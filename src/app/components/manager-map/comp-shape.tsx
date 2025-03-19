// ShapeComponent.tsx
import { Shape } from "./shapes";

export const ShapeComponent = ({ shape }: { shape: Shape }) => {
  const style = {
    position: "absolute" as const,
    left: shape.x,
    top: shape.y,
    width: shape.width,
    height: shape.height,
    background: shape.type !== "arrow" ? shape.color : "transparent",
    border: shape.type !== "arrow" ? "1px solid blue" : "none",
    borderRadius: shape.type === "circle" ? "50%" : "0",
    transform: `rotate(${shape.rotation}deg)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    textAlign: "center" as const,
    padding: shape.type !== "arrow" ? "4px" : "0",
    overflow: "hidden" as const,
  };

  return (
    <div key={shape.id} data-id={shape.id} className="shape" style={style}>
      {shape.type === "arrow" ? (
        <svg width={shape.width} height={shape.height} viewBox={`0 0 ${shape.width} ${shape.height}`} fill="#FFF">
          <path
            d={`M 0 ${shape.height / 2} H ${shape.width * 0.75} L ${shape.width * 0.5} ${shape.height * 0.25} M ${
              shape.width * 0.75
            } ${shape.height / 2} L ${shape.width * 0.5} ${shape.height * 0.75}`}
            stroke={shape.color}
            strokeWidth="2"
          />
          <text
            x={shape.width / 3}
            y={shape.height / 2.75}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#000"
            fontSize="12"
          >
            {shape.text}
          </text>
        </svg>
      ) : shape.type === "car" ? (
               <img className="w-full h-full bg-amber-50" src="./icon/car.svg" alt="car" />
        ) : shape.type === "motor" ? (
                <img className="w-full h-full bg-amber-50" src="./icon/motor.svg" alt="motor" />
          ) : shape.type === "bicycle" ? (
                <img className="w-full h-full bg-amber-50" src="./icon/bicycle.svg" alt="bicycle" />
      ):(
        shape.text
      )}
    </div>
  );
};