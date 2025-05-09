import {
  extractPx,
  extractColor,
  extractOpacity,
  extractRgba,
  extractSolidFillColor,
  calculateChildFrame,
  extractFontFamily,
} from "./extract_utils";
import { emuToPx, emuToFontSize,emuRotationToDegrees } from "./helper_utils";
import { NodeAttribs } from "./constants";

function processEffectLst(
  stylecss: any,
  effectLst: any,
  maxDim: { width: number; height: number }
): any {
  if (effectLst) {
    // Handle outer shadow (outerShdw)
    const outerShdw = effectLst.outerShdw;
    if (outerShdw) {
      // Extract shadow properties
      const dir = outerShdw.dir || 0; // Direction in EMUs
      const align = outerShdw.algn || "ctr"; // Alignment (default to center)
      // const rotWithShape = outerShdw.rotWithShape || "1"; // Rotate with shape (default to true). This is not supported in css
      const colorNode = outerShdw.prstClr || outerShdw.srgbClr; // Shadow color

      // Convert EMU values to pixels
      const blurPx = extractPx(outerShdw?.blurRad, 0, maxDim);
      const distPx = extractPx(outerShdw.dist, 0, maxDim);

      // Convert direction to x and y offsets
      const angleRad = (dir / 60000) * (Math.PI / 180); // Convert EMUs to degrees, then to radians
      let offsetX = Math.round(distPx * Math.cos(angleRad));
      let offsetY = Math.round(distPx * Math.sin(angleRad));

      // Adjust offsets based on alignment
      if (align === "t") offsetY = -Math.abs(offsetY); // Top alignment
      else if (align === "b") offsetY = Math.abs(offsetY); // Bottom alignment
      else if (align === "l") offsetX = -Math.abs(offsetX); // Left alignment
      else if (align === "r") offsetX = Math.abs(offsetX); // Right alignment
      else if (align === "tl") {
        offsetX = -Math.abs(offsetX);
        offsetY = -Math.abs(offsetY);
      } else if (align === "tr") {
        offsetX = Math.abs(offsetX);
        offsetY = -Math.abs(offsetY);
      } else if (align === "bl") {
        offsetX = -Math.abs(offsetX);
        offsetY = Math.abs(offsetY);
      } else if (align === "br") {
        offsetX = Math.abs(offsetX);
        offsetY = Math.abs(offsetY);
      }

      // Extract shadow color
      const shadowColor = extractColor(colorNode);

      // Extract opacity
      const opacity = extractOpacity(outerShdw);

      // Combine into box-shadow
      stylecss.boxShadow = `${offsetX}px ${offsetY}px ${blurPx}px ${extractRgba(
        shadowColor
      )}}, ${opacity})`;
    }
  }
}

function processLn(
  stylecss: any,
  ln: any,
  maxDim: { width: number; height: number }
): any {
  if (ln) {
    const lineColor = extractSolidFillColor(ln.solidFill);

    const opacity = extractOpacity(ln.solidFill);

    const lineWidth = extractPx(ln.w, 1, maxDim);

    stylecss.border = `${lineWidth}px solid ${extractRgba(
      lineColor
    )}, ${opacity})`;
  }
}

function processNoFill(stylecss: any): any {
  stylecss;
}

function processSolidFill(stylecss: any, solidFill: any): any {
  if (solidFill) {
    const color = extractSolidFillColor(solidFill);

    if (color) {
      stylecss.color = color;
    }
  }
}

function processGradFill(stylecss: any, gradFill: any): any {
  if (gradFill) {
    const gradientStops =
      gradFill?.gsLst?.gs?.map((stop: any) => {
        const color = stop?.srgbClr?.val ? `#${stop.srgbClr.val}` : "#000000";
        const position = stop?.pos ? `${parseInt(stop.pos) / 1000}%` : "0%";
        return `${color} ${position}`;
      }) || [];

    const angle = `${parseInt(gradFill?.lin?.ang || "0") / 60000}deg`;

    stylecss.backgroundImage = `linear-gradient(${angle}, ${gradientStops.join(
      ", "
    )})`;
  }
}

const patterns = {
  none: null,
  ltUpDiag: "-45deg",
};

function processPattFill(stylecss: any, pattFill: any): any {
  if (pattFill) {
    // Extract pattern _type
    const prst = pattFill.prst || "none"; // Default to "none" if not specified
    const pattern = patterns[prst as keyof typeof patterns];

    if (pattern) {
      // Extract foreground color
      let fgColor = extractColor(pattFill.fgClr?.schemeClr);
      // Extract background color
      let bgColor = extractColor(pattFill.bgClr?.schemeClr);

      stylecss.backgroundImage = `repeating-linear-gradient(${pattern}, ${fgColor}, ${bgColor} 0.5px)`;
    }
  }
}

function processXfrm(
  stylecss: any,
  xfrm: any,
  maxDim: { width: number; height: number },
  childFrame: any
): any {
  console.log("xfrm", xfrm);
  if (xfrm) {
    console.log("xfrm 1", xfrm);

    const offset = xfrm?.off;
    if (offset) {
      console.log("xfrm offset", offset);
      stylecss.left = `${
        offset.x ? emuToPx(offset.x, maxDim.width, childFrame.off.x) : 0
      }px`;
      stylecss.top = `${
        offset.y ? emuToPx(offset.y, maxDim.width, childFrame.off.y) : 0
      }px`;
      stylecss.position = "absolute";
      console.log("xfrm top left", stylecss.left, stylecss.top);
    }
    const extent = xfrm?.ext;
    if (extent) {
      console.log("xfrm extent", extent);
      stylecss.width = `${
        extent.cx
          ? emuToPx(extent.cx, maxDim.width, childFrame.ext.x)
          : maxDim.width
      }px`;
      stylecss.height = `${
        extent.cy
          ? emuToPx(extent.cy, maxDim.width, childFrame.ext.y)
          : maxDim.height
      }px`;
      console.log("xfrm width height", stylecss.width, stylecss.height);
    }
    const invert = xfrm?.flipH ? -1 : 1;
    const rotation=
    emuRotationToDegrees(parseInt(xfrm?.rot))
    stylecss.transform= `rotate(${rotation}deg) scaleX(${invert})`,

    console.log(stylecss.transform)
  }
}

function processCropping(
  stylecss: any,
  cropping: any,
  maxDim: { width: number; height: number },
  childFrame: any
): any {
  let vals = cropping?.srcRect;
  if (vals) {
    const cropLeft = vals?.l ? (parseInt(vals.l) / 100000) * 100 : 0;
    const cropTop = vals?.t ? (parseInt(vals.t) / 100000) * 100 : 0;
    const cropRight = vals?.r ? (parseInt(vals.r) / 100000) * 100 : 0;
    const cropBottom = vals?.b ? (parseInt(vals.b) / 100000) * 100 : 0;
    if (cropLeft || cropTop || cropRight || cropBottom) {
      stylecss.clipPath = `inset(${cropTop}% ${cropRight}% ${cropBottom}% ${cropLeft}%)`;
    }
  }
}

function processProperties(
  stylecss: any,
  properties: any,
  maxDim: { width: number; height: number },
  childFrame: any
) {
  if (properties) {
    // Loop through key:val of properties
    for (const [attrib, val] of Object.entries(properties)) {
      if (attrib === "xfrm") {
        processXfrm(stylecss, val, maxDim, childFrame);
      } else if(attrib==="blipFill"){
        processCropping(stylecss,val,maxDim,childFrame)
      } else if (attrib === "pattFill") {
        processPattFill(stylecss, val);
      } else if (attrib === "noFill") {
        processNoFill(stylecss);
      } else if (attrib === "solidFill") {
        processSolidFill(stylecss, val);
      } else if (attrib === "gradFill") {
        // Handle gradient fill
        processGradFill(stylecss, val);
      } else if (attrib === "ln") {
        processLn(stylecss, val, maxDim);
      } else if (attrib === "effectLst") {
        processEffectLst(stylecss, val, maxDim);
      } else if (attrib === "wrap") {
        // Map wrap to CSS float or text-wrap
        stylecss.float = val === "square" ? "left" : "none";
      } else if (attrib === "rtlCol") {
        // Map rtlCol to CSS direction
        stylecss.direction = val === "1" ? "rtl" : "ltr";
      } else if (attrib === "anchor") {
        // Map anchor to vertical alignment
        stylecss.verticalAlign = val === "ctr" ? "middle" : val;
      } else if (attrib === "algn") {
        // Map algn to text alignment
        stylecss.textAlign =
          val === "l" ? "left" : val === "r" ? "right" : "center";
      } else if (attrib === "sz") {
        // Convert font size from EMUs to points
        stylecss.fontSize = `${emuToFontSize(val as number, maxDim.width)}px`;
      } else if (attrib === "b") {
        // Map boldness
        stylecss.fontWeight = val === "1" ? "bold" : "normal";
      } else if (attrib === "i") {
        // Map italic
        stylecss.fontStyle = val === "1" ? "italic" : "normal";
      } else if (attrib === "u") {
        // Map underline
        stylecss.textDecoration = val === "1" ? "underline" : "none";
      } else if (attrib === "strike") {
        // Map strikethrough
        if (val == "1") {
          if (!stylecss.textDecoration) stylecss.textDecoration = "";
          stylecss.textDecoration += " line-through";
        }
      } else if (attrib === "cap") {
        // Map capitalization
        if (val != "none") {
          if (!stylecss.textDecoration) stylecss.textDecoration = "";
          stylecss.textDecoration +=
            val === "allCaps"
              ? "uppercase"
              : val === "smallCaps"
              ? "capitalize"
              : "";
        }
      } else if (attrib === "latin") {
        // Map font properties
        if (val && typeof val === "object") {
          const { typeface } = val as { typeface: string };
          if (typeface) {
            stylecss.fontFamily = typeface;
          }
        }
      }
    }
  }
}

function processStyle(
  stylecss: any,
  style: any,
  maxDim: { width: number; height: number },
  childFrame: any
) {
  if (style) {
    // Loop through key:val of style
    for (const [attrib, val] of Object.entries(style)) {
      if (attrib === "fillRef") {
        processSolidFill(stylecss, val);
      } else if (attrib === "lnRef") {
        processLn(stylecss, val, maxDim);
      } else if (attrib === "effectRef") {
        processEffectLst(stylecss, val, maxDim);
      } else if (attrib === "fontRef") {
        // Handle fontRef logic

        // Apply font family and color to stylecss
        stylecss.fontFamily = extractFontFamily(val);
        stylecss.color = extractColor((val as { schemeClr?: any })?.schemeClr);
      }
    }
  }
}

function convertPowerPointStyle(
  node: any,
  zIndex: any,
  maxDim: { width: number; height: number },
  childFrame: { off: { x: number; y: number }; ext: { x: number; y: number } }
): any {
  const stylecss: any = { zIndex };

  processStyle(stylecss, node[NodeAttribs.PROPERTIES]?.style, maxDim, childFrame);
  processProperties(stylecss, node[NodeAttribs.PROPERTIES], maxDim, childFrame);

  const newChildFrame = calculateChildFrame(node, maxDim);
  console.log(stylecss.clipPath);
  return { style: stylecss, newChildFrame };
}

export default convertPowerPointStyle;
