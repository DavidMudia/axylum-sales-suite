import axios from "axios";


const api = axios.create({

  baseURL:
    "http://localhost:5000/api",

  headers: {
    "Content-Type": "application/json",
  },

  withCredentials: true,

});


// Attach JWT token automatically
api.interceptors.request.use(

  (config) => {

    const token =
      localStorage.getItem("token");


    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }


    return config;

  },

  (error) => {

    return Promise.reject(error);

  }

);


// Handle expired/invalid sessions globally
api.interceptors.response.use(

  (response) => {

    return response;

  },

  (error) => {

    if (
      error.response?.status === 401
    ) {

      // optional later:
      // clear session
      // redirect to login

      console.log(
        "Unauthorized request"
      );

    }


    return Promise.reject(error);

  }

);


export default api;