import "../style.css";

export const TOOL_ITEMS = [
  { type: "square", className: "bg-sz" },
  { type: "circle", className: "bg-sz rounded-full" },
  {
    type: "arrow",
    className: "bg-sz flex items-center justify-center ",
    icon: (
      <svg width={24} height={24} fill="none">
        <path
          d="M0 12 H18 L12 6 M18 12 L12 18"
          stroke="white"
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    type: "arrowPolygon",
    className: " flex items-center justify-center bg-sz  ",
    icon: <img src="./icon/arrow-polygon.svg" alt="arrow-polygon" />,
  },
];

export const IMAGE_ITEMS = [
  { type: "car", src: "./icon/car.svg", alt: "car" },
  { type: "motor", src: "./icon/motor.svg", alt: "motor" },
  { type: "bicycle", src: "./icon/bicycle.svg", alt: "bicycle" },
  { type: "camera", src: "./icon/camera.svg", alt: "camera" },
  { type: "exit", src: "./icon/exit.svg", alt: "exit" },
  { type: "station", src: "./icon/gas-station.svg", alt: "station" },
  { type: "payment", src: "./icon/payment.svg", alt: "payment" },
  { type: "gateway", src: "./icon/gateway.svg", alt: "gateway" },
];
