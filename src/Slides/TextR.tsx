import React from "react";
import convertPowerPointStyle from "../utils/css_convertor";
import { emuToPx } from "../utils/helper_utils";

interface TextRProps {
  node: any;
  zIndex: number;
  maxDim: { width: number; height: number };
  childFrame: {off: {x: number, y: number}, ext: {x: number, y: number}}
}

const TextR: React.FC<TextRProps> = ({ node, zIndex, maxDim, childFrame }: any) => {
  console.log("Text node:", node.asset, node.type, node.name);
  const {style} = convertPowerPointStyle(node, zIndex, maxDim, childFrame);
  console.log(`Rcolor : ${style.color} ${node.properties?.solidFill?.srgbClr?.val} ${node.properties?.solidFill?.prstClr?.val}`);

  return (
    <span
      key={node.asset}
      className={`${node.type} ${node.name ? node.name : ""}`}
      id={node.asset}
      style={{
      ...style,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: `${emuToPx(50000, maxDim.width)}px`, // Add default gap
      }}
    >
      {node.properties?.t?.text || ""}
    </span>
  );
};

export default TextR;