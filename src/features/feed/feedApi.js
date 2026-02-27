import axios from "axios"
import { BASE_URL } from "../../utils/constants";

export const Feed = async()=>{
      const response = await axios.get(`${BASE_URL}/feed`,{withCredentials: true});
        return response.data;
}
