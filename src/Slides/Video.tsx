import React from 'react';
import pxl from '../utils/emutopxl';


const Video = ({path,coordinates}:any) => {
  const basePath = "src/assets";

  function pathbuilder(pathvid:string) {
    if(!pathvid) return ""
    const finalpath=basePath + pathvid.slice(2)
    //console.log(basePath + pathvid.slice(2));
    //console.log(finalpath)
    return finalpath
  }
  const style: React.CSSProperties = {
    position: "absolute",
    left: pxl(coordinates?.x || 0),
    top: pxl(coordinates?.y || 0),
    width: pxl(coordinates?.width || 0),
    height: pxl(coordinates?.height || 0),
   
    //   ${((cropping?.t ?? 0) / 100000) * (coordinates?.height ?? 0)}px 
    //   ${(100 - ((cropping?.r ?? 0) / 100000) * 100)}px
    //   ${(100 - ((cropping?.b ?? 0) / 100000) * 100)}px
    //   ${((cropping?.l ?? 0) / 100000) * (coordinates?.width ?? 0)}px
    // )`,
  };

  return (
    <div>
      {pathbuilder(path)?( <div>
        <video 
        
        style={style}


        
         controls autoPlay>
      <source src={pathbuilder(path)} type="video/mp4"/>
      </video>
      </div>): (<div>No Video</div>)}
      
    </div>
  );
}

export default Video;