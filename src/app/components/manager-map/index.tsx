import * as React from "react";
import Wapper from "./wapper/wapper";
import DrawToolTest from "./draw-tool";

export default function Drawing() {
  return (
    <Wapper title="Diagram">
      <DrawToolTest />
    </Wapper>
  );
}
