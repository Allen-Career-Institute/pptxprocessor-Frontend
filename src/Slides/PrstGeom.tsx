import React, { useEffect, useState, JSX } from "react";

interface PresetGeometryProps {
  node: any;
  zIndex: number;
  mediaPath: string;
  prstGeom: any;
  style: any;
  maxDim: { width: number; height: number };
  childFrame: { off: { x: number; y: number }; ext: { x: number; y: number } };
  renderChildren: (node: any, zIndex: number, childFrame: any) => JSX.Element;
}

const PresetGeometry: React.FC<PresetGeometryProps> = ({
  node,
  zIndex,
  mediaPath,
  prstGeom,
  style,
  maxDim,
  childFrame,
  renderChildren,
}) => {
  const [imageUrl, setImageUrl] = useState<string>();
  const [styleCss, setStyleCss] = useState<any>({});

  console.log("PresetGeometry node:", node.name, node.asset, node.type);

  useEffect(() => {
    if (!("properties" in node)) return;
    if (!("blipFill" in node.properties)) return;
    if (!("link" in node.properties.blipFill)) return;
    setImageUrl(mediaPath + node.properties.blipFill.link.slice(3));
  }, []);

  useEffect(() => {
    let borderRadius;
    if (prstGeom && style) {
      const scalingFactor = maxDim.width / 1280;
      const prst = prstGeom.prst;

      if (prst) {
        if (prst === "roundRect") {
          const cornerAdj = prstGeom.avLst?.gd?.fmla.split(" ")[1];
          if (cornerAdj) {
            borderRadius = `${(parseInt(cornerAdj) / 1000) * scalingFactor}px`;
          }
        } else if (prst === "ellipse") {
          console.log("Got ellipse", node.asset);
          borderRadius = "50%";
        }
      }
    }
    if (borderRadius) {
      setStyleCss({
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        borderRadius,
      });
    } else {
      setStyleCss({
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      });
    }
  }, [prstGeom, style]);

  return (
    <div
      key={node.asset}
      className={`${node.type} prstGeom ${node.name ? node.name : ""}`}
      id={node.asset}
      style={styleCss}
    >
      {imageUrl && (
        <img src={imageUrl} style={{ ...style, left: "0px", top: "0px" }} />
      )}
      {renderChildren(node, zIndex, childFrame)}
    </div>
  );
};

export default PresetGeometry;
