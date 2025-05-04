
import { extractPx, extractColor, extractOpacity, extractRgba, extractSolidFillColor, calculateChildFrame, extractFontFamily } from './extract_utils';
import { emuToPx, emuToFontSize } from './helper_utils';

function processEffectLst(stylecss: any, effectLst: any, maxDim: { width: number; height: number }): any {
  if (effectLst) {
    console.log("Processing effectLst:", effectLst);

    // Handle outer shadow (outerShdw)
    const outerShdw = effectLst.outerShdw;
    if (outerShdw) {
      console.log("Processing outerShdw:", outerShdw);

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
      stylecss.boxShadow = `${offsetX}px ${offsetY}px ${blurPx}px ${extractRgba(shadowColor)}}, ${opacity})`;
      console.log("Computed boxShadow:", stylecss.boxShadow);
    }
  }
}


function processLn(stylecss: any, ln: any, maxDim: {width: number, height: number}): any {
  if (ln) {
    console.log("Processing ln:", ln);

    const lineColor = extractSolidFillColor(ln.solidFill);
    console.log("Extracted lineColor:", lineColor);

    const opacity = extractOpacity(ln.solidFill);
    console.log("Computed opacity:", opacity);

    const lineWidth = extractPx(ln.w, 1, maxDim);
    console.log("Computed lineWidth:", lineWidth);

    stylecss.border = `${lineWidth}px solid ${extractRgba(lineColor)}, ${opacity})`;
    console.log("Computed border style:", stylecss.border);
  }
}

function processNoFill(stylecss: any): any {
  stylecss
}

function processSolidFill(stylecss: any, solidFill: any): any {
  if (solidFill) {
    console
    const color = extractSolidFillColor(solidFill);

    if (color) {
      stylecss.color = color;
    }
  }
}

function processGradFill(stylecss: any, gradFill: any): any {
  if (gradFill) {
    // Handle gradient fill
    const gradientStops = (gradFill as { gsLst: { gs: any[] } }).gsLst.gs.map((stop: any) => {
      const color = `#${stop.srgbClr.val}`;
      const position = `${parseInt(stop.pos) / 1000}%`;
      return `${color} ${position}`;
    });
    const angle = `${parseInt((gradFill as { lin: { ang: string } }).lin?.ang || "0") / 60000}deg`;
    stylecss.color = `linear-gradient(${angle}, ${gradientStops.join(", ")})`;
    console.log("Computed gradient fill:", stylecss.backgroundImage);
  }
}

const patterns = {
  "none": null,
  "ltUpDiag": "-45deg"
}

function processPattFill(stylecss: any, pattFill: any): any {
  if (pattFill) {
    console.log("Processing pattFill:", pattFill);
    // Extract pattern type
    const prst = pattFill.prst || "none"; // Default to "none" if not specified
    const pattern = patterns[prst as keyof typeof patterns];

    if (pattern) {
      // Extract foreground color
      let fgColor = extractColor(pattFill.fgClr?.schemeClr);
      // Extract background color
      let bgColor = extractColor(pattFill.bgClr?.schemeClr);

      console.log("pattern:", pattern, fgColor, bgColor);
      // Return CSS styles for pattern fill
      // if (stylecss.backgroundImage) {
      //   console.error("stylecss.backgroundImage already exists:", stylecss.backgroundImage);
      // }
      stylecss.backgroundImage = `repeating-linear-gradient(${pattern}, ${fgColor}, ${bgColor} 0.5px)`;
      console.log("Computed backgroundImage:", stylecss.backgroundImage);
    }
  }
}

function processPrstGeom(stylecss: any, prstGeom: any, maxDim: { width: number; height: number }): any {
  if (prstGeom) {
    console.log("Processing prstGeom:", prstGeom);
    const scalingFactor = maxDim.width / 1280;
    const prst = prstGeom.prst;
    if (prst) {
      console.log("prst value:", prst);
      if (prst === "roundRect") {
        const cornerAdj = prstGeom.avLst?.gd?.fmla.split(" ")[1];
        if (cornerAdj) {
          console.log("cornerAdj:", cornerAdj, "scalingFactor:", scalingFactor);
          stylecss.borderRadius = `${(parseInt(cornerAdj) / 1000) * scalingFactor}px`;
          console.log("Computed borderRadius:", stylecss.borderRadius);
        }
      } else if (prst === "ellipse") {
        stylecss.borderRadius = "50%";
        console.log("Set borderRadius for ellipse:", stylecss.borderRadius);
      }
    }
  }
}

function processXfrm(stylecss: any, xfrm: any, maxDim: { width: number; height: number }, childFrame: any): any {
  if (xfrm) {
    console.log("Processing xfrm:", xfrm);
    const offset = xfrm?.off;
    if (offset) {
      stylecss.left = `${offset.x ? emuToPx(offset.x, maxDim.width, childFrame.off.x) : 0}px`;
      stylecss.top = `${offset.y ? emuToPx(offset.y, maxDim.width, childFrame.off.y) : 0}px`;
      console.log("Computed xfrm offset:", { left: stylecss.left, top: stylecss.top });
      stylecss.position = "absolute";
    }
    const extent = xfrm?.ext;
    if (extent) {
      stylecss.width = `${extent.cx ? emuToPx(extent.cx, maxDim.width, childFrame.ext.x) : maxDim.width}px`;
      stylecss.height = `${extent.cy ? emuToPx(extent.cy, maxDim.width, childFrame.ext.y) : maxDim.height}px`;
      console.log("Computed xfrm extent:", { width: stylecss.width, height: stylecss.height });
    }
  }
}

function processProperties(stylecss: any, properties: any, maxDim: { width: number; height: number }, childFrame: any) {
  if (properties) {
    // Loop through key:val of properties
    for (const [attrib, val] of Object.entries(properties)) {
      if (attrib === "xfrm") {
        processXfrm(stylecss, val, maxDim, childFrame);
      } else if (attrib === "prstGeom") {
        processPrstGeom(stylecss, val, maxDim);
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
        console.log("Computed wrap style:", stylecss.float);
      } else if (attrib === "rtlCol") {
        // Map rtlCol to CSS direction
        stylecss.direction = val === "1" ? "rtl" : "ltr";
        console.log("Computed rtlCol style:", stylecss.direction);
      } else if (attrib === "anchor") {
        // Map anchor to vertical alignment
        stylecss.verticalAlign = val === "ctr" ? "middle" : val;
        console.log("Computed anchor style:", stylecss.verticalAlign);
      } else if (attrib === "algn") {
        // Map algn to text alignment
        stylecss.textAlign = val === "l" ? "left" : val === "r" ? "right" : "center";
        console.log("Computed algn style:", stylecss.textAlign);
      } else if (attrib === "sz") {
        // Convert font size from EMUs to points
        stylecss.fontSize = `${emuToFontSize(val as number, maxDim.width)}px`;
        console.log("Computed font size:", stylecss.fontSize);
      } else if (attrib === "b") {
        // Map boldness
        stylecss.fontWeight = val === "1" ? "bold" : "normal";
        console.log("Computed bold style:", stylecss.fontWeight);
      } else if (attrib === "i") {
        // Map italic
        stylecss.fontStyle = val === "1" ? "italic" : "normal";
        console.log("Computed italic style:", stylecss.fontStyle);
      } else if (attrib === "u") {
        // Map underline
        stylecss.textDecoration = val === "1" ? "underline" : "none";
        console.log("Computed underline style:", stylecss.textDecoration);
      } else if (attrib === "strike") {
        // Map strikethrough
        if (val == "1") {
          if (!stylecss.textDecoration) stylecss.textDecoration = "";
          stylecss.textDecoration += " line-through";
        }
        console.log("Computed strikethrough style:", stylecss.textDecoration);
      } else if (attrib === "cap") {
        // Map capitalization
        if (val != "none") {
          if (!stylecss.textDecoration) stylecss.textDecoration = "";
          stylecss.textDecoration += val === "allCaps" ? "uppercase" : val === "smallCaps" ? "capitalize" : "";
          console.log("Computed capitalization style:", stylecss.textTransform);
        }
      } else if (attrib === "latin") {
        // Map font properties
        if (val && typeof val === "object") {
          const { typeface } = val as { typeface: string };
          if (typeface) {
            stylecss.fontFamily = typeface;
            console.log("Computed fontFamily style:", stylecss.fontFamily);
          }
        }
      } 
    }
    console.log("Final stylecss:", stylecss);
  }
}

function processStyle(stylecss: any, style: any, maxDim: { width: number; height: number }, childFrame: any) {
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
        console.log("Processing fontRef:", val);

        // Apply font family and color to stylecss
        stylecss.fontFamily = extractFontFamily(val);
        stylecss.color = extractColor((val as { schemeClr?: any })?.schemeClr);
        console.log("Computed font styles:", stylecss.fontFamily, stylecss.color);
      
      }
    }
    console.log("Final stylecss:", stylecss);
  }
}

function convertPowerPointStyle(
  node: any,
  zIndex: any,
  maxDim: { width: number; height: number },
  childFrame: { off: { x: number; y: number }; ext: { x: number; y: number } }
): any {
  const stylecss: any = { zIndex };

  console.log("Setting style from Style")
  processStyle(stylecss, node.properties?.style, maxDim, childFrame);
  console.log("Setting style from rest of the properties")
  processProperties(stylecss, node.properties, maxDim, childFrame);

  const newChildFrame = calculateChildFrame(node, maxDim);

  return { style: stylecss, newChildFrame };
}

export default convertPowerPointStyle;