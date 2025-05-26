import React from "react";
import { useNavigate } from "react-router-dom"; // import useNavigate
import "./AboutSection.css";

const AboutSection = ({ preview = false }) => {
  const navigate = useNavigate(); // initialize navigate

  return (
    <div className="about-section">
      <div className="about-header">
        <div className="about-label">About</div>
        {preview && (
          <button
            className="about-cta-button"
            onClick={() => navigate("/about")} // navigate on click
          >
            Know More&nbsp;
            <img
              src="https://img.icons8.com/ios-filled/24/ffffff/right--v1.png"
              alt="Right Arrow"
              style={{ verticalAlign: "middle" }}
            />
          </button>
        )}
      </div>

      <div className="about-content">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/e988908983e34bf6aa29948865286bf3/b5c3e7f42b72b4af8fd26f49a645e56ffc058cd3?placeholderIfAbsent=true"
          className="about-image"
          alt="Photographer"
        />

        <div className="about-details">
          <div className="about-intro">
            <div className="section-header">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/e988908983e34bf6aa29948865286bf3/4eb2ae8ab2a996bd554b48b675226b405048c29f?placeholderIfAbsent=true"
                className="section-icon"
                alt=""
              />
              <h2 className="section-title">Introduction</h2>
            </div>
            <p className="intro-text">
              My journey as a photographer is a lifelong passion to capture the
              extraordinary within the everyday, to freeze fleeting moments, and
              to share the vibrant beauty of India through my lens. Rooted in
              the diverse and colorful landscapes of this incredible country, I
              draw inspiration from its rich heritage, bustling streets, and
              serene nature alike. Join me on this visual journey, where every
              photograph tells a unique story, and each frame reflects a piece
              of my soul.
            </p>
          </div>

          <div className="contact-info">
            <div className="section-header">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/e988908983e34bf6aa29948865286bf3/4eb2ae8ab2a996bd554b48b675226b405048c29f?placeholderIfAbsent=true"
                className="section-icon"
                alt=""
              />
              <h2 className="section-title">Contact Information</h2>
            </div>

            <div className="contact-details">
              <div className="contact-item">
                <h3 className="contact-label">Email</h3>
                <div className="contact-value">name@gmail.com</div>
              </div>
              <div className="contact-item">
                <h3 className="contact-label">Phone Number</h3>
                <div className="contact-value">+91 000000000</div>
              </div>
            </div>

            <div className="contact-actions">
              <div className="social-buttons">
                <button
                  className="social-button"
                  onClick={() =>
                    window.open(
                      "https://facebook.com",
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                  aria-label="Facebook"
                >
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/e988908983e34bf6aa29948865286bf3/0b242f0ff3ed52d4384da181f7e5530464a63d77?placeholderIfAbsent=true"
                    className="social-icon"
                    alt="Facebook"
                  />
                </button>
                <button
                  className="social-button"
                  onClick={() =>
                    window.open(
                      "https://twitter.com",
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                  aria-label="Twitter"
                >
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/e988908983e34bf6aa29948865286bf3/ec2714fb35eced696f65afc05dc207517bf5df91?placeholderIfAbsent=true"
                    className="social-icon"
                    alt="Twitter"
                  />
                </button>
                <button
                  className="social-button"
                  onClick={() =>
                    window.open(
                      "https://linkedin.com",
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                  aria-label="LinkedIn"
                >
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/e988908983e34bf6aa29948865286bf3/5a96035c82473100177e71dc3ef2aac5f4099b6b?placeholderIfAbsent=true"
                    className="social-icon"
                    alt="LinkedIn"
                  />
                </button>
                <button
                  className="social-button"
                  onClick={() =>
                    window.open(
                      "https://instagram.com",
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                  aria-label="Instagram"
                >
                  <img
                    src="https://static.vecteezy.com/system/resources/previews/014/414/683/non_2x/instagram-black-logo-on-transparent-background-free-vector.jpg"
                    className="social-icon"
                    alt="Instagram"
                  />
                </button>
              </div>

              <div className="action-buttons">
                <button
                  className="action-button"
                  onClick={() => navigate("/contact")}
                >
                  Let's Work
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
