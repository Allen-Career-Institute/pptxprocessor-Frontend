import React, { useRef, useState, useEffect } from "react";
import PowerPointStyle from "../utils/css_convertor";
import { NodeAttribs, StyleConstants } from "../utils/constants";

interface ImageProps {
  node: any;
  zIndex: number;
  mediaPath: string;
  maxDim: { width: number; height: number };
  childFrame: {
    off: { x: number; y: number };
    ext: { x: number; y: number };
  };
}

const Image: React.FC<ImageProps> = ({
  node,
  zIndex,
  mediaPath,
  maxDim,
  childFrame,
}: any) => {
  console.log(node);
  const { style } = PowerPointStyle(node, zIndex, maxDim, childFrame);
  !style.width && (style.width = StyleConstants.INHERIT);
  !style.height && (style.height = StyleConstants.INHERIT);

  const [isPlaying, setIsPlaying] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!(NodeAttribs.PROPERTIES in node)) return;
    if (!("blipFill" in node[NodeAttribs.PROPERTIES])) return;
    if (!("link" in node[NodeAttribs.PROPERTIES].blipFill)) return;
    setImageUrl(
      mediaPath + node[NodeAttribs.PROPERTIES].blipFill.link.slice(3),
    );
  }, []);

  useEffect(() => {
    if (!(NodeAttribs.PROPERTIES in node)) return;
    if (
      "videoFile" in node[NodeAttribs.PROPERTIES] &&
      "link" in node[NodeAttribs.PROPERTIES].videoFile &&
      node[NodeAttribs.PROPERTIES].videoFile.link !== "NULL"
    ) {
      setVideoUrl(
        mediaPath + node[NodeAttribs.PROPERTIES].videoFile.link.slice(3),
      );
    } else if (
      "media" in node[NodeAttribs.PROPERTIES] &&
      "link" in node[NodeAttribs.PROPERTIES].media
    ) {
      setVideoUrl(mediaPath + node[NodeAttribs.PROPERTIES].media.link.slice(3));
    }
  }, []);
  console.log(imageUrl, style.zIndex, style.transform);
  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    // Parse start and end times as numbers (in seconds)
    const startTime = node[NodeAttribs.PROPERTIES].media?.trim?.st
      ? parseFloat(node[NodeAttribs.PROPERTIES].media.trim.st) / 1000
      : null;
    const endTime = node[NodeAttribs.PROPERTIES].media?.trim?.end
      ? parseFloat(node[NodeAttribs.PROPERTIES].media.trim.end) / 1000
      : null;

    const handlePlay = () => {
      setIsPlaying(true);
      if (startTime !== null) {
        video.currentTime = startTime; // Set the video to start at the specified time
      }
    };

    const handleTimeUpdate = () => {
      if (endTime !== null && video.currentTime >= endTime) {
        video.pause(); // Pause the video when it reaches the end time
      }
    };

    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    // Add event listeners
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("timeupdate", handleTimeUpdate);

    // Cleanup event listeners on unmount
    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [node, videoRef]);

  const divStyle = { ...style };
  delete divStyle["transform"];

  return (
    <div
      key={node[NodeAttribs.ASSET]}
      className={`${node[NodeAttribs.TYPE]} ${node.name ? node.name : ""}`}
      id={node.id ? node.id : node[NodeAttribs.ASSET]}
      style={divStyle}
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
