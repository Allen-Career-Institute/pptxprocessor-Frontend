import React from "react";
import convertPowerPointStyle from "../utils/css_convertor";
import { emuToPx } from "../utils/helper_utils";
import { NodeAttribs } from "../utils/constants";

interface TextRProps {
  node: any;
  zIndex: number;
  maxDim: { width: number; height: number };
  childFrame: { off: { x: number; y: number }; ext: { x: number; y: number } };
}

const TextR: React.FC<TextRProps> = ({
  node,
  zIndex,
  maxDim,
  childFrame,
}: any) => {
  const { style } = convertPowerPointStyle(node, zIndex, maxDim, childFrame);
  if (!style.fontSize) {
    style.fontSize = emuToPx(220000, maxDim.width);
  }

  return (
    <span
      key={node.asset}
      className={`${node[NodeAttribs.TYPE]} TextR ${node.name ? node.name : ""}`}
      id={node.asset}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: `${emuToPx(50000, maxDim.width)}px`, // Add default gap
      }}
    >
      {node[NodeAttribs.PROPERTIES]?.t?.text || ""}
    </span>
  );
};

export default TextR;
