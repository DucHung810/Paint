import { Shape } from "../shapes";

export const ArrowPolygon = ({ shape }: { shape: Shape }) => {
  const { width, height, color, text } = shape;

  // Điểm của mũi tên (hình đa giác)
  const points = `
    0,${height / 3} 
    ${width * 0.7},${height / 3} 
    ${width * 0.7},0 
    ${width},${height / 2} 
    ${width * 0.7},${height} 
    ${width * 0.7},${(height * 2) / 3} 
    0,${(height * 2) / 3}
  `;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      {/* Vẽ mũi tên bằng polygon */}
      <polygon points={points} fill={shape.color} stroke={"#000"} />

      {/* Văn bản bên trong mũi tên */}
      <text
        x={width / 3}
        y={height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#000"
        fontSize="12"
      >
        {text}
      </text>
    </svg>
  );
};
