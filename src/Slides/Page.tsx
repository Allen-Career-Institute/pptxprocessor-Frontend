import React, { useEffect, useRef, useState } from "react";
import findAllImages from "../utils/ImgFind";
import findAllVideos from "../utils/VideoFnd";
import Image from "./Image";
import pxl from '../utils/emutopxl';
import Video from "./Video";
//import json from "../assets/asset copy.json";
import "../App.css"
import degree from "../utils/Todegree";
//import { clear } from "console";
interface PageProps {
  currSlide: number;
  currSlideData: any;
}

const Page: React.FC<PageProps> = ({ currSlide, currSlideData }) => {
  const [images, setImages] = useState<any[]>([]);
  const [video,setVideo]=useState<any[]>([])
  // const imageListref=useRef();
  useEffect(() => {
    if (!currSlideData) return;
    setImages([]);
    setVideo([]);
    console.log("useEffect triggered for slide:", currSlide);

    const imageList = findAllImages(currSlideData[Object.keys(currSlideData)[0]]);
    const videolist=findAllVideos(currSlideData[Object.keys(currSlideData)[0]])
    console.log("Extracted Images:", imageList); // Debugging log
    console.log("Extracted Video List", videolist)
      setImages(()=>imageList);
      setVideo(()=>videolist);
    //   return ()=>{
    //     console.log("Inside Cleanup")
    //   setImages([]);
    // setVideo([]);
    //   }
  }, [currSlideData]);
  
  return (
    <div className="slide-page">
      <h1>{images.length}</h1>
      <h1>{video.length}</h1>
      {images.length > 0 ? (
        images.map((img, index) => (
          
            
            <Image 
            key={index}
              imagepath={img.imageRef} 
              coordinates={img.coordinates}
              cropping=   {img.cropping}
            />
        
        ))
      ) : (
        <div>No images found in this slide</div>
      )}
      {video.length>0?(video.map(function(vid,index){

        return <div key={currSlide}>
            <Video 
            key={currSlide+index}
            path={vid.VideoRef}
            style={{
              position:"absolute",
              left: pxl(vid.coordinates?.x || 0),
              top: pxl(vid.coordinates?.y || 0),
              width: pxl(vid.coordinates?.width || 0),
              height: pxl(vid.coordinates?.height || 0),
            }}
            />
          
           </div>
      })):(<div>No video Content</div>)}

    
    </div>
  );
};

export default Page;
