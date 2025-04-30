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
  "Preset Colour"?: string;
  Croppping?: string;
  "OuterShadow=./a:outerShdw"?: string;
  "AlphaModFix=a:alphaModFix"?: string;
  grpSpPr_coords?: string;
  "gd inside gdLst"?: any[] | string;
  zIndex?: number;
  "LineProperties=./a:ln"?:string
}

function emuToPx(emu: number): number {
  return emu / 9525;
}

function emuRotationToDegrees(rotationEMU: number): number {
  return rotationEMU / 60000;
}

function safeJsonParse(input: string): any {
  try {
    return JSON.parse(input.replace(/'/g, '"'));
  } catch {
    return {};
  }
}

// Main function
function convertPowerPointStyle(pptxStyle: PowerPointStyle): any {
  const coords = pptxStyle.Coordinates
    ? safeJsonParse(pptxStyle.Coordinates)
    : null;
  const grpcoords = pptxStyle.grpSpPr_coords
    ? safeJsonParse(pptxStyle.grpSpPr_coords)
    : null;
  const croppingRaw = pptxStyle["Croppping"];
  const cropping =
    croppingRaw && croppingRaw !== "True" ? safeJsonParse(croppingRaw) : null;
  const prstGeom = pptxStyle["PresetGeometry=./a:prstGeom"]
    ? safeJsonParse(pptxStyle["PresetGeometry=./a:prstGeom"])
    : {};
  const cnvpr = pptxStyle.cNvPr
    ? safeJsonParse(pptxStyle.cNvPr)
    : { name: "", id: "" };

  let left = coords?.offset?.x ? emuToPx(coords.offset.x) : 0;
  let top = coords?.offset?.y ? emuToPx(coords.offset.y) : 0;
  let width = coords?.extent?.cx ? emuToPx(coords.extent.cx) : 0;
  let height = coords?.extent?.cy ? emuToPx(coords.extent.cy) : 0;
  let rotation = coords?.rotation
    ? emuRotationToDegrees(Number(coords.rotation))
    : 0;
  const invert = coords?.flipH ? -1 : 1;

  if (grpcoords) {
    left =
      emuToPx(grpcoords.offset?.x || 0) +
      emuToPx(coords?.offset?.x || 0) -
      emuToPx(grpcoords.childOffset?.x || 0);
    top =
      emuToPx(grpcoords.offset?.y || 0) +
      emuToPx(coords?.offset?.y || 0) -
      emuToPx(grpcoords.childOffset?.y || 0);
  }

  let presetColor = "";
  if (pptxStyle["Preset Colour"]) {
    const rawColor = Array.isArray(pptxStyle["Preset Colour"])
      ? pptxStyle["Preset Colour"][0]
      : pptxStyle["Preset Colour"];
    presetColor = safeJsonParse(rawColor).val;
  }

  const alpha = pptxStyle["AlphaModFix=a:alphaModFix"]
    ? safeJsonParse(pptxStyle["AlphaModFix=a:alphaModFix"]).amt / 100000
    : 1;

  // Normalize cropping from PowerPoint's 0–100000 scale to % (0–100)
  const cropLeft = cropping?.l ? (parseInt(cropping.l) / 100000) * 100 : 0;
  const cropTop = cropping?.t ? (parseInt(cropping.t) / 100000) * 100 : 0;
  const cropRight = cropping?.r ? (parseInt(cropping.r) / 100000) * 100 : 0;
  const cropBottom = cropping?.b ? (parseInt(cropping.b) / 100000) * 100 : 0;

  const hasImage = !!pptxStyle.Image;

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
      opacity: parseFloat(alpha.toFixed(3)),
      zIndex: pptxStyle.zIndex,
      clipPath: `inset(${cropTop}% ${cropRight}% ${cropBottom}% ${cropLeft}%)`,
      objectFit: "fill",
      ...(hasImage && {
        backgroundImage: `url(${pptxStyle.Image})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }),
    },
    Image: hasImage ? "Yes" : "No",
    Video: pptxStyle.Media ? "Yes" : "No",
  };
}

export default convertPowerPointStyle;
