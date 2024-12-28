import { useEffect, useRef, useState } from 'react'
import './App.css'
import clearImg from "./assets/defaultimg.jpg";
import rainImg from "./assets/rainyimg3.jpg";
import snowImg from "./assets/snowimage.webp";
import cloudsImg from "./assets/cloudyimg2.jpg";
import thunderstormImg from "./assets/thunderstorm.jpg";
import defaultImg from "./assets/default2.jpg";

function App() {
  const [location, setLocation] = useState(null)
  const [data, setData] = useState(null)
  const [backgroundImage, setBackgroundImage] = useState(defaultImg);
  const [error, setError] = useState(null)
  const inputRef = useRef("")

  useEffect(() => {
    inputRef.current.focus()
  })

  const weatherForecast = (loc) => {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${loc}&appid=8ac5c4d57ba6a4b3dfcf622700447b1e&units=metric`;
    fetch(url).then(res => {
      res.json().then(result => {
        if (result.cod !== 200) {
          setError(result.message || "An error occurred");
          setData(null);
        } else {
          setData(result)
          updateBackground(result.weather?.[0]?.main);
          setError(null);
        }

      })
    }).catch(rej => {
      setError("Failed to connect to the weather service.");
    })
  }

  const updateBackground = (weather) => {
    const weatherBackgrounds = {
      Clear: clearImg,
      Rain: rainImg,
      Snow: snowImg,
      Clouds: cloudsImg,
      Thunderstorm: thunderstormImg,
      Default: defaultImg
    };

    setBackgroundImage(weatherBackgrounds[weather] || weatherBackgrounds.Default);
  };

  return (
    <>
      <div style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" ,transition: 'background-image 0.5s ease-in-out' }} className='row'>
        <div className='col-lg-2'></div>
        <div style={{ height: '100vh' }} className='col-lg-8 text-center '>
          <div className='rounded my-5 ' >
            <h1 className=' p-2 p-2 mb-4 fw-bolder main-heading'><i class="fa-solid fa-cloud-sun-rain"></i> Weather Forecast</h1>
            {/* input section */}
            <div className='d-flex justify-content-center'>
              <input ref={inputRef} onChange={e => setLocation(e.target.value)} type="text" placeholder='Enter the location name' className='form-control w-50  me-2' />
              <button onClick={() => weatherForecast(location)} className='btn btn-primary fw-bold border-light'>Search</button>
            </div>
            {error && (
              <div className="text-danger fw-bold mt-3 danger-style">
                <p><i class="fa-solid fa-triangle-exclamation"></i> Error: {error}</p>
              </div>
            )}
            {/* output section */}
            <div style={{ height: '400px' }} className='text-dark fw-bold  mt-5 d-flex align-items-center justify-content-center output-sect '>
              {data ? (
                <div>
                  <p><i class="fa-solid fa-location-dot fs-3 content-style"></i> <span className='fs-2 fw-bold content-style'>{data?.name || "Unknown"}</span></p>
                  <p><span className='fs-1 content-style'>{data?.main?.temp}°C</span></p>
                  <p><span className='fs-4 content-style'> {data?.weather?.[0]?.description}</span></p> 
                  <div className='d-flex justify-content-between border p-3 fs-6 extra ' >
                    <div className='fw-bolder mx-3 p-2'>
                      <p> Wind </p>
                      <p><span >{data?.wind?.speed}mph </span></p>
                    </div>

                    <div className='fw-bolder mx-3 p-2'>
                      <p> Humidity </p>
                      <p><span >{data?.main?.humidity}% </span></p>
                    </div>

                    <div className='fw-bolder mx-3 p-2'>
                      <p> Feels like </p>
                      <p><span >{data?.main?.feels_like}°F </span></p>
                    </div>
                  </div>
                </div>
              ) : (
                <h4 className='fw-bold text-primary'>Enter a location and click Search to see the forecast.</h4>
              )}
            </div>
          </div>
        </div>
        <div className='col-lg-2'></div>
      </div>
    </>
  )
}

export default App
