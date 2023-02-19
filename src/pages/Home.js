import React from "react";
import { Logo } from "../assets";
import { Link } from "react-router-dom";
import { Footer } from "../components";

const Home = () => {
  return (
    <div className=" w-full">
      <div className="w-full h-[100vh] overflow-hidden -z-10 absolute">
        <img src={require("../assets/background.png")} alt="" />
      </div>
      <nav className="h-[100px] flex py-10 px-5 items-center z-10 justify-between">
        <div className="flex items-center gap-10">
          <div className="logo w-16 h-16 bg-white rounded-[50%] text-[#646D8A] ml-2">
            <Logo className="w-16 h-16" />
          </div>
          <div className="midItems list-none gap-16 text-white text-[1.1rem] hidden">
            <li className="cursor-pointer">Item</li>
            <li className="cursor-pointer">Item</li>
            <li className="cursor-pointer">Item</li>
            <li className="cursor-pointer">Item</li>
          </div>
        </div>
        <Link
          to="/start"
          className="connect bg-white mr-5 py-3 px-5 font-bold text-[#E40072] rounded-md hover:bg-gray-100"
        >
          Launch App
        </Link>
      </nav>
      <div className="heroContainer z-10 mx-16 pt-8 flex flex-col items-center">
        <h1 className="font-semibold text-[4rem] my-12 text-white">
          Filechain
        </h1>
        <div className="overview mb-16 mx-32 text-white h-[70vh] w-[1000px]">
          <p className="text-[1.2rem] text-center leading-8">
            Protecting the proof of your most important work in time. There's no
            upload limit or Size limit. Upload as many files as you'd like and
            as many times as you'd like. Each time you'd have to pay a meagre
            fee compared to the proofs you are saving on the blockchain.
            Restricted only by the capacity of your device. Prove the history of
            your lifetime's work in seconds without the hassle of patenting it
            instantaneously.
          </p>
        </div>
        <div className="sectionContainer flex justify-center items-center gap-10">
          <img
            src={require("../assets/home/1.png")}
            className="h-[450px] "
            alt=""
          />
          <div className="content text-[1.1rem] leading-8 w-[500px] text-justify">
            It gives one the power to save any file's existence proof on-chain,
            which works as proof of ownership in time. Each Merkle tree is
            independent, although linked with each other. Only hash values of
            the red box are required to prove the file's existence, as Merkle
            roots are saved on-chain.
          </div>
        </div>
        <div className="sectionContainer flex justify-center items-center gap-10 my-20">
          <div className="content text-[1.1rem] leading-8 w-[500px] text-justify">
            It gives one the power to save any file's existence proof on-chain,
            which works as proof of ownership in time. Each Merkle tree is
            independent, although linked with each other. Only hash values of
            the red box are required to prove the file's existence, as Merkle
            roots are saved on-chain.
          </div>
          <img
            src={require("../assets/home/2.png")}
            className="h-[450px] "
            alt=""
          />
        </div>
      </div>
      <div className="my-6 mt-10">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
