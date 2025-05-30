import React, { useState, useRef } from "react";
import "./Contact.css";
import { db } from "../Firebase/firebase"; // Adjust path if needed
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const APPOINTMENT_DURATION_MINUTES = 20;

const timeToMinutes = (timeStr) => {
  const [hh, mm] = timeStr.split(":").map(Number);
  return hh * 60 + mm;
};

const isOverlapping = (start1, duration1, start2, duration2) => {
  return start1 < start2 + duration2 && start2 < start1 + duration1;
};

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    appointmentDate: "",
    appointmentTime: "00:00",
    inquiryType: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const dateInputRef = useRef(null);
  const timeInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      if (!formData.appointmentDate || !formData.appointmentTime) {
        setErrorMsg("Please select both appointment date and time.");
        setLoading(false);
        return;
      }

      const appointmentsRef = collection(db, "appointments");
      const q = query(
        appointmentsRef,
        where("appointmentDate", "==", formData.appointmentDate)
      );
      const querySnapshot = await getDocs(q);

      const requestedStart = timeToMinutes(formData.appointmentTime);

      let conflictFound = false;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.appointmentTime) {
          const existingStart = timeToMinutes(data.appointmentTime);
          if (
            isOverlapping(
              requestedStart,
              APPOINTMENT_DURATION_MINUTES,
              existingStart,
              APPOINTMENT_DURATION_MINUTES
            )
          ) {
            conflictFound = true;
          }
        }
      });

      if (conflictFound) {
        setErrorMsg(
          "The selected appointment time is not available. Please choose a different time."
        );
        setLoading(false);
        return;
      }

      await addDoc(appointmentsRef, {
        ...formData,
        createdAt: serverTimestamp(),
      });

      setSuccessMsg("Appointment request send successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
        appointmentDate: "",
        appointmentTime: "00:00",
        inquiryType: "",
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      setErrorMsg("Failed to book appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-content">
        <div className="contact-header">
          <div className="contact-label">Contact Me</div>
          <div className="contact-title">Get in Touch with Me</div>
        </div>

        <div className="contact-description">
          Step into a world of timeless photography with me. Explore our range
          of photography services, each crafted to tell your unique story
          through captivating images. Whether it's the magic of portraits, the
          emotion of events, or the allure of commercial photography, we're here
          to bring your vision to life.
        </div>

        {/* Social Buttons */}
        <div className="social-media-container">
          <button
            className="social-button"
            aria-label="Facebook"
            onClick={() =>
              window.open(
                "https://facebook.com",
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets/e988908983e34bf6aa29948865286bf3/0b242f0ff3ed52d4384da181f7e5530464a63d77?placeholderIfAbsent=true"
              alt="Facebook"
              className="social-icon"
            />
          </button>

          <button
            className="social-button"
            aria-label="LinkedIn"
            onClick={() =>
              window.open(
                "https://linkedin.com",
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets/e988908983e34bf6aa29948865286bf3/5a96035c82473100177e71dc3ef2aac5f4099b6b?placeholderIfAbsent=true"
              alt="LinkedIn"
              className="social-icon"
            />
          </button>

          <button
            className="social-button"
            aria-label="Twitter"
            onClick={() =>
              window.open(
                "https://twitter.com",
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets/e988908983e34bf6aa29948865286bf3/ec2714fb35eced696f65afc05dc207517bf5df91?placeholderIfAbsent=true"
              alt="Twitter"
              className="social-icon"
            />
          </button>

          <button
            className="social-button"
            aria-label="Instagram"
            onClick={() =>
              window.open(
                "https://instagram.com",
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            <img
              src="https://static.vecteezy.com/system/resources/previews/014/414/683/non_2x/instagram-black-logo-on-transparent-background-free-vector.jpg"
              alt="Instagram"
              className="social-icon"
            />
          </button>
        </div>

        <div className="scroll-message">Scroll Down To Book An Appointment</div>
      </div>

      <div className="contact-form-container">
        <div className="contact-info-section">
          <div className="contact-info-content">
            <div className="section-title">Contact Information</div>
            <div className="section-description">
              Feel free to reach out to us through various channels. We are
              available by phone, email, and social media for your convenience.
            </div>
          </div>
          <div className="contact-links">
            <div className="contact-link">
              <div className="link-text">+91-0000000000</div>
              <div className="link-icon" aria-hidden="true">
                📞
              </div>
            </div>
            <div className="contact-link">
              <div className="link-text">info@namephotography.com</div>
              <div className="link-icon" aria-hidden="true">
                ✉️
              </div>
            </div>
          </div>
        </div>

        <div className="message-section">
          <div className="message-content">
            <div className="section-title">Book an Appointment</div>
            <div className="section-description">
              Have a specific inquiry or message for us? Please use the contact
              form below, and we'll get back to you promptly.
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="firstName">
                  First Name
                </label>
                <div className="input-wrapper">
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    placeholder="FIRST NAME"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    autoComplete="given-name"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="lastName">
                  Last Name
                </label>
                <div className="input-wrapper">
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    placeholder="LAST NAME"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    autoComplete="family-name"
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email
                </label>
                <div className="input-wrapper">
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="EMAIL ADDRESS"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="phone">
                  Phone Number
                </label>
                <div className="input-wrapper">
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="PHONE NUMBER"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input"
                    autoComplete="tel"
                  />
                </div>
              </div>
            </div>

            {/* Inquiry Type */}
            <div className="form-group full-width">
              <label className="form-label" htmlFor="inquiryType">
                Type of Inquiry
              </label>
              <div className="input-wrapper">
                <select
                  id="inquiryType"
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  aria-required="true"
                >
                  <option value="" disabled>
                    Select inquiry type
                  </option>
                  <option value="Portrait Photography">
                    Portrait Photography
                  </option>
                  <option value="Event Photography">Event Photography</option>
                  <option value="Commercial Photography">
                    Commercial Photography
                  </option>
                  <option value="Wedding Photography">
                    Wedding Photography
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Appointment Date with calendar button */}
            <div className="form-group full-width">
              <label className="form-label" htmlFor="appointmentDate">
                Appointment Date
              </label>
              <div className="input-wrapper date-input-wrapper">
                <input
                  id="appointmentDate"
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  style={{ flexGrow: 1 }}
                  ref={dateInputRef}
                  aria-describedby="appointmentDateHelp"
                />
                <button
                  type="button"
                  className="calendar-button"
                  onClick={() =>
                    dateInputRef.current?.showPicker?.() ||
                    dateInputRef.current?.focus()
                  }
                  aria-label="Open calendar"
                >
                  📅
                </button>
              </div>
              <small id="appointmentDateHelp" className="form-hint">
                Please select your preferred appointment date.
              </small>
            </div>

            {/* Appointment Time */}
            <div className="form-group full-width">
              <label className="form-label" htmlFor="appointmentTime">
                Appointment Time
              </label>
              <div className="input-wrapper time-input-wrapper">
                <input
                  id="appointmentTime"
                  type="time"
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  ref={timeInputRef}
                  aria-describedby="appointmentTimeHelp"
                />
                <button
                  type="button"
                  className="time-button"
                  onClick={() =>
                    timeInputRef.current?.showPicker?.() ||
                    timeInputRef.current?.focus()
                  }
                  aria-label="Open time picker"
                >
                  ⏰
                </button>
              </div>
              <small id="appointmentTimeHelp" className="form-hint">
                Please select your preferred appointment time.
              </small>
            </div>

            {/* Message Field */}
            <div className="form-group full-width">
              <label className="form-label" htmlFor="message">
                Message
              </label>
              <div className="input-wrapper">
                <textarea
                  id="message"
                  name="message"
                  placeholder="YOUR MESSAGE"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows={4}
                />
              </div>
            </div>

            {errorMsg && (
              <p className="form-error" role="alert">
                {errorMsg}
              </p>
            )}
            {successMsg && <p className="form-success">{successMsg}</p>}

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Booking..." : "Book Appointment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
