import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../Firebase/firebase";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Dashboard.css";

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      const q = query(
        collection(db, "appointments"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      setAppointments(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };
    fetchAppointments();
  }, []);

  const toggleCalendar = () => {
    setCalendarVisible(!calendarVisible);
  };

  // Format Date to dd-mm-yy
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  };

  const getTileContent = ({ date, view }) => {
    if (view === "month") {
      const formatted = formatDate(date);
      const hasAppointment = appointments.some(
        (a) => formatDate(a.appointmentDate) === formatted
      );
      return hasAppointment ? <div className="dot" /> : null;
    }
  };

  const appointmentsOnSelectedDate = selectedDate
    ? appointments.filter(
        (a) => formatDate(a.appointmentDate) === formatDate(selectedDate)
      )
    : [];

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
              tileContent={getTileContent}
            />
            {selectedDate && (
              <div className="selected-date-appointments">
                <h3>
                  Appointments on <strong>{formatDate(selectedDate)}</strong>
                </h3>
                {appointmentsOnSelectedDate.length > 0 ? (
                  appointmentsOnSelectedDate.map((item) => (
                    <div key={item.id} className="appointment-card">
                      <p>
                        <strong>Name:</strong> {item.firstName} {item.lastName}
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
                    </div>
                  ))
                ) : (
                  <p>No appointments on this date.</p>
                )}
              </div>
            )}
          </div>
        )}

        {!calendarVisible &&
          appointments.map((item) => (
            <div key={item.id} className="appointment-card">
              <p>
                <strong>Name:</strong> {item.firstName} {item.lastName}
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
            </div>
          ))}
      </div>
    </div>
  );
}
