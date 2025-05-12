import React, { JSX } from "react";
import TextP from "./TextP";
import convertPowerPointStyle from "../utils/css_convertor";
import { NodeAttribs } from "../utils/constants";


interface TextProps {
  node: any;
  zIndex: number;
  maxDim: { width: number; height: number };
  childFrame: { off: { x: number; y: number }; ext: { x: number; y: number } };
  renderChildren: (node: any, zIndex: number, childFrame: any) => JSX.Element;
}

const Text: React.FC<TextProps> = ({
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
  !style.width && (style.width = "inherit");
  !style.height && (style.height = "inherit");

  return (
    <div
    key={node[NodeAttribs.ASSET]}
      className={`${node[NodeAttribs.TYPE]} Text ${node.name ? node.name : ""}`}
      id={node[NodeAttribs.ASSET]}
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

export default Text;
