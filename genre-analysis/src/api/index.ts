import axios from 'axios'

const ABSOLUTE_API_BASE_URL = 'https://172.20.10.7:8443/api/v1';

const api = axios.create({
  //baseURL: '/api',   
  baseURL: ABSOLUTE_API_BASE_URL,
})

let currentToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  currentToken = token;
};

api.interceptors.request.use((config) => {

  if (currentToken) {
    config.headers.Authorization = `Bearer ${currentToken}`
  }
  return config
});

api.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
api.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
api.defaults.headers.common['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept, Authorization';


export default api;