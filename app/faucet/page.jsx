"use client";

import ClientOnly from "@/components/ClientOnly";
import { CHAIN_INFORMATION } from "@/utils/ChainInformation";
import { ERC20_ABI } from "@/utils/abi";
import { CURRENTCHAIN, getHashLink } from "@/utils/helpers";
import { useState } from "react";
import { useContractWrite, useNetwork, usePrepareContractWrite } from "wagmi";

export default function Faucet() {
  const [toAddress, setToAddress] = useState();
  const [amount, setAmount] = useState();
  const { chain } = useNetwork();

  let tokenAddress;
  let currentChainInfo;
  if (chain) {
    // currentChainInfo = CHAIN_INFORMATION[chain.id][CURRENTCHAIN];
    currentChainInfo = CHAIN_INFORMATION[chain.id];

    tokenAddress = currentChainInfo.wrappedAsset;
    console.log(currentChainInfo.wrappedAsset);
  }

  // mint
  const { config: mintConfig } = usePrepareContractWrite({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "mint",
    args: [toAddress && toAddress, amount && amount * 1e18],
  });
  const { data: mintData, write: mint } = useContractWrite(mintConfig);

  return (
    <ClientOnly>
      {currentChainInfo && (
        <div className="faucet">
          <h3>Mint Wrapped {currentChainInfo.symbol}</h3>
          <input
            placeholder="To"
            onChange={(e) => setToAddress(e.target.value)}
          />
          <input
            placeholder="Amount"
            onChange={(e) => setAmount(e.target.value)}
          />
          <button onClick={() => mint?.()}>Mint</button>
        </div>
      )}
    </ClientOnly>
  );
}
