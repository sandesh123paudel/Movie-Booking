import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  dummyCastsData,
  dummyDateTimeData,
  dummyShowsData,
} from "../assets/assets";
import BlurCircle from "../components/BlurCircle";
import { Heart, PlayCircle, StarIcon, TicketIcon } from "lucide-react";
import timeformat from "../lib/timeformat";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getShow = async () => {
    const show = dummyShowsData.find((show) => show._id === id);
    setShow({
      movie: show,
      dateTime: dummyDateTimeData,
    });
  };

  useEffect(() => {
    getShow();
  }, [id]);

  return show ? (
    <div className="px-6 md:px-16 lg:px-40 pt-30 md:pt-50 ">
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        <img
          src={show.movie.poster_path}
          alt="Movie Banner"
          className="max-md:mx-auto rounded-xl h-104 max-w-70 object-cover"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/400x600?text=No+Image+Available";
          }}
        />
        <div className="relative flex flex-col gap-3">
          <BlurCircle top="-100px" left="-100px" />
          <p className="text-primary">ENGLISH</p>
          <h1 className="text-4xl font-semibold max--w-96 text-balance">
            {show.movie.title}
          </h1>
          <div className="flex items-center gap-2 text-gray-300">
            <StarIcon className="w-5 h-5 text-primary fill-primary" />
            <span>{show.movie.vote_average.toFixed(1)}/10</span>
          </div>
          <p className="text-gray-400 mt-4 text-sm leading-tight max-w-xl">
            {show.movie.overview}
          </p>
          <p className="">
            {timeformat(show.movie.runtime)} ·{" "}
            {show.movie.genres.map((genre) => genre.name).join(", ")} ·{" "}
            {show.movie.release_date.split(" ")[0]}
          </p>

          <div className="flex items-center flex-wrap gap-4 mt-4">
            <button className="flex items-center gap-2 px-7 py-3 rounded-md bg-gray-800 hover:bg-gray-700 transition-all duration-300 cursor-pointer font-medium">
              <PlayCircle className="w-5 h-5" />
              Watch Trailer
            </button>
            <a
              href="#dateSelect"
              className="flex items-center gap-2 px-7 py-3 rounded-md bg-primary hover:bg-primary-dull transition-all duration-300 cursor-pointer font-medium"
            >
              <TicketIcon className="w-5 h-5" />
              Buy Tickets
            </a>
            <button className="flex items-center gap-2 px-3 py-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-all duration-300 cursor-pointer font-medium">
              <Heart className={`w-5 h-5`} />
            </button>
          </div>
        </div>
      </div>

      <p className="text-lg font-semibold mt-20">Your Favorite Cast</p>
      <div className="flex gap-4 mt-4 no-scrollbar scroll-smooth overflow-x-auto ">
        {show.movie.casts.slice(0, 11).map((cast, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 flex flex-col gap-2 items-center min-w-[90px] cursor-pointer "
          >
            <img
              src={cast.profile_path}
              alt="cast"
              className="md:h-20 md:w-20 h-20 w-20 rounded-full object-cover"
            />
            <p className="text-xs font-medium text-center">{cast.name}</p>
          </div>
        ))}
      </div>
    </div>
  ) : null;
};

export default MovieDetails;
