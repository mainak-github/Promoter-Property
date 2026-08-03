const isLocalhost = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
);

const API_URL = import.meta.env.VITE_API_URL || (isLocalhost ? "http://localhost:3330/api" : "http://api.promoterproperty.com/api");
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL || (isLocalhost ? "http://localhost:3330" : "http://api.promoterproperty.com");

export { API_URL, IMAGE_URL };
export default { API_URL, IMAGE_URL };
