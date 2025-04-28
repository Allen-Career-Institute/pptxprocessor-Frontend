import React, { JSX } from "react";
import Image from "./Image";

interface ContainerProps {
  node: any;
  zIndex: number;
}


const Container: React.FC<ContainerProps> = ({ node, zIndex }) => {
  console.log("Container node:", zIndex, node.asset);

  const renderComponent = (node: any, zIndex: number): JSX.Element => {
    if (node.type === "pic") {
      return <Image key={node.asset} node={node} zIndex={zIndex} />;
    } else {
      return <Container key={node.asset} node={node} zIndex={zIndex} />;
    }
  }

  return (
    <div
      key={node.asset}
      className={node.type}
      id={node.asset}
      style={{zIndex}}
    >
     {node.children &&
          Object.values(node.children)
            .filter((childData: any) => childData.asset)
            .map((childData: any, index: number) =>
              renderComponent(childData, (zIndex + index + 1))
            )}
    </div>
  );
};

export default Container;
