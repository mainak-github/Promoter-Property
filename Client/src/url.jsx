const isLocalhost = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
);

const API_URL = import.meta.env.VITE_API_URL || (isLocalhost ? "https://localhost:3330/api" : "https://api.promoterproperty.com/api");
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL || (isLocalhost ? "https://localhost:3330" : "https://api.promoterproperty.com");

export { API_URL, IMAGE_URL };
export default { API_URL, IMAGE_URL };
