import React, { JSX } from "react";
import convertPowerPointStyle from "../utils/css_convertor";
import { NodeAttribs } from "../utils/constants";

interface TextPProps {
  node: any;
  zIndex: number;
  maxDim: { width: number; height: number };
  childFrame: { off: { x: number; y: number }; ext: { x: number; y: number } };
  renderChildren: (node: any, zIndex: number, childFrame: any) => JSX.Element;
}

const TextP: React.FC<TextPProps> = ({
  node,
  zIndex,
  maxDim,
  childFrame,
  renderChildren,
}: any) => {
  const { style, newChildFrame } = convertPowerPointStyle(
    node,
    zIndex,
    maxDim,
    childFrame
  );

  return (
    <div
      key={node.asset}
      className={`${node[NodeAttribs.TYPE]} TextP ${node.name? node.name : ""}`}
      id={node.asset}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {renderChildren(node, zIndex, newChildFrame)}
    </div>
  );
};

export default TextP;
