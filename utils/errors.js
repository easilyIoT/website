
export const isErrorResponse = (e) => e && e.response && e.response.data && e.response.data.error === true && e.response.data.message;