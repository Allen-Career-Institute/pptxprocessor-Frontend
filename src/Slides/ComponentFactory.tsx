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
import { v4 as uuidv4 } from 'uuid';
import { Stage, Layer, Text } from "react-konva";

interface PageProps {
  currSlide: number;
  currSlideData: any;
  coordinates: any;
  cropping: any;
}

const ComponentFactory: React.FC<PageProps> = ({ currSlide, currSlideData, coordinates, cropping }) => {
  const [assets, setAssets] = useState<any[]>([]);
  // const [shapes, setShapes] = useState<any[]>([]);
  // const [video,setvideo]=useState<any[]>([]);
  useEffect(() => {
    // if (!currSlideData) return;

    if (currSlideData.Type === "Image") {
      console.log("Factory With Image", JSON.stringify(currSlideData));
    } else {
      // console.log("Factory No Image", currSlideData.Type);
    }

    // const slideData = currSlideData[Object.keys(currSlideData)[0]];
    // const imageList = findAllImages(slideData);
    // const videoList = findAllVideos(slideData);
    // const assetList = findAllAssets(slideData);
    // const shapeList = findAllShapes(slideData);
    // setvideo(videoList);
    // console.log("Extracted Images:", imageList);
    // console.log("Extracted Videos:", videoList);
    // console.log("Extracted Assets:", assetList);
    // console.log("Extracted Shapes:", shapeList);

    // setShapes(shapeList);
    // setAssets(asseter(assetList, imageList, videoList));
    
  }, [currSlideData]);

  return (
    // <div className="slide-page">
    <>
      {currSlideData.Type === "Image"  && 
      //(
        <Image
          key={uuidv4()}
          imagepath={currSlideData.Value}
          coordinates={coordinates}
          cropping={cropping}
        />
      // ) : (
      //   <Video
      //     key={uuidv4()}
      //     path={currSlideData.VideoRef}
      //     coordinates={currSlideData.coordinates}
      //   />
      // )
      }
      {currSlideData.children.length > 0 && 
        currSlideData.children.map((childData: any,index:any) => {
          // let data:any;
          if (childData.Type == "Image") {
            // data=childData;
            console.log("Children", JSON.stringify(childData));
          }
          return <ComponentFactory key={index} currSlide={currSlide} currSlideData={childData}/>
        }
      )}
    </>

    //   <h1>Total Assets: {assets.length}</h1>
    //   {assets.length > 0 ? (
    //     assets.map((item) => {
    //       console.log("Rendering Asset:", item);
    //       return item.AssetType === "Image" ? (
    //         <Image
    //           key={uuidv4()}
    //           imagepath={item.imageRef}
    //           coordinates={item.coordinates}
    //           cropping={item.cropping}
    //         />
    //       ) : (
    //         <Video
    //           key={uuidv4()}
    //           path={item.VideoRef}
    //           coordinates={item.coordinates}
    //         />
    //       );
    //     })
    //   ) : (
    //     <p>No assets found in this slide</p>
    //   )}
      

    //   <Stage width={1280} height={720}>
    //     <Layer>
    //       {shapes.length > 0 ? (
    //         shapes.map((item) => (
    //           <Shape
    //             key={uuidv4()}
    //             coordinates={item.coordinates}
    //             assettype={item.AssetType || "rect"} // Default to "rect" if missing
    //           />
    //         ))
    //       ) : (
    //         <Text // Konva does not support direct divs, so we replace it with a Konva Text component
    //           text="No shapes found in this slide"
    //           fontSize={16}
    //           x={10}
    //           y={10}
    //           fill="black"
    //         />
    //       )}
    //     </Layer>
    //   </Stage>
    // </div>
  );
};

export default ComponentFactory;