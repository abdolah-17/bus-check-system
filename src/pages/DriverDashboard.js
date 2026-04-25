import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/driverDashboard.css";

function DriverDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [driverData, setDriverData] = useState({
    totalPassengers: 0,
    returnedCount: 0,
    restStarted: false,
    departureSignal: false,
  });

  useEffect(() => {
    // Initial load
    const loadData = () => {
      const dataStr = localStorage.getItem("driverDashboardData");
      if (dataStr) {
        setDriverData(JSON.parse(dataStr));
      }
    };
    loadData();

    // Listen for storage changes from the supervisor's tab
    const handleStorageChange = (e) => {
      if (e.key === "driverDashboardData" && e.newValue) {
        setDriverData(JSON.parse(e.newValue));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Fallback polling for same-tab/same-window testing if storage event is unreliable
    const interval = setInterval(loadData, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Handle 15s timeout for departure signal
  useEffect(() => {
    if (driverData.departureSignal) {
      const timer = setTimeout(() => {
        // Reset the signal in localStorage after 15 seconds
        const currentData = JSON.parse(localStorage.getItem("driverDashboardData") || "{}");
        const updatedData = { ...currentData, departureSignal: false, restStarted: false };
        localStorage.setItem("driverDashboardData", JSON.stringify(updatedData));
        localStorage.setItem("departureSignal", "false");
        localStorage.setItem("restStarted", "false");
        
        setDriverData(prev => ({ ...prev, departureSignal: false, restStarted: false }));
      }, 15000);

      return () => clearTimeout(timer);
    }
  }, [driverData.departureSignal]);

  const { totalPassengers, returnedCount, restStarted, departureSignal } = driverData;
  const isComplete = totalPassengers > 0 && returnedCount === totalPassengers;

  let statusClass = "status-idle";
  let statusText = "وضع القيادة - رحلة سعيدة";
  let statusIcon;

  if (departureSignal) {
    statusClass = "status-depart";
    statusText = "اكتمل العدد - تفضل بالانطلاق";
    statusIcon = (
      <svg className="bus-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 6v6M16 6v6M2 9h20M2 15h20M4 9v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9M4 6h16a2 2 0 0 1 2 2v1H2V8a2 2 0 0 1 2-2z"/>
        <circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>
      </svg>
    );
  } else if (restStarted) {
    if (isComplete) {
      statusClass = "status-ready";
      statusText = "الركاب مكتملون - بانتظار إشارة المشرف";
      statusIcon = "✅";
    } else {
      statusClass = "status-waiting";
      statusText = "وقت استراحة - جاري تفقد الركاب";
      statusIcon = "⏳";
    }
  } else {
    // Default Driving Mode
    statusIcon = (
      <div className="steering-wheel-container">
        <svg className="steering-wheel-svg" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" className="wheel-rim" />
          <circle cx="50" cy="50" r="40" className="wheel-inner-rim" />
          <rect x="47" y="10" width="6" height="35" rx="2" className="wheel-spoke" />
          <rect x="47" y="55" width="6" height="35" rx="2" className="wheel-spoke" />
          <rect x="10" y="47" width="35" height="6" rx="2" className="wheel-spoke" />
          <rect x="55" y="47" width="35" height="6" rx="2" className="wheel-spoke" />
          <circle cx="50" cy="50" r="10" className="wheel-center" />
          <circle cx="50" cy="50" r="4" fill="white" opacity="0.3" />
        </svg>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className={`driver-dashboard ${statusClass}`} dir="rtl">
      <div className="driver-card glass-effect">
        <div className="driver-header">
          <h1>شاشة السائق</h1>
          <div className="pulsing-dot"></div>
        </div>
        
        <div className="driver-status-area">
          <div className="status-icon">{statusIcon}</div>
          <h2 className="status-text">{statusText}</h2>
        </div>

        <div className="driver-stats-area">
          <div className="stat-box">
            <span className="stat-label">إجمالي الركاب</span>
            <span className="stat-value total">{totalPassengers}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">تم تفقدهم</span>
            <span className="stat-value returned">{returnedCount}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">المتبقي</span>
            <span className="stat-value remaining">{Math.max(0, totalPassengers - returnedCount)}</span>
          </div>
        </div>
        
        <div className="progress-container">
          <div 
            className="progress-bar" 
            style={{ width: `${totalPassengers ? (returnedCount / totalPassengers) * 100 : 0}%` }}
          ></div>
        </div>

        <button className="driver-logout-btn" onClick={handleLogout}>
          🚪 تسجيل الخروج من النظام
        </button>
      </div>
    </div>
  );
}

export default DriverDashboard;
