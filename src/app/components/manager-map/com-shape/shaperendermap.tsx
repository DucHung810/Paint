// ShapeRenderer.tsx

import { JSX } from "react";

import { ImageShape } from "./img-shape";
import { ArrowShape } from "./arrow-shape";
import { ArrowPolygon } from "./arrow-polygon";
import { Shape } from "../shapes";

const imageMap: Record<string, string> = {
  car: "./icon/car.svg",
  motor: "./icon/motor.svg",
  bicycle: "./icon/bicycle.svg",
  gateway: "./icon/gateway.svg",
  station: "./icon/gas-station.svg",
  payment: "./icon/payment.svg",
  exit: "./icon/exit.svg",
  camera: "./icon/camera.svg",
};

// Mapping type -> component render
const ShapeRenderMap: Record<
  string,
  ({ shape }: { shape: Shape }) => JSX.Element
> = {
  arrow: ArrowShape,
  arrowPolygon: ArrowPolygon,
  car: ({ shape }) => <ImageShape src={imageMap.car} alt={shape.type} />,
  motor: ({ shape }) => <ImageShape src={imageMap.motor} alt={shape.type} />,
  bicycle: ({ shape }) => (
    <ImageShape src={imageMap.bicycle} alt={shape.type} />
  ),
  gateway: ({ shape }) => (
    <ImageShape src={imageMap.gateway} alt={shape.type} />
  ),
  exit: ({ shape }) => <ImageShape src={imageMap.exit} alt={shape.type} />,
  payment: ({ shape }) => (
    <ImageShape src={imageMap.payment} alt={shape.type} />
  ),
  station: ({ shape }) => (
    <ImageShape src={imageMap.station} alt={shape.type} />
  ),
  camera: ({ shape }) => <ImageShape src={imageMap.camera} alt={shape.type} />,
};

// Component render tự động
export const ShapeRenderer = ({ shape }: { shape: Shape }) => {
  const RenderComponent = ShapeRenderMap[shape.type];
  return RenderComponent ? (
    <RenderComponent shape={shape} />
  ) : (
    <span>{shape.text}</span>
  );
};
