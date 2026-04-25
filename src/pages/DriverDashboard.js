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

  const { totalPassengers, returnedCount, restStarted, departureSignal } = driverData;
  const isComplete = totalPassengers > 0 && returnedCount === totalPassengers;

  let statusClass = "status-idle";
  let statusText = "وضع القيادة - رحلة سعيدة";
  let statusIcon = "☸️"; // رمز يشبه المقود

  if (departureSignal) {
    statusClass = "status-depart";
    statusText = "اكتمل العدد - تفضل بالانطلاق";
    statusIcon = "🚌";
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
