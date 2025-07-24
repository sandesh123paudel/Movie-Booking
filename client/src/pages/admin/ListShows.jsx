import React, { useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";

const ListShows = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const [shows, setShows] = useState([]);

  const [loading, setLoading] = useState(false);

  return !loading ? (
    <>
      <Title text1="List" text2="Shows" />

      <div className="max-w-4xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-primary/20 text-left text-white">
              <th className="p-2 font-medium pl-5">Movie Name</th>
              <th className="p-2 font-medium">Show Time</th>
              <th className="p-2 font-medium">Total Bookings</th>
              <th className="p-2 font-medium">Earnings</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default ListShows;
