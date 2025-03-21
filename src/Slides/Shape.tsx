//import React from 'react'
//import findAllShapes from '../utils/ShapeFind'
import { Stage, Layer, Rect } from 'react-konva'
import pxl from '../utils/emutopxl';
import degree from '../utils/Todegree';

const Shape = ({ coordinates, assettype }) => {
    function border(asset, coordinates) {
        if (asset == "roundRect") return 5;
        else if (asset == "ellipse") return pxl(coordinates.height) / 2;
        return 0;
    }

    const style = {
        x: pxl(coordinates.x),
        y: pxl(coordinates.y),
        width: pxl(coordinates.width),
        height: pxl(coordinates.height),
        stroke: "black",
        strokeWidth: 2,
        cornerRadius: border(assettype, coordinates),
       // rotation: degree(coordinates.rot || 0), // Apply rotation
        // offsetX: pxl(coordinates.width) / 2, // Set rotation around center
        // offsetY: pxl(coordinates.height) / 2
    };

    return (
        <Rect {...style} />
    );
}

export default Shape;