export interface PowerPointStyle {
    "Media"?: string;
    "cNvPr"?: string;
    "HyperlinkClick=./a:hlinkClick"?: string;
    "Pic Locks"?: string;
    "videoFile Not in Dict"?: string;
    "Image"?: string;
    "blip Not in Dict"?: string;
    "Coordinates"?: string;
    "PresetGeometry=./a:prstGeom"?: string;
   // "alpha"?: string;
    "Preset Colour"?:string;
    "./a:srcRect=Croppping"?: string;
    "OuterShadow=./a:outerShdw"?: string;
    "AlphaModFix=a:alphaModFix"?:string;
    "grpSpPr_coords"?:string;
    
    zIndex?:number;
}

function emuToPx(emu: number): number {
    return emu / 9525;
}

function emuRotationToDegrees(rotationEMU: number): number {
    return rotationEMU / 60000;
}



// Main function
function convertPowerPointStyle(pptxStyle: PowerPointStyle): any {
    const coords = pptxStyle["Coordinates"] ? JSON.parse(pptxStyle.Coordinates.replace(/'/g, '"')) : null;
    const grpcoords=pptxStyle["grpSpPr_coords"]?JSON.parse(pptxStyle.grpSpPr_coords.replace(/'/g, '"')):null;
    //const shadow = pptxStyle["OuterShadow=./a:outerShdw"] ? JSON.parse(pptxStyle["OuterShadow=./a:outerShdw"]) : null;
    const cropping = pptxStyle["./a:srcRect=Croppping"] ? JSON.parse(pptxStyle["./a:srcRect=Croppping"].replace(/'/g, '"')) : null;
    const prstGeom=pptxStyle["PresetGeometry=./a:prstGeom"]? JSON.parse(pptxStyle["PresetGeometry=./a:prstGeom"].replace(/'/g, '"')):"rect";
    const cnvpr=pptxStyle["cNvPr"]?JSON.parse(pptxStyle["cNvPr"].replace(/'/g, '"')):"Sher";
    let left = coords.offset.x ? emuToPx(coords.offset.x) : 0;
    let top = coords.offset.y ? emuToPx(coords.offset.y) : 0;
    let width = coords.extent.cx ? emuToPx(coords.extent.cx) : 0;
    let height = coords.extent.cy ? emuToPx(coords.extent.cy) : 0;
    const rotation = coords.rotation ? emuRotationToDegrees(Number(coords.rotation)) : 0;
    const invert=coords.flipH?-1:1;


    if(grpcoords){
        left=emuToPx(grpcoords.offset.x)+emuToPx(coords.offset.x)-emuToPx(grpcoords.childOffset.x);
        top=emuToPx(grpcoords.offset.y)+emuToPx(coords.offset.y)-emuToPx(grpcoords.childOffset.y);
    }
//     if(!pptxStyle["Image"]&& !pptxStyle["Media"]){
//         const scaleX = emuToPx(grpcoords.extent.cx) / emuToPx(grpcoords.childExtent.cx);
//   const scaleY = emuToPx(grpcoords.extent.cy) / emuToPx(grpcoords.childExtent.cy);

//   width = emuToPx(coords.extent.cx) * scaleX;
//   height = emuToPx(coords.extent.cy) * scaleY;
//     }
    //const blurRadius = shadow?.blurRad ? emuToPx(shadow.blurRad) : 0;
    
    // Extract color properties
   // const presetColor = pptxStyle["Preset Colour"] ? JSON.parse(pptxStyle["Preset Colour"].replace(/'/g, '"')).val : 'black';
    const alpha = pptxStyle["AlphaModFix=a:alphaModFix"]?JSON.parse(pptxStyle["AlphaModFix=a:alphaModFix"].replace(/'/g, '"')).amt / 100000: 1;  
    const cropLeft = cropping?.l ? (parseFloat(cropping.l) / 100000) * 100 : 0;
    const cropTop = cropping?.t ? (parseFloat(cropping.t) / 100000) * 100 : 0;
    const cropRight = cropping?.r ? (parseFloat(cropping.r )/ 100000) * 100 : 100;
    const cropBottom = cropping?.b ? (parseFloat(cropping.b )/ 100000) * 100 : 100;
  
    return {
      stylecss: {
        cnvpr:cnvpr.name,
        id:cnvpr.id,
        position: "absolute",
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
        transform: `rotate(${rotation}deg) scaleX(${invert})`,
        geom:prstGeom.prst,
        //boxShadow: `${blurRadius}px 0px 10px rgba(0,0,0,0.5)`, 
        //backgroundColor: presetColor,
        opacity: parseFloat(JSON.stringify(alpha)) ,
        zIndex:pptxStyle.zIndex,
       // backgroundImage: pptxStyle.Image ? `url(${pptxStyle.Image})` : "none",
       // backgroundSize: `${100 / ((cropRight - cropLeft) / 100)}% ${100 / ((cropBottom - cropTop) / 100)}%`,
        //backgroundPosition: `${-cropLeft}% ${-cropTop}%`,
        //backgroundRepeat: "no-repeat"
      },
      Image:pptxStyle["Image"]?"Yes":"No",
      Video:pptxStyle["Media"]?"Yes":"No"
    };
  }
  
export default convertPowerPointStyle;