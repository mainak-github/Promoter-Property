const isDev = import.meta.env.DEV;

const API_URL = import.meta.env.VITE_API_URL || (isDev ? "http://localhost:3330/api" : "https://api.promoterproperty.com/api");
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL || (isDev ? "http://localhost:3330" : "https://api.promoterproperty.com");

export { API_URL, IMAGE_URL };
export default { API_URL, IMAGE_URL };
