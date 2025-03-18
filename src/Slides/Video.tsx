import React from 'react';



const Video = ({path,style}:any) => {
  const basePath = "src/assets";

  function pathbuilder(pathvid:string) {
    if(!pathvid) return ""
    const finalpath=basePath + pathvid.slice(2)

    //console.log(basePath + pathvid.slice(2));
    console.log(finalpath)
    return finalpath
  }


  return (
    <div>
      {pathbuilder(path)?( <div>
        <video style={style} controls autoPlay>
      <source src={pathbuilder(path)} type="video/mp4"/>
      </video>
      </div>): (<div>No Video</div>)}
      
    </div>
  );
}

export default Video;