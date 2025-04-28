import { useCallback, useState } from "react";

// import obj from "./assets/media/asset.modified.json"
import obj from "./assets/media/asset_output.json";
import Page from "./Slides/Page";
import "./App.css"; // Import the CSS file

const App = () => {
  const [currSlide, setCurrSlide] = useState(15);
  const [loading, setLoading] = useState(false);
  const num_slides = Object.keys(obj).length;

  const getSlideData = useCallback(() => {
    const slideKey = `slide${currSlide}.xml` as keyof typeof obj;
    return obj[slideKey];
  }, [currSlide]);

  const arr = Array.from({ length: num_slides }, (_, i) => i + 1);

  const handlenext = () => {
    if (currSlide < num_slides) {
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
          <Page
            currSlide={currSlide}
            currSlideData={getSlideData()[Object.keys(getSlideData())[0]]}
          />
        )}
      </div>
      <div className="pagination">
        <h1>{currSlide}</h1>
        <button onClick={handleprev}>Prev</button>
        {arr.map((element) => (
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
