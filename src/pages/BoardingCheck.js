import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SeatGrid from "../components/SeatGrid";
import "../styles/boardingCheck.css";

function BoardingCheck() {
  const location = useLocation();
  const navigate = useNavigate();

  const savedTripData = localStorage.getItem("tripData");
  const tripData =
    location.state || (savedTripData ? JSON.parse(savedTripData) : null);

  const generateSeats = () => {
    if (!tripData) return [];
    return Array.from({ length: tripData.seatCount }, (_, index) => ({
      id: index + 1,
      seatNumber: index + 1,
      checked: false,
    }));
  };

  const [seats, setSeats] = useState(() => {
    const savedSeats = localStorage.getItem("tripSeats");
    return savedSeats ? JSON.parse(savedSeats) : generateSeats();
  });

  const [restStarted, setRestStarted] = useState(() => {
    const savedRestState = localStorage.getItem("restStarted");
    return savedRestState ? JSON.parse(savedRestState) : false;
  });

  const [departureSignal, setDepartureSignal] = useState(() => {
    const savedSignal = localStorage.getItem("departureSignal");
    return savedSignal ? JSON.parse(savedSignal) : false;
  });

  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  useEffect(() => {
    if (!tripData) navigate("/create-trip");
  }, [tripData, navigate]);

  useEffect(() => {
    localStorage.setItem("tripSeats", JSON.stringify(seats));
  }, [seats]);

  useEffect(() => {
    localStorage.setItem("restStarted", JSON.stringify(restStarted));
  }, [restStarted]);

  useEffect(() => {
    localStorage.setItem("departureSignal", JSON.stringify(departureSignal));
  }, [departureSignal]);

  const handleSeatClick = (seatId) => {
    if (!restStarted) return;
    const updatedSeats = seats.map((seat) => {
      if (seat.id === seatId) return { ...seat, checked: !seat.checked };
      return seat;
    });
    setSeats(updatedSeats);
  };

  const handleStartRest = () => {
    const initializedSeats = seats.map((seat) => ({ ...seat, checked: false }));
    setSeats(initializedSeats);
    setRestStarted(true);
    setIsMapModalOpen(true); // Auto-open map when rest starts
  };

  const handleFinishCheck = () => {
    if (window.confirm("هل أنت متأكد من إنهاء الرحلة تماماً؟ سيتم مسح كافة البيانات من هذا الجهاز.")) {
      setRestStarted(false);
      setDepartureSignal(false);
      localStorage.removeItem("tripData");
      localStorage.removeItem("tripSeats");
      localStorage.removeItem("restStarted");
      localStorage.removeItem("departureSignal");
      localStorage.removeItem("driverDashboardData");
      alert("تم إنهاء الرحلة بنجاح وتطهير بيانات الجهاز.");
      navigate("/");
    }
  };
  const handleResetCheck = () => {
    const resetSeats = seats.map((seat) => ({ ...seat, checked: false }));
    setSeats(resetSeats);
    setRestStarted(false);
    setDepartureSignal(false);
  };

  const totalPassengers = seats.filter((seat) => seat.gender !== null).length;
  const returnedCount = seats.filter((seat) => seat.checked).length;
  const remainingCount = totalPassengers - returnedCount;

  // Sync data to Driver Dashboard
  useEffect(() => {
    const data = {
      totalPassengers,
      returnedCount,
      restStarted,
      departureSignal
    };
    localStorage.setItem("driverDashboardData", JSON.stringify(data));
  }, [totalPassengers, returnedCount, restStarted, departureSignal]);

  if (!tripData) return null;

  return (
    <div className="page-container boarding-page" dir="rtl">
      <div className="boarding-container">
        {/* Header Info */}
        <div className="glass-card trip-info-card">
          <div className="trip-info-item">
            <span className="info-label">رقم الرحلة</span>
            <span className="info-value">#{tripData.tripNumber}</span>
          </div>
          <div className="trip-info-item">
            <span className="info-label">المشرف</span>
            <span className="info-value">{tripData.supervisorName}</span>
          </div>
          <div className="trip-info-item">
            <span className="info-label">الركاب</span>
            <span className="info-value">{totalPassengers} راكب</span>
          </div>
        </div>

        {/* Main Control Card */}
        <div className="glass-card rest-control-card">
          <div className="rest-status-area">
            <div className={`status-pill ${restStarted ? "active" : "inactive"}`}>
              {restStarted ? "حالة التفقد: نشط الآن" : "حالة التفقد: متوقف"}
            </div>
            <div className="big-stats-display">
              <div className="stat-item">
                <span className="stat-val">{returnedCount}</span>
                <span className="stat-lbl">تم تفقدهم</span>
              </div>
              <div className="stat-divider">من</div>
              <div className="stat-item">
                <span className="stat-val">{totalPassengers}</span>
                <span className="stat-lbl">الإجمالي</span>
              </div>
            </div>
          </div>

          <div className="action-buttons-area">
            {!restStarted ? (
              <div className="btn-group-vertical">
                <button className="btn btn-primary start" onClick={handleStartRest}>
                  بدأ عملية التفقد والنزول
                </button>
                <button className="btn btn-secondary" style={{marginTop: '10px'}} onClick={() => window.open('/driver-dashboard', '_blank')}>
                  🖥️ فتح شاشة السائق
                </button>
              </div>
            ) : (
              <div className="btn-group-vertical">
                {totalPassengers > 0 && returnedCount === totalPassengers && !departureSignal && (
                  <button className="btn btn-success" style={{marginBottom: '15px', padding: '15px', fontSize: '1.1rem', animation: 'pulse-bg 2s infinite'}} onClick={() => setDepartureSignal(true)}>
                    🚦 إعطاء إشارة الانطلاق للسائق
                  </button>
                )}
                {departureSignal && (
                  <div className="status-pill active" style={{backgroundColor: 'var(--success-color)', marginBottom: '15px'}}>
                    ✅ تم إرسال إشارة الانطلاق للسائق
                  </div>
                )}
                <button className="btn btn-primary open-map" onClick={() => setIsMapModalOpen(true)}>
                  📂 فتح خريطة الباص للتفقد
                </button>
                <button className="btn btn-secondary" onClick={() => window.open('/driver-dashboard', '_blank')}>
                  🖥️ فتح شاشة السائق
                </button>
                <div className="sub-actions">
                  <button className="btn btn-danger finish" onClick={handleFinishCheck}>إنهاء</button>
                  <button className="btn btn-secondary reset" onClick={handleResetCheck}>إعادة ضبط</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Map Modal */}
        {isMapModalOpen && (
          <div className="map-popup-overlay">
            <div className="map-popup-content glass-effect">
              <button className="modal-close close-popup-floating" onClick={() => setIsMapModalOpen(false)}>✕</button>

              <div className="popup-body">
                <div className="bus-wrapper horizontal-bus">
                  <div className="bus-shell">
                    <div className="bus-front">
                      <div className="steering-wheel"><div className="steering-inner"></div></div>
                      <div className="driver-seat">السائق</div>
                      <div className="bus-door">🚪</div>
                    </div>
                    <div className="bus-layout">
                      <SeatGrid
                        seats={seats}
                        busLayout={tripData.busLayout}
                        restStarted={restStarted}
                        onSeatClick={handleSeatClick}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="popup-footer-v2">
                <div className="footer-stats">
                  <span>تم تفقد <span className="highlight">{returnedCount}</span> من أصل <span className="highlight">{totalPassengers}</span></span>
                </div>
                <button className="btn btn-primary" style={{width: 'auto', borderRadius: '30px', padding: '15px 50px'}} onClick={() => setIsMapModalOpen(false)}>
                  تأكيد وحفظ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BoardingCheck;