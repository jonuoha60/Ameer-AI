import axios from "../components/api/api";

const useRefreshToken = () => {
   

  const refreshToken = async() => {
try {
  const response = await axios.post(
  "/refresh",
  {},
);
  // setAuth((prev: Auth) => {
  //   return {...prev, accessToken: response.data.accessToken}
  // })
  // setUser((prev: Auth) => {
  //   return {...prev, accessToken: response.data.accessToken}
  // })
  return response.data
} catch (err: unknown) {
    console.log("Refresh token error:", err);
  // console.error("Axios Error Code:", err); 
  // console.error("Full Error Object:", err);
}
    }
  return refreshToken
}

export default useRefreshToken;