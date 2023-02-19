import React, { useEffect, useState } from "react";
import { CopyIcon, FileIcon, SuccessIcon, Wrong } from "../assets";
import { Footer, Header } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { getFiles } from "../redux/actions";
import { Link, useParams } from "react-router-dom";
import { Web3Storage } from "web3.storage";
import { useMoralis } from "react-moralis";
import fileHash from "../utils/FileHash";
import getMerkleRootHash from "../utils/MerkleTree";
import {
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
} from "../utils/GetFunctionCalls/constants";

const ethers = require("ethers");

function getAccessToken() {
  return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDVhMTdGZjE5MTI5RTM4NjFCMkRjMDM4OGNlRmNGMzFlMTVGMUM3MjciLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzQ5OTk0OTQyNjksIm5hbWUiOiJldGhGb3JBbGwifQ.M7XJPOoZexjHcQA829tkmoey7TJnTXiLZiP69RS_60c";
}

function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() });
}

const Verify = () => {
  const dispatch = useDispatch();
  const { account } = useMoralis();
  const [file, setFile] = useState([]);
  const [commit, setCommit] = useState();
  const [time, setTime] = useState("");
  const [FileCount, setFileCount] = useState();
  const [isLoader, setIsLoader] = useState(false);
  const [isErrorFile, setIsErrorFile] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [prevCommit, setPrevCommit] = useState();
  const [commitData, setCommitData] = useState();
  const [isDataShow, setisDataShow] = useState(true);
  const params = useParams();

  const { data } = useSelector((state) => state);

  console.log(data, params.id);
  const provider = new ethers.providers.JsonRpcProvider(
    // "https://polygon-mumbai.g.alchemy.com/v2/tJhWcjDo8S2sN0580yBZ5ssyf-wE0lnr"
    "https://small-aged-choice.matic-testnet.discover.quiknode.pro/96824cf731765ba9f2808ffee848a758569bfe18/"
  );

  const timeStamp = () => {
    let date = new Date(Number(data.commits.timestamp._hex) * 1000);
    // setTime(date);
    setTime(Number(data.commits.timestamp._hex));
    // console.log(date);
  };

  useEffect(() => {
    setCommit(data.commits);
    timeStamp();
    const contractInteraction = async () => {
      const walletContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        provider
      );

      const lastCommit = parseInt(await walletContract.count(account));
      console.log("lastCommit: " + typeof lastCommit);
      try {
        const secondLastCommit = await walletContract.commits(
          account,
          data.lastCommitIndex - 1
        );
        console.log("2ndLast Commit: " + secondLastCommit);
        setPrevCommit(secondLastCommit);
      } catch (e) {
        console.log(e);
      }
      // setCommits(details);
    };
    contractInteraction();
  }, []);

  const handleUpload = async (e) => {
    setFile([...file, ...e.target.files]);
    await dispatch(getFiles([...file, ...e.target.files]));
  };
  console.log(file);

  const handleDelete = (name) => {
    let newFiles = file.filter((item) => {
      if (item.name != name) {
        return item;
      }
    });
    setFile(newFiles);
  };

  useEffect(() => {
    async function retrieveFiles(cid) {
      const client = makeStorageClient();
      const res = await client.get(cid);
      const files = await res.files();
      setCommitData(files);
      // console.log(await files);
    }
    if (data && data.commits && data.commits.cid != "null") {
      retrieveFiles(data.commits.cid);
    }
  }, []);

  const verifyModal = () => {
    setisDataShow(false);
  };

  const handleCompare = async () => {
    if (file.length != 0) {
      setIsLoader(true);
      let hashes = [prevCommit];
      if (data.lastCommitIndex == 0) {
        hashes = [];
      }
      let newRootHash;

      for (let i = 0; i < file.length; i++) {
        let hash = await fileHash(file[i]);
        console.log(hash);
        await hashes.push(hash);
      }
      setTimeout(async () => {
        let tempRootData = await getMerkleRootHash(hashes);
        newRootHash = `0x${tempRootData}`;
      }, 2000);

      setTimeout(async () => {
        console.log("Generate RootHash:" + newRootHash);
        console.log("Backend RootHash:" + params.id);
        setIsModal(true);
        if (newRootHash === params.id) {
          console.log("SUCCESS !!!!");
          setIsSuccess(true);
        } else {
          console.log("FAILED !!!!");
          // setIsSuccess(false);
        }
        setIsLoader(false);
      }, 5000);
    } else {
      setIsErrorFile(true);
      setTimeout(() => setIsErrorFile(false), 3000);
    }
  };

  return (
    <div className="h-[100vh] w-full overflow-y-hidden">
      {isLoader && (
        <div className="loaderContainer w-[100vw] h-[100vh] absolute  flex justify-center items-center z-1 ">
          <div className="bg w-[100%] absolute h-[100%] bg-black opacity-50 -z-5"></div>
          <img
            src={require("../assets/loader.gif")}
            width={50}
            alt="my-gif"
            className="z-10 -translate-y-12"
          />
        </div>
      )}
      {isModal && (
        <div className="successContainer w-[100vw] h-[100vh] absolute  flex justify-center items-center z-1 ">
          <div className="bg w-[100%] absolute h-[100%] bg-black opacity-40 -z-5"></div>
          <div className="succes z-10 h-[470px] w-[470px] rounded-[20px] shadow-2xl bg-white flex flex-col justify-center items-center">
            <h1 className="text-[2rem] font-bold">
              {isSuccess ? "Congratulation!" : "Verification failed!"}
            </h1>
            {isSuccess ? (
              <SuccessIcon className="mb-3 mt-2" />
            ) : (
              <Wrong className="mb-3 mt-2" />
            )}

            <h2 className="text-[1.2rem] font-bold">
              {isSuccess
                ? "These files belong to You!"
                : "Either wrong files uploaded"}
            </h2>
            {isSuccess ? (
              <div className=" flex flex-col items-center">
                <p className="text-center text-[1rem] font-semibold mb-3">
                  These files were added on{" "}
                  <span className="text-green-600">
                    {time ? time : "timeStamp"} Unix time
                  </span>
                  <br />
                  and are successfully verified.
                </p>
                <Link to="/start" onClick={() => setIsModal(false)}>
                  <button className="bg-[#EB4899] w-32 py-3 px-5 text-[1.2rem] font-bold text-white rounded-md hover:bg-[#E40072]">
                    OK
                  </button>
                </Link>
              </div>
            ) : (
              <div className=" flex flex-col items-center gap-2">
                <p className="text-center text-[1.1rem] font-semibold mt-2">
                  or
                </p>
                <p className="text-center text-[1.1rem] font-semibold ">
                  In wrong order! Try again!
                </p>
                <button
                  onClick={() => setIsModal(false)}
                  className="bg-[#EB4899] w-32 py-2 px-4 text-[1.2rem] font-bold text-white rounded-lg hover:bg-[#E40072]"
                >
                  OK
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="w-full h-[100vh] overflow-hidden -z-10 absolute">
        <img src={require("../assets/background.png")} alt="" />
      </div>
      <Header />
      <div className="h-[90vh] flex flex-col justify-between items-center pt-20">
        <div className="container flex flex-col gap-3  h-[500px] w-[700px]  rounded-[20px] px-8 py-8 shadow-2xl bg-white">
          <div className="titleContainer flex justify-between items-center">
            <div className="left ">
              <p className="text-[12px] font-semibold text-[#a3a3a2] text-left">
                Commit
              </p>
              <h2 className="text-[1.7rem] font-bold text-left">
                {commit ? commit.name : "commit name"}
              </h2>
              <p className="  text-[15px]">
                Upload the exact files to get verify
              </p>
            </div>
            <div className=" flex flex-col gap-2">
              {!isDataShow ? (
                <button
                  className="mb-1"
                  onInputCapture={(e) => handleUpload(e)}
                >
                  <label className=" bg-[#EB4899] w-full py-3 px-5 font-bold text-white rounded-md hover:bg-[#E40072]">
                    <span className="font-semibold text-lg ">Browse</span>
                    <input type="file" className="hidden" multiple />
                  </label>
                </button>
              ) : (
                <div> </div>
              )}
              <div className="right text-center w-full translate-y-[8px] font-semibold cursor-pointer">
                Files :{" "}
                {commit && commit.noOfFiles
                  ? Number(commit.noOfFiles._hex)
                  : ""}
              </div>
            </div>
          </div>
          {!isDataShow ? (
            <div className="fileContainer h-[180px] overflow-auto border-[1px] border-[#9c9c9c] rounded-lg flex flex-col gap-1">
              {file
                ? file.map(({ name, type }, index) => {
                    return (
                      <div
                        className="flex h-10 gap-3 items-center justify-between px-5 py-7 cursor-pointer font-semibold"
                        id={name}
                      >
                        <div className="flex  gap-3 items-center">
                          <p className="">{index + 1}</p>
                          <FileIcon width={45} height={45} />
                          <div>
                            <h3 className="text-[1rem] mb-[2px]">{name}</h3>
                            <p className="text-xs">{type}</p>
                          </div>
                        </div>
                        <button
                          className="mr-5 hover:text-[#585858]"
                          onClick={() => handleDelete(name)}
                        >
                          remove
                        </button>
                      </div>
                    );
                  })
                : 1}
            </div>
          ) : (
            <div className="fileContainer h-[180px] overflow-auto border-[1px] border-[#9c9c9c] rounded-lg flex flex-col gap-1">
              {commitData ? (
                commitData.map(({ cid, name, size }, index) => {
                  // console.log(cid);
                  return (
                    <div
                      className="flex h-10 gap-3 items-center justify-between px-5 py-7 cursor-pointer font-semibold"
                      id={cid ? cid : "cid"}
                    >
                      <div className="flex  gap-3 items-center">
                        {/* <p className="">{index + 1}</p> */}
                        <FileIcon width={45} height={45} />
                        <div>
                          <h3 className="text-[1rem] mb-[2px]">
                            {name ? name : "name"}
                          </h3>
                          <p className="text-xs text-left">
                            size :{parseInt(size / 1024)}kB
                          </p>
                        </div>
                      </div>
                      <a
                        className="mr-5 hover:text-[#585858]"
                        href={`https://ipfs.io/ipfs/${cid}?filename=${name}&download=true`} // onClick={() => handleDelete(name)}
                        // download
                      >
                        download
                      </a>
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center justify-center h-[100%] text-[1.2rem] font-bold text-[#E40072] ">
                  Not on IPFS!
                </div>
              )}
            </div>
          )}

          <div className="my-2">
            <label
              for="large-input"
              className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
            >
              Merkle Root of this Commit
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="text"
                value={commit ? commit.merkleRoot : ""}
                className="block w-full text-[15px] p-2 h-10 text-gray-900 border border-gray-300 rounded-lg bg-gray-50  focus:ring-blue-500 focus:border-blue-500"
              />
              <div className=" rounded-lg w-10 h-9 flex justify-center items-center bg-gray-100 hover:bg-gray-200 ">
                <CopyIcon
                  width={20}
                  onClick={() =>
                    navigator.clipboard.writeText(
                      commit ? commit.merkle_root : ""
                    )
                  }
                />
              </div>
            </div>
          </div>
          <div>
            <div className="text-red-600 text-sm mb-2 text-center">
              {isErrorFile && "please upload files"}
            </div>
            <div className="flex gap-3">
              <Link
                to="/commits"
                className="w-full bg-[#28282B] flex justify-center py-3 text-[1.2rem] px-5 font-bold text-white rounded-md hover:bg-[#333335]"
              >
                Back
              </Link>
              {isDataShow ? (
                <button
                  onClick={() => verifyModal()}
                  className=" bg-[#EB4899] w-full py-3 px-5 font-bold text-white rounded-md text-[1.2rem] hover:bg-[#E40072]"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={() => handleCompare()}
                  className=" bg-[#EB4899] w-full py-3 px-5 font-bold text-white rounded-md text-[1.2rem] hover:bg-[#E40072]"
                >
                  Verify
                </button>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Verify;
