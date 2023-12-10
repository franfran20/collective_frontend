"use client";

import ClientOnly from "@/components/ClientOnly";
import { CHAIN_INFORMATION } from "@/utils/ChainInformation";
import { COLLECTIVE_CORE_ABI, ERC20_ABI } from "@/utils/abi";
import Image from "next/image";
import {
  useAccount,
  useContractRead,
  useNetwork,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { formatTime, getProtocolProfitImage } from "@/utils/helpers";
import { useState } from "react";

export default function StartSaving() {
  const { address: user } = useAccount();
  const { chain } = useNetwork();

  const [avaxAmount, setAvaxAmount] = useState();
  const [opEthAmount, setOpEthAmount] = useState();
  const [maticAmount, setMaticAmount] = useState();
  const [amount, setAmount] = useState();
  const [time, setTime] = useState();
  const [reason, setReason] = useState();

  let collectiveAddress;
  let currentChainInfo;
  if (chain) {
    currentChainInfo = CHAIN_INFORMATION[chain.id].avalanche;
    collectiveAddress = currentChainInfo.collectiveAddress;
  }

  // READ FUNCTIONS
  const { data: userMeetsSavingTarget } = useContractRead({
    address: collectiveAddress,
    abi: COLLECTIVE_CORE_ABI,
    functionName: "getUserMeetsSavingTarget",
    args: [user],
  });

  const { data: progressPercent } = useContractRead({
    address: collectiveAddress,
    abi: COLLECTIVE_CORE_ABI,
    functionName: "getUserSavingCompletionPercentage",
    args: [user],
  });

  const { data: userShareInPool } = useContractRead({
    address: collectiveAddress,
    abi: COLLECTIVE_CORE_ABI,
    functionName: "getUsersShareInInterestPool",
    args: [user],
  });

  const { data: userSavingDetails } = useContractRead({
    address: collectiveAddress,
    abi: COLLECTIVE_CORE_ABI,
    functionName: "getUserSavingsDetails",
    args: [user],
  });

  const { data: userSavingTimeLeft } = useContractRead({
    address: collectiveAddress,
    abi: COLLECTIVE_CORE_ABI,
    functionName: "getUserTimeLeftForSavingInSeconds",
    args: [user],
  });

  const { data: userSavingBalance } = useContractRead({
    address: collectiveAddress,
    abi: COLLECTIVE_CORE_ABI,
    functionName: "getUserSavingBalance",
    args: [user],
  });

  const { data: userSavingStatus } = useContractRead({
    address: collectiveAddress,
    abi: COLLECTIVE_CORE_ABI,
    functionName: "getUserSavingStatus",
    args: [user],
  });

  // WRITE FUNCTIONS

  // approve
  const { config: approveConfig } = usePrepareContractWrite({
    address: currentChainInfo && currentChainInfo.wrappedAsset,
    abi: ERC20_ABI,
    functionName: "approve",
    args: [collectiveAddress, amount * 1e18],
  });
  const {
    data: approveData,
    isLoading: loadingApprove,
    error: approveError,
    write: approveAsset,
  } = useContractWrite(approveConfig);

  // start saving
  const { config: startSavingConfig } = usePrepareContractWrite({
    address: collectiveAddress,
    abi: COLLECTIVE_CORE_ABI,
    functionName: "startSavings",
    args: [
      currentChainInfo && currentChainInfo.wrappedAsset,
      amount * 1e18,
      time,
      reason,
      [avaxAmount * 1e18, opEthAmount * 1e18, maticAmount * 1e18],
    ],
  });
  const {
    data: startSaveTxHash,
    isLoading: loadingStartSave,
    error: startSavingError,
    write: startSaving,
  } = useContractWrite(startSavingConfig);

  // top savings
  // topUpSavings(address asset, uint256 amount)
  const { config: topUpSavingsConfig } = usePrepareContractWrite({
    address: collectiveAddress,
    abi: COLLECTIVE_CORE_ABI,
    functionName: "topUpSavings",
    args: [currentChainInfo && currentChainInfo.wrappedAsset, amount * 1e18],
  });
  const {
    data: topUpSaveTxHash,
    isLoading: loadingTopUpSave,
    error: topUpError,
    write: topUpSavings,
  } = useContractWrite(topUpSavingsConfig);

  // break savings
  const { config: breakSavingsConfig } = usePrepareContractWrite({
    address: collectiveAddress,
    abi: COLLECTIVE_CORE_ABI,
    functionName: "breakSavings",
  });
  const {
    data: breakSavingsData,
    isLoading: breakSavingsLoading,
    error: breakSavingsError,
    write: breakSavings,
  } = useContractWrite(breakSavingsConfig);

  // withdraw savings
  const { config: withdrawSavingsConfig } = usePrepareContractWrite({
    address: collectiveAddress,
    abi: COLLECTIVE_CORE_ABI,
    functionName: "withdrawSavings",
  });
  const {
    data: withdrawSavingData,
    isLoading: withdrawSavingLoad,
    error: withdrawSavingError,
    write: withdrawSaving,
  } = useContractWrite(withdrawSavingsConfig);

  // HELPERS
  function getAmountToDepositDependingOnChain(chainInfo) {
    if (chainInfo.name == "Avalanche") {
      return avaxAmount;
    }

    if (chainInfo.name == "Optimism") {
      return opEthAmount;
    }

    if (chainInfo.name == "Polygon") {
      return maticAmount;
    }
  }

  return (
    <div>
      <div className="left">
        <ClientOnly>
          {userSavingStatus && (
            <div className="time-left">
              <h4>Time Left</h4>
              <p>{formatTime(userSavingTimeLeft.toString())} Left</p>
            </div>
          )}
        </ClientOnly>

        {/* users svaing balance */}
        <div className="saving-balance">
          <h3>Your Savings Balance </h3>

          <div className="saving-balance-details">
            <div>
              <Image src="/avaxLogo.png" width="60" height="30" />
              <ClientOnly>
                {userSavingBalance && (
                  <p>
                    {(userSavingBalance.wAVAX.toString() / 1e18).toFixed(4)}
                  </p>
                )}
              </ClientOnly>
            </div>

            <div>
              <Image src="/optimismLogo.png" width="60" height="30" />
              <ClientOnly>
                {userSavingBalance && (
                  <p>{(userSavingBalance.wOP.toString() / 1e18).toFixed(4)}</p>
                )}
              </ClientOnly>
            </div>

            <div>
              <Image src="/maticLogo.png" width="60" height="30" />
              <ClientOnly>
                {userSavingBalance && (
                  <p>
                    {(userSavingBalance.wMATIC.toString() / 1e18).toFixed(4)}
                  </p>
                )}
              </ClientOnly>
            </div>
          </div>
        </div>

        {/* user target */}
        <ClientOnly>
          {userSavingStatus && (
            <div>
              <h3>Your Savings Target </h3>

              <div>
                <div>
                  <Image src="/temp.png" width="60" height="30" />
                  <ClientOnly>
                    {userSavingDetails && (
                      <p>
                        {(
                          userSavingDetails.savingsTarget.wOP.toString() / 1e18
                        ).toFixed(4)}
                      </p>
                    )}
                  </ClientOnly>
                </div>

                <div>
                  <Image src="/temp.png" width="60" height="30" />
                  <ClientOnly>
                    {userSavingDetails && (
                      <p>
                        {(
                          userSavingDetails.savingsTarget.wMATIC.toString() /
                          1e18
                        ).toFixed(4)}
                      </p>
                    )}
                  </ClientOnly>
                </div>

                <div>
                  <Image src="/temp.png" width="60" height="30" />
                  <ClientOnly>
                    {userSavingDetails && (
                      <p>
                        {(
                          userSavingDetails.savingsTarget.wAVAX.toString() /
                          1e18
                        ).toFixed(4)}
                      </p>
                    )}
                  </ClientOnly>
                </div>
              </div>
            </div>
          )}
        </ClientOnly>

        {/* set user saving target */}
        <ClientOnly>
          {!userSavingStatus && (
            <div className="set-saving-target">
              <h3>Start Savings</h3>
              <h5>Set Saving Target</h5>

              <div className="target-input-container">
                <div>
                  <Image src="/avaxLogo.png" width="60" height="30" />
                  <input
                    placeholder="0.00001"
                    type="number"
                    onChange={(e) => setAvaxAmount(e.target.value)}
                  />
                </div>

                <div>
                  <Image src="/optimismLogo.png" width="60" height="30" />
                  <input
                    placeholder="0.00001"
                    type="number"
                    onChange={(e) => setOpEthAmount(e.target.value)}
                  />
                </div>

                <div>
                  <Image src="/maticLogo.png" width="60" height="30" />
                  <input
                    placeholder="0.00001"
                    type="number"
                    onChange={(e) => setMaticAmount(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </ClientOnly>

        {/* progress bar */}
        <ClientOnly>
          {userSavingStatus && (
            <div>
              <h5>Progress Bar</h5>
              {/* redeploy and test this */}
              {progressPercent && <p>{progressPercent.toString()} %</p>}
              <div>Im supposed to be the progress bar</div>
            </div>
          )}
        </ClientOnly>

        {/* top up savings */}
        <ClientOnly>
          {userSavingStatus &&
            userSavingTimeLeft &&
            userSavingTimeLeft.toString() > 0 &&
            !userMeetsSavingTarget && (
              <div>
                <h3>Top Up Savings</h3>
                <Image src="/temp.png" width="20" height="40" />
                <input onChange={(e) => setAmount(e.target.value)} />
                <button onClick={() => approveAsset?.()}>Approve</button>
                <button onClick={() => topUpSavings?.()}>Top Up</button>
                <p>Tx Hash: {topUpSaveTxHash && topUpSaveTxHash.hash}</p>
              </div>
            )}
        </ClientOnly>

        {/* start savings */}
        <ClientOnly>
          {!userSavingStatus && (
            <div className="start-saving-info">
              <div className="set-time">
                <input
                  placeholder="time in sec"
                  onChange={(e) => setTime(e.target.value)}
                />
                <p>{time && formatTime(time)}</p>
              </div>

              <textarea
                placeholder="Reason"
                className="reason-input"
                onChange={(e) => setReason(e.target.value)}
              />

              <Image
                src={getProtocolProfitImage(currentChainInfo.name)}
                width="40"
                height="20"
              />
              <input
                placeholder="Amount"
                className="amount-input"
                onChange={(e) => setAmount(e.target.value)}
              />
              <button
                onClick={() => approveAsset?.()}
                className="approve-button"
              >
                Approve
              </button>
              {approveData && (
                <p>
                  Tx Hash: {approveData && !startSaveTxHash && approveData.hash}
                </p>
              )}

              <button onClick={() => startSaving?.()} className="write-button">
                Save
              </button>
              {startSaveTxHash && (
                <p>Tx Hash: {startSaveTxHash && startSaveTxHash.hash}</p>
              )}
            </div>
          )}
        </ClientOnly>
      </div>

      {/* ALL DETAILS ON RHS REQUIRE THE USER TO HAVE AN ACTIVE SAVING */}
      <ClientOnly>
        {userSavingStatus && (
          <div className="right">
            {/* saving reason */}
            <ClientOnly>
              <div>
                <h3>Saving Reason</h3>
                {userSavingDetails && <p>{userSavingDetails.reason}</p>}
              </div>
            </ClientOnly>

            {/* break save */}
            <ClientOnly>
              {userSavingTimeLeft &&
                userSavingTimeLeft.toString() > 0 &&
                !userMeetsSavingTarget && (
                  <div>
                    <h2>Break Save</h2>
                    <p>
                      Breaking your save without reaching the intended timeline
                      or specifioed target will lead to a fee attracted on all
                      saved asset on withdrawal.
                    </p>

                    <p>
                      Current Fee: <b>{currentChainInfo.savingFee} %</b>
                    </p>

                    <button onClick={() => breakSavings?.()}>
                      Break Savings
                    </button>
                  </div>
                )}
            </ClientOnly>

            {/* withdraw save */}
            <ClientOnly>
              {userSavingTimeLeft <= 0 && progressPercent.toString() >= 100 && (
                <div>
                  <h2>Withdraw Savings</h2>
                  <p>
                    You've succesfully reached your savings target within the
                    stipulated time you set. Congratulations! Withdraw your
                    savings.
                  </p>

                  <p>
                    Current Fee: <b>0 %</b>
                  </p>

                  <button onClick={() => withdrawSaving?.()}>Withdraw</button>
                </div>
              )}
            </ClientOnly>

            {/* how much the user would receive on Break */}
            <ClientOnly>
              {userSavingTimeLeft &&
                userSavingTimeLeft.toString() > 0 &&
                !userMeetsSavingTarget &&
                userSavingBalance &&
                userShareInPool && (
                  <div>
                    <h3>How Much You'd receive</h3>
                    <div>
                      <div>
                        <Image src="/temp.png" height="40" width="30" />
                        <p>
                          {(userSavingBalance.wAVAX.toString() * 0.75) / 1e18}
                        </p>
                      </div>
                      <div>
                        <Image src="/temp.png" height="40" width="30" />
                        <p>{(userSavingBalance.wOP.toString() * 0.8) / 1e18}</p>
                      </div>
                      <div>
                        <Image src="/temp.png" height="40" width="30" />
                        <p>
                          {(userSavingBalance.wAVAX.toString() * 0.7) / 1e18}
                        </p>
                      </div>

                      <div>
                        <Image src="/temp.png" height="40" width="30" />
                        <p>0</p>
                      </div>
                    </div>
                  </div>
                )}
            </ClientOnly>

            {/* how much the user would receive on withdrawal */}
            <ClientOnly>
              {userSavingTimeLeft &&
                userSavingTimeLeft.toString() <= 0 &&
                userMeetsSavingTarget &&
                userSavingBalance &&
                userShareInPool && (
                  <div>
                    <h3>How Much You'd receive</h3>
                    <div>
                      <div>
                        <Image src="/temp.png" height="40" width="30" />
                        <p>{userSavingBalance.wAVAX.toString()}</p>
                      </div>
                      <div>
                        <Image src="/temp.png" height="40" width="30" />
                        <p>{userSavingBalance.wOP.toString()}</p>
                      </div>
                      <div>
                        <Image src="/temp.png" height="40" width="30" />
                        <p>{userSavingBalance.wAVAX.toString()}</p>
                      </div>

                      <div>
                        <Image src="/temp.png" height="40" width="30" />
                        <p>{userShareInPool.toString() / 1e18}</p>
                      </div>
                    </div>
                  </div>
                )}
            </ClientOnly>
          </div>
        )}
      </ClientOnly>
    </div>
  );
}

// we get the saving status of the user
// if they have a saving display: have saving component
// if they dont display: start saving component

// inside these components there should be a way to check if the user saved and met his target or not
// then display break or withdraw component
