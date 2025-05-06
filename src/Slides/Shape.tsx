import React, { JSX, useState, useEffect } from "react";
import Image from "./Image";
import Text from "./Text";
import CustGeom from "./CustGeom";
import convertPowerPointStyle from "../utils/css_convertor";

interface ShapeProps {
  node: any;
  zIndex: number;
  mediaPath: string;
  maxDim: { width: number; height: number };
  childFrame: { off: { x: number; y: number }; ext: { x: number; y: number } };
}

const Shape: React.FC<ShapeProps> = ({
  node,
  zIndex,
  mediaPath,
  maxDim,
  childFrame,
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

  const renderComponent = (node: any, zIndex: number): JSX.Element => {
    if (node.type === "pic") {
      return (
        <Image
          key={node.asset}
          node={node}
          zIndex={zIndex}
          mediaPath={mediaPath}
          maxDim={maxDim}
          childFrame={newChildFrame}
        />
      );
    } else if (node.type === "txBody") {
      return (
        <Text
          key={node.asset}
          node={node}
          zIndex={zIndex}
          maxDim={maxDim}
          childFrame={newChildFrame}
        />
      );
    } else {
      return <></>;
    }
  };

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
      {node.children &&
        Object.values(node.children)
          .flatMap((childData: any) =>
            Array.isArray(childData) ? childData : [childData]
          )
          .filter((childData: any) => childData.asset)
          .map((childData: any, index: number) =>
            renderComponent(childData, zIndex + index + 1)
          )}
      {/* {custGeom && (
        <CustGeom
          key={node.asset}
          custGeom={custGeom}
          ln={ln}
          maxDim={maxDim}/>)} */}
    </div>
  );
};

export default Shape;
