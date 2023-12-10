"use client";

import ClientOnly from "@/components/ClientOnly";
import { CHAIN_INFORMATION } from "@/utils/ChainInformation";
import { COLLECTIVE_CORE_ABI, ERC20_ABI } from "@/utils/abi";
import {
  formatTime,
  getGrouProgressPercent,
  getGroupSavingTimeLeft,
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
  const [showGroup, setShowGroup] = useState(0);
  const [selectedSearchGroupID, setSelectedSearchGroup] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState();
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
    currentChainInfo = CHAIN_INFORMATION[chain.id].avalanche;
    collectiveAddress = currentChainInfo.collectiveAddress;
    console.log(currentChainInfo.collectiveAddress);
    console.log(selectedGroup);
  }

  // write functions
  // contribute
  const { config: contributeConfig } = usePrepareContractWrite({
    address: collectiveAddress,
    abi: COLLECTIVE_CORE_ABI,
    functionName: "contributeToGroup",
    args: [selectedGroup && selectedGroup, amount && amount * 1e18],
  });
  const {
    data: contributeData,
    isLoading: contributeLoading,
    error: contributeError,
    write: contribute,
  } = useContractWrite(contributeConfig);

  // create
  const { config: createGroupConfig } = usePrepareContractWrite({
    address: collectiveAddress,
    abi: COLLECTIVE_CORE_ABI,
    functionName: "createGroupSavings",
    args: [
      amount * 1e18,
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
    error: createGroupError,
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
    args: [collectiveAddress, amount * 1e18],
  });
  const {
    data: approveData,
    isLoading: loadingApprove,
    error: approveError,
    write: approveAsset,
  } = useContractWrite(approveConfig);

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

  if (userContributionToGroup) {
    console.log(userContributionToGroup);
    console.log(currentTimeStamp);
  }

  return (
    <div>
      <div>
        <p onClick={() => setShowGroup(1)}>Ongoing</p>
        <p onClick={() => setShowGroup(2)}>Completed</p>
        <p onClick={() => setShowGroup(3)}>Create</p>
        <p onClick={() => setShowGroup(4)}>Join</p>
      </div>

      {/* ---- LEFT ---- */}
      <div className="left">
        {/* display ongoing groups i.etheir time has not been exhausted*/}
        {showGroup == 1 && (
          <ClientOnly>
            {allGroups &&
              currentTimeStamp &&
              allGroups.map((group) => {
                if (parseInt(group.savingStopTime) > parseInt(currentTimeStamp))
                  return (
                    <div
                      className="group-box"
                      onClick={() => setSelectedGroup(group.groupID.toString())}
                    >
                      <div>
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
              })}
          </ClientOnly>
        )}

        {/* display completed groups i.etheir time has not been exhausted*/}
        {showGroup == 2 && (
          <ClientOnly>
            {allGroups &&
              currentTimeStamp &&
              allGroups.map((group) => {
                if (parseInt(group.savingStopTime) < parseInt(currentTimeStamp))
                  return (
                    <div
                      className="group-box"
                      onClick={() => setSelectedGroup(group.groupID.toString())}
                    >
                      <div>
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
              })}
          </ClientOnly>
        )}

        {/* display create group */}
        {showGroup == 3 && (
          <ClientOnly>
            <h3>Group Details</h3>
            <input
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
            />
            <input
              onChange={(e) => setGroupReason(e.target.value)}
              placeholder="Saving Reason"
            />
            <div>
              <input
                onChange={(e) => setGroupTime(e.target.value)}
                placeholder="Time"
              />{" "}
              3 days
            </div>
            <input
              onChange={(e) => setGroupRecipient(e.target.value)}
              placeholder="Recipient"
            />

            <div>
              <div>
                <Image src="/temp.png" width="30" height="30" />
                <input onChange={(e) => setCreateAvaxTarget(e.target.value)} />
              </div>

              <div>
                <Image src="/temp.png" width="30" height="30" />
                <input onChange={(e) => setCreateMaticTarget(e.target.value)} />
              </div>

              <div>
                <Image src="/temp.png" width="30" height="30" />
                <input onChange={(e) => setCreateOpEthTarget(e.target.value)} />
              </div>
            </div>
            <button onClick={() => approveAsset?.()}>Approve</button>
            <button onClick={() => createGroup?.()}>Create Group</button>
          </ClientOnly>
        )}

        {/* dispay join group */}
        {showGroup == 4 && (
          <ClientOnly>
            <div>
              <input onChange={(e) => setSelectedSearchGroup(e.target.value)} />
              <Image src="/temp.png" width="30" height="30" />
            </div>
          </ClientOnly>
        )}

        {showGroup == 4 &&
          selectedSearchGroupID &&
          allGroups &&
          allGroups.length >= selectedSearchGroupID && (
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
          )}
      </div>

      {/* ----- RIGHT ----- */}
      <ClientOnly>
        {showGroup &&
          allGroups &&
          showGroup != 3 &&
          selectedGroup &&
          currentTimeStamp && (
            <div className="right">
              {/* The gorup ID */}
              <h3>Group ID: {selectedGroup}</h3>

              {/* withdraw contribution */}
              {showGroup == 2 &&
                getGrouProgressPercent(
                  allGroups[selectedGroup - 1].amountRaised,
                  allGroups[selectedGroup - 1].target
                ) < 100 && (
                  <div className="withdraw-contibution">
                    <button onClick={() => claimGroupContribution?.()}>
                      Withdraw Contribution
                    </button>
                    <p>Current Fee: {currentChainInfo.savingFee}</p>
                  </div>
                )}

              {/* Dispatch Saving */}
              {showGroup == 2 &&
                getGrouProgressPercent(
                  allGroups[selectedGroup - 1].amountRaised,
                  allGroups[selectedGroup - 1].target
                ) >= 100 && (
                  <ClientOnly>
                    <div className="dispatch-saving">
                      <button onClick={() => dispatchGroupFunds?.()}>
                        Dispatch Saving
                      </button>
                      <p>Current Fee: 0</p>
                    </div>
                  </ClientOnly>
                )}

              {/* contribute */}
              {showGroup == 1 && (
                <div>
                  <h5>Contribute</h5>
                  <div>
                    <Image
                      src="/temp.png"
                      width="30"
                      height="30"
                      alt="asset-logo"
                    />
                    <input onChange={(e) => setAmount(e.target.value)} />
                    <button onClick={() => approveAsset?.()}>Approve</button>
                    <button onClick={() => contribute?.()}>Contribute</button>
                  </div>
                </div>
              )}

              {/* saving reason */}
              <div>
                <h3>Group Saving Purpose</h3>
                <p>{allGroups[selectedGroup - 1].purpose}</p>
              </div>

              {/* Time Left & Progress Bar */}
              <div className="time-left-and-bar">
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
                </div>
              </div>

              {/* memebers status, recipient */}
              <div className="members-status-recipient">
                <div>
                  <h5>Members</h5>
                  <p>{allGroups[selectedGroup - 1].members.toString()}</p>
                </div>
                <div>
                  <h5>Status</h5>
                  {showGroup == 1 && <p>You Can Do It!!</p>}
                  {showGroup == 2 && (
                    <p>
                      {getGrouProgressPercent(
                        allGroups[selectedGroup - 1].amountRaised,
                        allGroups[selectedGroup - 1].target
                      ) >= 100
                        ? "You Did It!!"
                        : "Sorry You Didnt Make It On Time"}
                    </p>
                  )}
                </div>
                <div>
                  <h5>Recipient</h5>
                  <p>{allGroups[selectedGroup - 1].recipient}</p>
                </div>
              </div>

              {/* Amount Raised, Target & My Contribution */}
              <div>
                {/* Target */}
                <div>
                  <h4>Target</h4>
                  <div>
                    <div>
                      <Image src="/temp.png" width="30" height="30" />
                      <p>
                        {(
                          allGroups[selectedGroup - 1].target.wAVAX.toString() /
                          1e18
                        ).toFixed(3)}
                      </p>
                    </div>
                    <div>
                      <Image src="/temp.png" width="30" height="30" />
                      <p>
                        {(
                          allGroups[selectedGroup - 1].target.wOP.toString() /
                          1e18
                        ).toFixed(3)}
                      </p>
                    </div>
                    <div>
                      <Image src="/temp.png" width="30" height="30" />
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
                  <h4>Amount Raised</h4>
                  <div>
                    <div>
                      <Image src="/temp.png" width="30" height="30" />
                      <p>
                        {(
                          allGroups[
                            selectedGroup - 1
                          ].amountRaised.wAVAX.toString() / 1e18
                        ).toFixed(4)}
                      </p>
                    </div>
                    <div>
                      <Image src="/temp.png" width="30" height="30" />
                      <p>
                        {(
                          allGroups[
                            selectedGroup - 1
                          ].amountRaised.wOP.toString() / 1e18
                        ).toFixed(4)}
                      </p>
                    </div>
                    <div>
                      <Image src="/temp.png" width="30" height="30" />
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
                      <h5>My Amount Raised</h5>

                      <div>
                        <div>
                          <Image src="/temp.png" width="30" height="30" />
                          <p>
                            {(
                              userContributionToGroup.wAVAX.toString() / 1e18
                            ).toFixed(4)}
                          </p>
                        </div>
                        <div>
                          <Image src="/temp.png" width="30" height="30" />
                          <p>
                            {(
                              userContributionToGroup.wOP.toString() / 1e18
                            ).toFixed(4)}
                          </p>
                        </div>
                        <div>
                          <Image src="/temp.png" width="30" height="30" />
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
  );
}
