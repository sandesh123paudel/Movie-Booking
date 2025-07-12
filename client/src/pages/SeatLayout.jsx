import React, { useState } from "react";
import { useParams } from "react-router-dom";

const SeatLayout = () => {
  const { id, date } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Mock data for seats - in real app, this would come from API
  const ROWS = ["A", "B", "C", "D", "E", "F", "G"];
  const SEATS_PER_ROW = 12;
  const PREMIUM_ROWS = ["A", "B"]; // First two rows are premium

  // Mock booked seats - in real app, this would come from API
  const bookedSeats = ["A1", "B5", "C7", "D3"];

  const isSeatBooked = (seatId) => bookedSeats.includes(seatId);
  const isSeatSelected = (seatId) => selectedSeats.includes(seatId);
  const isPremiumSeat = (row) => PREMIUM_ROWS.includes(row);

  const handleSeatClick = (seatId) => {
    if (isSeatBooked(seatId)) return;

    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((id) => id !== seatId);
      }
      return [...prev, seatId];
    });
  };

  const getSeatColor = (row, seatId) => {
    if (isSeatBooked(seatId)) return "bg-gray-500"; // Booked seats
    if (isSeatSelected(seatId)) return "bg-primary"; // Selected seats using theme color
    return isPremiumSeat(row) ? "bg-amber-500" : "bg-blue-500"; // Premium vs Standard seats
  };

  return (
    <div className="min-h-screen py-10 px-4 mt-16">
      <div className="max-w-6xl mx-auto">
        {/* Screen */}
        <div className="w-full mb-16">
          <div className="h-2 bg-gray-300 rounded-lg w-4/5 mx-auto mb-4"></div>
          <p className="text-center text-gray-400">SCREEN</p>
        </div>

        {/* Seat Layout */}
        <div className="max-w-4xl mx-auto">
          {ROWS.map((row) => (
            <div key={row} className="flex items-center gap-2 mb-4">
              {/* Row Label */}
              <div className="w-8 text-center">{row}</div>

              {/* Seats */}
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: SEATS_PER_ROW }, (_, index) => {
                  const seatNumber = index + 1;
                  const seatId = `${row}${seatNumber}`;

                  
                  return (
                    <button
                      key={seatId}
                      onClick={() => handleSeatClick(seatId)}
                      disabled={isSeatBooked(seatId)}
                      className={`
                        w-8 h-8 rounded-t-lg
                        ${getSeatColor(row, seatId)}
                        transition-colors duration-200
                        disabled:cursor-not-allowed
                        hover:opacity-80
                      `}
                      title={`${row}${seatNumber}`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-12 flex justify-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded-t-lg"></div>
            <span>Standard</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-amber-500 rounded-t-lg"></div>
            <span>Premium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-t-lg"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-500 rounded-t-lg"></div>
            <span>Booked</span>
          </div>
        </div>

        {/* Selected Seats Summary */}
        {selectedSeats.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-lg">
              Selected Seats: {selectedSeats.sort().join(", ")}
            </p>
            <button
              className="mt-4 bg-primary hover:bg-primary-dull px-8 py-2 rounded-lg transition-colors duration-200"
              onClick={() => {
                // Handle booking - in real app, this would call an API
                console.log("Booking seats:", selectedSeats);
              }}
            >
              Book Tickets
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatLayout;
