import React from 'react';
import pxl from '../utils/emutopxl';
import degree from '../utils/Todegree';

const Image = ({ imagepath, coordinates, cropping }: any) => {
  const basePath = "src/assets";

  function pathbuilder(imagepath: string) {
    return basePath + imagepath.slice(2);
  }

  const style: React.CSSProperties = {
    position: "absolute",
    left: pxl(coordinates?.x || 0),
    top: pxl(coordinates?.y || 0),
    width: pxl(coordinates?.width || 0),
    height: pxl(coordinates?.height || 0),
    transform: `rotate(${degree(coordinates?.rot || "0")}deg)`,
    // clipPath: `inset(
    //   ${((cropping?.t ?? 0) / 100000) * (coordinates?.height ?? 0)}px 
    //   ${(100 - ((cropping?.r ?? 0) / 100000) * 100)}px
    //   ${(100 - ((cropping?.b ?? 0) / 100000) * 100)}px
    //   ${((cropping?.l ?? 0) / 100000) * (coordinates?.width ?? 0)}px
    // )`,
    //opacity:(pxl(coordinates?.width)>=1250 && pxl(coordinates?.height)>=700)?0:1
  };
  console.log(style)

  return (
    <div>
      <img src={pathbuilder(imagepath)} style={style} />
    </div>
  );
};

export default Image;