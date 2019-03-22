import { combineReducers } from "redux";
import error from "./error";
import weather from "./weather";
import location from "./location";

const app = combineReducers({
    error,
    weather,
    location
});

export default app;