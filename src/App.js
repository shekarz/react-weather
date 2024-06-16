import { useState } from "react";
import { TailSpin } from "react-loader-spinner";
import "./App.css";
import { FaSearch } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import axios from "axios";
import clear_icon from "./assets/weatherIcons/clear.png";
import cloud_icon from "./assets/weatherIcons/cloud.png";
import drizzle_icon from "./assets/weatherIcons/drizzle.png";
import humidity_icon from "./assets/weatherIcons/humidity.png";
import rain_icon from "./assets/weatherIcons/rain.png";
import snow_icon from "./assets/weatherIcons/snow.png";
import wind_icon from "./assets/weatherIcons/wind.png";
import { MdNightlightRound, MdOutlineLightMode } from "react-icons/md";

function App() {
 // state variables
 const [city, setCity] = useState("");
 const [loading, setLoading] = useState(false);
 const [weatherData, setWeatherData] = useState(null);
 const [theme, setTheme] = useState("dark");

 //  apiKey for access
 const apiKey = "7fc70907466c3259a4ce2c5605503c31";

 const weatherIcons = {
  "01d": clear_icon,
  "01n": clear_icon,
  "02d": cloud_icon,
  "02n": cloud_icon,
  "03d": cloud_icon,
  "03n": cloud_icon,
  "04d": drizzle_icon,
  "04n": drizzle_icon,
  "09d": rain_icon,
  "09n": rain_icon,
  "10d": rain_icon,
  "10n": rain_icon,
  "13d": snow_icon,
  "13n": snow_icon,
 };

 //  fetching weather data
 const fetchWeatherData = async (cityName) => {
  if (cityName === "") {
   alert("Please Enter any City Name");
   setWeatherData(null);
   return;
  }
  try {
   setLoading(true);
   const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`
   );
   const { data } = response;
   console.log(response);
   const icon = weatherIcons[data.weather[0].icon] || clear_icon;
   setWeatherData({
    temperature: data.main.temp,
    location: data.name,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    weather: data.weather[0].description,
    icon,
    date: new Date(data.dt * 1000).toLocaleString(),
   });
   setLoading(false);
  } catch (error) {
   if (error.response.status === 404) {
    alert("City Not Found");
    setLoading(false);
    setWeatherData(null);
    return;
   }
   console.log("Error while fetching data: ", error);
  }
 };

 //  handling mouse, keyboard events
 const onClickSearch = () => {
  fetchWeatherData(city);
 };

 const handleKeyDown = (e) => {
  if (e.key === "Enter") {
   fetchWeatherData(city);
  }
 };

 //  toggling between light and dark themes
 const toggleTheme = () => {
  const newTheme = theme === "light" ? "dark" : "light";
  setTheme(newTheme);
  document.body.className = newTheme;
 };

 //  rendering UI components
 return (
  <div className={`app ${theme}`}>
   <h1>Weather Info App</h1>
   <p>Welcome to Weather Info App. Find the weather details of any city! </p>
   <button className="themeBtn" onClick={toggleTheme}>
    {theme === "light" ? "Switch to Dark Theme" : "Switch to Light Theme"}
    {theme === "light" ? (
     <MdNightlightRound size={25} />
    ) : (
     <MdOutlineLightMode size={25} />
    )}
   </button>
   <div className="container">
    <div className="searchBox">
     <FaLocationDot className="search-icons" />
     <input
      onChange={(e) => setCity(e.target.value)}
      onKeyDown={handleKeyDown}
      value={city}
      type="text"
      placeholder="Enter Your Location"
     />
     <button onClick={onClickSearch}>
      <FaSearch className="search-icons" />
     </button>
    </div>
    {loading && (
     <div className="loader">
      <TailSpin height={50} color="white" />
     </div>
    )}
    {weatherData ? (
     <div className={`weatherInfo ${theme}`}>
      <img src={weatherData.icon} className="weatherIcon" alt="weather icon" />
      <h1>{parseInt(weatherData.temperature)}°C</h1>
      <h4>{weatherData.location}</h4>
      <p>{weatherData.weather}</p>
      <p>Date & Time: {weatherData.date}</p>
      <div className="weatherDetails">
       <div>
        <p>Humidity</p>
        <div className="humidity-wind">
         <img src={humidity_icon} alt="humidity" />
         <h4>{weatherData.humidity}%</h4>
        </div>
       </div>
       <div>
        <p>Wind Speed</p>
        <div className="humidity-wind">
         <img src={wind_icon} alt="wind speed" />
         <h4>{weatherData.windSpeed} Km/h</h4>
        </div>
       </div>
      </div>
     </div>
    ) : (
     !loading && (
      <div className="noWeatherData">
       <p>
        Enter a city name to find weather details like temperature, humidity,
        windspeed and etc. of the city
       </p>
      </div>
     )
    )}
   </div>
  </div>
 );
}

export default App;
