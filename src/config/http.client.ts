import axios from 'axios'

// como crear interceptores
/**
* const instance = axios.create(); 
* instance.interceptors.request.use(function () {/*...});
*/

const instance = axios.create({
  baseURL: 'http://localhost:3009',
  timeout: 5000,
  headers: {
    'X-Custom-Header': 'foobar',
    'Accept': 'application/json',
    'Content-Type':'application/json'
  }
})

instance.interceptors.request.use(
  (config) => {
    console.log(`🌐 [AXIOS] Enviando petición a: ${config.method?.toUpperCase()} ${config.url}`);
    console.log(`📦 Headers:`, config.headers);
    if (config.data) {
      console.log(`📤 Body:`, config.data);
    }
    return config;
  },
  (error) => {
    console.error('❌ [AXIOS ERROR] En solicitud:', error.message);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    console.log(`✅ [AXIOS] Respuesta recibida: ${response.status} ${response.statusText}`);
    console.log(`📥 Datos recibidos:`, response.data);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`❌ [AXIOS ERROR] Respuesta fallida: ${error.response.status}`);
      console.error('📦 Error data:', error.response.data);
    } else {
      console.error('❌ [AXIOS ERROR] Sin respuesta del servidor:', error.message);
    }
    return Promise.reject(error);
  }
);


export default instance
