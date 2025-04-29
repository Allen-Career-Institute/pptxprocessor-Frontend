import React, { useEffect, useState } from "react";
import findAllImages from "../utils/ImgFind";
import findAllVideos from "../utils/VideoFnd";
import findAllAssets from "../utils/assetfinder";
import findAllShapes from "../utils/ShapeFind";
import Image from "./Image";
import Video from "./Video";
import Shape from "./Shape";
import asseter from "../utils/finalassetmaker";
import "../App.css";
import { v4 as uuidv4 } from "uuid";
import { Stage, Layer, Text } from "react-konva";
import ComponentFactory from "./Componen//tFactory";
import pics from "../utils/ImgFind";
import Text_Comp from "./Text_Comp";
import obj from "..//assets/media/asset.modified.json"
interface PageProps {
  currSlide: number;
  currSlideData: any;
}

const Page: React.FC<PageProps> = ({ currSlide, currSlideData }) => {
  const [assets, setAssets] = useState<any[]>([]);
  const [shapes, setShapes] = useState<any[]>([]);
  const [video, setvideo] = useState<any[]>([]);
  const [image, setImageList] = useState<any[]>([]);
  const [text, setTextList] = useState<any[]>([]);

  useEffect(() => {
    if (!currSlideData) return;

    console.log(
      "useEffect triggered for slide:",
      currSlide,
      currSlideData.asset,
      currSlideData.type
    );
    // console.log("Curr slide data:", currSlideData);

    const slideData = currSlideData; //[Object.keys(currSlideData)[0]];
    const imageList = pics(slideData).images;

    //setImageList(imageList);

    //console.log("Extracted Images Immediately:", imageList);
    //const imageList = ;
    // const videoList = findAllVideos(slideData);
    // const assetList = findAllAssets(slideData);
    //const shapeList = pics(slideData).shapes;
   // const textlist = pics(slideData).text;
    //setvideo(videoList);
    //setTextList(textlist);
    // console.log("Extracted Videos:", videoList);
    // console.log("Extracted Assets:", assetList);
    // console.log("Extracted Shapes:", shapeList);

    //setShapes(shapeList);
    // setAssets(asseter(assetList, imageList, videoList));
  }, [currSlideData, currSlide]);
  // useEffect(() => {
  //   console.log("Updated State (imageList):", image);
  // }, [image]);

  const renderChildren = (children: any[]) => {

    for(let keys in children){
     


      return  <Page
      key={children.asset}
      currSlide={currSlide}
      currSlideData={children[keys]}

    />
    }




    // return children.map((childData: any) => (
    //   <Page
    //     key={childData.asset}
    //     currSlide={currSlide}
    //     currSlideData={childData}
    //   />
    // ));
  };

  const renderComponent = (currSlideData: any, assetType: string) => {
    return (
      <div
        key={currSlide}
        className={assetType}
        id={currSlideData.Asset}
      >
        {currSlideData.children && renderChildren(currSlideData.children)}
        {image.length > 0 &&
          image.map((val, index) => {
            val.style.zIndex = index;
            return <Image key={index} style={val.style} />;
          })}
        {text.length > 0 &&
          text.map((item) => <Text_Comp key={uuidv4()} style={item.style} />)}
        {shapes.length > 0 && (
          <Stage width={1268} height={780}>
            <Layer>
              {shapes.map((item, index) => {
                return (
                  <Shape
                    key={uuidv4()}
                    style={item.style}
                    parent={item.parent}
                  />
                );
              })}
            </Layer>
          </Stage>
        )}
      </div>
    );
  };

  

  console.log("Rendered slide:", currSlide, currSlideData.asset,currSlideData);

  return (
    <>
      {currSlideData.type === "cSld"
        ? renderComponent(currSlideData, "cSld")
        : currSlideData.type === "spTree"
        ? renderComponent(currSlideData, "spTree")
        : currSlideData.type === "grpSp"
        ? renderComponent(currSlideData, "grpSp")
        : currSlideData.type === "sp"
        ? renderComponent(currSlideData, "sp")
        : currSlideData.type === "pic"
        ? renderComponent(currSlideData, "pic")
        // : currSlideData.type === "GroupShapeProperties=./p:grpSpPr"
        // ? renderComponent(currSlideData, "grpSpPr")
        // : currSlideData.type === "non visual group properties = ./p:nvGrpSpPr"
        // ? renderComponent(currSlideData, "nvGrpSpPr")
        // : currSlideData.type === "cNvPr"
        // ? renderComponent(currSlideData, "cNvPr")
        // : currSlideData.type === "cNvGrpSpPr Not in Dict"
        // ? renderComponent(currSlideData, "cNvGrpSpPr")
        // : currSlideData.type === "nvPr Not in Dict"
        // ? renderComponent(currSlideData, "nvPr")
        // : currSlideData.type === "Coordinates"
        // ? renderComponent(currSlideData, "Coordinates")
        // : renderComponent(currSlideData, "None")
        : <></>}
    </>
  );
};

export default Page;
