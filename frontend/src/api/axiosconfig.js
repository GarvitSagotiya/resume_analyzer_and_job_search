import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:7300/api', // Kept your original /api base path mapping
  headers: { 'Content-Type': 'application/json' },
});

// Vital flag to ensure HttpOnly cookies travel across cross-origin server environments
api.defaults.withCredentials = true;

export const setupInterceptors = (accessToken, refreshTokens, setAccessToken) => {
  
  // Request Interceptor: Attach bearer tokens dynamically from React memory state
  const requestIntercept = api.interceptors.request.use(
    (config) => {
      if (!config.headers['Authorization'] && accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response Interceptor: Seamless background Silent Token Rotation
  const responseIntercept = api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const prevRequest = error?.config;
      
      // If server throws 401 (Unauthorized), intercept it and attempt token swap
      if (error?.response?.status === 401 && !prevRequest?.sent) {
        prevRequest.sent = true; // Protects against accidental infinite error loop checks

        try {
          // Fire back-end silent refresh rotation route (points cleanly to your adjusted base path)
          const response = await axios.post('http://localhost:7300/api/users/refresh', {}, { withCredentials: true });
          const newAccessToken = response.data.accessToken;
          
          setAccessToken(newAccessToken);
          
          // Overwrite the header of the failed request with the fresh token
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          
          return api(prevRequest); // Replay original broken API fetch execution seamlessly
        } catch (refreshError) {
          setAccessToken(null); // Clear token state context if refresh token has expired or died
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  return { requestIntercept, responseIntercept };
};

export default api;