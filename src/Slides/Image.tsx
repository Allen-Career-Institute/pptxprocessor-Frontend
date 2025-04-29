import React, { useRef, useState, useEffect, use } from "react";
import pxl from "../utils/emutopxl";
import degree from "../utils/Todegree";
import PowerPointStyle from "../utils/css_convertor";

interface ImageProps {
  node: any;
  zIndex: number;
  mediaPath: string;
}

const Image: React.FC<ImageProps> = ({ node, zIndex, mediaPath }: any) => {
  const style = PowerPointStyle(node, zIndex);

  const [isPlaying, setIsPlaying] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement | null>(null);

  console.log(node)
  useEffect(() => {
    if (!("children" in node)) return;
    if (!("blipFill" in node.children)) return;
    if (!("properties" in node.children.blipFill)) return;
    if (!("image" in node.children.blipFill.properties)) return;
    if (!("link" in node.children.blipFill.properties.image)) return;
    setImageUrl(mediaPath + node.children.blipFill.properties.image.link.slice(3));
  }, []);

  useEffect(() => {
    if (!("properties" in node)) return;
    if (!("videoFile" in node["properties"])) return;
    if (!("link" in node["properties"]["videoFile"])) return;
    setVideoUrl(mediaPath + node.properties.videoFile.link.slice(3));
    console.log("videoUrl", mediaPath + node.properties.videoFile.link.slice(3));
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

  const handleVideoClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <div>
      {imageUrl !== "" && (
        <>
          {videoUrl !== "" ? (
            <video
              src={videoUrl}
              poster={imageUrl}
              style={style}
              controls
              autoPlay
            />
          ) : (
            <img src={imageUrl} style={style} />
          )}
        </>
      )}
    </div>
  );
};

export default Image;
