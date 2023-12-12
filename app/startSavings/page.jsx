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
import {
  CURRENTCHAIN,
  formatTime,
  getHashLink,
  getProgressBarColor,
  getProtocolProfitImage,
} from "@/utils/helpers";
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
    // currentChainInfo = CHAIN_INFORMATION[chain.id][CURRENTCHAIN];
    currentChainInfo = CHAIN_INFORMATION[chain.id];

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

  const { data: userShareInPool, isSuccess: fetchedUserShareInPool } =
    useContractRead({
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

  const { data: userSavingTimeLeft, isSuccess: userSavingTimeLeftFetched } =
    useContractRead({
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

  // start saving
  const { config: startSavingConfig, error: startSavingErr } =
    usePrepareContractWrite({
      address: collectiveAddress,
      abi: COLLECTIVE_CORE_ABI,
      functionName: "startSavings",
      args: [
        currentChainInfo && currentChainInfo.wrappedAsset,
        amount && amount * 1e18,
        time,
        reason,
        [avaxAmount * 1e18, opEthAmount * 1e18, maticAmount * 1e18],
      ],
    });
  const {
    data: startSaveTxHash,
    isLoading: loadingStartSave,
    write: startSaving,
  } = useContractWrite(startSavingConfig);

  // approve
  const { config: approveConfig } = usePrepareContractWrite({
    address: currentChainInfo && currentChainInfo.wrappedAsset,
    abi: ERC20_ABI,
    functionName: "approve",
    args: [collectiveAddress, amount && amount * 1e18],
  });
  const {
    data: approveData,
    isLoading: loadingApprove,
    error: approveError,
    write: approveAsset,
  } = useContractWrite(approveConfig);

  // top savings
  const { config: topUpSavingsConfig } = usePrepareContractWrite({
    address: collectiveAddress,
    abi: COLLECTIVE_CORE_ABI,
    functionName: "topUpSavings",
    args: [
      currentChainInfo && currentChainInfo.wrappedAsset,
      amount && amount * 1e18,
    ],
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

  function displayStartSavingError() {
    if (currentChainInfo.name == "Avalanche") {
      if (amount >= avaxAmount) {
        return "Error: Saving Amount Is Greater Than Or Equal To Target";
      }
    }
    if (currentChainInfo.name == "Optimism") {
      if (amount >= opEthAmount) {
        return "Error: Saving Amount Is Greater Than Or Equal To Target";
      }
    }
    if (currentChainInfo.name == "Polygon") {
      if (amount >= maticAmount) {
        return "Error: Saving Amount Is Greater Than Or Equal To Target";
      }
    }

    if (amount <= 0) {
      return "Error: Amount Cannot Be Zero";
    }

    if (time <= 0) {
      return "Error: Saving Time Cannot Be Zero";
    }

    if (avaxAmount == 0 || opEthAmount == 0 || maticAmount == 0) {
      return "Error: Cant Have A Saving Target Of Zero";
    }
  }

  return (
    <div className="save-container">
      <div className="left">
        <ClientOnly>
          {userSavingStatus && (
            <div className="time-left">
              <h4>Time Left</h4>
              {userSavingTimeLeftFetched && (
                <p>
                  {userSavingTimeLeft.toString() == "0"
                    ? "Ended"
                    : formatTime(userSavingTimeLeft.toString())}
                </p>
              )}
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
            <div className="saving-balance">
              <h3>Your Savings Target </h3>

              <div className="saving-balance-details">
                <div>
                  <Image src="/avaxLogo.png" width="60" height="30" />
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

                <div>
                  <Image src="/optimismLogo.png" width="60" height="30" />
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
                  <Image src="/maticLogo.png" width="60" height="30" />
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
              </div>
            </div>
          )}
        </ClientOnly>

        {/* set user saving target */}
        <ClientOnly>
          {!userSavingStatus && (
            <div className="set-saving-target">
              <h3>Start Savings</h3>
              <h5>Target</h5>

              <div className="target-input-container">
                <div>
                  <Image src="/avaxLogo.png" width="60" height="30" />
                  <input
                    placeholder="0.0000"
                    type="number"
                    onChange={(e) => setAvaxAmount(e.target.value)}
                  />
                </div>

                <div>
                  <Image src="/optimismLogo.png" width="60" height="30" />
                  <input
                    placeholder="0.0000"
                    type="number"
                    onChange={(e) => setOpEthAmount(e.target.value)}
                  />
                </div>

                <div>
                  <Image src="/maticLogo.png" width="60" height="30" />
                  <input
                    placeholder="0.0000"
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
            <div className="progress-bar">
              <h5>Progress Bar</h5>
              {/* redeploy and test this */}
              {progressPercent && <p>{progressPercent.toString()} %</p>}
              {progressPercent && (
                <div
                  className={`progress-bar-${getProgressBarColor(
                    progressPercent.toString()
                  )}`}
                ></div>
              )}
            </div>
          )}
        </ClientOnly>

        {/* top up savings */}
        <ClientOnly>
          {userSavingStatus &&
            userSavingTimeLeft &&
            userSavingTimeLeft.toString() > 0 &&
            !userMeetsSavingTarget && (
              <div className="top-up-savings">
                <h3>Top Up Savings</h3>
                <div>
                  <Image
                    src={getProtocolProfitImage(currentChainInfo.name)}
                    width="20"
                    height="40"
                  />
                  <input onChange={(e) => setAmount(e.target.value)} />
                  <button
                    onClick={() => approveAsset?.()}
                    className="approve-button"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => topUpSavings?.()}
                    className="write-button"
                  >
                    Top Up
                  </button>
                </div>
              </div>
            )}

          {topUpSaveTxHash && (
            <a
              className="tx-hash-link"
              target="_blank"
              href={getHashLink(topUpSaveTxHash.hash, currentChainInfo.name)}
            >
              Top Up Save Transaction Details &gt;
            </a>
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

              <div className="set-amount-container">
                <Image
                  src={getProtocolProfitImage(
                    currentChainInfo && currentChainInfo.name
                  )}
                  width="40"
                  height="20"
                />
                <input
                  placeholder="Amount"
                  className="amount-input"
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <p style={{ margin: "10px 0px" }}>
                Note: Always Approve The Amount You Wish To Save Before
                Initiating Save
              </p>

              {amount && <p className="error">{displayStartSavingError()}</p>}
              {startSavingErr &&
                startSavingErr.message &&
                startSavingErr.message.includes("0xfb8f41b2") && (
                  <p className="error">Insufficient Token Approval</p>
                )}

              {startSavingErr &&
                startSavingErr.message &&
                startSavingErr.message.includes("0xe450d38c") && (
                  <p className="error">Insufficient Token Balance</p>
                )}

              <button
                onClick={() => approveAsset?.()}
                className="approve-button"
              >
                Approve
              </button>
              {approveData && !startSaveTxHash && (
                <a
                  className="tx-hash-link"
                  target="_blank"
                  href={getHashLink(approveData.hash, currentChainInfo.name)}
                >
                  Approve Transaction Details &gt;
                </a>
              )}

              <button onClick={() => startSaving?.()} className="write-button">
                Save
              </button>

              {startSaveTxHash && (
                <a
                  className="tx-hash-link"
                  target="_blank"
                  href={getHashLink(
                    startSaveTxHash.hash,
                    currentChainInfo.name
                  )}
                >
                  Save Transaction Details &gt;
                </a>
              )}
            </div>
          )}
        </ClientOnly>
      </div>

      {/* ALL DETAILS ON RHS REQUIRE THE USER TO HAVE AN ACTIVE SAVING */}
      <ClientOnly>
        {userSavingStatus && (
          <div className="right">
            {/* break save */}
            <ClientOnly>
              {userSavingTimeLeftFetched && !userMeetsSavingTarget && (
                <div className="break-or-withdraw-save">
                  {/* saving reason */}
                  <ClientOnly>
                    <div className="saving-reason">
                      <h3>Saving Reason</h3>
                      {userSavingDetails && <p>{userSavingDetails.reason}</p>}
                    </div>
                  </ClientOnly>

                  <h2>Break Save</h2>
                  <p>
                    Breaking your save without reaching the intended timeline or
                    specifioed target will lead to a fee attracted on all saved
                    asset on withdrawal.
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
              {userSavingTimeLeftFetched &&
                userSavingTimeLeft.toString() <= 0 &&
                progressPercent.toString() >= 100 && (
                  <div className="break-or-withdraw-save">
                    {/* saving reason */}
                    <ClientOnly>
                      <div className="saving-reason">
                        <h3>Saving Reason</h3>
                        {userSavingDetails && <p>{userSavingDetails.reason}</p>}
                      </div>
                    </ClientOnly>

                    <h2>Withdraw Savings</h2>
                    <p>
                      You've succesfully reached your savings target within the
                      stipulated time you set. Congratulations! Withdraw your
                      savings.
                    </p>

                    <p>
                      Current Fee: <b>0 %</b>
                    </p>

                    <button
                      onClick={() => withdrawSaving?.()}
                      style={{ backgroundColor: "#4FA516" }}
                    >
                      Withdraw
                    </button>

                    {userSavingDetails &&
                      userSavingDetails.withdrawalChainSelector.toString() !=
                        currentChainInfo.chainSelector && (
                        <p className="error">
                          Error: Cannot Initiate Withdrawal On This Chain: Not
                          Your Save Chain
                        </p>
                      )}
                  </div>
                )}
            </ClientOnly>

            {/* if user has saved completely but time hasnt arrived */}
            <ClientOnly>
              {userMeetsSavingTarget &&
                userSavingTimeLeftFetched &&
                userSavingTimeLeft.toString() > 0 &&
                fetchedUserShareInPool && (
                  <div className="reached-target-not-time">
                    <h3>Congratulations! You Reached Your Saving Target!</h3>
                    <p className="reached-target-not-time-p">
                      We're happy you've reached your saving target but you'd
                      have to wait till the saving time is over to unlock your
                      savings and interest.
                    </p>
                    <p>Thanks For Saving With Us!!</p>

                    <h3>OR</h3>
                    <p className="reached-target-not-time-p">
                      If The funds are really important to you right now. Please
                      feel free to break your savings.
                    </p>

                    <div className="break-or-withdraw-save">
                      <h2>Break Save</h2>
                      <p>
                        Breaking your save without reaching the intended
                        timeline or specifioed target will lead to a fee
                        attracted on all saved asset on withdrawal.
                      </p>

                      <p>
                        Current Fee: <b>{currentChainInfo.savingFee} %</b>
                      </p>

                      <button onClick={() => breakSavings?.()}>
                        Break Savings
                      </button>

                      <div className="receive-from-end">
                        <h3>How Much You'd receive</h3>
                        <div>
                          <div>
                            <Image src="/avaxLogo.png" height="40" width="30" />
                            <p>
                              {(
                                (userSavingBalance.wAVAX.toString() * 0.75) /
                                1e18
                              ).toFixed(4)}
                            </p>
                          </div>
                          <div>
                            <Image
                              src="/optimismLogo.png"
                              height="40"
                              width="30"
                            />
                            <p>
                              {(
                                (userSavingBalance.wOP.toString() * 0.8) /
                                1e18
                              ).toFixed(4)}
                            </p>
                          </div>
                        </div>

                        <div>
                          <div>
                            <Image
                              src="/maticLogo.png"
                              height="40"
                              width="30"
                            />
                            <p>
                              {(
                                (userSavingBalance.wMATIC.toString() * 0.7) /
                                1e18
                              ).toFixed(4)}
                            </p>
                          </div>

                          <div>
                            <Image src="/usdtLogo.png" height="40" width="30" />
                            <p>{(0).toFixed(4)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            </ClientOnly>

            {/* how much the user would receive on Break */}
            <ClientOnly>
              {!userMeetsSavingTarget &&
                userSavingBalance &&
                fetchedUserShareInPool && (
                  <div className="receive-from-end">
                    <h3>How Much You'd receive</h3>
                    <div>
                      <div>
                        <Image src="/avaxLogo.png" height="40" width="30" />
                        <p>
                          {(
                            (userSavingBalance.wAVAX.toString() * 0.75) /
                            1e18
                          ).toFixed(4)}
                        </p>
                      </div>
                      <div>
                        <Image src="/optimismLogo.png" height="40" width="30" />
                        <p>
                          {(
                            (userSavingBalance.wOP.toString() * 0.8) /
                            1e18
                          ).toFixed(4)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div>
                        <Image src="/maticLogo.png" height="40" width="30" />
                        <p>
                          {(
                            (userSavingBalance.wMATIC.toString() * 0.7) /
                            1e18
                          ).toFixed(4)}
                        </p>
                      </div>

                      <div>
                        <Image src="/usdtLogo.png" height="40" width="30" />
                        <p>{(0).toFixed(4)}</p>
                      </div>
                    </div>
                  </div>
                )}
            </ClientOnly>

            {/* how much the user would receive on withdrawal */}
            <ClientOnly>
              {userSavingTimeLeftFetched &&
                userSavingTimeLeft.toString() <= 0 &&
                userMeetsSavingTarget &&
                userSavingBalance &&
                fetchedUserShareInPool && (
                  <div className="receive-from-end">
                    <h3>How Much You'd receive</h3>
                    <div>
                      <div>
                        <Image src="/avaxLogo.png" height="40" width="30" />
                        <p>
                          {(userSavingBalance.wAVAX.toString() / 1e18).toFixed(
                            4
                          )}
                        </p>
                      </div>
                      <div>
                        <Image src="/optimismLogo.png" height="40" width="30" />
                        <p>
                          {(userSavingBalance.wOP.toString() / 1e18).toFixed(4)}
                        </p>
                      </div>
                      <div>
                        <Image src="/maticLogo.png" height="40" width="30" />
                        <p>
                          {(userSavingBalance.wMATIC.toString() / 1e18).toFixed(
                            4
                          )}
                        </p>
                      </div>

                      <div>
                        <Image src="/usdtLogo.png" height="40" width="30" />
                        <p>{(userShareInPool.toString() / 1e18).toFixed(4)}</p>
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
