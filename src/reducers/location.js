import { Types } from "../actions"

const location = (state = "", action) => {
    switch (action.type) {
        case Types.UPDATE_LOCATION:
            return action.location;
        default:
            return state;
    }
}

export default location;