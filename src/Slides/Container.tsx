import React, { JSX } from "react";
import Image from "./Image";
import Shape from "./Shape";
import Text from "./Text";
import TextP from "./TextP";
import TextR from "./TextR";
import EmptyContainer from "./EmptyContainer";
import PowerPointStyle from "../utils/css_convertor";

interface ContainerProps {
  node: any;
  zIndex: number;
  mediaPath: string;
  maxDim: { width: number; height: number };
  childFrame: { off: { x: number; y: number }; ext: { x: number; y: number } };
}

const Container: React.FC<ContainerProps> = ({
  node,
  zIndex,
  mediaPath,
  maxDim,
  childFrame,
}) => {
  const { style, newChildFrame } = PowerPointStyle(
    node,
    zIndex,
    maxDim,
    childFrame
  );
  if (node._type == "cSld") {
    style.width = maxDim.width;
    style.height = maxDim.height;
  } else {
    if (node._type == "spTree") {
      console.log("spTree", node._asset, style.width, style.height);
    }
    !style.width && (style.width = "inherit");
    !style.height && (style.height = "inherit");
  }

  const renderChildren = (
    node: any,
    zIndex: number,
    childFrameParam: any
  ): JSX.Element => {
    return (
      node._children &&
      Object.values(node._children)
        .flatMap((childData: any) =>
          Array.isArray(childData) ? childData : [childData]
        )
        .filter((childData: any) => childData._asset)
        .map((childData: any, index: number) => {
          console.log(
            "renderComponent node:",
            zIndex,
            childData._type,
            childData._asset
          );
          const newZIndex = zIndex + index + 1;
          if (childData._type === "pic") {
            return (
              <Image
                key={childData._asset}
                node={childData}
                zIndex={newZIndex}
                mediaPath={mediaPath}
                maxDim={maxDim}
                childFrame={childFrameParam}
              />
            );
          } else if (childData._type === "txBody") {
            return (
              <Text
                key={childData._asset}
                node={childData}
                zIndex={newZIndex}
                maxDim={maxDim}
                childFrame={childFrameParam}
                renderChildren={renderChildren}
              />
            );
          } else if (childData._type === "p") {
            return (
              <TextP
                key={childData._asset}
                node={childData}
                zIndex={zIndex}
                maxDim={maxDim}
                childFrame={newChildFrame}
                renderChildren={renderChildren}
              />
            );
          } else if (childData._type === "r") {
            return (
              <TextR
                key={childData._asset}
                node={childData}
                zIndex={zIndex}
                maxDim={maxDim}
                childFrame={newChildFrame}
              />
            );
          } else if (
            childData._type === "sp" ||
            childData._type === "cxnSp" ||
            childData._type === "grpSp"
          ) {
            return (
              <Shape
                key={childData._asset}
                node={childData}
                zIndex={newZIndex}
                mediaPath={mediaPath}
                maxDim={maxDim}
                childFrame={childFrameParam}
                renderChildren={renderChildren}
              />
            );
          } else if (
            childData._type === "AlternateContent" ||
            childData._type === "Fallback"
          ) {
            return (
              <EmptyContainer
                key={childData._asset}
                node={childData}
                zIndex={newZIndex}
                childFrame={childFrameParam}
                renderChildren={renderChildren}
              />
            );
          } else {
            //cSld, spTree, grpSp
            return (
              <Container
                key={childData._asset}
                node={childData}
                zIndex={newZIndex}
                mediaPath={mediaPath}
                maxDim={maxDim}
                childFrame={childFrameParam}
              />
            );
          }
        })
    );
  };

  return (
    <div
      key={node._asset}
      className={`${node._type} ${node.name ? node.name : ""}`}
      id={node._asset}
      style={style}
    >
      {renderChildren(node, zIndex, newChildFrame)}
    </div>
  );
};

export default Container;
