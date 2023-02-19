import React, { useEffect } from "react";
import { ConnectWallet, Footer, Header } from "../components";
import { useMoralis } from "react-moralis";
import { getUserAddress } from "../redux/actions";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { CONTRACT_ADDRESS } from "../utils/GetFunctionCalls/constants";

const Start = () => {
  const dispatch = useDispatch();

  const { isWeb3Enabled, account } = useMoralis();
  console.log(isWeb3Enabled);

  useEffect(() => {
    if (isWeb3Enabled) {
      dispatch(getUserAddress(account));
    }
  }, []);
  console.log(account);
  return (
    <div
      className="h-[100vh] w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 "
      style={{ backgroundImage: `url("../assets/background.png")` }}
    >
      <div className="w-full h-[100vh] overflow-hidden -z-10 absolute">
        <img src={require("../assets/background.png")} alt="" />
      </div>
      <Header />
      <div className="h-[90vh] flex flex-col justify-between items-center pt-20">
        <div className="container  w-[700px] p-10 rounded-[20px] shadow-2xl bg-white flex">
          <div className="userDetails w-full">
            <h2 className="text-[2.2rem] font-bold w-full text-center mb-10">
              Filechain
            </h2>
            <div className="address my-5 flex justify-between items-center">
              <p className="font-semibold text-[1.1rem]">Contract Address</p>
              <p className=" text-[1rem]">{CONTRACT_ADDRESS}</p>
            </div>
            <div className="line h-[1px] bg-[#a8a8a8] w-[100%] mb-7"></div>
            <div className="section w-[100%] flex">
              {isWeb3Enabled ? (
                <div className="w-[100%] flex gap-4">
                  <Link
                    to="/upload"
                    className="w-full bg-[#F21282] flex justify-center py-4 text-[1.2rem] px-2 font-bold text-white rounded-lg hover:bg-[#E40072]"
                  >
                    Upload
                  </Link>
                  <Link
                    to="/commits"
                    className="w-full bg-[#28282B] flex justify-center py-4 text-[1.2rem] px-2 font-bold text-white rounded-lg hover:bg-[#333335]"
                  >
                    Verify
                  </Link>
                </div>
              ) : (
                <div className=" w-full">
                  <ConnectWallet />
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Start;
