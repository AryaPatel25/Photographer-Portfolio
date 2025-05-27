import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../Firebase/firebase"; // Make sure storage is exported from firebase.js
import "./AdminBlogManagement.css";

export default function AdminBlogManagement() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
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
      } finally {
        setLoading(false);
      }
    };
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

    let imageUrl = "";

    try {
      if (imageFile) {
        const imageRef = ref(
          storage,
          `blogImages/${Date.now()}-${imageFile.name}`
        );
        const snapshot = await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }
    } catch (uploadErr) {
      console.error("Image upload failed:", uploadErr);
      setError("Image upload failed. Please try a different image.");
      return;
    }

    try {
      await addDoc(collection(db, "blogPosts"), {
        title: title.trim(),
        date: date.trim(),
        content: content.trim(),
        imageUrl: imageUrl || null,
        createdAt: serverTimestamp(),
      });

      setSuccess("Blog post added successfully!");
      setTitle("");
      setDate("");
      setContent("");
      setImageFile(null);

      // Refresh blog list
      const q = query(collection(db, "blogPosts"), orderBy("date", "desc"));
      const snapshot = await getDocs(q);
      const posts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogs(posts);
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

        <label>
          Upload Image:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
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
        <ul className="blog-list">
          {blogs.map((post) => (
            <li key={post.id} className="blog-item">
              <h4>{post.title}</h4>
              <p>
                <em>{post.date}</em>
              </p>
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="blog-thumbnail"
                />
              )}
              <p>{post.content.substring(0, 100)}...</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
