import { error } from "./error";
export const REQUEST_WEATHER = "REQUEST_WEATHER";
export const RECEIVE_WEATHER = "RECEIVE_WEATHER";

export const requestWeather = (location) => ({
    type: REQUEST_WEATHER,
    location: location
});

export const receiveWeather = (weatherInfo, location) => ({
    type: RECEIVE_WEATHER,
    temperature: weatherInfo.temperature,
    weather: weatherInfo.weather,
    location: location
});

export const fetchWeatherInfo = (location) => 
    async dispatch => {
        dispatch(requestWeather(location));

        const response = await fetch(`https://api.aerisapi.com/observations/${location}?&format=json&filter=allstations&limit=1&fields=ob.weather,ob.tempC&client_id=fD3yzDEwR2Jv2fzSn24vu&client_secret=wlcVokVwyBSlMVAMdnHMrwIL1ducoASIXpNQZPj0`);
        if (response.status !== 200) {
            dispatch(error(`Cannot fetch weather (${response.status})`));
        }

        const ans = await response.json();
        if (!ans.success) {
            dispatch(error(ans.error));
        }

        return dispatch(receiveWeather(ans.response.ob, location));
    }
