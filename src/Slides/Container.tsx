import React, { JSX } from "react";
import Image from "./Image";
import Shape from "./Shape";
import Text from "./Text";
import TextP from "./TextP";
import TextR from "./TextR";
import EmptyContainer from "./EmptyContainer";
import PowerPointStyle from "../utils/css_convertor";
import { SlideTypes, StyleConstants, NodeAttribs } from "../utils/constants";

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
  if (node[NodeAttribs.TYPE] == SlideTypes.SLIDE) {
    style.width = maxDim.width;
    style.height = maxDim.height;
  } else {
    !style.width && (style.width = StyleConstants.INHERIT);
    !style.height && (style.height = StyleConstants.INHERIT);
  }

  const renderChildren = (
    node: any,
    zIndex: number,
    childFrameParam: any
  ): JSX.Element => {
    return (
      node[NodeAttribs.CHILDREN] &&
      Object.values(node[NodeAttribs.CHILDREN])
        .flatMap((childData: any) =>
          Array.isArray(childData) ? childData : [childData]
        )
        .filter((childData: any) => childData[NodeAttribs.ASSET])
        .map((childData: any, index: number) => {
          // console.log(
          //   "renderComponent node:",
          //   zIndex,
          //   childData[NodeAttribs.TYPE],
          //   childData[NodeAttribs.ASSET]
          // );
          const newZIndex = zIndex + index + 1;
          if (childData[NodeAttribs.TYPE] === SlideTypes.PICTURE) {
            return (
              <Image
                key={childData[NodeAttribs.ASSET]}
                node={childData}
                zIndex={newZIndex}
                mediaPath={mediaPath}
                maxDim={maxDim}
                childFrame={childFrameParam}
              />
            );
          } else if (childData[NodeAttribs.TYPE] === SlideTypes.TEXT_BODY) {
            return (
              <Text
                key={childData[NodeAttribs.ASSET]}
                node={childData}
                zIndex={newZIndex}
                maxDim={maxDim}
                childFrame={childFrameParam}
                renderChildren={renderChildren}
              />
            );
          } else if (
            childData[NodeAttribs.TYPE] === SlideTypes.TEXT_PARAGRAPH
          ) {
            return (
              <TextP
                key={childData[NodeAttribs.ASSET]}
                node={childData}
                zIndex={zIndex}
                maxDim={maxDim}
                childFrame={newChildFrame}
                renderChildren={renderChildren}
              />
            );
          } else if (childData[NodeAttribs.TYPE] === SlideTypes.TEXT_RUN) {
            return (
              <TextR
                key={childData[NodeAttribs.ASSET]}
                node={childData}
                zIndex={zIndex}
                maxDim={maxDim}
                childFrame={newChildFrame}
              />
            );
          } else if (
            childData[NodeAttribs.TYPE] === SlideTypes.SHAPE ||
            childData[NodeAttribs.TYPE] === SlideTypes.CONNECTION_SHAPE ||
            childData[NodeAttribs.TYPE] === SlideTypes.GROUP_SHAPE
          ) {
            return (
              <Shape
                key={childData[NodeAttribs.ASSET]}
                node={childData}
                zIndex={newZIndex}
                mediaPath={mediaPath}
                maxDim={maxDim}
                childFrame={childFrameParam}
                renderChildren={renderChildren}
              />
            );
          } else if (
            childData[NodeAttribs.TYPE] === SlideTypes.ALTERNATE_CONTENT ||
            childData[NodeAttribs.TYPE] === SlideTypes.FALLBACK
          ) {
            return (
              <EmptyContainer
                key={childData[NodeAttribs.ASSET]}
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
                key={childData[NodeAttribs.ASSET]}
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
      key={node[NodeAttribs.ASSET]}
      className={`${node[NodeAttribs.TYPE]} ${node.name ? node.name : ""}`}
      id={node.id ? node.id : node[NodeAttribs.ASSET]}
      style={style}
    >
      {renderChildren(node, zIndex, newChildFrame)}
    </div>
  );
};

export default Container;
