// import React, { useState } from "react";
// import Header from "./components/Header/Header";
// import Homepage from "./components/HomePage/HomePage";
// import Portfolio from "./components/Portfolio/Portfolio";
// import About from "./components/About/About";
// import Contact from "./components/Contact/Contact";
// import Footer from "./components/Footer/Footer";

// const App = () => {
//   const [activeTab, setActiveTab] = useState("Home");

//   const renderPage = () => {
//     switch (activeTab) {
//       case "Home":
//         return <Homepage setActiveTab={setActiveTab} />;
//       case "About Me":
//         return <About />;
//       case "Portfolio":
//         return <Portfolio />;
//       case "Contact Me":
//         return <Contact />;
//       default:
//         return <Homepage setActiveTab={setActiveTab} />;
//     }
//   };
//   return (
//     <>
//       <Header activeTab={activeTab} setActiveTab={setActiveTab} />
//       <div className="main-content">{renderPage()}</div>
//       <Footer />
//     </>
//   );
// };

// export default App;

// import React, { useState } from "react";
// import SignUpPage from "../src/components/Signup/Signuppage";
// import HomePage from "../src/components/HomePage/HomePage";

// function App() {
//   const [showSignUp, setShowSignUp] = useState(true);

//   return (
//     <div>
//       {showSignUp ? (
//         <SignUpPage onSignUpComplete={() => setShowSignUp(false)} />
//       ) : (
//         <HomePage />
//       )}
//     </div>
//   );
// }

// export default App;
// import React, { useState } from "react";
// import LoginPage from "../src/components/Login/Login";
// import HomePage from "../src/components/HomePage/HomePage";

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   return (
//     <div>
//       {isLoggedIn ? (
//         <HomePage />
//       ) : (
//         <LoginPage onLogin={() => setIsLoggedIn(true)} />
//       )}
//     </div>
//   );
// }

// export default App;


import React, { useState, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from './components/Login/Login';
import Signup from './components/Signup/Signuppage';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import HomePage from './components/HomePage/HomePage';
import Portfolio from './components/Portfolio/Portfolio';
import ForgetPassword from './components/ForgetPassword/ForgetPassword';


import ProtectedRoute from './components/ProtectedRoute';
import { AuthContext } from './components/AuthContext';  // Import your AuthContext

function App() {
  const [activeTab, setActiveTab] = useState("Home");
  const { currentUser } = useContext(AuthContext);  // Get real user from AuthContext

  return (
    <Router>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="main-content">
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public routes */}
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute isAuthenticated={!!currentUser}>
                <HomePage setActiveTab={setActiveTab} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/portfolio" 
            element={
              <ProtectedRoute isAuthenticated={!!currentUser}>
                <Portfolio />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/about" 
            element={
              <ProtectedRoute isAuthenticated={!!currentUser}>
                <About />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/contact" 
            element={
              <ProtectedRoute isAuthenticated={!!currentUser}>
                <Contact />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>

      <Footer />
    </Router>
  );
}

export default App;


