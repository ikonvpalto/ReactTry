import {ERROR, error} from "./error";
import {UPDATE_LOCATION, updateLocation} from "./location";
import {REQUEST_WEATHER, RECEIVE_WEATHER, fetchWeatherInfo} from "./weather";

export const Types = Object.freeze({
    UPDATE_LOCATION,
    REQUEST_WEATHER,
    RECEIVE_WEATHER, 
    ERROR
});

export {
    error,
    fetchWeatherInfo,
    updateLocation
}