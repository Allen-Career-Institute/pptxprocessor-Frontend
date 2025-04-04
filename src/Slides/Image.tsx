import React from 'react';
import pxl from '../utils/emutopxl';
import degree from '../utils/Todegree';
import  PowerPointStyle  from '../utils/css_convertor';
const Image = ({ style }: any) => {
 const s=PowerPointStyle(style)
 console.log(s)
const basePath = "src/assets";
  function pathbuilderImg() {
    if(s.Image==="No")return ""
    return basePath + style.Image.slice(2);
  }
  function pathbuilderVid(){
    if(s.Video==="No") return ""
    return basePath +style.Media.slice(2)
  }
 
//const s=PowerPointStyle(style).stylecss;
//console.log(PowerPointStyle(style))

  // const style: React.CSSProperties = {
  //   position: "absolute",
  //   left: pxl(coordinates?.x || 0),
  //   top: pxl(coordinates?.y || 0),
  //   width: pxl(coordinates?.width || 0),
  //   height: pxl(coordinates?.height || 0),
  //   transform: `rotate(${degree(coordinates?.rot || "0")}deg)  scaleX(${(coordinates.flipH==="1")?(-1):(1)})`,
  //   // clipPath: `inset(
  //   //   ${((cropping?.t ?? 0) / 100000) * (coordinates?.height ?? 0)}px 
  //   //   ${(100 - ((cropping?.r ?? 0) / 100000) * 100)}px
  //   //   ${(100 - ((cropping?.b ?? 0) / 100000) * 100)}px
  //   //   ${((cropping?.l ?? 0) / 100000) * (coordinates?.width ?? 0)}px
  //   // )`,
  //   //opacity:(pxl(coordinates?.width)>=1250 && pxl(coordinates?.height)>=700)?0:1
  // };
  // console.log(style)

  return (
    <div>
  {s.Image === "Yes" && (
    <>
      {s.Video === "Yes" ? (
        <video
          src={pathbuilderVid()}
           // Image as video thumbnail
           poster={pathbuilderImg()}
          style={PowerPointStyle(style).stylecss}
         controls autoPlay
        />
      ) : (
        <img src={pathbuilderImg()} style={PowerPointStyle(style).stylecss} />
      )}
    </>
  )}
</div>
  );

};
export default Image;


