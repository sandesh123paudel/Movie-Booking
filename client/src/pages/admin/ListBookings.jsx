import React, { useState } from "react";
import Loading from "../../components/Loading";
import { dateFormat } from "../../lib/dateFormat";
import Title from "../../components/admin/Title";

const ListBookings = () => {
  const [isLoading, setIsLoading] = useState(false);
  return !isLoading ? (
    <>
      <Title text1="List" text2="Bookings" />
      <div className="max-w-4xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-primary/20 text-left text-white">
              <th className="p-2 font-medium pl-5">User Name</th>
              <th className="p-2 font-medium">Movie Name</th>
              <th className="p-2 font-medium">Show Time</th>
              <th className="p-2 font-medium">Seats</th>
              <th className="p-2 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light"></tbody>
        </table>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default ListBookings;
