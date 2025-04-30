const EMUConst = 9525;
const StandardWidth = 1280;

function emuToPx(emu: number, maxWidth: number, childFrame: number): number {
  return ((maxWidth * emu) / (EMUConst * StandardWidth)) - childFrame;
}

function emuRotationToDegrees(rotationEMU: number): number {
  return rotationEMU / 60000;
}

function convertPowerPointStyle(node: any, zIndex: any, 
  maxDim: { width: number; height: number },
  childFrame: {off: {x: number, y: number}, ext: {x: number, y: number}}): any {
  const stylecss: any = { position: "absolute", zIndex };

  const scalingFactor = maxDim.width / 1280; // Scaling factor for all pixel-based values

  // Extract position and dimensions
  const offset = node.properties?.shape?.xfrm?.off?.value || {};
  const extent = node.properties?.shape?.xfrm?.ext?.value || {};
  const chOff = node.properties?.shape?.xfrm?.chOff?.value || { x: 0, y: 0 };
  const chExt = node.properties?.shape?.xfrm?.chExt?.value || { cx: 1, cy: 1 };
  stylecss.left = `${offset.x ? emuToPx(offset.x, maxDim.width, childFrame.off.x) : 0}px`;
  stylecss.top = `${offset.y ? emuToPx(offset.y, maxDim.width, childFrame.off.y) : 0}px`;
  stylecss.width = `${extent.cx ? emuToPx(extent.cx, maxDim.width, childFrame.ext.x) : maxDim.width}px`;
  stylecss.height = `${extent.cy ? emuToPx(extent.cy, maxDim.width, childFrame.ext.y) : maxDim.height}px`;
  console.log("ChildFrame", offset.x, childFrame.off.x, stylecss.left);

  const newChildFrame = {off: {x: 0, y: 0}, ext: {x: 0, y: 0}};
  newChildFrame.off.x = chOff.x ? emuToPx(chOff.x, maxDim.width, 0) : 0;
  newChildFrame.off.y = chOff.y ? emuToPx(chOff.y, maxDim.width, 0) : 0;
  newChildFrame.ext.x = chExt.x ? emuToPx(chExt.x, maxDim.width, 0) : 0;
  newChildFrame.ext.y = chExt.y ? emuToPx(chExt.y, maxDim.width, 0) : 0;

  // Extract fill styles
  const solidFill = node.properties?.shape?.solidFill?.srgbClr?.value?.val || null;
  const gradFill = node.properties?.shape?.gradFill?.gsLst?.gs || null;
  if (solidFill) {
    stylecss.backgroundColor = `#${solidFill}`;
  } else if (gradFill) {
    const gradientColors = gradFill.map((stop: any) => `#${stop.srgbClr?.value?.val}`).join(", ");
    stylecss.backgroundImage = `linear-gradient(${gradientColors})`;
  }

  // Extract stroke (border) styles
  const line = node.properties?.shape?.ln || {};
  const lineColor = line.solidFill?.schemeClr?.value?.val || "black";
  const lineWidth = (parseInt(line.value?.w || "1") / 12700) * scalingFactor; // Scale border width
  stylecss.border = `${lineWidth}px solid #${lineColor}`;

  // Extract corner radius for rounded rectangles
  const prstGeom = node.properties?.shape?.prstGeom?.value?.prst || "rect";
  if (prstGeom === "roundRect") {
    const cornerAdj = node.properties?.shape?.prstGeom?.avLst?.gd?.value?.fmla || "0";
    stylecss.borderRadius = `${(parseInt(cornerAdj) / 1000) * scalingFactor}px`; // Scale corner radius
  } else if (prstGeom === "ellipse") {
    stylecss.borderRadius = "50%";
  }

  // Extract shadow effects
  const outerShadow = node.properties?.shape?.effectLst?.outerShdw || null;
  if (outerShadow) {
    const shadowColor = outerShadow.prstClr?.value?.val || "000000";
    const blur = emuToPx(parseInt(outerShadow.value?.blurRad || "0"), maxDim.width, 0); // Use emuToPx for blur radius
    const dist = emuToPx(parseInt(outerShadow.value?.dist || "0"), maxDim.width, 0); // Use emuToPx for distance
    const dir = parseInt(outerShadow.value?.dir || "0"); // Direction in EMUs (angle)
  
    // Calculate offsetX and offsetY based on direction and distance
    const offsetX = dist * Math.cos((dir * Math.PI) / 1800000); // Convert EMUs to degrees
    const offsetY = dist * Math.sin((dir * Math.PI) / 1800000); // Convert EMUs to degrees
  
    stylecss.boxShadow = `${blur}px ${offsetX}px ${offsetY}px #${shadowColor}`;
  }

  // Extract text styles
  const textStyle = node.properties?.txBody?.p?.endParaRPr?.value || {};
  node.properties?.txBody?.p?.r && console.log("Text", node.properties?.txBody?.p?.r[0]?.t?.value?.text);
  const fontSize = emuToPx(parseInt(textStyle.sz || (24*EMUConst).toString()), maxDim.width, 0); // Scale font size
  const fontColor = textStyle.solidFill?.prstClr?.value?.val || "000000";
  const fontFamily = textStyle.latin?.value?.typeface || "Arial";
  const textAlign = node.properties?.txBody?.p?.pPr?.value?.algn || "center";
  stylecss.fontSize = `${fontSize}px`;
  stylecss.color = `#${fontColor}`;
  stylecss.fontFamily = fontFamily;
  stylecss.textAlign = textAlign;

  return {style: stylecss, newChildFrame};
}

export default convertPowerPointStyle;