import { useState, useEffect } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const APIKEY = import.meta.env.VITE_WEATHER_API_KEY;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://api.airvisual.com/v2/nearest_city?key=${APIKEY}`
        );
        setWeatherData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.response);
        if (error.response.status === 429) {
          setOpen(true);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress disableShrink />
        </Box>
      ) : (
        <main>
          <div>
            <h1>{weatherData.data.city}</h1>
            <p>{weatherData.data.country}</p>
          </div>
          <div>
            <p>{weatherData.data.current.weather.tp}°</p>
            <img
              src={`/icons/${weatherData.data.current.weather.ic}.svg`}
              alt="Weather icon"
            />
          </div>
        </main>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            The limit on requests has been exceeded
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Please try again as you have exceeded the requested limit
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default Weather;
