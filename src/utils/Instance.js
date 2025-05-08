import axios from "axios";

export const instance = axios.create({
    baseURL: 'http://luxcycs.com:5500/',
    headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': '' 
      }
})

export default instance