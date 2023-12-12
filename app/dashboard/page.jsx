"use client";

import Image from "next/image";
import styles from "../../styles/Dashboard.module.css";
import Link from "next/link";

import { useAccount, useConnect, useNetwork, useContractRead } from "wagmi";
import { CHAIN_INFORMATION } from "@/utils/ChainInformation";
import { COLLECTIVE_CORE_ABI } from "@/utils/abi";
import ClientOnly from "@/components/ClientOnly";
import {
  CURRENTCHAIN,
  formatTime,
  getProtocolProfitImage,
} from "@/utils/helpers";

export default function Dashboard() {
  const { chain } = useNetwork();

  let collectiveAddress;
  let currentChainInfo;

  if (chain) {
    // currentChainInfo = CHAIN_INFORMATION[chain.id][CURRENTCHAIN];
    currentChainInfo = CHAIN_INFORMATION[chain.id];

    collectiveAddress = currentChainInfo.collectiveAddress;
    console.log(currentChainInfo.collectiveAddress);
  }

  const { data: totalChainSavings } = useContractRead({
    address: collectiveAddress,
    abi: COLLECTIVE_CORE_ABI,
    functionName: "getTotalChainSavings",
  });

  const { data: interestPoolBalance, isSuccess: fetchInterestPoolBalance } =
    useContractRead({
      address: collectiveAddress,
      abi: COLLECTIVE_CORE_ABI,
      functionName: "getInterestPoolBalance",
    });

  const { data: protocolProfitOnThisChain } = useContractRead({
    address: collectiveAddress,
    abi: COLLECTIVE_CORE_ABI,
    functionName: "getProtocolProfit",
  });

  const { data: totalExpectedSaveTime } = useContractRead({
    address: collectiveAddress,
    abi: COLLECTIVE_CORE_ABI,
    functionName: "getTotalExpectedSaveTime",
  });

  const { data: totalChainSavers, isSuccess: totalChainSaversFetched } =
    useContractRead({
      address: collectiveAddress,
      abi: COLLECTIVE_CORE_ABI,
      functionName: "getTotalChainSavers",
    });

  const { data: usdtBalances } = useContractRead({
    address: collectiveAddress,
    abi: COLLECTIVE_CORE_ABI,
    functionName: "getUsdtBalances",
  });

  console.log(interestPoolBalance);

  return (
    <div className="dashboard-container">
      <div className={styles.left}>
        <ClientOnly>
          {totalChainSavings && (
            <div className="amount-saved-on-each-chain">
              <h4>Amount Saved On Each Chain</h4>
              <div className="amount-saved-container">
                <div className="amount-saved">
                  <Image src="/avaxLogo.png" width="60" height="30" />
                  <p>
                    {(totalChainSavings.wAVAX.toString() / 1e18).toFixed(4)}
                  </p>
                </div>

                <div className="amount-saved">
                  <Image src="/optimismLogo.png" width="60" height="30" />
                  <p>{(totalChainSavings.wOP.toString() / 1e18).toFixed(4)}</p>
                </div>

                <div className="amount-saved">
                  <Image src="/maticLogo.png" width="60" height="30" />
                  <p>
                    {(totalChainSavings.wMATIC.toString() / 1e18).toFixed(4)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {usdtBalances && (
            <div className="usdtBalances">
              <div className="usdtBalance">
                <h4>Avalanche</h4>
                <div className="usdt-amount">
                  <Image src="/usdtLogo.png" width="60" height="30" />
                  <p>{(usdtBalances.Avalanche.toString() / 1e18).toFixed(2)}</p>
                </div>
              </div>

              <div className="usdtBalance">
                <h4>Optimism</h4>
                <div className="usdt-amount">
                  <Image src="/usdtLogo.png" width="60" height="30" />
                  <p>{(usdtBalances.Optimism.toString() / 1e18).toFixed(2)}</p>
                </div>
              </div>

              <div className="usdtBalance">
                <h4>Polygon</h4>
                <div className="usdt-amount">
                  <Image src="/usdtLogo.png" width="60" height="30" />
                  <p>{(usdtBalances.Polygon.toString() / 1e18).toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
        </ClientOnly>
      </div>

      <div className="right">
        <h4>Protocol Statistics</h4>

        <div className="statBoxesContainer">
          <ClientOnly>
            <div className="statBox">
              <h5>Total Collective Interest</h5>
              <div>
                <Image src="/usdtLogo.png" width="40" height="60" />
                <p>
                  {fetchInterestPoolBalance
                    ? (interestPoolBalance.toString() / 1e18).toFixed(4)
                    : (0).toFixed(4)}
                </p>
              </div>
            </div>
          </ClientOnly>

          <ClientOnly>
            <div className="statBox">
              <h5>Total Savers</h5>
              <div>
                <p>
                  {totalChainSaversFetched ? totalChainSavers.toString() : "0"}
                </p>
              </div>
            </div>
          </ClientOnly>

          <ClientOnly>
            <div className="statBox">
              <h5>Total Expected Save Time</h5>
              <div>
                <p>
                  {totalExpectedSaveTime
                    ? formatTime(totalExpectedSaveTime.toString())
                    : "0 "}
                </p>
              </div>
            </div>
          </ClientOnly>

          <ClientOnly>
            <div className="statBox">
              <h5>Protocol Profit</h5>
              <div>
                <Image
                  src={getProtocolProfitImage(
                    currentChainInfo && currentChainInfo.name
                  )}
                  width="40"
                  height="60"
                />
                <p>
                  {protocolProfitOnThisChain
                    ? (protocolProfitOnThisChain.toString() / 1e18).toFixed(4)
                    : (0).toFixed(4)}
                </p>
              </div>
            </div>
          </ClientOnly>
        </div>
      </div>
    </div>
  );
}
