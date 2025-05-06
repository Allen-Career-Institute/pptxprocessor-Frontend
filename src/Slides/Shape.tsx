import React, { JSX, useState, useEffect } from "react";
import CustGeom from "./CustGeom";
import convertPowerPointStyle from "../utils/css_convertor";

interface ShapeProps {
  node: any;
  zIndex: number;
  mediaPath: string;
  maxDim: { width: number; height: number };
  childFrame: { off: { x: number; y: number }; ext: { x: number; y: number } };
  renderChildren: (node: any, zIndex: number, childFrame: any) => JSX.Element;
}

const Shape: React.FC<ShapeProps> = ({
  node,
  zIndex,
  mediaPath,
  maxDim,
  childFrame,
  renderChildren,
}: any) => {
  const [imageUrl, setImageUrl] = useState<string>();
  const [custGeom, setCustGeom] = useState<any>();
  const [ln, setLn] = useState<any>();

  const { style, newChildFrame } = convertPowerPointStyle(
    node,
    zIndex,
    maxDim,
    childFrame
  );

  useEffect(() => {
    if (!("properties" in node)) return;
    if (!("blipFill" in node.properties)) return;
    if (!("link" in node.properties.blipFill)) return;
    setImageUrl(mediaPath + node.properties.blipFill.link.slice(3));
  }, []);

  useEffect(() => {
    if (!("properties" in node)) return;
    if (!("custGeom" in node.properties)) return;
    setCustGeom(node.properties.custGeom);
  }, []);

  useEffect(() => {
    if (!("properties" in node)) return;
    if (!("ln" in node.properties)) return;
    setLn(node.properties.ln);
  }, []);


  return (
    <div
      key={node.asset}
      className={`${node.type} ${node.name ? node.name : ""}`}
      id={node.asset}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {imageUrl && (
        <img src={imageUrl} style={{ ...style, left: "0px", top: "0px" }} />
      )} 
      {custGeom && (
        <CustGeom
          key={node.asset}
          custGeom={custGeom}
          ln={ln}
          maxDim={maxDim}/>)}
      
      {renderChildren(node, zIndex, newChildFrame)}
    </div>
  );
};

export default Shape;
