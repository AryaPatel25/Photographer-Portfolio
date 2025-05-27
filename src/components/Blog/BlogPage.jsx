import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase/firebase"; // adjust path as needed
import { useNavigate } from "react-router-dom";
import "./BlogPage.css";

function BlogPage({ isAdmin }) {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPosts() {
      try {
        const querySnapshot = await getDocs(collection(db, "blogPosts"));
        const posts = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        setBlogPosts(posts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (loading) {
    return <div className="loading-message">Loading blog posts...</div>;
  }

  return (
    <div className="page-container">
      <header className="blog-header portfolio-header">
        <div className="portfolio-header-content header-text-container">
          <span className="header-label">BLOG</span>
          <h1 className="header-title">Latest Insights & Stories</h1>
          <p className="header-description">
            Discover tips, tutorials, and ideas on web development, UI/UX, and design.
          </p>
          {isAdmin && (
            <button
              className="admin-manage-btn"
              onClick={() => navigate("/admin/blog-management")}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#7b52ff",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Manage Blogs
            </button>
          )}
        </div>
        <div className="header-gallery">
          <img
            src="/images/blog-header.jpg"
            alt="Blog header"
            className="header-gallery-image"
          />
        </div>
      </header>

      <section className="blog-posts-grid projects-grid">
        {blogPosts.map((post) => (
          <article key={post.id} className="blog-post-card project-card">
            {post.imageUrl && (
              <img src={post.imageUrl} alt={post.title} className="project-image" />
            )}
            <div className="project-overlay">
              <h3 className="project-title">{post.title}</h3>
              <p className="project-date">{post.date}</p>
              <p>{post.summary || post.content?.substring(0, 120) + "..."}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

export default BlogPage;
