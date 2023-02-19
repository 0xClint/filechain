import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../assets";
import ConnectWallet from "./ConnectWallet";

const Header = () => {
  return (
    <div className="h-[75px] flex py-10 px-5 items-center justify-between">
      <div className="flex items-center gap-10">
        <Link
          to="/"
          className="logo w-[55px] h-[55px] bg-white rounded-[50%] text-[#646D8A] mr-10 flex justify-center items-center"
        >
          <Logo className="w-26 h-26" />
        </Link>

        <div className="midItems list-none  gap-16 text-white text-[1.1rem] flex">
          <li className="cursor-pointer">
            <Link to="/">Home</Link>
          </li>

          <li className="cursor-pointer">
            <Link to="/start">App Menu</Link>
          </li>
          <li className="cursor-pointer">
            <Link to="/commits">Commits</Link>
          </li>
        </div>
      </div>
      <div>
        <ConnectWallet />
      </div>
    </div>
  );
};

export default Header;
