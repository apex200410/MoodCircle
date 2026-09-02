import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const API_URL = import.meta.env.VITE_API_URL;

function Home() {
  const [image, setImage] = useState(null);
  const [note, setNote] = useState("");
  const [uploading, setUploading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const navigate = useNavigate();

  // Get user's posts
  const fetchMyPosts = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/posts/my-posts`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to load posts.");
        return;
      }

      setPosts(data.posts);
    } catch (error) {
      console.error("Fetch posts error:", error);
      alert("Failed to load your posts.");
    } finally {
      setLoadingPosts(false);
    }
  }, [navigate]);

  // Fetch posts when Home opens
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMyPosts();
  }, [fetchMyPosts]);

  // Handle image selection
  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];

    if (selectedImage) {
      setImage(selectedImage);
    }
  };

  // Upload post
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select an image.");
      return;
    }

    if (!note.trim()) {
      alert("Please enter a note.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again.");
      navigate("/");
      return;
    }

    const formData = new FormData();

    formData.append("image", image);
    formData.append("note", note);

    try {
      setUploading(true);

      const response = await fetch(`${API_URL}/api/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Upload failed.");
        return;
      }

      alert("Post uploaded successfully!");

      console.log("Saved post:", data.post);

      // Clear form
      setImage(null);
      setNote("");

      const imageInput = document.getElementById("imageInput");

      if (imageInput) {
        imageInput.value = "";
      }

      // Refresh posts
      fetchMyPosts();
    } catch (error) {
      console.error("Upload error:", error);
      alert("Something went wrong while uploading.");
    } finally {
      setUploading(false);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Copy public link
  const handleCopyLink = (publicId) => {
    const publicLink = `${window.location.origin}/view/${publicId}`;

    navigator.clipboard
      .writeText(publicLink)
      .then(() => {
        alert("Public link copied!");
      })
      .catch(() => {
        alert("Failed to copy link.");
      });
  };

  return (
    <div className="home-page">

      {/* Header */}
      <header className="home-header">
        <div className="home-brand">
          <div className="home-brand-icon">☻</div>

          <div>
            <h1>MoodCircle</h1>
            <span>Share your moments</span>
          </div>
        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="home-container">

        {/* Welcome Section */}
        <section className="welcome-section">
          <h2>Welcome to MoodCircle 👋</h2>

          <p>
            Capture a moment, add a note, and keep your memories
            in one place.
          </p>
        </section>

        {/* Create Post */}
        <section className="create-card">
          <div className="section-heading">
            <h2>Create a MoodCircle Post</h2>

            <p>
              Share an image and a short note about your mood.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Image Upload */}
            <div className="home-input-group">
              <label htmlFor="imageInput">
                Select Image
              </label>

              <input
                id="imageInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />

              {image && (
                <p className="selected-file">
                  Selected: {image.name}
                </p>
              )}
            </div>

            {/* Note */}
            <div className="home-input-group">
              <label htmlFor="note">
                Short Note
              </label>

              <textarea
                id="note"
                placeholder="How are you feeling today?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows="5"
                required
              />
            </div>

            {/* Upload Button */}
            <button
              className="upload-button"
              type="submit"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload Post"}
            </button>

          </form>
        </section>

        {/* Posts Section */}
        <section className="posts-section">

          <div className="section-heading">
            <h2>My Posts</h2>

            <p>
              Your saved MoodCircle moments.
            </p>
          </div>

          {loadingPosts ? (
            <div className="empty-card">
              <p>Loading your posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="empty-card">
              <div className="empty-icon">📷</div>

              <h3>No posts yet</h3>

              <p>
                Upload your first image and create your
                first MoodCircle moment.
              </p>
            </div>
          ) : (
            <div className="posts-grid">

              {posts.map((post) => (
                <article
                  className="post-card"
                  key={post._id}
                >

                  {/* Image */}
                  <div className="post-image-wrapper">
                    <img
                      src={post.imageUrl}
                      alt="MoodCircle post"
                      className="post-image"
                    />
                  </div>

                  {/* Post Content */}
                  <div className="post-content">

                    <p className="post-note">
                      {post.note}
                    </p>

                    <p className="post-date">
                      {new Date(
                        post.createdAt
                      ).toLocaleString()}
                    </p>

                    <button
                      className="copy-link-button"
                      onClick={() =>
                        handleCopyLink(post.publicId)
                      }
                    >
                      🔗 Copy Public Link
                    </button>

                  </div>
                </article>
              ))}

            </div>
          )}

        </section>

      </main>

      {/* Footer */}
      <footer className="home-footer">
        <p>
          MoodCircle &copy; {new Date().getFullYear()}
        </p>
      </footer>

    </div>
  );
}

export default Home;