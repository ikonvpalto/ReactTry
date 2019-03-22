export const ERROR = "ERROR";
export const error = (error) => ({
    type: ERROR,
    message: error.message || error.description || error
});