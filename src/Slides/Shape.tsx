import React from "react";
import convertPowerPointStyle from "../utils/css_convertor";

interface ShapeProps {
  node: any;
  zIndex: number;
  maxDim: { width: number; height: number };
  childFrame: {off: {x: number, y: number}, ext: {x: number, y: number}}
}

const Shape: React.FC<ShapeProps> = ({ node, zIndex, maxDim, childFrame }: any) => {
  const {style, newChildFrame} = convertPowerPointStyle(node, zIndex, maxDim, childFrame);

  return (
    <div
      key={node.asset}
      className={`${node.type} ${node.name? node.name : ""}`}
      id={node.asset}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Render text if present */}
      {node.properties?.txBody?.p?.r?.map((textNode: any, index: number) => (
        <span key={index}>{textNode.t?.value?.text || ""}</span>
      ))}
    </div>
  );
};

export default Shape;