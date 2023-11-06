"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const AdminSidebar = () => {
  const pathname = usePathname();

  const menuItem = [
    {
      name: "Dashboard",
      url: "/admin/dashboard",
      icon: "fas fa-tachometer-alt",
    },
    {
      name: "Rooms",
      url: "/admin/rooms",
      icon: "fas fa-hotel",
    },
    {
      name: "Bookings",
      url: "/admin/bookings",
      icon: "fas fa-receipt",
    },
    {
      name: "Users",
      url: "/admin/users",
      icon: "fas fa-user",
    },
    {
      name: "Reviews",
      url: "/admin/reviews",
      icon: "fas fa-star",
    },
  ];

  const [activeMenuItem, setActiveMenuItem] = useState(pathname);

  const handleMenuItemClick = (menuItem: string) => {
    setActiveMenuItem(menuItem);
  };

  return (
    <div className='list-group mt-5 pl-4'>
      {menuItem.map((x, index) => (
        <Link
          key={index}
          href={x.url}
          className={`fw-bold list-group-item list-group-item-action ${
            activeMenuItem.includes(x.url) ? "active" : ""
          }`}
          onClick={() => handleMenuItemClick(x.url)}
          aria-current={activeMenuItem.includes(x.url) ? "true" : "false"}
        >
          <i className={`${x.icon} fa-fw pe-2`}></i>
          {x.name}
        </Link>
      ))}
    </div>
  );
};
export default AdminSidebar;
