"use client";

import ClientOnly from "@/components/ClientOnly";
import { CHAIN_INFORMATION } from "@/utils/ChainInformation";
import { COLLECTIVE_CORE_ABI, ERC20_ABI } from "@/utils/abi";
import {
  CURRENTCHAIN,
  formatTime,
  getGrouProgressPercent,
  getGroupSavingTimeLeft,
  getHashLink,
  getProgressBarColor,
  getProtocolProfitImage,
  truncateEthereumAddress,
} from "@/utils/helpers";
import Image from "next/image";
import { useState } from "react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from "wagmi";

export default function GroupSavings() {
  const [showGroup, setShowGroup] = useState("none");
  const [selectedSearchGroupID, setSelectedSearchGroup] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState(false);
  const [amount, setAmount] = useState();

  // create group
  const [groupReason, setGroupReason] = useState();
  const [groupRecipient, setGroupRecipient] = useState();
  const [groupTime, setGroupTime] = useState();
  const [createAvaxTarget, setCreateAvaxTarget] = useState();
  const [createOpEthTarget, setCreateOpEthTarget] = useState();
  const [createMaticTarget, setCreateMaticTarget] = useState();

  const { chain } = useNetwork();
  const { address: user } = useAccount();

  let collectiveAddress;
  let currentChainInfo;
  if (chain) {
    // currentChainInfo = CHAIN_INFORMATION[chain.id][CURRENTCHAIN];
    currentChainInfo = CHAIN_INFORMATION[chain.id];

    collectiveAddress = currentChainInfo.collectiveAddress;
    console.log(currentChainInfo.collectiveAddress);
    console.log(selectedGroup);
  }

  // write functions

  // create
  const { config: createGroupConfig, error: createGroupError } =
    usePrepareContractWrite({
      address: collectiveAddress,
      abi: COLLECTIVE_CORE_ABI,
      functionName: "createGroupSavings",
      args: [
        amount && amount * 1e18,
        groupReason,
        groupRecipient,
        groupTime,
        [
          createAvaxTarget * 1e18,
          createOpEthTarget * 1e18,
          createMaticTarget * 1e18,
        ],
      ],
    });
  const {
    data: createGroupData,
    isLoading: createGroupLoading,
    write: createGroup,
  } = useContractWrite(createGroupConfig);

  // dispatch
  const { config: dispatchConfig } = usePrepareContractWrite({
    address: collectiveAddress,
    abi: COLLECTIVE_CORE_ABI,
    functionName: "dispatchGroupFundsToRecipient",
    args: [selectedGroup && selectedGroup],
  });
  const {
    data: dispatchData,
    isLoading: dispatchLoading,
    error: dispatchError,
    write: dispatchGroupFunds,
  } = useContractWrite(dispatchConfig);

  // claim group conribution
  const { config: claimGroupContributionConfig } = usePrepareContractWrite({
    address: collectiveAddress,
    abi: COLLECTIVE_CORE_ABI,
    functionName: "claimGroupContribution",
    args: [selectedGroup && selectedGroup],
  });
  const {
    data: claimGroupContributionData,
    isLoading: claimGroupContributionLoading,
    error: claimGroupContributionError,
    write: claimGroupContribution,
  } = useContractWrite(claimGroupContributionConfig);

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

  // contribute
  const { config: contributeConfig, error: contributeGroupErr } =
    usePrepareContractWrite({
      address: collectiveAddress,
      abi: COLLECTIVE_CORE_ABI,
      functionName: "contributeToGroup",
      args: [selectedGroup && selectedGroup, amount && amount * 1e18],
    });
  const { write: contribute } = useContractWrite(contributeConfig);

  // read functions
  const { data: userContributionToGroup } = useContractRead({
    address: collectiveAddress,
    abi: COLLECTIVE_CORE_ABI,
    functionName: "getUserGroupContribution",
    args: [selectedGroup && selectedGroup, user],
  });

  const { data: currentTimeStamp } = useContractRead({
    address: collectiveAddress,
    abi: COLLECTIVE_CORE_ABI,
    functionName: "getBlockTimestamp",
  });

  const { data: allGroups } = useContractRead({
    address: collectiveAddress,
    abi: COLLECTIVE_CORE_ABI,
    functionName: "getOngoinGroupSavings",
  });

  const { data: userMemeberStatus } = useContractRead({
    address: collectiveAddress,
    abi: COLLECTIVE_CORE_ABI,
    functionName: "getUserMemebrshipStatus",
    args: [selectedGroup & selectedGroup, user && user],
  });

  const { data: groupDispatchStatus } = useContractRead({
    address: collectiveAddress,
    abi: COLLECTIVE_CORE_ABI,
    functionName: "getGroupDispatchStatus",
    args: [selectedGroup & selectedGroup],
  });

  function displayCreateGroupError() {
    if (currentChainInfo.name == "Avalanche") {
      if (amount >= createAvaxTarget) {
        return "Error: Saving Amount Is Greater Than Or Equal To Target";
      }
    }
    if (currentChainInfo.name == "Optimism") {
      if (amount >= createOpEthTarget) {
        return "Error: Saving Amount Is Greater Than Or Equal To Target";
      }
    }
    if (currentChainInfo.name == "Polygon") {
      if (amount >= createMaticTarget) {
        return "Error: Saving Amount Is Greater Than Or Equal To Target";
      }
    }

    if (amount <= 0) {
      return "Error: Amount Cannot Be Zero";
    }

    if (groupTime <= 0) {
      return "Error: Saving Time Cannot Be Zero";
    }

    if (
      createAvaxTarget == 0 ||
      createOpEthTarget == 0 ||
      createMaticTarget == 0
    ) {
      return "Error: Cant Have A Saving Target Of Zero";
    }
  }

  if (userContributionToGroup) {
    console.log(userContributionToGroup);
    console.log(currentTimeStamp);
  }

  return (
    <div>
      <div className="group-nav">
        <p
          onClick={() => {
            setShowGroup(1);
            setSelectedGroup(false);
          }}
        >
          Ongoing
        </p>
        <p
          onClick={() => {
            setShowGroup(2);
            setSelectedGroup(false);
          }}
        >
          Completed
        </p>
        <p
          onClick={() => {
            setShowGroup(3);
            setSelectedGroup(false);
          }}
        >
          Create
        </p>
        <p
          onClick={() => {
            setShowGroup(4);
            setSelectedGroup(false);
          }}
        >
          Join
        </p>
      </div>

      <div className="group-container">
        {/* ---- LEFT ---- */}
        <div className="left">
          {showGroup == "none" && (
            <div>
              <p>Select An Option</p>
            </div>
          )}
          {/* display ongoing groups i.etheir time has not been exhausted*/}
          {showGroup == 1 && (
            <ClientOnly>
              {allGroups &&
                currentTimeStamp &&
                allGroups.map((group, index) => {
                  let counter = 0;
                  if (
                    parseInt(group.savingStopTime) > parseInt(currentTimeStamp)
                  ) {
                    counter += 1;
                    return (
                      <div
                        className="group-box"
                        onClick={() => {
                          setSelectedGroup(group.groupID.toString());
                        }}
                        key={index}
                      >
                        <div className="top">
                          <div>
                            <span>Group ID</span>
                            <p>{group.groupID.toString()}</p>
                          </div>

                          <div>
                            <span>Creator</span>
                            <p>{group.creator}</p>
                          </div>
                        </div>

                        <span>Purpose</span>
                        <p>{group.purpose}</p>
                      </div>
                    );
                  }

                  if (index + 1 == allGroups.length) {
                    if (counter == 0) {
                      return <div key={index}>No Ongoing Group Savings</div>;
                    }
                  }
                })}

              {allGroups && allGroups.length == 0 && <p>No Group Exists</p>}
            </ClientOnly>
          )}

          {/* display completed groups i.etheir time has not been exhausted*/}
          {showGroup == 2 && (
            <ClientOnly>
              {allGroups &&
                currentTimeStamp &&
                allGroups.map((group, index) => {
                  let counter = 0;
                  if (
                    parseInt(group.savingStopTime) < parseInt(currentTimeStamp)
                  ) {
                    counter += 1;
                    return (
                      <div
                        className="group-box"
                        onClick={() =>
                          setSelectedGroup(group.groupID.toString())
                        }
                        key={index}
                      >
                        <div className="top">
                          <div>
                            <span>Group ID</span>
                            <p>{group.groupID.toString()}</p>
                          </div>

                          <div>
                            <span>Creator</span>
                            <p>{group.creator}</p>
                          </div>
                        </div>

                        <span>Purpose</span>
                        <p>{group.purpose}</p>
                      </div>
                    );
                  }

                  if (index + 2 == allGroups.length) {
                    if (counter == 0) {
                      return <div key={index}>No Completed Group Savings</div>;
                    }
                  }
                })}

              {allGroups && allGroups.length == 0 && <p>No Group Exists</p>}
            </ClientOnly>
          )}

          {/* display create group */}
          {showGroup == 3 && (
            <ClientOnly>
              <div className="create-group">
                <h3>Group Details</h3>
                <input
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount"
                  className="create-group-input"
                />
                <textarea
                  onChange={(e) => setGroupReason(e.target.value)}
                  placeholder="Saving Reason"
                  className="reason-input"
                />
                <input
                  onChange={(e) => setGroupTime(e.target.value)}
                  placeholder="Time"
                  className="create-group-input"
                />
                <p>{groupTime && formatTime(groupTime)}</p>

                <input
                  onChange={(e) => setGroupRecipient(e.target.value)}
                  placeholder="Recipient"
                  className="create-group-input"
                />
                <h3 className="target-h3">Target</h3>
                <div className="target-input-container">
                  <div>
                    <Image src="/avaxLogo.png" width="30" height="30" />
                    <input
                      onChange={(e) => setCreateAvaxTarget(e.target.value)}
                      placeholder="0.0000"
                    />
                  </div>

                  <div>
                    <Image src="/optimismLogo.png" width="30" height="30" />
                    <input
                      onChange={(e) => setCreateOpEthTarget(e.target.value)}
                      placeholder="0.0000"
                    />
                  </div>

                  <div>
                    <Image src="/maticLogo.png" width="30" height="30" />
                    <input
                      onChange={(e) => setCreateMaticTarget(e.target.value)}
                      placeholder="0.0000"
                    />
                  </div>
                </div>

                {createGroupError &&
                  createGroupError.message &&
                  createGroupError.message.includes("0xfb8f41b2") && (
                    <p className="error">Insufficient Token Approval</p>
                  )}

                {createGroupError &&
                  createGroupError.message &&
                  createGroupError.message.includes("0xe450d38c") && (
                    <p className="error">Insufficient Token Balance</p>
                  )}

                <p style={{ margin: "10px 0px" }}>
                  Note: Always Approve The Amount You Wish To Save Before
                  Initiating Save
                </p>

                <button
                  onClick={() => approveAsset?.()}
                  className="approve-button"
                >
                  Approve
                </button>
                {approveData && (
                  <a
                    className="tx-hash-link"
                    target="_blank"
                    href={getHashLink(approveData.hash, currentChainInfo.name)}
                  >
                    Approve Transaction Details &gt;
                  </a>
                )}

                <button
                  onClick={() => createGroup?.()}
                  className="write-button-create"
                >
                  Create Group
                </button>

                {createGroupData && (
                  <a
                    className="tx-hash-link"
                    target="_blank"
                    href={getHashLink(
                      createGroupData.hash,
                      currentChainInfo.name
                    )}
                  >
                    Create Transaction Details &gt;
                  </a>
                )}

                {amount && <p className="error">{displayCreateGroupError()}</p>}

                {currentChainInfo &&
                  currentChainInfo.chainSelector !=
                    CHAIN_INFORMATION["31337"].avalanche.chainSelector && (
                    <p className="error">
                      Error: Can only create group on Avalanche
                    </p>
                  )}
              </div>
            </ClientOnly>
          )}

          {/* dispay join group */}
          {showGroup == 4 && (
            <ClientOnly>
              <div className="join-group">
                <input
                  onChange={(e) => setSelectedSearchGroup(e.target.value)}
                  className="create-group-input "
                  placeholder="Search Group By ID"
                />
                <Image src="/search.png" width="60" height="35" />
              </div>
            </ClientOnly>
          )}

          {showGroup == 4 &&
          selectedSearchGroupID > 0 &&
          allGroups &&
          allGroups.length >= selectedSearchGroupID ? (
            <div
              className="group-box"
              onClick={() => setSelectedGroup(selectedSearchGroupID)}
            >
              <div>
                <div>
                  <span>Group ID</span>
                  <p>{selectedSearchGroupID}</p>
                </div>

                <div>
                  <span>Creator</span>
                  <p>{allGroups[selectedSearchGroupID - 1].creator}</p>
                </div>
              </div>

              <span>Purpose</span>
              <p>{allGroups[selectedSearchGroupID - 1].purpose}</p>
            </div>
          ) : (
            showGroup == 4 && <p>No Group With That ID Exists Currently</p>
          )}
        </div>

        {/* ----- RIGHT ----- */}

        <ClientOnly>
          {showGroup &&
            allGroups &&
            showGroup != 3 &&
            selectedGroup != false &&
            currentTimeStamp &&
            userContributionToGroup && (
              <div className="right">
                {/* The gorup ID */}
                <h3 className="group-id-right">Group ID: {selectedGroup}</h3>

                {/* withdraw contribution */}
                {showGroup == 2 &&
                  getGrouProgressPercent(
                    allGroups[selectedGroup - 1].amountRaised,
                    allGroups[selectedGroup - 1].target
                  ) < 100 && (
                    <div className="withdraw-contribution">
                      {(userContributionToGroup.wAVAX.toString() > 0 ||
                        userContributionToGroup.wOP.toString() > 0 ||
                        userContributionToGroup.wMATIC.toString() > 0) && (
                        <button
                          onClick={() => claimGroupContribution?.()}
                          className="write-button-withdraw"
                        >
                          Withdraw Contribution
                        </button>
                      )}
                      <p>
                        Current Fee: <b>{currentChainInfo.savingFee}</b> %
                      </p>
                    </div>
                  )}

                {/* Dispatch Saving */}
                {showGroup == 2 &&
                  getGrouProgressPercent(
                    allGroups[selectedGroup - 1].amountRaised,
                    allGroups[selectedGroup - 1].target
                  ) >= 100 &&
                  userMemeberStatus &&
                  !groupDispatchStatus && (
                    <ClientOnly>
                      <div className="dispatch-saving">
                        <button
                          onClick={() => dispatchGroupFunds?.()}
                          className="write-button-create"
                          style={{
                            backgroundColor: "#0ABB15",
                            margin: "10px 0px",
                          }}
                        >
                          Dispatch Saving
                        </button>
                        <p style={{ margin: "10px 0px" }}>Current Fee: 0</p>
                      </div>
                    </ClientOnly>
                  )}

                {/* contribute */}
                {showGroup == 1 && (
                  <div className="top-up-savings">
                    <h5 className="contribute-h5">Contribute</h5>
                    <div>
                      <Image
                        src={getProtocolProfitImage(currentChainInfo.name)}
                        width="30"
                        height="30"
                        alt="asset-logo"
                      />
                      <input onChange={(e) => setAmount(e.target.value)} />

                      {contributeGroupErr &&
                        contributeGroupErr.message &&
                        contributeGroupErr.message.includes("0xfb8f41b2") && (
                          <p className="error">Insufficient Token Approval</p>
                        )}
                      <button
                        onClick={() => approveAsset?.()}
                        className="approve-button"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => contribute?.()}
                        className="write-button-create"
                      >
                        Contribute
                      </button>
                    </div>
                  </div>
                )}

                {/* saving reason */}
                <div className="saving-purpose">
                  <h3>Group Saving Purpose</h3>
                  <p>{allGroups[selectedGroup - 1].purpose}</p>
                </div>

                {/* Time Left & Progress Bar */}
                <div className="time-left">
                  <h3>Time Left</h3>
                  <p>
                    {getGroupSavingTimeLeft(
                      allGroups[selectedGroup - 1].savingStopTime,
                      currentTimeStamp
                    )}
                  </p>
                </div>

                <div className="progress-bar">
                  <h5>Progress Bar</h5>
                  <p>
                    Progresssss:{" "}
                    {getGrouProgressPercent(
                      allGroups[selectedGroup - 1].amountRaised,
                      allGroups[selectedGroup - 1].target
                    )}{" "}
                    %
                  </p>
                  {
                    <div
                      className={`progress-bar-${getProgressBarColor(
                        getGrouProgressPercent(
                          allGroups[selectedGroup - 1].amountRaised,
                          allGroups[selectedGroup - 1].target
                        )
                      )}`}
                    ></div>
                  }
                </div>

                {/* memebers status, recipient */}
                <div className="members-status-recipient">
                  <div>
                    <h5>Members</h5>
                    <p>{allGroups[selectedGroup - 1].members.toString()}</p>
                  </div>
                  <div>
                    <h5>Status</h5>
                    {showGroup == 1 && <p>Ongoing</p>}
                    {showGroup == 2 && (
                      <p>
                        {getGrouProgressPercent(
                          allGroups[selectedGroup - 1].amountRaised,
                          allGroups[selectedGroup - 1].target
                        ) >= 100
                          ? "Success"
                          : "Failed"}
                      </p>
                    )}
                  </div>
                  <div>
                    <h5>Recipient</h5>
                    <p>
                      {truncateEthereumAddress(
                        allGroups[selectedGroup - 1].recipient
                      )}
                    </p>
                  </div>
                </div>

                {/* Amount Raised, Target & My Contribution */}
                <div>
                  {/* Target */}
                  <div>
                    <h5 className="balance-sub-head">Target</h5>
                    <div className="saving-balance-details">
                      <div>
                        <Image src="/avaxLogo.png" width="30" height="30" />
                        <p>
                          {(
                            allGroups[
                              selectedGroup - 1
                            ].target.wAVAX.toString() / 1e18
                          ).toFixed(3)}
                        </p>
                      </div>
                      <div>
                        <Image src="/optimismLogo.png" width="30" height="30" />
                        <p>
                          {(
                            allGroups[selectedGroup - 1].target.wOP.toString() /
                            1e18
                          ).toFixed(3)}
                        </p>
                      </div>
                      <div>
                        <Image src="/maticLogo.png" width="30" height="30" />
                        <p>
                          {(
                            allGroups[
                              selectedGroup - 1
                            ].target.wMATIC.toString() / 1e18
                          ).toFixed(3)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Amount Raised */}
                  <div>
                    <h5 className="balance-sub-head">Amount Raised</h5>
                    <div className="saving-balance-details">
                      <div>
                        <Image src="/avaxLogo.png" width="30" height="30" />
                        <p>
                          {(
                            allGroups[
                              selectedGroup - 1
                            ].amountRaised.wAVAX.toString() / 1e18
                          ).toFixed(4)}
                        </p>
                      </div>
                      <div>
                        <Image src="/optimismLogo.png" width="30" height="30" />
                        <p>
                          {(
                            allGroups[
                              selectedGroup - 1
                            ].amountRaised.wOP.toString() / 1e18
                          ).toFixed(4)}
                        </p>
                      </div>
                      <div>
                        <Image src="/maticLogo.png" width="30" height="30" />
                        <p>
                          {(
                            allGroups[
                              selectedGroup - 1
                            ].amountRaised.wMATIC.toString() / 1e18
                          ).toFixed(4)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* My contribution To Group */}
                  <ClientOnly>
                    {userContributionToGroup && (
                      <div>
                        <h5 className="balance-sub-head">My Amount Raised</h5>

                        <div className="saving-balance-details">
                          <div>
                            <Image src="/avaxLogo.png" width="30" height="30" />
                            <p>
                              {(
                                userContributionToGroup.wAVAX.toString() / 1e18
                              ).toFixed(4)}
                            </p>
                          </div>
                          <div>
                            <Image
                              src="/optimismLogo.png"
                              width="30"
                              height="30"
                            />
                            <p>
                              {(
                                userContributionToGroup.wOP.toString() / 1e18
                              ).toFixed(4)}
                            </p>
                          </div>
                          <div>
                            <Image
                              src="/maticLogo.png"
                              width="30"
                              height="30"
                            />
                            <p>
                              {(
                                userContributionToGroup.wMATIC.toString() / 1e18
                              ).toFixed(4)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </ClientOnly>
                </div>

                {/* Join Savings */}
                {showGroup == 3 && <button>Join</button>}
              </div>
            )}
        </ClientOnly>
      </div>
    </div>
  );
}
