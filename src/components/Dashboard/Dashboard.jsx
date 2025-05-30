import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../Firebase/firebase";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Dashboard.css";

import emailjs from "@emailjs/browser";

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loadingIds, setLoadingIds] = useState([]); // track processing appointment ids

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const q = query(
          collection(db, "appointments"),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Clear time for accurate comparison

        const filteredAppointments = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((appointment) => {
            const appointmentDate = new Date(appointment.appointmentDate);
            appointmentDate.setHours(0, 0, 0, 0); // Normalize to midnight
            return appointmentDate >= today;
          });

        setAppointments(filteredAppointments);
      } catch (error) {
        alert("Failed to fetch appointments: " + error.message);
      }
    };

    fetchAppointments();
  }, []);

  const toggleCalendar = () => {
    setCalendarVisible(!calendarVisible);
  };

  // Format date as dd-mm-yyyy (date can be string or Date object)
  const formatDate = (date) => {
    // If date is string, parse carefully (assumes "YYYY-MM-DD")
    const d =
      typeof date === "string"
        ? new Date(date + "T00:00:00") // avoid timezone shift by forcing time
        : new Date(date);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const sendEmail = async (appointment, status) => {
    const templateParams = {
      to_name: `${appointment.firstName} ${appointment.lastName}`,
      to_email: appointment.email,
      appointment_date: formatDate(appointment.appointmentDate),
      appointment_time: appointment.appointmentTime,
      status: status === "accepted" ? "confirmed" : "rejected",
      isAccepted: status === "accepted",
    };

    try {
      const result = await emailjs.send(
        "service_y02jui7",
        "template_pnlrwqv",
        templateParams,
        "EmAXdfJQhewYq30UY"
      );
      console.log("Email successfully sent!", result.text);
    } catch (error) {
      console.error("Failed to send email:", error.text || error.message);
      alert(`Failed to send ${status} email to ${appointment.email}`);
    }
  };

  const handleAccept = async (id) => {
    if (loadingIds.includes(id)) return; // prevent duplicate clicks
    setLoadingIds((prev) => [...prev, id]);

    try {
      const appointmentRef = doc(db, "appointments", id);
      await updateDoc(appointmentRef, { status: "accepted" });
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "accepted" } : a))
      );

      const acceptedAppointment = appointments.find((a) => a.id === id);
      if (acceptedAppointment) {
        await sendEmail(acceptedAppointment, "accepted");
      }
    } catch (error) {
      alert("Failed to accept appointment: " + error.message);
    } finally {
      setLoadingIds((prev) => prev.filter((loadingId) => loadingId !== id));
    }
  };

  const handleReject = async (id) => {
    if (loadingIds.includes(id)) return; // prevent duplicate clicks
    setLoadingIds((prev) => [...prev, id]);

    try {
      const rejectedAppointment = appointments.find((a) => a.id === id);
      const appointmentRef = doc(db, "appointments", id);
      await deleteDoc(appointmentRef);
      setAppointments((prev) => prev.filter((a) => a.id !== id));

      if (rejectedAppointment) {
        await sendEmail(rejectedAppointment, "rejected");
      }

      alert(
        `Appointment for ${rejectedAppointment.email} has been rejected and removed.`
      );
    } catch (error) {
      alert("Failed to reject appointment: " + error.message);
    } finally {
      setLoadingIds((prev) => prev.filter((loadingId) => loadingId !== id));
    }
  };

  const appointmentsOnSelectedDate = selectedDate
    ? appointments.filter(
        (a) => formatDate(a.appointmentDate) === formatDate(selectedDate)
      )
    : [];

  const renderAppointmentCard = (item) => {
    const isLoading = loadingIds.includes(item.id);
    const isPending = !item.status || item.status === "pending";

    return (
      <div key={item.id} className="appointment-card">
        <p>
          <strong>Name:</strong> {item.firstName} {item.lastName}
        </p>
        <p>
          <strong>Date:</strong> {formatDate(item.appointmentDate)}
        </p>
        <p>
          <strong>Time:</strong> {item.appointmentTime}
        </p>
        <p>
          <strong>Email:</strong> {item.email}
        </p>
        <p>
          <strong>Phone:</strong> {item.phone}
        </p>
        <p>
          <strong>Message:</strong> {item.message}
        </p>
        <p>
          <strong>Status:</strong> {item.status || "pending"}
        </p>

        {isPending && (
          <div className="appointment-actions">
            <button
              className="accept-btn"
              onClick={() => handleAccept(item.id)}
              disabled={isLoading}
              aria-label={`Accept appointment for ${item.firstName} ${item.lastName}`}
            >
              {isLoading ? "Processing..." : "Accept"}
            </button>
            <button
              className="reject-btn"
              onClick={() => handleReject(item.id)}
              disabled={isLoading}
              aria-label={`Reject appointment for ${item.firstName} ${item.lastName}`}
            >
              {isLoading ? "Processing..." : "Reject"}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="dashboard-wrapper">
      <div className="appointments-container">
        <div className="appointments-header">
          <h2 className="appointments-title">📅 Booked Appointments</h2>
          <button className="calendar-toggle-btn" onClick={toggleCalendar}>
            {calendarVisible ? "Hide Calendar" : "Show Calendar"}
          </button>
        </div>

        {calendarVisible && (
          <div className="calendar-section">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileContent={({ date, view }) => {
                if (view === "month") {
                  const formatted = formatDate(date);
                  const hasAppointment = appointments.some(
                    (a) => formatDate(a.appointmentDate) === formatted
                  );
                  return hasAppointment ? <div className="dot" /> : null;
                }
              }}
            />
            {selectedDate && (
              <div className="selected-date-appointments">
                <h3>
                  Appointments on <strong>{formatDate(selectedDate)}</strong>
                </h3>
                {appointmentsOnSelectedDate.length > 0 ? (
                  appointmentsOnSelectedDate.map(renderAppointmentCard)
                ) : (
                  <p>No appointments on this date.</p>
                )}
              </div>
            )}
          </div>
        )}

        {!calendarVisible && appointments.map(renderAppointmentCard)}
      </div>
    </div>
  );
}
