import React, { useEffect } from "react";
import "../App.css";
import Container from "./Container";
interface PageProps {
  currSlide: number;
  currSlideData: any;
  mediaPath: string;
  maxDim: { width: number; height: number };
}

const Page: React.FC<PageProps> = ({ currSlide, currSlideData, mediaPath, maxDim }) => {
  const childFrame = {
    off: { x: 0, y: 0 },
    ext: { x: 0, y: 0 }
  };
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
    <div 
      style={{ 
        width: "inherit", 
        height: "inherit", 
        position: "absolute",
        top: 0,
        left: 0, 
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Container key={currSlideData.asset} node={currSlideData.cSld} zIndex={0} mediaPath={mediaPath} maxDim={maxDim} childFrame={childFrame}/>
    </div>
  );
};

export default Page;
