import React from "react";
import { assets } from "../../assets/assets";
import {
  LayoutDashboardIcon,
  ListCollapseIcon,
  ListIcon,
  PlusSquareIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  const user = {
    firstName: "Admin",
    lastName: "User",
    imageUrl: assets.profile,
  };
  const adminNavlinks = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboardIcon,
    },
    {
      name: "Add-Shows",
      path: "/admin/add-shows",
      icon: PlusSquareIcon,
    },
    {
      name: "List Shows",
      path: "/admin/list-shows",
      icon: ListIcon,
    },
    {
      name: "List Bookings",
      path: "/admin/list-bookings",
      icon: ListCollapseIcon,
    },
  ];
  return (
    <div className="h-[calc(100vh-64px)] flex flex-col items-center md:items-start pt-8 max-w-14 md:max-w-60 w-full border-r border-gray-300/20 text-sm">
      <img
        className="h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto md:mx-4"
        src={user.imageUrl}
        alt="sidebar"
      />

      <p className="mt-2 text-base max-md:hidden mx-4 text-center md:text-left">
        {user.firstName} {user.lastName}
      </p>

      <div className="w-full mt-4">
        {adminNavlinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            end
            className={({ isActive }) =>
              `group relative flex items-center max-md:justify-center md:justify-start gap-2 w-full py-2.5 px-4 first:mt-6 text-gray-400 hover:text-white ${
                isActive && "bg-primary/15 text-primary"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Icon */}
                <link.icon className="w-5 h-5" />

                {/* Text on md+, tooltip on hover for max-md */}
                <span className="hidden md:inline">{link.name}</span>

                {/* Tooltip on hover (only for max-md) */}
                <span className="absolute left-full ml-2 z-10 hidden max-md:group-hover:inline-block whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded shadow">
                  {link.name}
                </span>

                {/* Active indicator */}
                <span
                  className={`w-1.5 h-10 rounded-l right-0 absolute ${
                    isActive && "bg-primary"
                  }`}
                />
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;
