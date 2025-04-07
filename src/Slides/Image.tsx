import React, { useRef, useState, useEffect } from 'react';
import pxl from '../utils/emutopxl';
import degree from '../utils/Todegree';
import PowerPointStyle from '../utils/css_convertor';

const Image = ({ style }: any) => {
  const s = PowerPointStyle(style);
  const basePath = "src/assets";

  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const pathbuilderImg = () => {
    if (s.Image === "No") return "";
    return basePath + style.Image.slice(2);
  };

  const pathbuilderVid = () => {
    if (s.Video === "No") return "";
    return basePath + style.Media.slice(2);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  const handleVideoClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <div>
      
      {s.Image === "Yes" && (
        <>
          {s.Video === "Yes" ? (
           
              <video
              style={s.stylecss}
                src={pathbuilderVid()}
                poster={pathbuilderImg()}
               controls autoPlay
              />
            
         
          ) : (
            <img src={pathbuilderImg()} style={s.stylecss} />
          )}
        </>
      )}
    </div>
  );
};

export default Image;