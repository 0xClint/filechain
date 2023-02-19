import React, { useEffect, useState } from "react";
import { Web3Storage } from "web3.storage";
import sha256 from "crypto-js/sha256";

function getAccessToken() {
  return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDVhMTdGZjE5MTI5RTM4NjFCMkRjMDM4OGNlRmNGMzFlMTVGMUM3MjciLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzQ5OTk0OTQyNjksIm5hbWUiOiJldGhGb3JBbGwifQ.M7XJPOoZexjHcQA829tkmoey7TJnTXiLZiP69RS_60c";
}

function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() });
}

const Template12 = () => {
  useEffect(() => {
    async function retrieveFiles(cid) {
      const client = makeStorageClient();
      const res = await client.get(cid);
      const files = await res.files();
      console.log(await files);
    }

    retrieveFiles(
      "bafybeib65prwx6vggmxg2v7jsrl2r7ji5gjoj52ppiuhc4ggz3bjpqoumu"
    );
  }, []);

  const [dataFile, setdataFile] = useState();

  const inputFile = (e) => {
    setdataFile(e.target.files[0]);
  };
  console.log(dataFile);

  //   const tempData = {
  //     property1: "property1",
  //     property2: "property2",
  //     property3: "property3",
  //   };

  return (
    <div>
      Template12
      <input type={"file"} multiple onChange={(e) => inputFile(e)} />
      <button>modify Data</button>
    </div>
  );
};

export default Template12;
