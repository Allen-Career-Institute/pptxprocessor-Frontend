import React, { useEffect, useState, JSX } from "react";
import "../App.css";
import Container from "./Container";
interface PageProps {
  currSlide: number;
  currSlideData: any;
  mediaPath: string;
  maxDim: { width: number; height: number };
}

const Page: React.FC<PageProps> = ({ currSlide, currSlideData, mediaPath, maxDim }) => {
  useEffect(() => {
    if (!currSlideData) return;

    console.log(
      "useEffect triggered for slide:",
      currSlide,
      currSlideData.Asset
    );
  }, [currSlideData, currSlide]);

  console.log("Page currSlideData:", currSlideData);

  return (
    <>
      <Container key={currSlideData.asset} node={currSlideData.cSld} zIndex={0} mediaPath={mediaPath} maxDim={maxDim}/>
    </>
  );
};

export default Page;
