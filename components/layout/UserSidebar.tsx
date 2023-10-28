"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const UserSidebar = () => {

  const pathname = usePathname();

  const menuItem = [
    {
      name: "Update Profile",
      url: "/me/update",
      icon: "fas fa-user",
    },
    {
      name: "Upload Avatar",
      url: "/me/upload_avatar",
      icon: "fas fa-user-circle",
    },
    {
      name: "Update Password",
      url: "/me/update_password",
      icon: "fas fa-lock",
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
            activeMenuItem === x.url ? "active" : ""
          }`}
          onClick={() => handleMenuItemClick(x.url)}
          aria-current={activeMenuItem === x.url ? "true" : "false"}
        >
          <i className={`${x.icon} fa-fw pe-2`}></i>
          {x.name}
        </Link>
      ))}
    </div>
  );
};
export default UserSidebar;
