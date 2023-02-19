const ethers = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(
  "https://polygon-mumbai.g.alchemy.com/v2/tJhWcjDo8S2sN0580yBZ5ssyf-wE0lnr"
  // "https://small-aged-choice.matic-testnet.discover.quiknode.pro/96824cf731765ba9f2808ffee848a758569bfe18/"
);

// **********************GET_TOTAL_FILES **********************

export const getLastCommitData = async (userAddress, count) => {
  const walletContract = new ethers.Contract(
    CONTRACT_ADDRESS,
    CONTRACT_ABI,
    provider
  );

  const details = await walletContract.getLastCommit(account);
  console.log(details);

  return details;
};
