import { useState } from "react";
import { followUser } from "../../libs/actions/FollowUser";
import { Toast } from "../popup/Toast";
import { useNavigate } from "react-router-dom";
import type { Auth } from "../../types";

type FollowButtonProps = {
  followingId: string;
  auth: Auth | null;
};

export const FollowButton = ({ followingId, auth }: FollowButtonProps) => {
  const [loading, setLoading] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const navigate = useNavigate()

  const displayToast = (message: string) => {
    setToastMessage(message);
    setShowToast(false); 
    setTimeout(() => setShowToast(true), 10);
  };

  const handleFollow = async () => {
    if(!auth) {
        navigate("/login")
    }
    try {
      setLoading(true);

      await followUser(followingId);

      displayToast("User followed successfully!");
    } catch (error: any) {
      console.error(error);

      displayToast(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to follow user."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast
        message={toastMessage}
        show={showToast}
        duration={3000}
      />

      <button
        onClick={handleFollow}
        disabled={loading}
        className="follow-btn"
      >
        {loading ? "Following..." : "Follow"}
      </button>
    </>
  );
};