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
  console.log(`Style width ${node.asset} Before:`, style.width);
  !style.width && (style.width = "inherit");
  !style.height && (style.height = "inherit");
  console.log(`Style width ${node.asset} After:`, style.width);

  const [isPlaying, setIsPlaying] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement | null>(null);

  console.log(node);
  useEffect(() => {
    if (!("properties" in node)) return;
    if (!("blipFill" in node.properties)) return;
    if (!("link" in node.properties.blipFill)) return;
    setImageUrl(mediaPath + node.properties.blipFill.link.slice(3));
  }, []);

  useEffect(() => {
    if (!("properties" in node)) return;
    if (
      "videoFile" in node.properties &&
      "link" in node.properties.videoFile &&
      node.properties.videoFile.link !== "NULL"
    ) {
      setVideoUrl(mediaPath + node.properties.videoFile.link.slice(3));

      console.log(
        "videoUrl",
        mediaPath + node.properties.videoFile.link.slice(3)
      );
    } else if ("media" in node.properties && "link" in node.properties.media) {
      setVideoUrl(mediaPath + node.properties.media.link.slice(3));
      console.log("mediaUrl", mediaPath + node.properties.media.link.slice(3));
    }
  }, []);

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
      key={node.asset}
      className={`${node.type} ${node.name ? node.name : ""}`}
      id={node.asset}
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
