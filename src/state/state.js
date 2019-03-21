import {createStore} from "redux"

const Actions = {
    INPUT_LOCATION: "INPUT_LOCATION",
    // FORCE_SEARCH: "FORCE_SEARCH",
    GET_WEATHER: "GET_WEATHER"
}

const initialState = {
    location: undefined,
    lastSuccessLocation: undefined,
    errorMessage: undefined,
    temp: undefined,
    weather: undefined,
};

function weather(state = initialState, action) {
    switch (action.type) {
        case Actions.INPUT_LOCATION:
            return Object.assign({}, state, {
                location: action.location,
                errorMessage: undefined
            });
        case Actions.GET_WEATHER:
            return Object.assign({}, state, {
                lastSuccessLocation: state.location,
                temp: action.temp,
                weather: action.weather,
                errorMessage: undefined
            });
        default:
            return state;
    }
}

const Store = createStore(weather)

export {Actions, Store};