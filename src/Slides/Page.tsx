import React, { useEffect, useState, JSX } from "react";
import "../App.css";
import Container from "./Container";
interface PageProps {
  currSlide: number;
  currSlideData: any;
}

const Page: React.FC<PageProps> = ({ currSlide, currSlideData }) => {
  useEffect(() => {
    if (!currSlideData) return;

    console.log(
      "useEffect triggered for slide:",
      currSlide,
      currSlideData.Asset
    );
  }, [currSlideData, currSlide]);

  return (
    <>
      <Container key={currSlideData.asset} node={currSlideData} zIndex={0} />
    </>
  );
};

export default Page;
