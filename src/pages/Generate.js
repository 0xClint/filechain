import React, { useEffect, useState } from "react";
import { FileIcon, SuccesIcon, SuccessIcon } from "../assets";
import Header from "../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { generateHash, getFiles, getRootHash } from "../redux/actions";
import fileHash from "../utils/FileHash";
import getMerkleRootHash from "../utils/MerkleTree";
import { Web3Storage } from "web3.storage";
import { useMoralis } from "react-moralis";
import {
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
} from "../utils/GetFunctionCalls/constants";
import { Footer } from "../components";
import { downloadHash, downloadSequence } from "../utils/GetSequence";
import hexToBytes from "../utils/HexToByte";
const ethers = require("ethers");

function getAccessToken() {
  return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDVhMTdGZjE5MTI5RTM4NjFCMkRjMDM4OGNlRmNGMzFlMTVGMUM3MjciLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzQ5OTk0OTQyNjksIm5hbWUiOiJldGhGb3JBbGwifQ.M7XJPOoZexjHcQA829tkmoey7TJnTXiLZiP69RS_60c";
}

function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() });
}

const Generate = () => {
  const { isWeb3Enabled, account } = useMoralis();

  // const { doContractCall } = useConnect();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [file, setFile] = useState([]);
  const [transaction, setTransaction] = useState("");
  const [rootHash, setRootHash] = useState("");
  const [lastMerkleRoot, setLastMerkleRoot] = useState("");
  const [isFirstCommit, setisFirstCommit] = useState();
  const [isLoader, setIsLoader] = useState(false);
  const [isRootSuccess, setIsRootSuccess] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [cidData, setCidData] = useState();
  const [IPFS, setIPFS] = useState(false);
  const { data } = useSelector((state) => state);
  console.log(data);

  useEffect(() => {
    const getLastCommitData = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );
      console.log(signer);
      let data1;
      try {
        data1 = await contract.getLastCommit();
        console.log(data1);
      } catch (e) {
        data1 = 0;
      }
      // console.log(data1);
      if (data1) {
        setLastMerkleRoot(data1[0]);
      } else {
        setisFirstCommit(true);
        console.log("first commit");
      }
      console.log(data1[0]);
    };
    getLastCommitData();
  }, []);

  useEffect(() => {
    setFile(data.files[0]);
  }, []);

  useEffect(() => {
    if (!isWeb3Enabled) {
      navigate("/upload");
    }
  });

  const setHash = async () => {
    if (file.length != 0) {
      setIsLoader(true);
      let hashes = [lastMerkleRoot];
      // let hashes = [];
      if (isFirstCommit) {
        hashes = [];
      }
      let tempHash;
      for (let i = 0; i < file.length; i++) {
        let hash = await fileHash(file[i]);
        console.log(hash);
        await hashes.push(hash);
      }
      setTimeout(async () => {
        tempHash = await getMerkleRootHash(hashes);
        setRootHash(tempHash);
        await dispatch(getRootHash(tempHash));
      }, 1000);
      setTimeout(async () => {
        dispatch(generateHash(hashes));
      }, 2000);
      setTimeout(() => {
        console.log(tempHash);
        // addMerkleRoot(data.title, tempHash, file.length);
        setIsLoader(false);
        setIsRootSuccess(true);
      }, 3000);
    }
  };
  console.log(rootHash);

  const handleList = () => {
    downloadSequence(file);
  };

  const handleDownloadHash = () => {
    downloadHash(rootHash);
  };

  const handleDelete = (name) => {
    let newFiles = file.filter((item) => {
      if (item.name != name) {
        return item;
      }
    });
    setFile(newFiles);
    console.log(newFiles);
  };

  const handleExtraUpload = async (e) => {
    console.log(e.target.files);
    setFile([...file, ...e.target.files]);
    await dispatch(getFiles([...file, ...e.target.files]));
  };
  console.log(file);

  async function merkleRoot(title, numFile, cid, hash) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );
    console.log(title, numFile, hash, cid);
    await contract.addMerkleRoot(numFile, cid, hexToBytes(hash), title);
    setIsLoader(false);
  }

  async function storeFiles(files) {
    // setIsLoader(true);
    const client = makeStorageClient();
    const cid = await client.put(files);
    console.log("stored files with cid:", cid);
    // await setCid(cid);
    // setIsLoader(false);
    // return cid;
  }

  const saveHash = async () => {
    setIsLoader(true);
    if (IPFS && file) {
      const client = await makeStorageClient();
      const cid = await client.put(file);
      console.log(data.title, file.length, cid, rootHash);
      await merkleRoot(data.title, file.length, cid, rootHash);
    } else {
      await merkleRoot(data.title, file.length, "null", rootHash);
    }
    setIsLoader(false);
    setIsRootSuccess(false);
    setIsSuccess(true);
  };
  console.log(IPFS);

  return (
    <div className="h-[100vh] w-full overflow-hidden">
      {isRootSuccess && (
        <div className="loaderContainer w-[100vw] h-[100vh] absolute  flex justify-center items-center z-1 ">
          <div className="bg w-[100%] absolute h-[100%] bg-black opacity-40 -z-5"></div>
          <div className="succes z-10 h-[500px] w-[500px] rounded-[40px] shadow-2xl bg-white flex flex-col justify-center items-center gap-2">
            <h1 className="text-[2rem] font-bold">Hash Generated!</h1>
            <img
              src={require("../assets/hash.png")}
              width={150}
              className="my-2"
            />
            <p className="font-medium">Your Hash:</p>
            <div className=" gap-5">
              <p className="text-center text-[1rem] w-96 break-words mb-2 font-semibold">
                {rootHash}
              </p>
              <p className="text-center text-[1rem] mb-0 text-blue-700 underline font-semibold">
                <a
                  onClick={() => handleDownloadHash()}
                  className="my-0 cursor-pointer"
                >
                  download hash
                </a>
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer my-2">
              <input type="checkbox" value="" class="sr-only peer" />
              <div
                onClick={() => setIPFS(!IPFS)}
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#EB4899]"
              ></div>
              <span class="ml-3 text-sm  font-bold">Save files on IPFS</span>
            </label>
            <div className="flex gap-5 mb-3">
              <button
                // onClick={() => storeFiles(file)}
                onClick={() => saveHash()}
                className="bg-[#EB4899] w-36 py-3 px-5 text-[1.2rem] font-bold border-2 border-[#EB4899] text-white rounded-lg hover:bg-[#E40072]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {isSuccess && (
        <div className="loaderContainer w-[100vw] h-[100vh] absolute  flex justify-center items-center z-1 ">
          <div className="bg w-[100%] absolute h-[100%] bg-black opacity-40 -z-5"></div>
          <div className="succes z-10 h-[500px] w-[500px] rounded-[40px] shadow-2xl bg-white flex flex-col justify-center items-center gap-2">
            <h1 className="text-[2rem] font-bold">Commit Added!</h1>
            <img
              src={require("../assets/blockchain.png")}
              width={150}
              className="my-2"
            />
            <p className="font-medium">Thank you for using filechain</p>
            <div className="flex gap-5">
              {/* <p className="text-center text-[1rem] mb-0 text-blue-700 underline font-semibold">
                <a href={transaction} target="_blank" className="my-0">
                  show transaction
                </a>
              </p> */}
              <p className="text-center text-[1rem] mb-0 text-blue-700 underline font-semibold">
                <a
                  onClick={() => handleDownloadHash()}
                  className="my-0 cursor-pointer"
                >
                  get Root hash
                </a>
              </p>
            </div>
            <h2 className="text-[1.2rem] font-bold my-2 text-center">
              ⚠️ For Verifibility ⚠️
              <br />
            </h2>
            <div className="flex gap-6">
              <Link to="/upload">
                <button className="bg-[#EB4899] w-48 py-3 px-5 text-[1.2rem] font-bold border-2 border-[#EB4899] text-white rounded-lg hover:bg-[#E40072]">
                  Add more
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
      {isLoader && (
        <div className="loaderContainer w-[100vw] h-[100vh] absolute  flex justify-center items-center z-10 ">
          <div className="bg w-[100%] absolute h-[100%] bg-black opacity-50 z-5"></div>
          <img
            src={require("../assets/loader.gif")}
            width={50}
            alt="my-gif"
            className="z-10 -translate-y-12"
          />
        </div>
      )}
      <div className="w-full h-[100vh] overflow-hidden -z-10 absolute">
        <img src={require("../assets/background.png")} alt="" />
      </div>
      <Header />
      <div className="h-[90vh] flex flex-col justify-between items-center pt-20">
        <div className="container h-[440px] w-[700px]  rounded-[20px] shadow-2xl bg-white flex">
          <div className=" h-full w-full rounded-br-[20px] rounded-tr-[20px]  flex flex-col justify-between px-8 pt-10 pb-8 font-semibold">
            <div className="fileContainer h-[270px] overflow-auto border-[1px] border-[#9c9c9c] rounded-2xl flex flex-col gap-3">
              {file
                ? file.map(({ name, type }, index) => {
                    return (
                      <div
                        className="flex h-10 gap-3 items-center justify-between px-5 py-7 cursor-pointer"
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
                          Remove
                        </button>
                      </div>
                    );
                  })
                : 1}
            </div>
            <p className=" text-red-600 font-normal text-sm text-center my-1">
              {file.length ? "" : "Please upload the file"}
            </p>

            <div className=" flex justify-center items-center gap-3">
              <button className="text-[#5064DF] w-40 h-14 flex justify-center items-center hover:text-white border border-[#5064DF] hover:bg-[#5064DF] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base text-center ">
                <label className="w-full h-full flex justify-center items-center">
                  Upload more
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    onInputCapture={(e) => handleExtraUpload(e)}
                  />
                </label>
              </button>
              <button
                className="text-white h-14 w-80 text-[1.2rem] font-semibold bg-[#F21282] hover:bg-[#E40072] rounded-lg text-sm px-5 py-2.5 text-center "
                onClick={() => setHash()}
              >
                Generate Hash
              </button>
              <button
                className="text-[#] w-40 h-14 flex justify-center items-center border-[#] hover:bg-[#] text-[#5064DF] hover:text-white border border-[#5064DF] hover:bg-[#5064DF] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-5 py-2 text-center "
                onClick={() => handleList()}
              >
                Download sequence
              </button>
            </div>
            <p className=" text-red-600 text-sm font-normal text-center mt-1">
              Make sure you remember the files with this commit name
            </p>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Generate;
