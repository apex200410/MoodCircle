import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

      document.getElementById("imageInput").value = "";

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

  return (
    <div>
      <h1>Welcome to MoodCircle</h1>

      <p>Share your moment</p>

      {/* Logout */}
      <button onClick={handleLogout}>Logout</button>

      <br />
      <br />

      {/* Upload Form */}
      <h2>Create a MoodCircle Post</h2>

      <form onSubmit={handleSubmit}>
        {/* Image */}
        <div>
          <label>Select Image:</label>

          <br />

          <input
            id="imageInput"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <br />

        {/* Note */}
        <div>
          <label>Short Note:</label>

          <br />

          <textarea
            placeholder="Write something..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows="5"
            cols="40"
          />
        </div>

        <br />

        {/* Upload */}
        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      <hr />

      {/* User Posts */}
      <h2>My Posts</h2>

      {loadingPosts ? (
        <p>Loading your posts...</p>
      ) : posts.length === 0 ? (
        <p>You haven't uploaded anything yet.</p>
      ) : (
        <div>
          {posts.map((post) => (
            <div key={post._id}>
              <img
                src={post.imageUrl}
                alt="MoodCircle post"
                width="300"
              />

              <p>{post.note}</p>

              <small>
                {new Date(post.createdAt).toLocaleString()}
              </small>

              <br />
              <br />

              <button
                onClick={() => {
                  const publicLink = `${window.location.origin}/view/${post.publicId}`;

                  navigator.clipboard
                    .writeText(publicLink)
                    .then(() => {
                      alert("Public link copied!");
                    })
                    .catch(() => {
                      alert("Failed to copy link.");
                    });
                }}
              >
                Copy Link
              </button>

              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;