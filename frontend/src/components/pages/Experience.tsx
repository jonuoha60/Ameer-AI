import { useState, type FormEvent, type ReactNode } from "react";
import "../../constants/styles/Experience.css";
import axios from "../../libs/utils/api";
import { Toast } from "../popup/Toast";
import { Supabase } from "../../libs/actions/Supabase";
import { useAuth } from "../../hooks/useAuth";

export const Experience = () => {
  const { auth } = useAuth()
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [transport, setTransport] = useState("");
  const [budget, setBudget] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [toastMessage, setToastMessage] = useState<ReactNode>("");
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const uploadImage = async (file: File) => {
    const filePath = `${file.name}-${Date.now()}`;

    const { error } = await Supabase.storage
      .from("trip-images")
      .upload(filePath, file);

    if (error) {
      console.error("Error uploading image: ", error.message);
      throw error;
    }

    const { data } = Supabase.storage
      .from("trip-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let username = ""

    if(auth) {
      username = auth.user.username
    }

    try {
      let photoUrl = "";

      if (image) {
        photoUrl = await uploadImage(image);
      }

      const formData = new FormData();

      formData.append("title", title);
      formData.append("username", username);
      formData.append("review", review);
      formData.append("rating", String(rating));
      formData.append("from", from);
      formData.append("to", to);
      formData.append("transport", transport);
      formData.append("budget", budget);
      formData.append("photoUrl", photoUrl);

      await axios.post("/experience/create", formData);

      setToastMessage(
        <span>
          🎉 Experience posted successfully!{" "}
          <a
            href="/profile"
            style={{ color: "#60a5fa", fontWeight: 600, marginLeft: "6px" }}
          >
            Check it out
          </a>
        </span>
      );
      setShowToast(true);

      // reset form
      setTitle("");
      setReview("");
      setRating(5);
      setFrom("");
      setTo("");
      setTransport("");
      setBudget("");
      setImage(null);
    } catch (err) {
      setToastMessage("Failed to post");
      setShowToast(true);
      console.error("Failed to create experience:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="experience-page">
      <Toast message={toastMessage} show={showToast} />

      <div className="experience-card">
        <h1>Share Your Experience</h1>
        <p className="experience-subtitle">
          Tell other travelers about your journey.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>From</label>
            <input
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="Toronto"
            />
          </div>

          <div className="field">
            <label>To</label>
            <input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Montreal"
            />
          </div>

          <div className="field">
            <label>Experience Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Amazing weekend trip"
            />
          </div>

          <div className="field">
            <label>Transport Used</label>
            <input
              value={transport}
              onChange={(e) => setTransport(e.target.value)}
              placeholder="Train, Uber, Bus..."
            />
          </div>

          <div className="field">
            <label>Budget ($)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="250"
            />
          </div>

          <div className="field">
            <label>Rating</label>

            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
              <option value={4}>⭐⭐⭐⭐ (4)</option>
              <option value={3}>⭐⭐⭐ (3)</option>
              <option value={2}>⭐⭐ (2)</option>
              <option value={1}>⭐ (1)</option>
            </select>
          </div>

          <div className="field">
            <label>Your Review</label>

            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Tell us about your trip..."
            />
          </div>

          <div className="field">
            <label>Upload Photo</label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setImage(file);
              }}
            />

            {image && (
              <p className="experience-file-name">{image.name}</p>
            )}
          </div>

          <button
            type="submit"
            className="experience-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Share Experience"}
          </button>
        </form>
      </div>
    </div>
  );
};