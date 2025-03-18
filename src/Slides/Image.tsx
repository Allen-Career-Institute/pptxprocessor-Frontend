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
    clipPath: `inset(
      ${(cropping?.t / 100000) * coordinates?.height}px 
      ${(100 - cropping?.r / 100000 * 100)}% 
      ${(100 - cropping?.b / 100000 * 100)}%  
      ${(cropping?.l / 100000) * coordinates?.width}px
    )`,
  };

  return (
    <div>
      <img src={pathbuilder(imagepath)} style={style} />
    </div>
  );
};

export default Image;