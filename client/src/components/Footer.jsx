import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  const links = [
    {
      id: 1,
      to: "/",
      icon: assets.facebook_icon,
    },
    {
      id: 2,
      to: "https://x.com/lugacityTech",
      icon: assets.twitter_icon,
    },
    {
      id: 3,
      to: "/",
      icon: assets.instagram_icon,
    },
  ];

  return (
    <div className="flex items-center justify-between gap-4 py-3 mt-20">
      <img src={assets.logo} width={90} alt="" />
      <div>
        <p className="flex-1  p-4 text-sm text-gray-500 max-sm:hidden">
          Copyright @{" "}
          <a className="text-blue-600 italic" href="https://lugacity.xyz">
            Lugacity.xyz
          </a>{" "}
          | All right reserved.
        </p>
      </div>

      <div className="flex gap-2.5">
        {links.map((link) => (
          <Link
            key={link.id}
            to={link.to}
            target={link.to.startsWith("http") ? "_blank" : "_self"}
          >
            <img src={link.icon} alt="" width={35} />

            {/* i develop an app with an ai generate text-2-image both frontend and backend using nodejs, expressjs, reactjs and..., write a content over that for me, i want to post on linkedln of my project */}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Footer;
