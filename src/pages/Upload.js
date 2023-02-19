import React, { useState } from "react";
import ConnectWallet from "../components/ConnectWallet";
import Header from "../components/Header";
import { useMoralis } from "react-moralis";
import { useDispatch } from "react-redux";
import { getFiles, getTitle } from "../redux/actions";
import { useNavigate } from "react-router-dom";
import { Footer } from "../components";
import { FileSelected, FileUpload } from "../assets";

const Upload = () => {
  const { isWeb3Enabled, account } = useMoralis();

  const [title, setTitle] = useState("");
  const [isErrortitle, setIsErrorTitle] = useState(false);
  const [file, setFile] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = async (e) => {
    setFile([...file, ...e.target.files]);
  };

  const handleUpload = async () => {
    if (title && file.length != 0) {
      await dispatch(getFiles(file));
      await dispatch(getTitle(title));
      navigate("/generate");
    } else {
      setIsErrorTitle(true);
      setTimeout(() => setIsErrorTitle(false), 3000);
    }
  };

  return (
    <div
      className="h-[100vh] w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 overflow-y-hidden"
      style={{ backgroundImage: `url("../assets/background.png")` }}
    >
      <div className="w-full h-[100vh] overflow-hidden -z-10 absolute">
        <img src={require("../assets/background.png")} alt="" />
      </div>
      <Header />
      <div className="h-[90vh] flex flex-col justify-between items-center pt-20 z-10">
        <div className="container h-[450px] w-[700px]  rounded-[20px] shadow-2xl bg-white flex flex-col">
          <div className="h-[100%] w-full rounded-tl-[20px] p-10 pb-7  rounded-bl-[20px]  flex flex-col">
            <div className="">
              <label
                // for="large-input"
                className="block mb-2 text-md font-semibold text-gray-900 text-left"
              >
                Enter Commit Name
              </label>
              <div className="flex gap-3 items-center">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="block w-full p-2 h-10 text-[1rem] text-gray-900 border border-gray-300 rounded-lg bg-gray-50  focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="Container mt-5 mb-2 flex flex-col justify-center gap-1 items-center h-[55%] rounded-[15px] border-dashed border-[2.5px] border-[#EB4899]">
              {file.length ? (
                <FileSelected className=" h-14" />
              ) : (
                <FileUpload className=" h-14" />
              )}
              <div className="font-bold">
                {file.length ? (
                  <p className="text-center text-pink-600">
                    File selected <br /> Press upload to continue
                  </p>
                ) : (
                  <p className="text-[#5064DF]">Drag an Drop files to upload</p>
                )}
              </div>
              <p className="font-semibold">{file.length ? "" : "or"}</p>
              <button className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium rounded-lg group border-2 border-[#EB4899] text-[#E40072] hover:text-white hover:bg-[#EB4899]">
                <label className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                  <span className="font-semibold">Browse</span>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    onChange={(e) => handleChange(e)}
                  />
                </label>
              </button>
            </div>
            <div>
              <div className="text-center text-sm mb-1 text-red-600 h-5">
                {isErrortitle && " Please fill all the fields"}
              </div>
              <div className="w-full h-14 flex justify-center items-center bg-[#EB4899] font-bold text-white rounded-[10px] hover:bg-[#E40072]">
                {isWeb3Enabled ? (
                  <button
                    className="text-[1.2rem] w-full h-full"
                    onClick={() => handleUpload()}
                  >
                    Upload
                  </button>
                ) : (
                  <ConnectWallet />
                )}
              </div>
            </div>
            <p className=" text-red-600 text-sm text-center mt-2">
              Make sure you remember the files with this commit name
            </p>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Upload;
