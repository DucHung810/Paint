import { ShapeRenderer } from "./com-shape/shaperendermap";
import { Shape } from "./shapes";

export const ShapeComponent = ({ shape }: { shape: Shape }) => {
  return (
    <div
      key={shape.id}
      data-id={shape.id}
      className={`shape absolute flex items-center justify-center text-white text-center overflow-hidden ${
        shape.type === "circle" ? "rounded-full" : ""
      }
     
      `}
      style={{
        left: shape.x,
        top: shape.y,
        width: shape.width,
        height: shape.height,
        background:
          shape.type === "arrowPolygon"
            ? "bg-white"
            : shape.type !== "arrow"
            ? shape.color
            : "transparent",
        border: shape.type !== "arrow" ? "none" : "none",
        transform: `rotate(${shape.rotation}deg)`,
        padding: shape.type !== "arrow" ? "4px" : "0",
      }}
    >
      <ShapeRenderer shape={shape} />
    </div>
  );
};
