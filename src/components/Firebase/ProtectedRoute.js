import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

function ProtectedRoute({ isAuthenticated, children }) {
  const { loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="loading-screen" style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0e0e10",
        color: "#fff",
        fontSize: "1.5rem"
      }}>
        Checking authentication...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
