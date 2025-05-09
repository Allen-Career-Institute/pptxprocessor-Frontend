import React, { useRef, useState, useEffect } from "react";
import PowerPointStyle from "../utils/css_convertor";

interface ImageProps {
  node: any;
  zIndex: number;
  mediaPath: string;
  maxDim: { width: number; height: number };
  childFrame: { off: { x: number; y: number }; ext: { x: number; y: number } };
}

const Image: React.FC<ImageProps> = ({
  node,
  zIndex,
  mediaPath,
  maxDim,
  childFrame,
}: any) => {
  const { style } = PowerPointStyle(node, zIndex, maxDim, childFrame);
  !style.width && (style.width = "inherit");
  !style.height && (style.height = "inherit");

  const [isPlaying, setIsPlaying] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!("_properties" in node)) return;
    if (!("blipFill" in node._properties)) return;
    if (!("link" in node._properties.blipFill)) return;
    setImageUrl(mediaPath + node._properties.blipFill.link.slice(3));
  }, []);

  useEffect(() => {
    if (!("_properties" in node)) return;
    if (
      "videoFile" in node._properties &&
      "link" in node._properties.videoFile &&
      node._properties.videoFile.link !== "NULL"
    ) {
      setVideoUrl(mediaPath + node._properties.videoFile.link.slice(3));
    } else if (
      "media" in node._properties &&
      "link" in node._properties.media
    ) {
      setVideoUrl(mediaPath + node._properties.media.link.slice(3));
    }
  }, []);
  console.log(imageUrl, style.zIndex, style.transform);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <div
      key={node._asset}
      className={`${node._type} ${node.name ? node.name : ""}`}
      id={node._asset}
      style={style}
    >
      {imageUrl !== "" && (
        <>
          {videoUrl !== "" ? (
            <video
              src={videoUrl}
              poster={imageUrl}
              style={{ ...style, left: "0px", top: "0px" }}
              controls
              autoPlay
            />
          ) : (
            <img src={imageUrl} style={{ ...style, left: "0px", top: "0px" }} />
          )}
        </>
      )}
    </div>
  );
};

export default Image;
