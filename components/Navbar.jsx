"use client";

import ClientOnly from "@/components/ClientOnly";
import styles from "../styles/Navbar.module.css";
import Image from "next/image";
import Link from "next/link";

import { useAccount, useConnect, useNetwork, useContractRead } from "wagmi";
import { CHAIN_INFORMATION } from "@/utils/ChainInformation";
import { CURRENTCHAIN, truncateEthereumAddress } from "@/utils/helpers";

export default function Navbar() {
  const { isConnected, address: user } = useAccount();
  const { connect, connectors } = useConnect();
  const { chain } = useNetwork();

  let collectiveAddress;
  let currentChainInfo;
  if (chain) {
    // currentChainInfo = CHAIN_INFORMATION[chain.id][CURRENTCHAIN];
    currentChainInfo = CHAIN_INFORMATION[chain.id];

    collectiveAddress = currentChainInfo.collectiveAddress;
    console.log(currentChainInfo.collectiveAddress);
  }

  return (
    <div className="navbar">
      <Link href="/" className="logo">
        <Image src="/logo.png" width="60" height="55" />
        <p>Collective</p>
      </Link>

      <ClientOnly>
        {isConnected && (
          <div className="network">
            {chain && (
              <div>
                Network: <span>{currentChainInfo.name}</span>
              </div>
            )}
          </div>
        )}
      </ClientOnly>

      <ClientOnly>
        <div className="centerLinks-and-user">
          {isConnected && (
            <div className="centerLinks">
              <Link href="/dashboard">Dashboard</Link>

              <Link href="/startSavings">Save</Link>

              <Link href="/groupPage">Group Save</Link>

              <Link href="/faucet">Faucet</Link>
            </div>
          )}

          {isConnected ? (
            <div className="connected-user">
              {truncateEthereumAddress(user)}
            </div>
          ) : (
            connectors.map((connector) => (
              <button onClick={() => connect({ connector })}>
                Connect Wallet
              </button>
            ))
          )}
        </div>
      </ClientOnly>
    </div>
  );
}
