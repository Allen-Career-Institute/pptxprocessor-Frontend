import React from "react";
import pxl from "../utils/emutopxl";

const Video = ({ path, coordinates }: any) => {
  const basePath = "src/assets";

  function pathbuilder(pathvid: string) {
    //if (!pathvid) return "";
    return basePath + pathvid.slice(2);
  }

  function getVideoType(pathvid: string) {
    const ext = pathvid.split(".").pop()?.toLowerCase();
    console.log(ext);
    const mimeTypes: { [key: string]: string } = {
      mp4: "video/mp4",
      webm: "video/webm",
      mov: "video/mov",
      ogg: "video/ogg",
      avi: "video/x-msvideo",
    };

    return mimeTypes[ext || ""] || "video/mp4"; // Default to mp4
  }

  const videoPath = pathbuilder(path);
  //const videoType = getVideoType(path);

  const style: React.CSSProperties = {
    position: "absolute",
    left: pxl(coordinates?.x || 0),
    top: pxl(coordinates?.y || 0),
    width: pxl(coordinates?.width || 0),
    height: pxl(coordinates?.height || 0),
    transform: ` scaleX(${(coordinates.flipH==="1")?(-1):(1)})`,

  };

  return (
    <div>
      {videoPath ? (
        <div>
          <video style={style}src={videoPath} controls autoPlay>
            {/* <source  type={videoType} /> */}
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        <div>No Video</div>
      )}
    </div>
  );
};

export default Video;