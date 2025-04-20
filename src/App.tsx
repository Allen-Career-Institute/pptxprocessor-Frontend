import React, { useCallback, useEffect, useState } from 'react';
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import obj from './assets/asset.modified.json';
//import obj from './assets1/asset.json'
import Page from './Slides/Page';
import './App.css'; // Import the CSS file
import { Stage,Layer,Rect,Ellipse } from 'react-konva';
const App = () => {
  const [currSlide, setCurrSlide] = useState(15);
  const [loading, setLoading] = useState(false);
  const num_slides = Object.keys(obj).length;

  const getSlideData = useCallback(() => {
    const slideKey = `slide${currSlide}.xml` as keyof typeof obj;
    //console.log(obj[slideKey]);
    return obj[slideKey];
  }, [currSlide])

 // const [currSlideData, setCurrSlideData] = useState<ReturnType<typeof getSlideData>>(getSlideData(1));

  // useEffect(() => {
  //   setCurrSlideData(getSlideData());
  // }, [currSlide]);

  const arr = Array.from({ length: num_slides }, (_, i) => i + 1);

  function handlenext() {
    if (currSlide < num_slides) {
      console.clear() 
      setCurrSlide(prev => prev + 1);
    }
  }

  function handleprev() {
    if (currSlide > 1) {
      console.clear() 

      setCurrSlide(prev => prev - 1);
    }
  }
//   //console.log(currSlideData)
//  const abc= Object.keys(currSlideData)
//  //console.log(currSlideData[abc[0]])
  return (
    <div className="app-container">

      <div className="content">
      <button>Event</button>

       {!loading && <Page currSlide={currSlide} currSlideData={getSlideData()}/> }
       {/* {obj[JSON.stringify(Object.keys(obj)[currSlide-1])]} */
       // obj[JSON.stringify(currSlideData)][Object.keys(obj[currSlideData])[0]]
       //JSON.stringify(currSlideData[Object.keys(currSlideData)[0]])
       }
      </div>
      <div className="pagination">
        <h1>{currSlide}</h1>
        <button onClick={handleprev}>Prev</button>
        {arr.map((element) => (
          <button
            key={element}
            onClick={() => {
              setLoading(true)
              setCurrSlide(() => {
                setLoading(false)
                return element
              })
            }}
          >
            {element}
          </button>
        ))}
        <button onClick={handlenext}>Next</button>
      </div>
    </div>
  );
};

export default App;