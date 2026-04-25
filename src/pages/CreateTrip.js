import React, { useState, useEffect } from "react";
import SeatGrid from "../components/SeatGrid";
import "../styles/createTrip.css";
import "../styles/boardingCheck.css";

function CreateTrip() {

  const [tripNumber, setTripNumber] = useState("");
  const [seatCount, setSeatCount] = useState(30);
  const [busLayout, setBusLayout] = useState("2+1");
  const [supervisorName, setSupervisorName] = useState("");
  const [seats, setSeats] = useState([]);
  
  const [showModal, setShowModal] = useState(false);
  const [activeSeat, setActiveSeat] = useState(null);

  useEffect(() => {
    const newSeats = Array.from({ length: seatCount }, (_, index) => ({
      id: index + 1,
      seatNumber: index + 1,
      gender: null,
      checked: false,
    }));
    setSeats(newSeats);
  }, [seatCount]);

  const handleOpenSelection = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleSeatClick = (seatId) => {
    setActiveSeat(activeSeat === seatId ? null : seatId);
  };

  const selectGender = (gender) => {
    const updatedSeats = seats.map((seat) => {
      if (seat.id === activeSeat) {
        return { ...seat, gender: gender };
      }
      return seat;
    });
    setSeats(updatedSeats);
    setActiveSeat(null);
  };

  const handleFinalSubmit = () => {
    const tripData = {
      tripNumber,
      seatCount: Number(seatCount),
      busLayout,
      supervisorName,
    };

    localStorage.setItem("tripData", JSON.stringify(tripData));
    localStorage.setItem("tripSeats", JSON.stringify(seats));
    localStorage.removeItem("restStarted");

    alert("تم حفظ الرحلة بنجاح! يمكن للمشرف الآن الدخول لتفقد الركاب.");
    setShowModal(false);
    
    setTripNumber("");
    setSupervisorName("");
  };

  const totalPassengers = seats.filter((s) => s.gender !== null).length;

  return (
    <div className="page-container create-trip-page" dir="rtl">
      <div className="glass-card central-card">
        <h1 className="create-trip-title">إنشاء رحلة جديدة</h1>
        <p className="create-trip-subtitle">أدخل بيانات الرحلة الأساسية للمتابعة</p>

        <form className="create-trip-form" onSubmit={handleOpenSelection}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">رقم الرحلة</label>
              <input
                className="form-input"
                type="text"
                value={tripNumber}
                onChange={(event) => setTripNumber(event.target.value)}
                placeholder="BUS-101"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">عدد المقاعد</label>
              <input
                className="form-input"
                type="number"
                value={seatCount}
                onChange={(event) => setSeatCount(Number(event.target.value))}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">توزيع المقاعد</label>
              <select className="form-input" value={busLayout} onChange={(event) => setBusLayout(event.target.value)}>
                <option value="2+1">درجة أولى (2+1)</option>
                <option value="2+2">درجة سياحية (2+2)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">اسم المشرف</label>
              <input
                className="form-input"
                type="text"
                value={supervisorName}
                onChange={(event) => setSupervisorName(event.target.value)}
                placeholder="اسم المشرف المسؤول"
                required
              />
            </div>
          </div>

          <button className="btn btn-primary" type="submit">تحديد ركاب الرحلة 🚌</button>
        </form>
      </div>

      {showModal && (
        <div className="map-popup-overlay create-trip-modal-overlay">
          <div className="map-popup-content glass-effect">
            <button className="close-popup-floating" onClick={() => { setShowModal(false); setActiveSeat(null); }}>✕</button>

            <div className="popup-body">
              <div className="modal-tip-bar">
                <p className="modal-tip">اضغط على المقعد لتحديد نوع الراكب (👨 رجل / 👩 امرأة)</p>
                <div className="passenger-counter-badge">
                  <span>الركاب المسجلين: <strong>{totalPassengers}</strong></span>
                </div>
              </div>

              <div className="bus-wrapper horizontal-bus">
                <div className="bus-shell">
                  <div className="bus-front">
                    <div className="steering-wheel">
                      <div className="steering-inner"></div>
                    </div>
                    <div className="driver-seat">السائق</div>
                  </div>
                  <div className="bus-layout">
                    <SeatGrid
                      seats={seats}
                      busLayout={busLayout}
                      restStarted={true}
                      onSeatClick={handleSeatClick}
                      activeSeat={activeSeat}
                      onSelectGender={selectGender}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="popup-footer-v2">
              <div className="footer-stats">
                <span>تم تسجيل <span className="highlight">{totalPassengers}</span> راكب</span>
              </div>
              <button className="btn btn-success" style={{width: 'auto', borderRadius: '30px', padding: '15px 50px'}} onClick={handleFinalSubmit}>
                تأكيد وحفظ الرحلة النهائية
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateTrip;