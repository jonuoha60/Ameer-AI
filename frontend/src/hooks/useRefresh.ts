import axios from "../libs/utils/api";

const useRefreshToken = () => {

  const refreshToken = async () => {
    try {
      const response = await axios.post(
        "/refresh",
        {},
        { withCredentials: true } 
      );

      return response.data;
    } catch (err) {
      console.error("Refresh token error:", err);
      return null; 
    }
  };

  return refreshToken;
};

export default useRefreshToken;