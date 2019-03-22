import { Types } from "../actions";

const error = (state = "", action) => {
    switch (action.type) {
        case Types.ERROR:
            return action.message;
        case Types.UPDATE_LOCATION:
            return "";
        default: 
            return state;
    }
}

export default error;