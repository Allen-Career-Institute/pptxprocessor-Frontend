import React, { useEffect, useState } from "react";
import findAllImages from "../utils/ImgFind";
import findAllVideos from "../utils/VideoFnd";
import findAllAssets from "../utils/assetfinder";
import Image from "./Image";
import Video from "./Video";
import asseter from "../utils/finalassetmaker";
import "../App.css";
import { v4 as uuidv4 } from 'uuid';


interface PageProps {
  currSlide: number;
  currSlideData: any;
}

const Page: React.FC<PageProps> = ({ currSlide, currSlideData }) => {
  const [assets, setAssets] = useState<any[]>([]);

  useEffect(() => {
    if (!currSlideData) return;

    console.log("useEffect triggered for slide:", currSlide);

    const slideData = currSlideData[Object.keys(currSlideData)[0]];
    const imageList = findAllImages(slideData);
    const videoList = findAllVideos(slideData);
    const assetList = findAllAssets(slideData);

    console.log("Extracted Images:", imageList);
    console.log("Extracted Videos:", videoList);
    console.log("Extracted Assets:", assetList);

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
    </div>
  );
};

export default Page;