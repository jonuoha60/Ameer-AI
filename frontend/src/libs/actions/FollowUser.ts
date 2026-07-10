import axios from "../utils/api";


export const followUser = async (followingId: string) => {
    
  const { data } = await axios.post(`/user/follow/${followingId}`);
  return data;
};