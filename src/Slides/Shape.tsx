import { Arc, Rect } from 'react-konva';
import PowerPointStyle from '../utils/css_convertor';

interface ShapeProps {
  node: any;
  zIndex: number;
  mediaPath: string;
  maxDim: { width: number; height: number };
}


const Shape: React.FC<ShapeProps> = ({ node, zIndex, mediaPath, maxDim }: any) => {
  let style = PowerPointStyle(node, zIndex, maxDim);
  const shape = s?.stylecss?.geom || "rect";
  //console.log("7",s.stylecss)
  function border() {
    const asset = s?.stylecss.geom;
    if (!asset) return 0;
    if (asset === "roundRect") return 15;
    if (asset === "ellipse") return parseInt(s.stylecss.height);
    return 0;
  }
  function stroke(){
      if(parent==="Grp_element")return "green"
      return "yellow"
  }

  return shape === "arc" ? (
    <Arc
      x={parseInt(s.stylecss.left)+parseInt(s.stylecss.width)/2}
      y={parseInt(s.stylecss.top)+parseInt(s.stylecss.height)/2}
      innerRadius={10}
      outerRadius={10}
      angle={s.stylecss.rotation}
      fill="yellow"
      stroke="black"
      strokeWidth={4}
    />
  ) : (
    <Rect
      x={parseInt(s.stylecss.left)}
      y={parseInt(s.stylecss.top)}
      width={parseInt(s.stylecss.width)}
      height={parseInt(s.stylecss.height)}
      stroke={stroke()}
      strokeWidth={2}
      cornerRadius={border()}
    />
  );
};

export default Shape;