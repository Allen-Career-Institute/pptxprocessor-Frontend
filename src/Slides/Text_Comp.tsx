
import convertText from "../utils/text_processor";

const Text_Comp = ({ style }: any) => {
    const { styletxt, text } = convertText(style);
  
    const divStyle: React.CSSProperties = {
      position: "absolute",
      left: `${styletxt.left}px`,
      top: `${styletxt.top}px`,
      width: `${styletxt.width}px`,
      height: `${styletxt.height}px`,
      color: "red",
      fontSize: 16,
      overflow: "hidden",
      whiteSpace: "pre-wrap", // respects line breaks
    };
  console.log("18",text,typeof(text))
    return <div style={divStyle}>{text}</div>;
  };
  
  export default Text_Comp;