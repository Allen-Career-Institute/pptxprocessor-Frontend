import React, { JSX } from "react";
import Image from "./Image";
import Text from "./Text";
import convertPowerPointStyle from "../utils/css_convertor";

interface ShapeProps {
  node: any;
  zIndex: number;
  mediaPath: string;
  maxDim: { width: number; height: number };
  childFrame: { off: { x: number; y: number }; ext: { x: number; y: number } };
}

const Shape: React.FC<ShapeProps> = ({
  node,
  zIndex,
  mediaPath,
  maxDim,
  childFrame,
}: any) => {
  console.log("Shape node:", node.asset, node.type, node.name);
  const { style, newChildFrame } = convertPowerPointStyle(
    node,
    zIndex,
    maxDim,
    childFrame
  );

  const renderComponent = (node: any, zIndex: number): JSX.Element => {
    console.log("renderComponent node:", zIndex, node.type, node.asset);
    if (node.type === "pic") {
      return (
        <Image
          key={node.asset}
          node={node}
          zIndex={zIndex}
          mediaPath={mediaPath}
          maxDim={maxDim}
          childFrame={newChildFrame}
        />
      );
    } else if (node.type === "txBody") {
      return (
        <Text
          key={node.asset}
          node={node}
          zIndex={zIndex}
          maxDim={maxDim}
          childFrame={newChildFrame}
        />
      );
    } else {
      return <></>;
    }
  };

  return (
    <div
      key={node.asset}
      className={`${node.type} ${node.name ? node.name : ""}`}
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
          .flatMap((childData: any) =>
            Array.isArray(childData) ? childData : [childData]
          )
          .filter((childData: any) => childData.asset)
          .map((childData: any, index: number) =>
            renderComponent(childData, zIndex + index + 1)
          )}
    </div>
  );
};

export default Shape;
