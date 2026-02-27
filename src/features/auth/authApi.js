import axios from "axios"
const BASE_URL = import.meta.env.VITE_BASE_URL;



export const Signup = async(data)=>{
      const response = await axios.post(`${BASE_URL}/signup`,data,{withCredentials: true});
        return response.data;
}


export const Login = async(data)=>{
  console.log(data);
  
      const response = await axios.post(`${BASE_URL}/login`,data,{withCredentials: true});
      
        return response.data;
}

export const Logout = async()=>{
      const response = await axios.post(`${BASE_URL}/logout`,null,{withCredentials: true});
        return response.data;
}

