import React, { JSX } from "react";
import Image from "./Image";
import Shape from "./Shape";
import PowerPointStyle from "../utils/css_convertor";

interface ContainerProps {
  node: any;
  zIndex: number;
  mediaPath: string;
  maxDim: { width: number; height: number };
  childFrame: {off: {x: number, y: number}, ext: {x: number, y: number}};
}


const Container: React.FC<ContainerProps> = ({ node, zIndex, mediaPath, maxDim, childFrame }) => {
  const {style, newChildFrame} = PowerPointStyle(node, zIndex, maxDim, childFrame);
  if (node.type == "cSld") {
    style.width = maxDim.width;
    style.height = maxDim.height;
  } else {
    !style.width && (style.width = "inherit");
    !style.height && (style.height = "inherit");
  }

  const renderComponent = (node: any, zIndex: number): JSX.Element => {
    console.log("renderComponent node:", zIndex, node.type, node.asset);
    if (node.type === "pic") {
      return <Image key={node.asset} node={node} zIndex={zIndex} mediaPath={mediaPath} maxDim={maxDim} childFrame={newChildFrame}/>;
    } else if (node.type === "sp") {
      return <Shape key={node.asset} node={node} zIndex={zIndex} mediaPath={mediaPath} maxDim={maxDim} childFrame={newChildFrame}/>;
    } else {//cSld, spTree, grpSp
      return <Container key={node.asset} node={node} zIndex={zIndex} mediaPath={mediaPath} maxDim={maxDim} childFrame={newChildFrame}/>;
    }
  }

  return (
    <div
      key={node.asset}
      className={`${node.type} ${node.name? node.name : ""}`}
      id={node.asset}
      style={style}
    >
     {node.children &&
        Object.values(node.children)
        .flatMap((childData: any) => Array.isArray(childData) ? childData : [childData])
        .filter((childData: any) => childData.asset)
        .map((childData: any, index: number) =>
          renderComponent(childData, (zIndex + index + 1))
        )}
    </div>
  );
};

export default Container;
