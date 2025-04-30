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

function adjustLuminance(color: string, lumMod: number, lumOff: number): string {
  console.log("adjustLuminance color:", color, lumMod, lumOff);
  // Convert hex color to RGB
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  // Apply luminance modifier and offset
  const adjust = (channel: number) =>
    Math.min(
      255,
      Math.max(0, (channel * lumMod) / 100000 + (lumOff * 255) / 100000)
    );

  const adjustedR = adjust(r);
  const adjustedG = adjust(g);
  const adjustedB = adjust(b);

  // Convert back to hex
  return `rgb(${Math.round(adjustedR)}, ${Math.round(adjustedG)}, ${Math.round(adjustedB)})`;
}

function extractPatternFillStyles(node: any): any {
  const pattFill = node.properties?.shape?.pattFill || null;
  if (pattFill) {
    // Extract foreground color
    const fgClr = pattFill.fgClr?.schemeClr;
    let fgColor = "#000000";
    let adjustedFgColor = fgColor;
    console.log("fgClr:", fgClr, pattFill);
    if (fgClr) {
      const tx1Color = {
        tx1: "#000000", // Default text color in PowerPoint is black
      };
      let fgClrVal = "#000000"
      fgClrVal = fgClr?.value? fgClr.value.val: fgClrVal;
      fgClrVal = fgClrVal in tx1Color ? tx1Color[fgClrVal as keyof typeof tx1Color] : fgClrVal; // Map tx1 to its corresponding color
      fgColor = fgClrVal;
      const fgLumMod = fgClr.lumMod?.value?.val || 100000; // Default to 100% luminance
      const fgLumOff = fgClr.lumOff?.value?.val || 0; // Default to 0% offset

      // Adjust foreground color brightness
      console.log("Calling adjustLuminance");
      adjustedFgColor = adjustLuminance(fgColor, fgLumMod, fgLumOff);
      console.log("Color:", fgColor, adjustedFgColor);
    }

    // Extract background color
    // const bgClr = pattFill.bgClr?.schemeClr?.value || {};
    // let bgColor = "#FFFFFF"; // Default to white
    // if (bgClr) {
    //   bgColor = bgClr.val ? `#${bgClr.val}` : bgColor;
    // }

    // Extract pattern type
    const pattern = pattFill.value?.prst || "none"; // Default to "none" if not specified

    console.log("pattern:", pattern, adjustedFgColor);
    // Return CSS styles for pattern fill
    return {
      backgroundImage: `repeating-linear-gradient(${pattern}, ${adjustedFgColor})`,
    };
  }
  return {};
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

function extractStrokeStyles(node: any, scalingFactor: number): any {
  const line = node.properties?.shape?.ln || {};
  const lineColor = line.solidFill?.schemeClr?.value?.val || "black";
  const lineWidth = (parseInt(line.value?.w || "1") / 12700) * scalingFactor;
  const alpha = line.solidFill?.schemeClr?.alpha?.value?.val || "100000"; // Transparency
  const opacity = parseInt(alpha) / 100000; // Convert to CSS opacity (0-1)
  return {
    border: `${lineWidth}px solid rgba(${parseInt(lineColor.slice(0, 2), 16)}, ${parseInt(
      lineColor.slice(2, 4),
      16
    )}, ${parseInt(lineColor.slice(4, 6), 16)}, ${opacity})`,
  };
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

function extractEffectsStyles(node: any, maxDim: { width: number; height: number }): any {
  const effects = node.properties?.shape?.effectLst || null;
  if (effects) {
    const outerShadow = effects.outerShdw?.value || null;
    if (outerShadow) {
      const shadowColor = effects.outerShdw.prstClr?.value?.val || "000000";
      const blur = emuToPx(parseInt(outerShadow.blurRad || "0"), maxDim.width, 0);
      const dist = emuToPx(parseInt(outerShadow.dist || "0"), maxDim.width, 0);
      const dir = parseInt(outerShadow.dir || "0");
      const offsetX = dist * Math.cos((dir * Math.PI) / 1800000);
      const offsetY = dist * Math.sin((dir * Math.PI) / 1800000);
      return { boxShadow: `${blur}px ${offsetX}px ${offsetY}px #${shadowColor}` };
    }
  }
  return {};
}

function extractTextStyles(node: any, maxDim: { width: number; height: number }): any {
  const textStyle = node.properties?.txBody?.p?.endParaRPr?.value || {};
  const fontSize = emuToPx(parseInt(textStyle.sz || (24 * EMUConst).toString()), maxDim.width, 0);
  const fontColor = textStyle.solidFill?.srgbClr?.value?.val || "000000";
  const fontFamily = textStyle.latin?.value?.typeface || "Arial";
  const textAlign = node.properties?.txBody?.p?.pPr?.value?.algn || "center";
  const wrap = node.properties?.txBody?.bodyPr?.value?.wrap || "none";
  const anchor = node.properties?.txBody?.bodyPr?.value?.anchor || "top";
  return {
    fontSize: `${fontSize}px`,
    color: `#${fontColor}`,
    fontFamily,
    textAlign,
    whiteSpace: wrap === "none" ? "nowrap" : "normal",
    verticalAlign: anchor === "ctr" ? "middle" : anchor,
  };
}

function extractStyleReferences(node: any): any {
  const style = node.properties?.style || {};
  const fillRef = style.fillRef?.schemeClr?.value?.val || null;
  const lnRef = style.lnRef?.schemeClr?.value?.val || null;
  const effectRef = style.effectRef?.schemeClr?.value?.val || null;
  const fontRef = style.fontRef?.schemeClr?.value?.val || null;
  return {
    fillColor: fillRef ? `#${fillRef}` : undefined,
    borderColor: lnRef ? `#${lnRef}` : undefined,
    effectColor: effectRef ? `#${effectRef}` : undefined,
    fontColor: fontRef ? `#${fontRef}` : undefined,
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
  Object.assign(stylecss, extractPatternFillStyles(node));
  Object.assign(stylecss, extractStrokeStyles(node, scalingFactor));
  Object.assign(stylecss, extractCornerRadius(node, scalingFactor));
  Object.assign(stylecss, extractEffectsStyles(node, maxDim));
  Object.assign(stylecss, extractTextStyles(node, maxDim));
  Object.assign(stylecss, extractStyleReferences(node));

  const newChildFrame = calculateChildFrame(node, maxDim);

  return { style: stylecss, newChildFrame };
}

export default convertPowerPointStyle;