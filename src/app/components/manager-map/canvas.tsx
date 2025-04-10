import { useRef, useEffect, useCallback } from "react";
import Selecto from "react-selecto";
import Moveable from "react-moveable";
import { OnSelectEnd } from "react-selecto";
import { ShapeComponent } from "./comp-shape";
import { Shape } from "./shapes";
import { ShapeType } from "./enum";

interface CanvasProps {
  shapes: Shape[];
  selectedIds: string[];
  isDraggingGroup: boolean;
  isRotatingGroup: boolean;
  updateShapes: (newShapes: Shape[], skipHistory?: boolean) => void;
  onSelect: (e: OnSelectEnd) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, type: ShapeType) => void;
  onDragGroupStart: () => void;
  onDragGroupEnd: () => void;
  onRotateGroupStart: () => void;
  onRotateGroupEnd: () => void;
}

export const Canvas = ({
  shapes,
  selectedIds,
  isDraggingGroup,
  isRotatingGroup,
  updateShapes,
  onSelect,
  onDrop,
  onDragGroupStart,
  onDragGroupEnd,
  onRotateGroupStart,
  onRotateGroupEnd,
}: CanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const moveableRef = useRef<Moveable>(null);

  const getMoveableTargets = useCallback(() => {
    return selectedIds
      .map((id) => document.querySelector(`[data-id="${id}"]`))
      .filter((el): el is HTMLElement => el instanceof HTMLElement);
  }, [selectedIds]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" && selectedIds.length > 0) {
        const newShapes = shapes.filter(
          (shape) => !selectedIds.includes(shape.id)
        );
        updateShapes(newShapes);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIds, shapes, updateShapes]);

  const canvasBounds = { width: 1500, height: 790 }; // Giới hạn khu vực canvas

  const handleDrag = ({ target, delta }: any) => {
    const shapeId = target.dataset.id;
    const shape = shapes.find((s) => s.id === shapeId);
    if (!shape) return;

    let newX = shape.x + delta[0];
    let newY = shape.y + delta[1];

    // Giới hạn vật thể không vượt quá canvas
    newX = Math.max(0, Math.min(canvasBounds.width - shape.width, newX));
    newY = Math.max(0, Math.min(canvasBounds.height - shape.height, newY));

    const newShapes = shapes.map((s) =>
      s.id === shapeId ? { ...s, x: newX, y: newY } : s
    );

    updateShapes(newShapes, true);
  };

  const handleResize = ({ target, width, height }: any) => {
    const shapeId = target.dataset.id;
    const shape = shapes.find((s) => s.id === shapeId);
    if (!shape) return;

    let newWidth = Math.min(width, canvasBounds.width - shape.x);
    let newHeight = Math.min(height, canvasBounds.height - shape.y);

    target.style.width = `${newWidth}px`;
    target.style.height = `${newHeight}px`;

    const newShapes = shapes.map((s) =>
      s.id === shapeId ? { ...s, width: newWidth, height: newHeight } : s
    );

    updateShapes(newShapes, true);
  };

  return (
    <div
      className="relative w-full h-full border border-gray-400 rounded-lg overflow-auto p-2"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        onDrop(e, e.dataTransfer.getData("type") as ShapeType);
      }}
    >
      <div className="absolute " ref={containerRef}>
        {shapes.map((shape) => (
          <ShapeComponent key={shape.id} shape={shape} />
        ))}
      </div>
      <Selecto
        container={containerRef.current}
        selectableTargets={[".shape"]}
        hitRate={90}
        selectByClick={true}
        selectFromInside={false}
        dragCondition={() => !isDraggingGroup && !isRotatingGroup} // Cập nhật điều kiện: chặn kéo chuột nếu đang kéo hoặc xoay nhóm
        onSelectEnd={(e) => {
          if (isDraggingGroup || isRotatingGroup) return; // Bỏ qua nếu đang kéo hoặc xoay nhóm
          console.log(
            "Selected shapes:",
            e.selected.map((el) => el.dataset.id)
          );
          onSelect(e);
        }}
      />
      <Moveable
        ref={moveableRef}
        target={getMoveableTargets()}
        draggable={true}
        resizable={true}
        rotatable={true}
        keepRatio={false}
        throttleDrag={1}
        onDragGroupStart={() => {
          onDragGroupStart();
        }}
        onDragGroupEnd={() => {
          onDragGroupEnd();
        }}
        onDragGroup={({ events }) => {
          const newShapes = shapes.map((shape) => {
            if (!selectedIds.includes(shape.id)) return shape;
            const event = events.find((e) => e.target.dataset.id === shape.id);
            return event
              ? {
                  ...shape,
                  x: shape.x + event.delta[0],
                  y: shape.y + event.delta[1],
                }
              : shape;
          });
          updateShapes(newShapes, true);
        }}
        onResizeGroup={({ events }) => {
          const newShapes = shapes.map((shape) => {
            const event = events.find((e) => e.target.dataset.id === shape.id);
            if (event) {
              event.delta[0] && (event.target.style.width = `${event.width}px`);
              event.delta[1] &&
                (event.target.style.height = `${event.height}px`);
              return { ...shape, width: event.width, height: event.height };
            }
            return shape;
          });
          updateShapes(newShapes, true);
        }}
        onRotateGroupStart={() => {
          onRotateGroupStart();
        }}
        onRotateGroupEnd={() => {
          onRotateGroupEnd();
        }}
        onRotateGroup={({ events }) => {
          const newShapes = shapes.map((shape) => {
            const event = events.find((e) => e.target.dataset.id === shape.id);
            return event ? { ...shape, rotation: event.rotation } : shape;
          });
          updateShapes(newShapes, true);
        }}
        // onDrag={({ target, delta }) => {
        //   const newShapes = shapes.map((s) =>
        //     s.id === target.dataset.id
        //       ? { ...s, x: s.x + delta[0], y: s.y + delta[1] }
        //       : s
        //   );
        //   updateShapes(newShapes, true);
        // }}
        // onResize={({ target, width, height, delta }) => {
        //   delta[0] && (target.style.width = `${width}px`);
        //   delta[1] && (target.style.height = `${height}px`);
        //   const newShapes = shapes.map((s) =>
        //     s.id === target.dataset.id ? { ...s, width, height } : s
        //   );
        //   updateShapes(newShapes, true);
        // }}
        onDrag={handleDrag}
        onResize={handleResize}
        onRotate={({ target, rotation }) => {
          const newShapes = shapes.map((s) =>
            s.id === target.dataset.id ? { ...s, rotation } : s
          );
          updateShapes(newShapes, true);
        }}
        onDragEnd={() => {
          updateShapes(shapes);
        }}
        onResizeEnd={() => {
          updateShapes(shapes);
        }}
        onRotateEnd={() => {
          updateShapes(shapes);
        }}
      />
    </div>
  );
};
