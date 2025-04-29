import React, { JSX } from "react";
import Image from "./Image";
import PowerPointStyle from "../utils/css_convertor";

interface ContainerProps {
  node: any;
  zIndex: number;
  mediaPath: string;
  maxDim: { width: number; height: number }
}


const Container: React.FC<ContainerProps> = ({ node, zIndex, mediaPath, maxDim }) => {
  console.log("Container node:", zIndex, node.asset);
  const style = PowerPointStyle(node, zIndex, maxDim);

  const renderComponent = (node: any, zIndex: number): JSX.Element => {
    if (node.type === "pic") {
      return <Image key={node.asset} node={node} zIndex={zIndex} mediaPath={mediaPath} maxDim={maxDim}/>;
    } else {
      return <Container key={node.asset} node={node} zIndex={zIndex} mediaPath={mediaPath} maxDim={maxDim} />;
    }
  }

  return (
    <div
      key={node.asset}
      className={node.type}
      id={node.asset}
      style={style}
    >
     {node.children &&
          Object.values(node.children)
            .filter((childData: any) => childData.asset)
            .map((childData: any, index: number) =>
              renderComponent(childData, (zIndex + index + 1))
            )}
    </div>
  );
};

export default Container;
