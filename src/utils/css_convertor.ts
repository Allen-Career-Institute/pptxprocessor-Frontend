function emuToPx(emu: number, maxWidth: number): number {
  return (maxWidth * emu) / (9525 * 1280);
}

function emuRotationToDegrees(rotationEMU: number): number {
  return rotationEMU / 60000;
}

// Main function
function convertPowerPointStyle(node: any, zIndex: any, maxDim: { width: number; height: number }): any {
  const stylecss: any = { position: "absolute", zIndex };

  const offset = node.properties?.shape?.xfrm.off || null;
  stylecss.left = `${offset ? emuToPx(offset.value.x, maxDim.width) : 0}px`;
  stylecss.top = `${offset ? emuToPx(offset.value.y, maxDim.width) : 0}px`;

  const extent = node.properties?.shape?.xfrm.ext || null;
  stylecss.width = `${extent ? extent.value.cx != "0"? emuToPx(extent.value.cx, maxDim.width) : maxDim.width : maxDim.width}px`;
  stylecss.height = `${extent ? extent.value.cy != "0"? emuToPx(extent.value.cy, maxDim.width) : maxDim.height: maxDim.height}px`;

  if (node.properties?.stretch) {
    if (node.properties.stretch === "fillRect") {
      stylecss.objectFit = "cover";
      stylecss.objectPosition = "center";
    }
  }
  // const coordRotation = node.properties?.shape?.xfrm.rot || null;
  //const shadow = pptxStyle["OuterShadow=./a:outerShdw"] ? JSON.parse(pptxStyle["OuterShadow=./a:outerShdw"]) : null;
  // const cropping =pptxStyle["Croppping"] &&
  //   pptxStyle["Croppping"] != "True"
  //     ? JSON.parse(pptxStyle["Croppping"].replace(/'/g, '"'))
  //     : null;

  // if(cropping){
  //   console.log(cropping);
  // }

  // const prstGeom = pptxStyle["PresetGeometry=./a:prstGeom"]
  //   ? JSON.parse(pptxStyle["PresetGeometry=./a:prstGeom"].replace(/'/g, '"'))
  //   : "";

  // let rotation = coordRotation
  //   ? emuRotationToDegrees(Number(coordRotation.value))
  //   : 0;
  // const invert = coords.flipH ? -1 : 1;

  // if (grpcoords) {
  //   left =
  //     emuToPx(grpcoords.offset.x) +
  //     emuToPx(coords.offset.x) -
  //     emuToPx(grpcoords.childOffset.x);
  //   top =
  //     emuToPx(grpcoords.offset.y) +
  //     emuToPx(coords.offset.y) -
  //     emuToPx(grpcoords.childOffset.y);
  // }

  // let presetColor = "";
  // if (pptxStyle["Preset Colour"]) {
  //   if (Array.isArray(pptxStyle["Preset Colour"])) {
  //     presetColor = JSON.parse(
  //       pptxStyle["Preset Colour"][0].replace(/'/g, '"')
  //     ).val;
  //   } else {
  //     presetColor = JSON.parse(
  //       pptxStyle["Preset Colour"].replace(/'/g, '"')
  //     ).val;
  //   }
  // }
  // const alpha = pptxStyle["AlphaModFix=a:alphaModFix"]
  //   ? JSON.parse(pptxStyle["AlphaModFix=a:alphaModFix"].replace(/'/g, '"'))
  //       .amt / 100000
  //   : 1;
  //   console.log("97",cropping)
  //  const cropLeft = cropping?.l?parseInt(cropping.l)/1000:0
  //  const cropTop = cropping?.t?parseInt(cropping.t)/1000:0
  //  const cropRight = cropping?.r?parseInt(cropping.r)/1000:0
  //  const cropBottom = cropping?.b?parseInt(cropping.b)/1000:0
  //  console.log("98",cropBottom,cropLeft,cropRight,cropTop)
  // if (prstGeom.prst === "arc") {
  //   let rot_st: string | undefined;

  //   const gdData = pptxStyle["gd inside gdLst"];

  //   let start = emuRotationToDegrees(
  //     parseInt(JSON.parse(gdData[0].replace(/'/g, '"')).fmla.slice(4))
  //   );
  //   let end = emuRotationToDegrees(
  //     parseInt(JSON.parse(gdData[1].replace(/'/g, '"')).fmla.slice(4))
  //   );

  //   //rotation=300-(rotation + start) % 360;
  //   //rotation=end;
  //   if(cropLeft!=0)console.log("121",cropLeft)

  //   console.log("83", rotation);
  // }
  return stylecss;
}

export default convertPowerPointStyle;
