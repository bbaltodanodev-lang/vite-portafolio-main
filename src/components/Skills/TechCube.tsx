import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { IconType } from "react-icons";
import * as THREE from "three";

import TechGridFallback from "./TechGridFallback";
import styles from "./styles.module.css";

// Props: array de objetos { icon: string (url), name: string }
interface TechCubeProps {
  technologies: { icon: IconType; name: string }[];
  size?: number;
}

// Crear un cubo de Rubik 3x3x3
const GRID_SIZE = 3;
const CUBE_SIZE = 1.7; // Aumentado de 0.6 a 0.8
const GAP = 0.2; // Aumentado proporcionalmente

export const TechCube: React.FC<TechCubeProps> = ({
  technologies,
  size = 2,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredFace, setHoveredFace] = useState<number | null>(null);
  const [faceNames, setFaceNames] = useState<string[]>([]);
  const [webglError, setWebglError] = useState<string | null>(null);

  // Usar useRef para valores que cambian frecuentemente en animación
  const rotationVelocityRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef<{ x: number; y: number } | null>(
    null
  );

  // Referencias para animaciones de cubos individuales
  const cubesRef = useRef<THREE.Mesh[]>([]);
  const originalPositionsRef = useRef<THREE.Vector3[]>([]);
  const originalScalesRef = useRef<THREE.Vector3[]>([]);
  const animationTargetsRef = useRef<
    Map<number, { scale: number; offset: THREE.Vector3 }>
  >(new Map());

  useEffect(() => {
    if (!mountRef.current) return;

    console.log("TechCube useEffect started");

    // Escena
    const scene = new THREE.Scene();
    // Sin fondo para que use el fondo transparente del CSS
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(5, 5, 5); // Acercado de (6,6,6) a (5,5,5)
    camera.lookAt(0, 0, 0);

    let renderer: THREE.WebGLRenderer;

    // declare resize handler reference so cleanup can access it
    let handleResize: (() => void) | null = null;

    try {
      console.log("Creating THREE.WebGLRenderer...");
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "default",
        failIfMajorPerformanceCaveat: false,
        preserveDrawingBuffer: false,
        premultipliedAlpha: false,
      });
      console.log("THREE.WebGLRenderer created successfully");
    } catch (error) {
      console.error("Failed to create THREE.WebGLRenderer:", error);
      setWebglError(`Error al crear el renderizador WebGL: ${error}`);
      return;
    }
    try {
      renderer.setClearColor(0x000000, 0); // Fondo transparente

      // ResizeObserver fires AFTER CSS layout is applied — fixes flash on load
      let resizeObserver: ResizeObserver | null = null;

      const setRendererSize = () => {
        if (!mountRef.current) return;
        // Use offsetWidth/offsetHeight — available synchronously after layout
        const w = mountRef.current.offsetWidth;
        const h = mountRef.current.offsetHeight;
        const size = Math.max(w, h, 1);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.25 : 1.75));
        renderer.setSize(size, size);
        camera.aspect = 1;
        camera.updateProjectionMatrix();
        if (renderer.domElement) {
          renderer.domElement.style.cssText = [
            "position:absolute",
            "top:0",
            "left:0",
            "width:100%",
            "height:100%",
            "display:block",
          ].join(";");
        }
      };

      // Observe the mount container — fires once layout is done (no flash)
      resizeObserver = new ResizeObserver(() => setRendererSize());
      resizeObserver.observe(mountRef.current);

      // Keep a ref so cleanup can disconnect it
      handleResize = () => resizeObserver?.disconnect();

      const lowPowerDevice = window.innerWidth < 768 || (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
      renderer.shadowMap.enabled = !lowPowerDevice;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Sombras suaves
      // Mantener los colores planos del atlas: ACES/exposure levantaba el morado
      // y hacía que las caras se vieran lavadas en algunas pantallas.
      // No aplicar exposición cinematográfica: aclara el morado y lo vuelve
      // magenta en pantallas con brillo alto.
      renderer.toneMapping = THREE.NoToneMapping;
      renderer.toneMappingExposure = 1;

      // Configuración de pixel ratio para Safari en dispositivos Retina
      const pixelRatio = Math.min(window.devicePixelRatio, 2);
      renderer.setPixelRatio(pixelRatio);

      mountRef.current.appendChild(renderer.domElement);
    } catch (error) {
      console.error("Failed to configure WebGL renderer:", error);
      setWebglError("Error al configurar el renderizador WebGL");
      return;
    }

    // Utilidad para renderizar un ReactElement (SVG) a un canvas y obtener una textura
    function renderIconToTexture(icon: React.ReactElement): THREE.Texture {
      const svg = renderToStaticMarkup(icon);
      const img = new window.Image();

      // Limpiar el SVG y asegurar que tenga las propiedades correctas
      const cleanSvg = svg
        .replace(/currentColor/g, "white")
        .replace(/fill="[^"]*"/g, 'fill="white"');
      const normalizedSvg = cleanSvg.includes("xmlns=")
        ? cleanSvg
        : cleanSvg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
      const svg64 = btoa(unescape(encodeURIComponent(normalizedSvg)));
      const image64 = "data:image/svg+xml;base64," + svg64;

      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext("2d", { alpha: true });
      const texture = new THREE.Texture(canvas);

      if (ctx) {
        // Color anterior que ya había sido aprobado.
        // Color original del cubo, antes de las pruebas de color.
        ctx.fillStyle = "#17005F";
        ctx.fillRect(0, 0, 256, 256);

        // Borde sutil
        ctx.strokeStyle = "rgba(126, 104, 220, 0.42)";
        ctx.lineWidth = 2;
        ctx.strokeRect(2, 2, 252, 252);

        img.onload = function () {
          ctx.drawImage(img, 32, 32, 192, 192);
          texture.needsUpdate = true;
        };

        img.onerror = function () {
          console.warn("Error loading icon");
          // Dibujar un rectángulo blanco como fallback
          ctx.fillStyle = "white";
          ctx.fillRect(160, 160, 192, 192);
          texture.needsUpdate = true;
        };

        img.src = image64;
      }

      // Configuraciones optimizadas para todos los navegadores
      texture.generateMipmaps = false;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.format = THREE.RGBAFormat;
      texture.flipY = false;

      return texture;
    }

    // Crear materiales únicos para cada tecnología
    const techMaterials = technologies.map((tech) => {
      const IconComponent = tech.icon;
      const iconElement = <IconComponent />;
      const texture = renderIconToTexture(iconElement);
      return new THREE.MeshBasicMaterial({
        map: texture,
        color: 0xffffff,
        side: THREE.FrontSide,
      });
    });

    // Material por defecto con aspecto premium
    const defaultMaterial = new THREE.MeshBasicMaterial({
      color: 0x17005f,
      side: THREE.FrontSide,
    });

    // Crear el cubo de Rubik 3x3x3
    const cubes: THREE.Mesh[] = [];
    const cubeNames: string[] = [];
    let techIndex = 0;

    // Crear un grupo para contener todos los cubitos
    const cubeGroup = new THREE.Group();

    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        for (let z = 0; z < GRID_SIZE; z++) {
          const geometry = new THREE.BoxGeometry(
            CUBE_SIZE,
            CUBE_SIZE,
            CUBE_SIZE
          );
          const material =
            techIndex < technologies.length
              ? techMaterials[techIndex]
              : defaultMaterial;

          const cube = new THREE.Mesh(geometry, material);
          const originalPosition = new THREE.Vector3(
            (x - 1) * (CUBE_SIZE + GAP),
            (y - 1) * (CUBE_SIZE + GAP),
            (z - 1) * (CUBE_SIZE + GAP)
          );

          cube.position.copy(originalPosition);

          // Habilitar sombras en el mesh
          cube.castShadow = true;
          cube.receiveShadow = true;

          // Guardar el índice de la tecnología en userData
          cube.userData = {
            techIndex,
            originalPosition: originalPosition.clone(),
          };
          cubes.push(cube);
          cubeNames.push(
            techIndex < technologies.length ? technologies[techIndex].name : ""
          );
          cubeGroup.add(cube); // Agregar al grupo en lugar de la escena directamente

          // Guardar posiciones y escalas originales
          originalPositionsRef.current.push(originalPosition.clone());
          originalScalesRef.current.push(new THREE.Vector3(1, 1, 1));

          techIndex++;
        }
      }
    }

    // Guardar referencia a todos los cubos
    cubesRef.current = cubes;

    scene.add(cubeGroup); // Agregar el grupo completo a la escena

    setFaceNames(cubeNames);

    const lowPowerDevice = window.innerWidth < 768 || (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;

    // Iluminación premium para materiales físicos
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3); // Reducida para más contraste
    scene.add(ambientLight);

    // Luz direccional principal con color cálido
    const directionalLight = new THREE.DirectionalLight(0xffffff, 3.0); // Más intensa
    directionalLight.position.set(12, 15, 8);
    directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = lowPowerDevice ? 1024 : 2048;
      directionalLight.shadow.mapSize.height = lowPowerDevice ? 1024 : 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    scene.add(directionalLight);

    // Luz de relleno desde el lado opuesto con tono púrpura
    const fillLight = new THREE.DirectionalLight(0x8066ff, 1.2); // Más intensa
    fillLight.position.set(-8, -5, -5);
    scene.add(fillLight);

    // Luces puntuales estratégicamente posicionadas para crear brillos dinámicos
    const rimLight1 = new THREE.PointLight(0xffffff, 2.5, 40); // Más intensa y alcance mayor
    rimLight1.position.set(0, 0, 25);
    scene.add(rimLight1);

    const rimLight2 = new THREE.PointLight(0x4922e5, 1.8, 35); // Color Terraform
    rimLight2.position.set(-20, 15, 10);
    scene.add(rimLight2);

    const rimLight3 = new THREE.PointLight(0xc956fb, 1.5, 30); // Rosa/púrpura
    rimLight3.position.set(20, -15, 12);
    scene.add(rimLight3);

    // Luz adicional desde arriba para realzar los reflejos superiores
    const topLight = new THREE.PointLight(0xffffff, 1.0, 25);
    topLight.position.set(0, 20, 0);
    scene.add(topLight);

    // Luz de acento desde abajo para eliminar sombras duras
    const bottomLight = new THREE.PointLight(0x5c4ee5, 0.8, 20);
    bottomLight.position.set(0, -15, 0);
    scene.add(bottomLight);

    // Agregar un plano para recibir sombras más prominentes
    const planeGeometry = new THREE.PlaneGeometry(30, 30);
    const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.6 }); // Sombras más visibles
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -4;
    plane.receiveShadow = true;
    scene.add(plane);

    // Event handlers para el drag (mouse y touch)
    const handleMouseDown = (event: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = {
        x: event.clientX,
        y: event.clientY,
      };
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        isDraggingRef.current = true;
        const touch = event.touches[0];
        previousMousePositionRef.current = {
          x: touch.clientX,
          y: touch.clientY,
        };
        // Prevenir scroll en móviles
        event.preventDefault();
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDraggingRef.current || !previousMousePositionRef.current) return;

      const deltaX = event.clientX - previousMousePositionRef.current.x;
      const deltaY = event.clientY - previousMousePositionRef.current.y;

      // Convertir movimiento del mouse a velocidad de rotación
      const sensitivity = 0.0032;
      rotationVelocityRef.current = {
        x: -deltaY * sensitivity,
        y: deltaX * sensitivity,
      };

      previousMousePositionRef.current = {
        x: event.clientX,
        y: event.clientY,
      };
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (
        !isDraggingRef.current ||
        !previousMousePositionRef.current ||
        event.touches.length !== 1
      )
        return;

      const touch = event.touches[0];
      const deltaX = touch.clientX - previousMousePositionRef.current.x;
      const deltaY = touch.clientY - previousMousePositionRef.current.y;

      // Convertir movimiento del touch a velocidad de rotación
      const sensitivity = 0.0038;
      const targetVelocity = {
        x: -deltaY * sensitivity,
        y: deltaX * sensitivity,
      };
      // Interpolar el gesto evita cambios bruscos cuando el navegador entrega
      // eventos táctiles con distinta frecuencia.
      rotationVelocityRef.current = {
        x: rotationVelocityRef.current.x * 0.65 + targetVelocity.x * 0.35,
        y: rotationVelocityRef.current.y * 0.65 + targetVelocity.y * 0.35,
      };

      previousMousePositionRef.current = {
        x: touch.clientX,
        y: touch.clientY,
      };

      // Prevenir scroll en móviles
      if (event.cancelable) event.preventDefault();
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      previousMousePositionRef.current = null;
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
      previousMousePositionRef.current = null;
    };


    // Función para animar un cubo individual (hover)
    const animateCube = (cubeIndex: number, isHovered: boolean) => {
      if (cubeIndex < 0 || cubeIndex >= cubes.length) return;

      const cube = cubes[cubeIndex];
      const originalPos = cube.userData.originalPosition;

      // Calcular dirección desde el centro del cubo
      const direction = originalPos.clone().normalize();

      // Detectar si es móvil (pantalla menor a 768px)
      const isMobile = window.innerWidth < 768;

      if (isHovered) {
        // Animación más sutil para móviles
        const scale = isMobile ? 1.08 : 1.15; // Menor escala en móvil
        const offsetMultiplier = isMobile ? 0.15 : 0.3; // Menor offset en móvil

        animationTargetsRef.current.set(cubeIndex, {
          scale: scale,
          offset: direction.multiplyScalar(offsetMultiplier),
        });
      } else {
        // Volver al estado original
        animationTargetsRef.current.set(cubeIndex, {
          scale: 1.0,
          offset: new THREE.Vector3(0, 0, 0),
        });
      }
    };

    // Añadir event listeners al canvas (mouse y touch)
    renderer.domElement.addEventListener("mousedown", handleMouseDown);
    renderer.domElement.addEventListener("mousemove", handleMouseMove);
    renderer.domElement.addEventListener("mouseup", handleMouseUp);
    renderer.domElement.addEventListener("mouseleave", handleMouseUp);

    // Event listeners para dispositivos táctiles
    renderer.domElement.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    renderer.domElement.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    renderer.domElement.addEventListener("touchend", handleTouchEnd);
    renderer.domElement.addEventListener("touchcancel", handleTouchEnd);

    // Animación con velocidad reducida e interacción
    let frameId: number;
    let lastFrame = 0;
    const animate = (time = 0) => {
      try {
        if (lowPowerDevice && time - lastFrame < 33) {
          frameId = requestAnimationFrame(animate);
          return;
        }
        lastFrame = time;
        // Rotación automática más lenta cuando no se está arrastrando
        if (!isDraggingRef.current) {
          cubeGroup.rotation.x += rotationVelocityRef.current.x + 0.0012;
          cubeGroup.rotation.y += rotationVelocityRef.current.y + 0.0018;

          // Aplicar fricción para desacelerar gradualmente
          rotationVelocityRef.current = {
          x: rotationVelocityRef.current.x * 0.93,
          y: rotationVelocityRef.current.y * 0.93,
          };
        }

        // Animar cubos individuales (hover effects)
        cubes.forEach((cube, index) => {
          const target = animationTargetsRef.current.get(index);
          if (target) {
            const originalPos = cube.userData.originalPosition;

            // Suavizar la transición hacia el target (más lento en móvil para mejor rendimiento)
            const isMobile = window.innerWidth < 768;
            const lerpSpeed = isMobile ? 0.08 : 0.1; // Más suave en móvil

            // Animar escala
            cube.scale.lerp(
              new THREE.Vector3(target.scale, target.scale, target.scale),
              lerpSpeed
            );

            // Animar posición (offset desde posición original)
            const targetPosition = originalPos.clone().add(target.offset);
            cube.position.lerp(targetPosition, lerpSpeed);
          }
        });

        renderer.render(scene, camera);
        frameId = requestAnimationFrame(animate);
      } catch (error) {
        console.error("Animation error:", error);
        setWebglError("Error durante la animación WebGL");
        cancelAnimationFrame(frameId);
      }
    };

    try {
      console.log("Starting animation...");
      animate();
      console.log("Animation started successfully");
    } catch (error) {
      console.error("Failed to start animation:", error);
      setWebglError("Error al iniciar la animación WebGL");
    }

    // Raycaster para detectar hover y clicks (mouse y touch)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let previousHoveredFace: number | null = null;

    function updateMousePosition(clientX: number, clientY: number) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    }

    function checkHover() {
      // No detectar hover si estamos arrastrando
      if (isDraggingRef.current) return;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(cubes);

      if (intersects.length > 0) {
        const hoveredCube = intersects[0].object as THREE.Mesh;
        const currentHoveredFace = hoveredCube.userData.techIndex;
        setHoveredFace(currentHoveredFace);

        // Si cambió el cubo hover, actualizar animaciones
        if (previousHoveredFace !== currentHoveredFace) {
          // Resetear el cubo anterior
          if (previousHoveredFace !== null) {
            animateCube(previousHoveredFace, false);
          }
          // Animar el nuevo cubo
          animateCube(currentHoveredFace, true);
          previousHoveredFace = currentHoveredFace;
        }
      } else {
        setHoveredFace(null);
        // Resetear hover del cubo anterior
        if (previousHoveredFace !== null) {
          animateCube(previousHoveredFace, false);
        }
        previousHoveredFace = null;
      }
    }

    function onMouseMove(event: MouseEvent) {
      updateMousePosition(event.clientX, event.clientY);
      checkHover();
    }

    function onTouchMove(event: TouchEvent) {
      if (event.touches.length === 1) {
        const touch = event.touches[0];
        updateMousePosition(touch.clientX, touch.clientY);
        checkHover();
      }
    }

    renderer.domElement.addEventListener("mousemove", onMouseMove);

    // Event listeners para hover táctil
    renderer.domElement.addEventListener("touchmove", onTouchMove, {
      passive: true,
    });

    // Guardar referencia local para cleanup
    const mountNode = mountRef.current;

    return () => {
      console.log("Cleaning up TechCube...");
      // Remove resize observer / listener added during init
      try {
        if (handleResize) handleResize(); // calls resizeObserver.disconnect()
      } catch {
        /* ignore */
      }
      // Cleanup mouse events
      renderer.domElement.removeEventListener("mousemove", onMouseMove);
      renderer.domElement.removeEventListener("mousedown", handleMouseDown);
      renderer.domElement.removeEventListener("mousemove", handleMouseMove);
      renderer.domElement.removeEventListener("mouseup", handleMouseUp);
      renderer.domElement.removeEventListener("mouseleave", handleMouseUp);

      // Cleanup touch events
      renderer.domElement.removeEventListener("touchstart", handleTouchStart);
      renderer.domElement.removeEventListener("touchmove", handleTouchMove);
      renderer.domElement.removeEventListener("touchend", handleTouchEnd);
      renderer.domElement.removeEventListener("touchcancel", handleTouchEnd);
      renderer.domElement.removeEventListener("touchmove", onTouchMove);

      if (mountNode) mountNode.removeChild(renderer.domElement);
      cancelAnimationFrame(frameId);
      cubes.forEach((cube) => {
        cube.geometry.dispose();
        if (Array.isArray(cube.material)) {
          cube.material.forEach((m) => m.dispose());
        } else {
          cube.material.dispose();
        }
      });
    };

    console.log("TechCube useEffect completed successfully");
  }, [technologies, size]);

  // Solo mostrar fallback si hay un error específico
  if (webglError) {
    console.log("Showing fallback due to error:", webglError);
    return <TechGridFallback technologies={technologies} size={size} />;
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      {/* Canvas de Three.js */}
      <div
        ref={mountRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            touchAction: "none",
          }}
      />
      {/* Tooltip del nombre de la tecnología — borde animado estilo Experience */}
      <AnimatePresence mode="wait">
        {hoveredFace !== null && faceNames[hoveredFace] && (
          <motion.div
            key={hoveredFace}
            initial={{ opacity: 0, y: 10, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.85 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              position: "absolute",
              bottom: "-52px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 20,
              pointerEvents: "none",
            }}
          >
            <div className={styles.techTooltip}>
              <div className={styles.techTooltipInner}>
                {faceNames[hoveredFace]}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TechCube;
