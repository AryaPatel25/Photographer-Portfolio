import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../Firebase/firebase";
import { useNavigate } from "react-router-dom";
import "./AdminBlogManagement.css";

export default function AdminBlogManagement() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  // Fixed cover image URL used for all blogs
  const coverImageUrl =
    "https://th.bing.com/th/id/OIP.HkQqlSZYLCVwlLroBHtDnQHaEc?w=292&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7";

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(collection(db, "blogPosts"), orderBy("date", "desc"));
      const snapshot = await getDocs(q);

      const posts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogs(posts);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Failed to load blog posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title.trim() || !date.trim() || !content.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      await addDoc(collection(db, "blogPosts"), {
        title: title.trim(),
        date: date.trim(),
        content: content.trim(),
        createdAt: serverTimestamp(),
      });

      setSuccess("Blog post added successfully!");
      setTitle("");
      setDate("");
      setContent("");

      fetchBlogs();
    } catch (err) {
      console.error("Error adding blog post:", err);
      setError("Failed to add blog post. Please try again.");
    }
  };

  return (
    <div className="admin-blog-management">
      <h2 style={{ textTransform: "uppercase" }}>Admin Blog Management</h2>

      <form onSubmit={handleSubmit} className="blog-form">
        <h3>Add New Blog Post</h3>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog title"
          />
        </label>

        <label>
          Date (e.g. May 27, 2025):
          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="Enter date"
          />
        </label>

        <label>
          Content:
          <textarea
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter full blog content"
          />
        </label>

        <button type="submit">Add Blog Post</button>
      </form>

      <hr />

      <h3>Existing Blog Posts</h3>

      {loading ? (
        <p>Loading...</p>
      ) : blogs.length === 0 ? (
        <p>No blog posts yet.</p>
      ) : (
        <section className="blog-posts-grid">
          {blogs.map((post) => (
            <article key={post.id} className="blog-post-card">
              <img
                src={coverImageUrl}
                alt={`Cover for ${post.title}`}
                className="blog-post-image"
              />
              <div className="blog-post-content">
                <h3 className="blog-post-title">{post.title}</h3>
                <p className="blog-post-date">{post.date}</p>
                <p className="blog-post-summary">
                  {post.summary ||
                    (post.content ? post.content.substring(0, 140) + "..." : "")}
                </p>
                <button
                  className="read-more-btn"
                  onClick={() => navigate(`/blog/${post.id}`)}
                  aria-label={`Read more about ${post.title}`}
                >
                  Read More
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
