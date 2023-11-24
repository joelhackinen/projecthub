export const throwError = (res, errorObj=null) => {
  const error = new Error();
  switch (res.status) {
    case 401:
      error.messages = errorObj ? Object.values(errorObj) : ["unauthorized, please log in again"];
      throw error;
    case 500:
      error.messages = ["unexpected error"];
      throw error;
    default:
      if (errorObj && typeof errorObj === "object") {
        error.messages = Object.values(errorObj);
        throw error;
      }
      error.messages = ["unknown error"];
      throw error;
  }
};
