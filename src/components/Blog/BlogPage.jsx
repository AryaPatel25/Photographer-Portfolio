import React from "react";
import "./BlogPage.css";

const blogPosts = [
  {
    id: 1,
    title: "How to Build a Portfolio Website",
    date: "May 26, 2025",
    summary:
      "Step-by-step guide to creating a professional portfolio website using React and modern CSS.",
    imageUrl: "/images/blog1.jpg",
  },
  {
    id: 2,
    title: "Understanding Glassmorphism in UI Design",
    date: "April 18, 2025",
    summary:
      "Explore the glassmorphism design trend and how to implement it effectively.",
    imageUrl: "/images/blog2.jpg",
  },
  // Add more posts as needed
];

const photographyTips = [
  "Use natural light whenever possible for more vibrant photos.",
  "Keep your lens clean to avoid blurry shots.",
  "Rule of thirds helps in composing balanced images.",
  "Experiment with different perspectives and angles.",
  "Shoot in RAW format to have more editing flexibility.",
];

function BlogPage() {
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
            <img
              src={post.imageUrl}
              alt={post.title}
              className="project-image"
            />
            <div className="project-overlay">
              <h3 className="project-title">{post.title}</h3>
              <p className="project-date">{post.date}</p>
              <p>{post.summary}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="photography-tips-section">
        <h2 className="section-title">Photography Tips</h2>
        <ul className="tips-list">
          {photographyTips.map((tip, index) => (
            <li key={index} className="tip-item">
              {tip}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default BlogPage;
