import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RightArrow } from "../assets";
import { Footer, Header } from "../components";
import { useNavigate } from "react-router-dom";
import { Web3Storage } from "web3.storage";
import { useMoralis } from "react-moralis";
import axios from "axios";
import {
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
} from "../utils/GetFunctionCalls/constants";
import { getCommits, getLastCommmitIndex } from "../redux/actions";
// import * as IPFS from "ipfs-core";

const ethers = require("ethers");

function getAccessToken() {
  return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDVhMTdGZjE5MTI5RTM4NjFCMkRjMDM4OGNlRmNGMzFlMTVGMUM3MjciLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzQ5OTk0OTQyNjksIm5hbWUiOiJldGhGb3JBbGwifQ.M7XJPOoZexjHcQA829tkmoey7TJnTXiLZiP69RS_60c";
}

function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() });
}

const Commits = () => {
  const { isWeb3Enabled, account } = useMoralis();
  const { data } = useSelector((state) => state);
  const navigate = useNavigate();
  const [isLoader, setIsLoader] = useState(true);
  const [commits, setCommits] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      setIsLoader(false);
    }, 3000);
  }, []);

  const provider = new ethers.providers.JsonRpcProvider(
    // "https://polygon-mumbai.g.alchemy.com/v2/tJhWcjDo8S2sN0580yBZ5ssyf-wE0lnr"
    "https://small-aged-choice.matic-testnet.discover.quiknode.pro/96824cf731765ba9f2808ffee848a758569bfe18/"
  );

  useEffect(() => {
    if (account) {
      const contractInteraction = async () => {
        const walletContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          provider
        );
        // console.log(account);

        const details = await walletContract.getDetails(account);
        console.log(details);
        setCommits(details);
      };
      contractInteraction();
    }
  }, [account]);

  const handleClick = async (commitId, index) => {
    await dispatch(getCommits(commits[index]));
    await dispatch(getLastCommmitIndex(index));
    navigate(`/verify/${commitId}`);
  };

  async function retrieve(cid) {
    const client = makeStorageClient();
    const res = await client.get(cid);
    console.log(`Got a response! [${res.status}] ${res.statusText}`);
    if (!res.ok) {
      throw new Error(`failed to get ${cid}`);
    }
  }

  // const fetchData = async () => {
  //   try {
  //     const response = await axios.get(
  //       "https://ipfs.io/ipfs/bafybeiaweq5elca6iaw3npx7vc63cr43lbcak2nprhmf4xusul6wzqmqki/IMG-20230214-WA0184.jpg"
  //     );
  //     console.log(response);
  //     // setData(response);
  //   } catch (error) {
  //     // setData("");
  //     console.log(error);
  //   }
  // };

  // async function fetchFromIPFS() {
  //   const node = await IPFS.create();

  //   // const fileAdded = await node.add({
  //   //   path: "test.txt",
  //   //   content: "Hello IPFS!",
  //   // });
  //   // console.log("Added file:", fileAdded.path, fileAdded.cid);

  //   const chunks = [];
  //   for await (const chunk of node.cat(
  //     "bafkreigqzp6rst2lv3xb4gc6qncsxa3pqo7a3kqfd4hjb5v26mucgiphta"
  //   )) {
  //     chunks.push(chunk);
  //   }

  //   console.log("Retrieved file contents:", chunks.toString());
  // }

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
      <div className="w-full h-[100vh] overflow-hidden -z-10 absolute">
        <img src={require("../assets/background.png")} />
      </div>
      <Header />
      <div className="h-[90vh] flex flex-col justify-between items-center pt-10">
        <div className="container h-[75vh] w-[1000px] rounded-[20px] px-12 py-8 shadow-2xl bg-white">
          <h2 className="text-[2rem] font-bold">Commits</h2>
          <p className="mt-1 mb-6">
            Selects the commit in which the file exists.
          </p>
          <div className="commitsContainer min-h-min max-h-[75%] overflow-auto border-[1px] text-[#424242] border-[#9c9c9c] rounded-xl">
            {commits
              ? commits.map((data, index) => {
                  // console.log(Number(data.timestamp._hex), index);
                  return (
                    <div
                      key={index}
                      onClick={() => handleClick(data.merkleRoot, index)}
                      className="commit cursor-pointer hover:bg-[#f1f1f1] flex justify-between  gap-3 border-b items-center py-5  pl-6 pr-4 text-[1.1rem] font-semibold"
                    >
                      <p className="w-full text-left">{data.name}</p>
                      <div className="flex gap-1 justify-center items-center mr-4">
                        <div className="text-[1.1rem] text-sm font-normal w-20 flex gap-1">
                          files:
                          <div className="font-semibold rounded-[50%] w-[20px] flex justify-center text-white items-center bg-[#EB4899]">
                            {Number(data.noOfFiles._hex)}
                          </div>
                        </div>
                        <RightArrow className="h-5 w-5" />
                      </div>
                    </div>
                  );
                })
              : ""}
            {}
          </div>
        </div>
        <div className="mt-5">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Commits;
