import { parse } from "path";

export interface PowerPointStyle {
  Media?: string;
  cNvPr?: string;
  "HyperlinkClick=./a:hlinkClick"?: string;
  "Pic Locks"?: string;
  "videoFile Not in Dict"?: string;
  Image?: string;
  "blip Not in Dict"?: string;
  Coordinates?: string;
  "PresetGeometry=./a:prstGeom"?: string;
  // "alpha"?: string;
  "Preset Colour"?: string;
  "./a:srcRect=Croppping"?: string;
  "OuterShadow=./a:outerShdw"?: string;
  "AlphaModFix=a:alphaModFix"?: string;
  grpSpPr_coords?: string;
  "gd inside gdLst"?: any[] | string;
  zIndex?: number;
}

function emuToPx(emu: number): number {
  return emu / 9525;
}

function emuRotationToDegrees(rotationEMU: number): number {
  return rotationEMU / 60000;
}

// Main function
function convertPowerPointStyle(pptxStyle: PowerPointStyle): any {
  const coords = pptxStyle["Coordinates"]
    ? JSON.parse(pptxStyle.Coordinates.replace(/'/g, '"'))
    : null;
  const grpcoords = pptxStyle["grpSpPr_coords"]
    ? JSON.parse(pptxStyle.grpSpPr_coords.replace(/'/g, '"'))
    : null;
  //const shadow = pptxStyle["OuterShadow=./a:outerShdw"] ? JSON.parse(pptxStyle["OuterShadow=./a:outerShdw"]) : null;
  const cropping =pptxStyle["./a:srcRect=Croppping"] &&
    pptxStyle["./a:srcRect=Croppping"] != "True"
      ? JSON.parse(pptxStyle["./a:srcRect=Croppping"].replace(/'/g, '"'))
      : null;
 

if(cropping){
  console.log(cropping);
}

  const prstGeom = pptxStyle["PresetGeometry=./a:prstGeom"]
    ? JSON.parse(pptxStyle["PresetGeometry=./a:prstGeom"].replace(/'/g, '"'))
    : "";

  const cnvpr = pptxStyle["cNvPr"]
    ? JSON.parse(pptxStyle["cNvPr"].replace(/'/g, '"'))
    : "Sher";
  let left = coords.offset.x ? emuToPx(coords.offset.x) : 0;
  let top = coords.offset.y ? emuToPx(coords.offset.y) : 0;
  let width = coords.extent.cx ? emuToPx(coords.extent.cx) : 0;
  let height = coords.extent.cy ? emuToPx(coords.extent.cy) : 0;
  let rotation = coords.rotation
    ? emuRotationToDegrees(Number(coords.rotation))
    : 0;
  const invert = coords.flipH ? -1 : 1;

  if (grpcoords) {
    left =
      emuToPx(grpcoords.offset.x) +
      emuToPx(coords.offset.x) -
      emuToPx(grpcoords.childOffset.x);
    top =
      emuToPx(grpcoords.offset.y) +
      emuToPx(coords.offset.y) -
      emuToPx(grpcoords.childOffset.y);
  }
 
  let presetColor = "";
  if (pptxStyle["Preset Colour"]) {
    if (Array.isArray(pptxStyle["Preset Colour"])) {
      presetColor = JSON.parse(
        pptxStyle["Preset Colour"][0].replace(/'/g, '"')
      ).val;
    } else {
      presetColor = JSON.parse(
        pptxStyle["Preset Colour"].replace(/'/g, '"')
      ).val;
    }
  }
  const alpha = pptxStyle["AlphaModFix=a:alphaModFix"]
    ? JSON.parse(pptxStyle["AlphaModFix=a:alphaModFix"].replace(/'/g, '"'))
        .amt / 100000
    : 1;
 //   console.log("97",cropping)
   const cropLeft = cropping?.l?parseInt(cropping.l)/1000:0
   const cropTop = cropping?.t?parseInt(cropping.t)/1000:0
   const cropRight = cropping?.r?parseInt(cropping.r)/1000:0
   const cropBottom = cropping?.b?parseInt(cropping.b)/1000:0
   console.log("98",cropBottom,cropLeft,cropRight,cropTop)
  if (prstGeom.prst === "arc") {
    let rot_st: string | undefined;

    const gdData = pptxStyle["gd inside gdLst"];

    let start = emuRotationToDegrees(
      parseInt(JSON.parse(gdData[0].replace(/'/g, '"')).fmla.slice(4))
    );
    let end = emuRotationToDegrees(
      parseInt(JSON.parse(gdData[1].replace(/'/g, '"')).fmla.slice(4))
    );
    
    
    //rotation=300-(rotation + start) % 360;
    //rotation=end;
    if(cropLeft!=0)console.log("121",cropLeft)

    console.log("83", rotation);
  }
  return {
    stylecss: {
      cnvpr: cnvpr.name,
      id: cnvpr.id,
      position: "absolute",
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`,
      transform: `rotate(${rotation}deg) scaleX(${invert})`,
      geom: prstGeom.prst,
      rotation: rotation,
      
      //boxShadow: `${blurRadius}px 0px 10px rgba(0,0,0,0.5)`,
      //backgroundColor: presetColor,
      opacity: parseFloat(JSON.stringify(alpha)),
      //opacity: 0.4 ,
      zIndex: pptxStyle.zIndex,
      clipPath: `inset(${cropTop}% ${cropRight}% ${cropBottom}% ${cropLeft}%)`,

      // backgroundImage: pptxStyle.Image ? `url(${pptxStyle.Image})` : "none",
      // backgroundSize: `${100 / ((cropRight - cropLeft) / 100)}% ${100 / ((cropBottom - cropTop) / 100)}%`,
      //backgroundPosition: `${-cropLeft}% ${-cropTop}%`,
      //backgroundRepeat: "no-repeat"
    },
    Image: pptxStyle["Image"] ? "Yes" : "No",
    Video: pptxStyle["Media"] ? "Yes" : "No",
  };
}

export default convertPowerPointStyle;
