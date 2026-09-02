import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./PublicView.css";

const API_URL = import.meta.env.VITE_API_URL;

function PublicView() {
  const { publicId } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPublicPost = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/posts/public/${publicId}`
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Post not found.");
          return;
        }

        setPost(data.post);
      } catch (error) {
        console.error(error);
        setError("Unable to load this post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicPost();
  }, [publicId]);

  /* Loading */
  if (loading) {
    return (
      <div className="public-page">
        <div className="public-card status-card">
          <div className="public-brand">
            <div className="public-brand-icon">☻</div>
            <h1>MoodCircle</h1>
          </div>

          <div className="loading-icon">⏳</div>

          <h2>Loading Moment...</h2>

          <p>
            Please wait while we load this shared moment.
          </p>
        </div>
      </div>
    );
  }

  /* Error */
  if (error) {
    return (
      <div className="public-page">
        <div className="public-card status-card">
          <div className="public-brand">
            <div className="public-brand-icon">☻</div>
            <h1>MoodCircle</h1>
          </div>

          <div className="error-icon">!</div>

          <h2>Moment Not Found</h2>

          <p>{error}</p>

          <Link
            to="/"
            className="public-button"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="public-page">

      {/* Header */}
      <header className="public-header">
        <div className="public-header-brand">
          <div className="public-brand-icon">
            ☻
          </div>

          <div>
            <h1>MoodCircle</h1>
            <span>Shared moments</span>
          </div>
        </div>

        <Link
          to="/"
          className="header-login-button"
        >
          Login
        </Link>
      </header>

      {/* Main */}
      <main className="public-container">

        <div className="public-card">

          {/* Title */}
          <div className="shared-heading">
            <span className="shared-label">
              SHARED MOMENT
            </span>

            <h2>A Moment from MoodCircle</h2>

            <p>
              Someone shared this moment with you.
            </p>
          </div>

          {/* Image */}
          <div className="shared-image-wrapper">
            <img
              src={post.imageUrl}
              alt="Shared MoodCircle post"
              className="shared-image"
            />
          </div>

          {/* Note */}
          <div className="shared-content">

            <div className="note-box">
              <p>{post.note}</p>
            </div>

            {/* Date */}
            <div className="shared-date">
              <span>Posted on</span>

              <strong>
                {new Date(
                  post.createdAt
                ).toLocaleString()}
              </strong>
            </div>

          </div>

          {/* Bottom */}
          <div className="shared-footer">
            <p>
              Want to share your own moments?
            </p>

            <Link
              to="/register"
              className="public-button"
            >
              Join MoodCircle
            </Link>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="public-footer">
        <p>
          MoodCircle &copy; {new Date().getFullYear()}
        </p>
      </footer>

    </div>
  );
}

export default PublicView;