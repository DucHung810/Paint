import { Shape } from "../shapes";

export const ArrowShape = ({ shape }: { shape: Shape }) => (
  <svg
    width={shape.width}
    height={shape.height}
    viewBox={`0 0 ${shape.width} ${shape.height}`}
    fill="#FFF"
  >
    <path
      d={`M 0 ${shape.height / 2} H ${shape.width * 0.75} 
        L ${shape.width * 0.5} ${shape.height * 0.25} 
        M ${shape.width * 0.75} ${shape.height / 2} 
        L ${shape.width * 0.5} ${shape.height * 0.75}`}
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
);
