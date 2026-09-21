import { useEffect } from "react";
import { createPortal } from "react-dom";
import { IoCloseCircleOutline } from "react-icons/io5";

export const ImageViewer = ({
  project,
  closeModal,
}: {
  project: {
    title: string;
    image: string;
  };
  closeModal: () => void;
}) => {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") closeModal(); };
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", onKeyDown); };
  }, [closeModal]);

  const content = (
    <div
    className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/90 p-3 backdrop-blur-md sm:p-6"
    onClick={closeModal}
  >
    {/* Modal content */}
    <div className="relative flex max-h-[94vh] w-full max-w-7xl flex-col items-center" onPointerDown={(event) => event.stopPropagation()} onClick={(event) => event.stopPropagation()}>
      {/* Botón de cerrar */}
      <button
        type="button"
        aria-label="Cerrar imagen ampliada"
        onPointerDown={(event) => { event.preventDefault(); event.stopPropagation(); closeModal(); }}
        onClick={(event) => { event.preventDefault(); event.stopPropagation(); closeModal(); }}
        className="fixed right-4 top-4 z-[10001] grid size-11 place-items-center rounded-full bg-black/90 text-white shadow-lg ring-1 ring-white/20 transition-colors duration-200 hover:bg-purple-600 sm:right-8 sm:top-8"
      >
        <IoCloseCircleOutline className="size-8"></IoCloseCircleOutline>
      </button>

      {/* Imagen */}
      <div className="relative flex max-h-[94vh] w-full flex-col items-center overflow-hidden rounded-2xl border border-gray-600/40 bg-gradient-to-br from-gray-900/90 to-black/95 p-2 backdrop-blur-md sm:p-4">
        <img
          src={project.image}
          alt={project.title}
          className="h-auto max-h-[calc(94vh-110px)] w-auto max-w-full object-contain"
          draggable={false}
        />

        {/* Información del proyecto en el modal */}
        <div className="w-full bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 sm:p-6">
          <h3 className="text-2xl font-bold text-white mb-2">
            {project.title}
          </h3>
        </div>
      </div>
    </div>
  </div>
  );

  return typeof document === "undefined" ? null : createPortal(content, document.body);
};
