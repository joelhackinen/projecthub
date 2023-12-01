export const throwError = async (res) => {
  let errorObj;
  try {
    const data = await res.json();
    errorObj = data.error;
  } catch (_error) {
    errorObj = null;
  }
  const error = new Error();
  switch (res.status) {
    case 401:
      error.messages = errorObj
        ? Object.values(errorObj)
        : ["unauthorized, please log in again"];
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
