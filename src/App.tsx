import { useCallback, useEffect, useState } from "react";

import Page from "./Slides/Page";
import "./App.css"; // Import the CSS file

const App = ({ slidePath, mediaPath }: { slidePath: string, mediaPath: string }) => {
  const [numSlides, setNumSlides] = useState<any>(1);
  const [currSlide, setCurrSlide] = useState(1);
  const [currSlideData, setCurrSlideData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [maxDim, setMaxDim] = useState<{ width: number; height: number }>({ width: 1280, height: 720 });

  useEffect(() => {
    const updateMaxDim = () => {
      const appElement = document.querySelector(".app-container");
      if (appElement) {
        const { clientHeight, clientWidth } = appElement;
        const aspectRatio = 16 / 9; // Assuming a 16:9 aspect ratio for slides
        const calculatedWidth = Math.min(clientWidth, clientHeight * aspectRatio);
        const calculatedHeight = calculatedWidth / aspectRatio;
        setMaxDim({ width: calculatedWidth, height: calculatedHeight });
      }
    };

    updateMaxDim();
    window.addEventListener("resize", updateMaxDim);

    return () => {
      window.removeEventListener("resize", updateMaxDim);
    };
  }, []);

  const fetchSlideJSON = useCallback(
    async (slideFile: string) => {
      try {
        const response = await fetch(`${slidePath}/${slideFile}.json`);
        if (!response.ok) {
          throw new Error(`Failed to fetch slide data: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Fetched slide data:", slideFile, data);
        return data;
      } catch (error) {
        console.error("Error fetching slide data:", slideFile, error);
        return null;
      }
    },
    [slidePath]
  );

  useEffect(() => {
    fetchSlideJSON("slide_meta").then((data) => {
      setNumSlides(data.numSlides)
      console.log("numSlides", numSlides);
    });
  }, []);

  useEffect(() => {
    fetchSlideJSON(`slide${currSlide}`).then((data) => {
      setCurrSlideData(data)
    });
  }, [currSlide]);

  useEffect(() => {
    if (currSlide && currSlideData) {
      console.log("currSlideData", currSlideData);
      setLoading(false);
    }
  }, [currSlideData]);

  const handlenext = () => {
    if (currSlide < numSlides) {
      console.clear();
      setCurrSlide((prev) => prev + 1);
    }
  };

  const handleprev = () => {
    if (currSlide > 1) {
      console.clear();

      setCurrSlide((prev) => prev - 1);
    }
  };

  return (
    <div className="app-container">
      <div className="content">
        <button>Event</button>

        {!loading && (
          <Page currSlide={currSlide} currSlideData={currSlideData} mediaPath={mediaPath} maxDim={maxDim} />
        )}
      </div>
      <div className="pagination">
        <h1>{currSlide}</h1>
        <button onClick={handleprev}>Prev</button>
        {Array.from({ length: numSlides }, (_, i) => i + 1).map((element) => (
          <button
            key={element}
            onClick={() => {
              setLoading(true);
              setCurrSlide(() => {
                setLoading(false);
                return element;
              });
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
