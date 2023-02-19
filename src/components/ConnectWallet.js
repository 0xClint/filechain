import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";
import { TurnOff, UserIcon } from "../assets";

const ConnectWallet = () => {
  const {
    enableWeb3,
    isWeb3Enabled,
    account,
    deactivateWeb3,
    Moralis,
    isWeb3EnableLoading,
  } = useMoralis();

  useEffect(() => {
    if (isWeb3Enabled) return;

    if (
      typeof window !== "undefined" &&
      window.localStorage.getItem("connected")
    ) {
      enableWeb3();
    }
  }, []);

  useEffect(() => {
    // Moralis
    Moralis.onAccountChanged((account) => {
      console.log(`Account changed to ${account}`);
      if (account == null) {
        window.localStorage.removeItem("connected");
        deactivateWeb3();
        console.log("Null account found");
      }
    });
  }, []);
  return (
    <div>
      {account ? (
        <div className="cursor-pointer flex justify-center items-center gap-2 bg-white p-[6px] rounded-[15px] rounded-bl-[15px]">
          <div className="w-[40px] h-[40px] bg-purple-500 rounded-[50%]">
            <UserIcon h={10} w={10} className="text-[2rem]" />
          </div>
          <p className="">
            {account.slice(0, 7)}...
            {account.slice(account.length - 4)}
          </p>
          <button className="Connect  mx-2">
            <TurnOff h={5} w={5} />
          </button>
        </div>
      ) : (
        <button
          className="connect bg-[#EB4899] w-full py-3 px-5 font-bold text-white rounded-lg hover:bg-[#E40072]"
          onClick={async () => {
            await enableWeb3();
            if (typeof window !== "undefined") {
              window.localStorage.setItem("connected", "injected");
            }
          }}
          disabled={isWeb3EnableLoading}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;
