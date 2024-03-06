import React, { useEffect, useState } from "react";
import { Container, Row, InputGroup, Form, Col, Image } from "react-bootstrap";

const Home = () => {

    const [lat, setLat] = useState('6.9271');
    const [lon, setLon] = useState('79.8612');
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState(null);
    const apiKey = process.env.REACT_APP_API_KEY;

    useEffect(() => {
        handleGetWeather();
    }, []);

    const isValidLatitude = (latitude) => {
        return !isNaN(latitude) && latitude >= -90 && latitude <= 90;
    };

    const isValidLongitude = (longitude) => {
        return !isNaN(longitude) && longitude >= -180 && longitude <= 180;
    };


    const handleGetWeather = async () => {
        if (!isValidLatitude(lat) || !isValidLongitude(lon)) {
            alert('Please enter valid latitude and longitude values.');
            return;
        }
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
                );
            if (!response.ok) {
                throw new Error('Failed to fetch weather data');
            }
            const data = await response.json();
            setWeatherData(data);
            setError(null);
        } catch (error) {
            setError(error.message);
            setWeatherData(null);
        }
    };

    const handleLonKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleGetWeather();
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp * 1000);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    const formatDate1 = (timestamp) => {
        const date = new Date(timestamp * 1000);
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const dayOfWeek = days[date.getDay()];
        const dayOfMonth = date.getDate();
        const month = months[date.getMonth()];
        return `${dayOfWeek} ${dayOfMonth.toString().padStart(2, '0')} ${month}`;
    }

    return (
        <Container fluid={true} className="weather-app px-md-5">
            {console.log(weatherData)}
            <Row>
                <InputGroup className="mt-3">
                    <Col xs={6} md={3} className="p-2">
                        <Form.Control aria-label="First name" id="lat"
                            value={lat}
                            onChange={(e) => setLat(e.target.value)}
                            onKeyPress={handleLonKeyPress} />
                    </Col>
                    <Col xs={6} md={3} className="p-2">
                        <Form.Control aria-label="Last name" id="lon"
                            value={lon}
                            onChange={(e) => setLon(e.target.value)}
                            onKeyPress={handleLonKeyPress} />
                    </Col>
                </InputGroup>
            </Row>
            <hr className="hr" />
            {!weatherData ? (
                <p>Loading...</p>
            ) : (
                <Row className="pt-md-4 px-2">
                    <h2 className="colour-white">{weatherData.name}, {weatherData.sys.country}</h2>
                    <h4 className="colour-white">{formatDate1(weatherData.dt)}</h4>
                </Row>
            )}
            {!weatherData ? (
                <p>Loading...</p>
            ) : (
                <Row>
                    <Col md={6} className="lb">
                        <Row className="pt-3">
                            <Col className="d-flex justify-content-center"><Image src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} /></Col>
                            <Col>
                                <h1 className="colour-white">{Math.round(weatherData.main.temp)}°</h1>
                                <h4 className="colour-white">{weatherData.weather[0].main}</h4>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={6} className="px-5">
                        <Row>
                            <Col className="pt-4">
                                <h6 className="colour-white">{Math.round(weatherData.main.temp_max)}°</h6>
                                <p className="colour-white">High</p>
                            </Col>
                            <Col className="pt-4">
                                <h6 className="colour-white">{weatherData.wind.speed} mph</h6>
                                <p className="colour-white">Wind</p>
                            </Col>
                            <Col className="pt-4">
                                <h6 className="colour-white">{formatTime(weatherData.sys.sunrise)}</h6>
                                <p className="colour-white">Sunrise</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="pt-4">
                                <h6 className="colour-white">{Math.round(weatherData.main.temp_min)}°</h6>
                                <p className="colour-white">Low</p>
                            </Col>
                            <Col className="pt-4">
                                <h6 className="colour-white">{weatherData.clouds.all}%</h6>
                                <p className="colour-white">Rain</p>
                            </Col>
                            <Col className="pt-4">
                                <h6 className="colour-white">{formatTime(weatherData.sys.sunset)}</h6>
                                <p className="colour-white">Sunset</p>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            )}
        </Container>
    );
};
export default Home;