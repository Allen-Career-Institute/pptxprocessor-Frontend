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
import ComponentFactory from "./ComponentFactory";
import pics from "../utils/ImgFind";
import Text_Comp from "./Text_Comp";
interface PageProps {
  currSlide: number;
  currSlideData: any;
}

const Page: React.FC<PageProps> = ({ currSlide, currSlideData }) => {

  const [assets, setAssets] = useState<any[]>([]);
  const [shapes, setShapes] = useState<any[]>([]);
  const [video,setvideo]=useState<any[]>([]);
  const [image, setImageList] = useState<any[]>([]);
  const [text, setTextList] = useState<any[]>([]);

  useEffect(() => {
    if (!currSlideData) return;

    console.log("useEffect triggered for slide:", currSlide);

    const slideData = currSlideData[Object.keys(currSlideData)[0]];
    const imageList = pics(slideData).images;
    
    setImageList(imageList);  

    console.log("Extracted Images Immediately:", imageList); 
    //const imageList = ;
    // const videoList = findAllVideos(slideData);
    // const assetList = findAllAssets(slideData);
    const shapeList = pics(slideData).shapes;
    const textlist=pics(slideData).text;
    //setvideo(videoList);
   setTextList(textlist);
    // console.log("Extracted Videos:", videoList);
    // console.log("Extracted Assets:", assetList);
    // console.log("Extracted Shapes:", shapeList);

    setShapes(shapeList);
   // setAssets(asseter(assetList, imageList, videoList));
    
  }, [currSlideData,currSlide]);
  useEffect(() => {
    console.log("Updated State (imageList):", image);
}, [image]); 
if(currSlide===12)console.log("sher")
  return (
    <div className="slide-page">

      <h1>Total Assets: {image.length}</h1>
      {/* <ComponentFactory currSlide={currSlide} currSlideData={currSlideData[Object.keys(currSlideData)[0]]} /> */}
      {/* {assets.length > 0 ? (
        assets.map((item) => {
          console.log("Rendering Asset:", item);
          return item.AssetType === "Image" ? (
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
        <p>No assets found in this slide</p>
      )} */}
       {
        
        image.length>0?(image.map((val,index)=>
        {
            //console.log("Inside iamges")
            
            val.style.zIndex=index;
           // console.log(val)
         return  <Image key={index} style={val.style}/>
        }
              
        )):(<p>No Images</p>)
      }
      

      <Stage width={1268} height={780}>
        <Layer>
          {shapes.length > 0 ? (
          
            shapes.map((item,index) => {
             // console.log("Inside ");
             console.log(item.style["PresetGeometry=./a:prstGeom"],index)
            
           return   <Shape
                key={uuidv4()}
                style={item.style}
                parent={item.parent}
              />
           
            
              
})
          ) : (
            <Text // Konva does not support direct divs, so we replace it with a Konva Text component
              text="No shapes found in this slide"
              fontSize={16}
              x={10}
              y={10}
              fill="black"
            />
          )}
        </Layer>
      </Stage>
      {/* <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          {text.length>0?(
            text.map((item)=>
            <Text_Comp  key={uuidv4()}  style={item.style}/>
            )
          ):(<Text // Konva does not support direct divs, so we replace it with a Konva Text component
              text="No shapes found in this slide"
              fontSize={16}
              x={10}
              y={10}
              fill="black"
            />)}
        </Layer>
      </Stage> */}
      {text.length>0?(
            text.map((item)=>
            <Text_Comp  key={uuidv4()}  style={item.style}/>
            )
          ):(<p>"No text</p>)}
     
    </div>
  );
};

export default Page;