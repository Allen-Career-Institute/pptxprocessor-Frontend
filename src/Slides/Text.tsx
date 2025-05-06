import React, { JSX } from "react";
import TextP from "./TextP";
import convertPowerPointStyle from "../utils/css_convertor";

interface TextProps {
  node: any;
  zIndex: number;
  maxDim: { width: number; height: number };
  childFrame: {off: {x: number, y: number}, ext: {x: number, y: number}}
}

const Text: React.FC<TextProps> = ({ node, zIndex, maxDim, childFrame }: any) => {
  const {style, newChildFrame} = convertPowerPointStyle(node, zIndex, maxDim, childFrame);
  !style.width && (style.width = "inherit");
  !style.height && (style.height = "inherit");

  const renderComponent = (node: any, zIndex: number): JSX.Element => {
    if (node.type === "p") {
      return <TextP key={node.asset} node={node} zIndex={zIndex} maxDim={maxDim} childFrame={newChildFrame}/>;
    } else {
      return <></>;
    }
  }

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
      {node.children &&
        Object.values(node.children)
        .flatMap((childData: any) => Array.isArray(childData) ? childData : [childData])
        .filter((childData: any) => childData.asset)
        .map((childData: any, index: number) =>
          renderComponent(childData, (zIndex))
        )}
    </div>
  );
};

export default Text;