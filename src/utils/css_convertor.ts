const EMUConst = 9525;
const StandardWidth = 1280;

function emuToPx(emu: number, maxWidth: number, childFrame: number): number {
  return ((maxWidth * emu) / (EMUConst * StandardWidth)) - childFrame;
}

function emuRotationToDegrees(rotationEMU: number): number {
  return rotationEMU / 60000;
}

function extractPositionAndDimensions(node: any, maxDim: { width: number; height: number }, childFrame: any): any {
  const offset = node.properties?.shape?.xfrm?.off?.value || {};
  const extent = node.properties?.shape?.xfrm?.ext?.value || {};
  return {
    left: `${offset.x ? emuToPx(offset.x, maxDim.width, childFrame.off.x) : 0}px`,
    top: `${offset.y ? emuToPx(offset.y, maxDim.width, childFrame.off.y) : 0}px`,
    width: `${extent.cx ? emuToPx(extent.cx, maxDim.width, childFrame.ext.x) : maxDim.width}px`,
    height: `${extent.cy ? emuToPx(extent.cy, maxDim.width, childFrame.ext.y) : maxDim.height}px`,
  };
}

function calculateChildFrame(node: any, maxDim: { width: number; height: number }): any {
  const chOff = node.properties?.shape?.xfrm?.chOff?.value || { x: 0, y: 0 };
  const chExt = node.properties?.shape?.xfrm?.chExt?.value || { cx: 1, cy: 1 };
  return {
    off: {
      x: chOff.x ? emuToPx(chOff.x, maxDim.width, 0) : 0,
      y: chOff.y ? emuToPx(chOff.y, maxDim.width, 0) : 0,
    },
    ext: {
      x: chExt.x ? emuToPx(chExt.x, maxDim.width, 0) : 0,
      y: chExt.y ? emuToPx(chExt.y, maxDim.width, 0) : 0,
    },
  };
}

function extractFillStyles(node: any): any {
  const solidFill = node.properties?.shape?.solidFill?.srgbClr?.value?.val || null;
  const gradFill = node.properties?.shape?.gradFill?.gsLst?.gs || null;
  if (solidFill) {
    return { backgroundColor: `#${solidFill}` };
  } else if (gradFill) {
    const gradientColors = gradFill.map((stop: any) => `#${stop.srgbClr?.value?.val}`).join(", ");
    return { backgroundImage: `linear-gradient(${gradientColors})` };
  }
  return {};
}

function extractStrokeStyles(node: any, scalingFactor: number): any {
  const line = node.properties?.shape?.ln || {};
  const lineColor = line.solidFill?.schemeClr?.value?.val || "black";
  const lineWidth = (parseInt(line.value?.w || "1") / 12700) * scalingFactor;
  return { border: `${lineWidth}px solid #${lineColor}` };
}

function extractCornerRadius(node: any, scalingFactor: number): any {
  const prstGeom = node.properties?.shape?.prstGeom?.value?.prst || "rect";
  console.log("prstGeom:", prstGeom, node.properties?.shape?.prstGeom?.value?.prst);
  if (prstGeom === "roundRect") {
    const cornerAdj = node.properties?.shape?.prstGeom?.avLst?.gd?.value?.fmla.split(" ")[1] || "0";
    console.log("cornerAdj:", cornerAdj, scalingFactor);
    const borderRadius = `${(parseInt(cornerAdj) / 1000) * scalingFactor}px`;
    console.log("borderRadius:", borderRadius);
    return { borderRadius };
  } else if (prstGeom === "ellipse") {
    return { borderRadius: "50%" };
  }
  return {};
}

function extractShadowStyles(node: any, maxDim: { width: number; height: number }): any {
  const outerShadow = node.properties?.shape?.effectLst?.outerShdw || null;
  if (outerShadow) {
    const shadowColor = outerShadow.prstClr?.value?.val || "000000";
    const blur = emuToPx(parseInt(outerShadow.value?.blurRad || "0"), maxDim.width, 0);
    const dist = emuToPx(parseInt(outerShadow.value?.dist || "0"), maxDim.width, 0);
    const dir = parseInt(outerShadow.value?.dir || "0");
    const offsetX = dist * Math.cos((dir * Math.PI) / 1800000);
    const offsetY = dist * Math.sin((dir * Math.PI) / 1800000);
    return { boxShadow: `${blur}px ${offsetX}px ${offsetY}px #${shadowColor}` };
  }
  return {};
}

function extractTextStyles(node: any, maxDim: { width: number; height: number }): any {
  const textStyle = node.properties?.txBody?.p?.endParaRPr?.value || {};
  const fontSize = emuToPx(parseInt(textStyle.sz || (24 * EMUConst).toString()), maxDim.width, 0);
  const fontColor = textStyle.solidFill?.prstClr?.value?.val || "000000";
  const fontFamily = textStyle.latin?.value?.typeface || "Arial";
  const textAlign = node.properties?.txBody?.p?.pPr?.value?.algn || "center";
  return {
    fontSize: `${fontSize}px`,
    color: `#${fontColor}`,
    fontFamily,
    textAlign,
  };
}

function convertPowerPointStyle(
  node: any,
  zIndex: any,
  maxDim: { width: number; height: number },
  childFrame: { off: { x: number; y: number }; ext: { x: number; y: number } }
): any {
  const stylecss: any = { position: "absolute", zIndex };
  const scalingFactor = maxDim.width / 1280;

  Object.assign(stylecss, extractPositionAndDimensions(node, maxDim, childFrame));
  Object.assign(stylecss, extractFillStyles(node));
  Object.assign(stylecss, extractStrokeStyles(node, scalingFactor));
  Object.assign(stylecss, extractCornerRadius(node, scalingFactor));
  Object.assign(stylecss, extractShadowStyles(node, maxDim));
  Object.assign(stylecss, extractTextStyles(node, maxDim));

  const newChildFrame = calculateChildFrame(node, maxDim);

  return { style: stylecss, newChildFrame };
}

export default convertPowerPointStyle;