import { Types } from "../actions";

const weather = (state = {}, action) => {
    switch (action.type) {
        case Types.REQUEST_WEATHER:
            return Object.assign({}, state, {loading: true});
        case Types.RECEIVE_WEATHER: 
            return Object.assign({}, state, {
                temperature: action.temperature,
                weather: action.weather,
                location: action.location,
                loading: false
            })
        default:
            return state;
    }
}

export default weather;