import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function PublicView() {
  const { publicId } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPublicPost = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/posts/public/${publicId}`
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

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div>
      <h1>MoodCircle</h1>

      <h2>Shared Moment</h2>

      <img
        src={post.imageUrl}
        alt="Shared MoodCircle post"
        width="400"
      />

      <p>{post.note}</p>

      <small>
        {new Date(post.createdAt).toLocaleString()}
      </small>
    </div>
  );
}

export default PublicView;