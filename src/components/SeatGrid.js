import React from "react";
import Seat from "./Seat";

const SeatGrid = ({ seats, busLayout, restStarted, onSeatClick, activeSeat, onSelectGender }) => {
  const isType2plus1 = busLayout === "2+1";
  const seatsPerRow = isType2plus1 ? 3 : 4;

  const renderSeat = (seatData) => {
    if (!seatData) return <Seat seat={null} restStarted={restStarted} />;
    return (
      <Seat
        key={seatData.id}
        seat={seatData}
        restStarted={restStarted}
        onClick={() => onSeatClick(seatData.id)}
        isActive={activeSeat === seatData.id}
        onSelectGender={onSelectGender}
      />
    );
  };

  const renderGrid = () => {
    const columns = [];
    for (let i = 0; i < seats.length; i += seatsPerRow) {
      const colSeats = seats.slice(i, i + seatsPerRow);
      
      columns.push(
        <div key={i} className="bus-column">
          {isType2plus1 ? (
            <>
              <div className="top-seats">
                {renderSeat(colSeats[0])}
                {renderSeat(colSeats[1])}
              </div>
              <div className="bus-aisle"></div>
              <div className="bottom-seats">
                {renderSeat(colSeats[2])}
              </div>
            </>
          ) : (
            <>
              <div className="top-seats">
                {renderSeat(colSeats[0])}
                {renderSeat(colSeats[1])}
              </div>
              <div className="bus-aisle"></div>
              <div className="bottom-seats">
                {renderSeat(colSeats[2])}
                {renderSeat(colSeats[3])}
              </div>
            </>
          )}
        </div>
      );
    }
    return columns;
  };

  return <div className="seats-grid-horizontal">{renderGrid()}</div>;
};

export default SeatGrid;