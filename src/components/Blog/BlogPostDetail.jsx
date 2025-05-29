import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/firebase";
import "./BlogPostDetail.css";

function BlogPostDetail() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      setError(null);
      try {
        const docRef = doc(db, "blogPosts", postId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() });
        } else {
          setPost(null);
          setError("Post not found.");
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to fetch the blog post.");
        setPost(null);
      } finally {
        setLoading(false);
      }
    }

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  if (loading) return <div className="loading-message">Loading post...</div>;

  if (error)
    return (
      <div className="post-not-found">
        <h2>{error}</h2>
        <Link to="/blog" className="back-link">
          Back to Blog
        </Link>
      </div>
    );

  if (!post)
    return (
      <div className="post-not-found">
        <h2>Post not found</h2>
        <Link to="/blog" className="back-link">
          Back to Blog
        </Link>
      </div>
    );

  return (
    <div className="post-detail-container">
      <Link to="/blog" className="back-link">
        ← Back to Blog Page
      </Link>
      <h1 className="post-title">{post.title}</h1>
      <p className="post-date">{post.date}</p>
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={`Cover for ${post.title}`}
          className="post-image"
          style={{ maxWidth: "100%", marginBottom: "1rem" }}
        />
      )}
      <div className="post-content">{post.content}</div>
    </div>
  );
}

export default BlogPostDetail;
