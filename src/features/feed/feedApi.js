import axios from "axios"
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const Feed = async()=>{
      const response = await axios.get(`${BASE_URL}/feed`,{withCredentials: true});
        return response.data;
}
