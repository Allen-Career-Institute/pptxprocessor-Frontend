import React, { useEffect } from "react";
import "../App.css";
import Container from "./Container";
import { NodeAttribs, SlideTypes, StyleConstants } from "../utils/constants";
import { commonTimeNode, onBeginCallback, OnCompleteCallback } from "../utils/animation";

interface PageProps {
  currSlide: number;
  currSlideData: any;
  mediaPath: string;
  maxDim: { width: number; height: number };
}

const Page: React.FC<PageProps> = ({
  currSlide,
  currSlideData,
  mediaPath,
  maxDim,
}) => {
  const childFrame = {
    off: { x: 0, y: 0 },
    ext: { x: 0, y: 0 },
  };

  useEffect(() => {
    const onComplete: OnCompleteCallback = () => {}

    const onBegin: onBeginCallback = () => {};

    commonTimeNode(currSlideData?.timing, null, onBegin, onComplete, null).init();
  }, []);

  return (
    <div
      style={{
        width: StyleConstants.INHERIT,
        height: StyleConstants.INHERIT,
        position: StyleConstants.ABSOLUTE,
        top: 0,
        left: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Container
        key={currSlideData[NodeAttribs.ASSET]}
        node={currSlideData[SlideTypes.SLIDE]}
        zIndex={0}
        mediaPath={mediaPath}
        maxDim={maxDim}
        childFrame={childFrame}
      />
    </div>
  );
};

export default Page;
