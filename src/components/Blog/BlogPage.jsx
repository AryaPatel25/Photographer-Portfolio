import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase/firebase";
import { useNavigate } from "react-router-dom";
import "./BlogPage.css";

function BlogPage({ isAdmin }) {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fixed cover image URL used for all blogs (same as in AdminBlogManagement)
  const coverImageUrl =
    "https://th.bing.com/th/id/OIP.HkQqlSZYLCVwlLroBHtDnQHaEc?w=292&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7";

  useEffect(() => {
    async function fetchPosts() {
      try {
        const querySnapshot = await getDocs(collection(db, "blogPosts"));
        const posts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
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
            Discover tips, tutorials, and ideas on web development, UI/UX, and
            design.
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
            src="https://th.bing.com/th/id/OIP.bSJCkwSTavqQtHod3SakqAHaEK?rs=1&pid=ImgDetMain"
            alt="Blog header"
            className="header-gallery-image"
          />
        </div>
      </header>

      <section className="blog-posts-grid">
        {blogPosts.map((post) => (
          <article key={post.id} className="blog-post-card">
            {/* Use fixed cover image */}
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
    </div>
  );
}

export default BlogPage;
