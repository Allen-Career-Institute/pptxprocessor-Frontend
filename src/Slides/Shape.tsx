//import React from 'react'
//import findAllShapes from '../utils/ShapeFind'
import { Stage, Layer, Rect } from 'react-konva'
import pxl from '../utils/emutopxl';
import degree from '../utils/Todegree';
import  PowerPointStyle  from '../utils/css_convertor';

const Shape = ({ style }:any) => {
    let s=PowerPointStyle(style);
    console.log(s)
    function border() {
        const asset = s.stylecss.geom;

if (!asset) {
  console.log("no shape (null or undefined)");
  return 0; // or some default value for missing shape
}
// if(asset === "Freeform: Shape 19"){
  
// }
if (asset === "roundRect") {
  console.log("round rect");
  return 15;
} else if (asset === "ellipse") {
  console.log("ellipse");
  return parseInt(s.stylecss.height);
}

console.log("other shape : rect");
return 0;
    }
//console.log(border(assettype,coordinates))
    // const style = {
    //     x: pxl(coordinates.x),
    //     y: pxl(coordinates.y),
    //     width: pxl(coordinates.width),
    //     height: pxl(coordinates.height),
    //     stroke: "yellow",
    //     strokeWidth: 2,
    //     cornerRadius: 56,
    //    // rotation: degree(coordinates.rot || 0), // Apply rotation
    //     // offsetX: pxl(coordinates.width) / 2, // Set rotation around center
    //     // offsetY: pxl(coordinates.height) / 2
    // };

    return (
       // <Rect {...style} />
        <Rect
        x = {parseInt(s.stylecss.left)}
        y = {parseInt(s.stylecss.top)}
        width = {parseInt(s.stylecss.width)}
        height = {parseInt(s.stylecss.height)}
         stroke= {"yellow"}
         strokeWidth= {2}
         cornerRadius= {border()}
        
        />
        
    );
}

export default Shape;