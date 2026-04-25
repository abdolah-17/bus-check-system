import React from "react";

function Seat({ seat, restStarted, onClick, isActive, onSelectGender }) {
  if (!seat) return <div className="seat-placeholder" />;

  return (
    <div className="seat-cell">
      <div
        className={`seat-box ${seat.gender || ""} ${seat.checked ? "checked" : ""} ${!restStarted ? "disabled-seat" : ""} ${isActive ? "seat-active" : ""}`}
        onClick={onClick}
      >
        <div className="seat-content">
          <span className="seat-number">{seat.seatNumber}</span>
          {seat.gender === "male" && <span className="gender-icon">👨</span>}
          {seat.gender === "female" && <span className="gender-icon">👩</span>}
        </div>
      </div>

      {/* Inline gender picker - appears right on the seat */}
      {isActive && onSelectGender && (
        <div className="seat-gender-picker">
          <button
            className="seat-gender-btn male"
            onClick={(e) => { e.stopPropagation(); onSelectGender("male"); }}
            title="رجل"
          >
            👨
          </button>
          <button
            className="seat-gender-btn female"
            onClick={(e) => { e.stopPropagation(); onSelectGender("female"); }}
            title="امرأة"
          >
            👩
          </button>
        </div>
      )}
    </div>
  );
}

export default Seat;