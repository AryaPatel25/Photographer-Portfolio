import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/firebase"; // adjust path as needed
import "./BlogPostDetail.css";

function BlogPostDetail() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const docRef = doc(db, "blogPosts", postId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() });
        } else {
          setPost(null);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [postId]);

  if (loading) return <div className="loading-message">Loading post...</div>;

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
      <h1 className="post-title">{post.title}</h1>
      <p className="post-date">{post.date}</p>
      <div className="post-content">{post.content}</div>
      <Link to="/blog" className="back-link">
        ← Back to Blog
      </Link>
    </div>
  );
}

export default BlogPostDetail;
