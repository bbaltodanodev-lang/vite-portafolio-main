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
const CUBE_SIZE = 1.7;
const GAP = 0.2;
const TEXTURE_SIZE = 1024; // 1024 para iconos nítidos en pantallas Retina/AMOLED
// El canvas 2D opera en sRGB. Three.js convierte la textura de sRGB→lineal
// antes del pipeline de iluminación + ACES tone mapping, lo que oscurece
// drásticamente un valor ya oscuro como #280077. Pre-convertimos los valores
// lineales deseados a su representación sRGB para que el resultado visual
// final sea el morado correcto (~#6B00B4 en canvas → #280077 perceptual).
const FACE_COLOR = new THREE.Color()
  .setRGB(40 / 255, 0, 119 / 255, THREE.LinearSRGBColorSpace)
  .getStyle();

export const TechCube: React.FC<TechCubeProps> = ({
  technologies,
  size = 2,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredFace, setHoveredFace] = useState<number | null>(null);
  const [faceNames, setFaceNames] = useState<string[]>([]);
  const [webglError, setWebglError] = useState<string | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const mountNode = mountRef.current;
    let disposed = false;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    const lowPowerDevice = window.matchMedia("(pointer: coarse)").matches || saveData;
    const animationTargets = new Map<number, { scale: number; offset: THREE.Vector3 }>();

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
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "default",
        failIfMajorPerformanceCaveat: false,
        preserveDrawingBuffer: false,
        premultipliedAlpha: false,
      });
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
        // Usar el DPR nativo del dispositivo para máxima nitidez en Retina/AMOLED.
        // Limitamos a 3× en móvil (suficiente para cualquier pantalla actual)
        // y a 2× en escritorio para no desperdiciar GPU en monitores 4K.
        const deviceRatio = window.devicePixelRatio || 1;
        const pixelRatio = saveData
          ? Math.min(deviceRatio, 1.5)
          : Math.min(deviceRatio, lowPowerDevice ? 3 : 2);
        renderer.setPixelRatio(pixelRatio);
        renderer.setSize(Math.max(w, 1), Math.max(h, 1), false);
        camera.aspect = Math.max(w, 1) / Math.max(h, 1);
        camera.updateProjectionMatrix();
        if (renderer.domElement) {
          renderer.domElement.style.cssText = [
            "position:absolute",
            "top:0",
            "left:0",
            "width:100%",
            "height:100%",
            "display:block",
            "will-change:transform", // hint GPU para compositing sin parpadeo
          ].join(";");
        }
      };

      // Observe the mount container — fires once layout is done (no flash)
      resizeObserver = new ResizeObserver(() => setRendererSize());
      resizeObserver.observe(mountRef.current);

      // Keep a ref so cleanup can disconnect it
      handleResize = () => resizeObserver?.disconnect();

      renderer.shadowMap.enabled = !lowPowerDevice;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Sombras suaves
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.5;

      mountRef.current.appendChild(renderer.domElement);
    } catch (error) {
      console.error("Failed to configure WebGL renderer:", error);
      handleResize?.();
      renderer.dispose();
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
      canvas.width = TEXTURE_SIZE;
      canvas.height = TEXTURE_SIZE;
      const ctx = canvas.getContext("2d", { alpha: true });
      const texture = new THREE.CanvasTexture(canvas);

      if (ctx) {
        ctx.fillStyle = FACE_COLOR;
        ctx.fillRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);

        // Borde sutil — grosor y posición proporcionales al tamaño de la textura
        ctx.strokeStyle = "rgba(0, 97, 149, 0.3)";
        ctx.lineWidth = Math.max(2, TEXTURE_SIZE / 256);
        const borderInset = Math.max(4, TEXTURE_SIZE / 128);
        ctx.strokeRect(borderInset, borderInset, TEXTURE_SIZE - borderInset * 2, TEXTURE_SIZE - borderInset * 2);

        img.onload = function () {
          if (disposed) return;
          // Margen 1/8 del canvas para que el icono respire bien a cualquier resolución
          const iconMargin = TEXTURE_SIZE >> 3;
          const iconSize = TEXTURE_SIZE - iconMargin * 2;
          ctx.drawImage(img, iconMargin, iconMargin, iconSize, iconSize);
          texture.needsUpdate = true;
        };

        img.onerror = function () {
          if (disposed) return;
          console.warn("Error loading icon");
          // Dibujar un rectángulo blanco como fallback
          ctx.fillStyle = "white";
          ctx.fillRect(160, 160, 192, 192);
          texture.needsUpdate = true;
        };

        img.src = image64;
      }

      // Configuraciones optimizadas para todos los navegadores
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
      texture.format = THREE.RGBAFormat;
      texture.flipY = false;

      return texture;
    }

    // Crear materiales únicos para cada tecnología
    const techMaterials = technologies.map((tech) => {
      const IconComponent = tech.icon;
      const iconElement = <IconComponent />;
      const texture = renderIconToTexture(iconElement);
      return new THREE.MeshPhysicalMaterial({
        map: texture,
        color: 0xffffff,
        side: THREE.FrontSide,
        // metalness bajo para que la textura y el color base sean visibles;
        // con metalness=0.8 el material refleja el fondo oscuro y oculta el morado.
        metalness: 0.15,
        roughness: 0.25,
        emissive: 0x280077,
        emissiveIntensity: 0.25,
        clearcoat: 0.4,
        clearcoatRoughness: 0.1,
        reflectivity: 0.5,
        ior: 1.5,
      });
    });

    // Material por defecto — mismas reglas de metalness que techMaterials
    const defaultMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x280077,
      side: THREE.FrontSide,
      metalness: 0.15,
      roughness: 0.25,
      emissive: 0x280077,
      emissiveIntensity: 0.3,
      clearcoat: 0.4,
      clearcoatRoughness: 0.1,
      reflectivity: 0.5,
      ior: 1.5,
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

          techIndex++;
        }
      }
    }

    scene.add(cubeGroup); // Agregar el grupo completo a la escena

    setFaceNames(cubeNames);

    // Iluminación premium para materiales físicos
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3); // Reducida para más contraste
    scene.add(ambientLight);

    // Luz direccional principal con color cálido
    const directionalLight = new THREE.DirectionalLight(0xffffff, 3.0); // Más intensa
    directionalLight.position.set(12, 15, 8);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.bias = -0.0004;
    directionalLight.shadow.normalBias = 0.025;
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

    // Un único flujo de Pointer Events para mouse y un dedo en pantalla.
    // No se intercepta wheel: el trackpad sigue desplazando la página.
    const canvasElement = renderer.domElement;
    canvasElement.style.touchAction = "none";
    canvasElement.style.cursor = "grab";
    canvasElement.tabIndex = 0;
    canvasElement.setAttribute("aria-label", "Cubo de tecnologías. Arrastra con el mouse o un dedo para girar; también puedes usar las flechas.");
    const velocity = { x: 0, y: 0 }; // Radianes por segundo, independiente de FPS.
    let activePointer: number | null = null;
    let previous = { x: 0, y: 0, time: 0 };
    let dragged = false;
    let hoveredIndex: number | null = null;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const setHover = (index: number | null) => {
      if (index === hoveredIndex) return;
      if (hoveredIndex !== null) {
        animationTargets.set(hoveredIndex, { scale: 1, offset: new THREE.Vector3() });
      }
      hoveredIndex = index;
      setHoveredFace(index);
      if (index !== null) {
        const direction = cubes[index].userData.originalPosition.clone().normalize();
        animationTargets.set(index, { scale: 1.08, offset: direction.multiplyScalar(0.15) });
      }
    };

    const pickFace = (event: PointerEvent) => {
      const rect = canvasElement.getBoundingClientRect();
      mouse.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(mouse, camera);
      const hit = raycaster.intersectObjects(cubes, false)[0];
      return hit ? hit.object.userData.techIndex as number : null;
    };

    const finishDrag = (cancelled = false) => {
      if (activePointer === null) return;
      const pointer = activePointer;
      activePointer = null;
      if (cancelled || performance.now() - previous.time > 90 || reduceMotion) {
        velocity.x = 0;
        velocity.y = 0;
      }
      if (canvasElement.hasPointerCapture(pointer)) canvasElement.releasePointerCapture(pointer);
      canvasElement.style.cursor = "grab";
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (!event.isPrimary) {
        finishDrag(true);
        return;
      }
      if (event.pointerType === "mouse" && event.button !== 0) return;
      if (activePointer !== null) return;
      activePointer = event.pointerId;
      previous = { x: event.clientX, y: event.clientY, time: performance.now() };
      dragged = false;
      velocity.x = 0;
      velocity.y = 0;
      setHover(null);
      setHoveredFace(null);
      canvasElement.setPointerCapture(event.pointerId);
      canvasElement.style.cursor = "grabbing";
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (activePointer === null) {
        if (event.pointerType === "mouse" && event.buttons === 0) setHover(pickFace(event));
        return;
      }
      if (event.pointerId !== activePointer) return;
      const now = performance.now();
      const deltaX = event.clientX - previous.x;
      const deltaY = event.clientY - previous.y;
      const elapsed = Math.max((now - previous.time) / 1000, 1 / 120);
      const sensitivity = Math.PI / Math.max(canvasElement.clientWidth, 1);
      const angleX = -deltaY * sensitivity;
      const angleY = deltaX * sensitivity;

      // El cubo sigue al dedo DURANTE el gesto; antes sólo giraba al soltar.
      cubeGroup.rotation.x += angleX;
      cubeGroup.rotation.y += angleY;
      const blend = 1 - Math.exp(-elapsed / 0.035);
      // Clamp más amplio (±10) para mayor respuesta táctil al inicio del gesto
      velocity.x = THREE.MathUtils.lerp(velocity.x, THREE.MathUtils.clamp(angleX / elapsed, -10, 10), blend);
      velocity.y = THREE.MathUtils.lerp(velocity.y, THREE.MathUtils.clamp(angleY / elapsed, -10, 10), blend);
      dragged ||= Math.abs(deltaX) + Math.abs(deltaY) > 2;
      previous = { x: event.clientX, y: event.clientY, time: now };
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (event.pointerId !== activePointer) return;
      if (!dragged && event.pointerType !== "mouse") setHoveredFace(pickFace(event));
      finishDrag();
    };
    const handlePointerCancel = () => finishDrag(true);
    const handlePointerLeave = () => {
      if (activePointer === null) setHover(null);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      const directions: Record<string, [number, number]> = {
        ArrowLeft: [0, -0.16], ArrowRight: [0, 0.16],
        ArrowUp: [-0.16, 0], ArrowDown: [0.16, 0],
      };
      const direction = directions[event.key];
      if (!direction) return;
      event.preventDefault();
      setHover(null);
      cubeGroup.rotation.x += direction[0];
      cubeGroup.rotation.y += direction[1];
    };

    canvasElement.addEventListener("pointerdown", handlePointerDown);
    canvasElement.addEventListener("pointermove", handlePointerMove);
    canvasElement.addEventListener("pointerup", handlePointerUp);
    canvasElement.addEventListener("pointercancel", handlePointerCancel);
    canvasElement.addEventListener("lostpointercapture", handlePointerCancel);
    canvasElement.addEventListener("pointerleave", handlePointerLeave);
    canvasElement.addEventListener("keydown", handleKeyDown);

    let frameId = 0;
    let lastFrame = 0;
    let inView = false;
    const targetScale = new THREE.Vector3();
    const targetPosition = new THREE.Vector3();
    const animate = (time: number) => {
      frameId = 0;
      if (disposed || !inView || document.hidden) return;
      const dt = lastFrame ? Math.min((time - lastFrame) / 1000, 0.05) : 1 / 60;
      lastFrame = time;
      if (activePointer === null) {
        cubeGroup.rotation.x += (velocity.x + (reduceMotion ? 0 : 0.072)) * dt;
        cubeGroup.rotation.y += (velocity.y + (reduceMotion ? 0 : 0.108)) * dt;
        // Fricción más baja (2.5 vs 4.3) = desaceleración más gradual = deslizamiento natural en móvil
        const friction = Math.exp(-2.5 * dt);
        velocity.x *= friction;
        velocity.y *= friction;
      }
      const blend = 1 - Math.exp(-8 * dt);
      for (const [index, target] of animationTargets) {
        const cube = cubes[index];
        targetScale.setScalar(target.scale);
        targetPosition.copy(cube.userData.originalPosition).add(target.offset);
        cube.scale.lerp(targetScale, blend);
        cube.position.lerp(targetPosition, blend);
        if (cube.scale.distanceToSquared(targetScale) < 0.00001 &&
            cube.position.distanceToSquared(targetPosition) < 0.00001) {
          cube.scale.copy(targetScale);
          cube.position.copy(targetPosition);
          animationTargets.delete(index);
        }
      }
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    // Dejar de renderizar cuando el cubo sale de la pantalla libera trabajo
    // durante el scroll rápido y evita saltos al volver a la sección.
    const updatePlayback = () => {
      if (inView && !document.hidden) {
        if (!frameId) {
          lastFrame = 0;
          frameId = requestAnimationFrame(animate);
        }
      } else {
        cancelAnimationFrame(frameId);
        frameId = 0;
        finishDrag(true);
        velocity.x = 0;
        velocity.y = 0;
      }
    };
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      updatePlayback();
    }, { rootMargin: "100px" });
    visibilityObserver.observe(mountNode);
    document.addEventListener("visibilitychange", updatePlayback);
    window.addEventListener("blur", handlePointerCancel);

    return () => {
      disposed = true;
      finishDrag(true);
      cancelAnimationFrame(frameId);
      handleResize?.();
      visibilityObserver.disconnect();
      document.removeEventListener("visibilitychange", updatePlayback);
      window.removeEventListener("blur", handlePointerCancel);
      canvasElement.removeEventListener("pointerdown", handlePointerDown);
      canvasElement.removeEventListener("pointermove", handlePointerMove);
      canvasElement.removeEventListener("pointerup", handlePointerUp);
      canvasElement.removeEventListener("pointercancel", handlePointerCancel);
      canvasElement.removeEventListener("lostpointercapture", handlePointerCancel);
      canvasElement.removeEventListener("pointerleave", handlePointerLeave);
      canvasElement.removeEventListener("keydown", handleKeyDown);
      canvasElement.remove();
      cubes.forEach((cube) => cube.geometry.dispose());
      techMaterials.forEach((material) => {
        material.map?.dispose();
        material.dispose();
      });
      defaultMaterial.dispose();
      planeGeometry.dispose();
      planeMaterial.dispose();
      directionalLight.shadow.dispose();
      renderer.dispose();
    };
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
