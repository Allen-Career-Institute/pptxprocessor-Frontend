import React, { useEffect, useState } from "react";
import findAllImages from "../utils/ImgFind";
import findAllVideos from "../utils/VideoFnd";
import findAllAssets from "../utils/assetfinder";
import Image from "./Image";
import Video from "./Video";
import Shape from "./Shape";
import asseter from "../utils/finalassetmaker";
import "../App.css";
import { v4 as uuidv4 } from 'uuid';
import findAllShapes from "../utils/ShapeFind";
import { Stage,Layer } from "react-konva";

interface PageProps {
  currSlide: number;
  currSlideData: any;
}

const Page: React.FC<PageProps> = ({ currSlide, currSlideData }) => {
  const [assets, setAssets] = useState<any[]>([]);
  const [shapes,setShapes]=useState<any[]>([]);
  //console.log(findAllShapes())
  useEffect(() => {
    if (!currSlideData) return;

    console.log("useEffect triggered for slide:", currSlide);

    const slideData = currSlideData[Object.keys(currSlideData)[0]];
    const imageList = findAllImages(slideData);
    const videoList = findAllVideos(slideData);
    const assetList = findAllAssets(slideData);
    const shapelist = findAllShapes(slideData);
    console.log("Extracted Images:", imageList);
    console.log("Extracted Videos:", videoList);
    console.log("Extracted Assets:", assetList);
    console.log("extracted shapes:", shapelist);
    setShapes(shapelist);
    const orderedAssets = asseter(assetList, imageList, videoList);
    setAssets(orderedAssets);
    
  }, [currSlideData]);

  return (
    <div className="slide-page">
      <h1>Total Assets: {assets.length}</h1>
      
      {assets.length > 0 ? (
        assets.map((item, index) => {
          console.log("Rendering Asset:", item);
          return item.AssetType==="Image" ? (
            <Image 
              key={uuidv4()}
              imagepath={item.imageRef} 
              coordinates={item.coordinates}
              cropping={item.cropping}
            />
          ) : (
            <Video 
              key={uuidv4()}
              path={item.VideoRef}
              coordinates={item.coordinates}
            />
          );
        })
      ) : (
        <div>No assets found in this slide</div>
      )}
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          {shapes.length > 0 ? (
            shapes.map((item, index) => (
              <Shape
                key={uuidv4()}
                coordinates={item.coordinates}
                assettype={item.assettype } // Default to "rect" if missing
              />
            ))
          ) : (
            <div>No shapes found in this slide</div>
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default Page;