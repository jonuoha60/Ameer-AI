import { useAuth } from "../../hooks/useAuth";
import axios from "../../libs/utils/api/index";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../firebase/client";
import { useNavigate } from "react-router-dom";

export const useGoogleSignIn = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const user = result.user;
      const idToken = await user.getIdToken();

      const res = await axios.post("/user/google/login", {
        token: idToken,
      });

      loginUser(res.data.user);
      navigate("/");
    } catch (err: any) {
      console.error(err);
      console.error(err.response?.data);
    }
  };

  return { handleGoogleSignIn };
};