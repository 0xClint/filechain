import React from "react";
import { Github } from "../assets";

const Footer = () => {
  return (
    <div className="flex justify-center items-center gap-2 mb-5 text-[1.1rem]">
      <a href="https://github.com/Omkar0803/Clarity-hackathon" target="_blank">
        <Github className="w-7" />
      </a>
      | Made with ❤️ at EthforAll
    </div>
  );
};

export default Footer;
