export const COLLECTIVE_CORE_ABI = [
  {
    type: "constructor",
    inputs: [
      { name: "asset", type: "address", internalType: "address" },
      { name: "router", type: "address", internalType: "address" },
      { name: "link", type: "address", internalType: "address" },
      {
        name: "avaxPriceFeed",
        type: "address",
        internalType: "address",
      },
      {
        name: "opEthPriceFeed",
        type: "address",
        internalType: "address",
      },
      {
        name: "maticPriceFeed",
        type: "address",
        internalType: "address",
      },
      { name: "usdt", type: "address", internalType: "address" },
      { name: "franfranSwap", type: "address", internalType: "address" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "AVALANCHE_DEFAULT_FEE",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "BUFFER_AMOUNT",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "OPTIMISM_DEFAULT_FEE",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "POLYGON_DEFAULT_FEE",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "breakSavings",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "ccipReceive",
    inputs: [
      {
        name: "message",
        type: "tuple",
        internalType: "struct Client.Any2EVMMessage",
        components: [
          {
            name: "messageId",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "sourceChainSelector",
            type: "uint64",
            internalType: "uint64",
          },
          { name: "sender", type: "bytes", internalType: "bytes" },
          { name: "data", type: "bytes", internalType: "bytes" },
          {
            name: "destTokenAmounts",
            type: "tuple[]",
            internalType: "struct Client.EVMTokenAmount[]",
            components: [
              {
                name: "token",
                type: "address",
                internalType: "address",
              },
              {
                name: "amount",
                type: "uint256",
                internalType: "uint256",
              },
            ],
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "claimGroupContribution",
    inputs: [{ name: "groupID", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "contributeToGroup",
    inputs: [
      { name: "groupID", type: "uint256", internalType: "uint256" },
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "createGroupSavings",
    inputs: [
      { name: "amount", type: "uint256", internalType: "uint256" },
      { name: "purpose", type: "string", internalType: "string" },
      { name: "recipient", type: "address", internalType: "address" },
      { name: "time", type: "uint256", internalType: "uint256" },
      {
        name: "targets",
        type: "uint256[3]",
        internalType: "uint256[3]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "depositUSDT",
    inputs: [{ name: "amount", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "dispatchGroupFundsToRecipient",
    inputs: [{ name: "groupID", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getBlockTimestamp",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getCosmicProviderDetails",
    inputs: [
      {
        name: "cosmicProvider",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct ICollectiveCore.CosmicProvider",
        components: [
          { name: "aUSDT", type: "uint256", internalType: "uint256" },
          { name: "oUSDT", type: "uint256", internalType: "uint256" },
          { name: "pUSDT", type: "uint256", internalType: "uint256" },
          {
            name: "IOU_USDT",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "totalUSDT",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "unlockPeriod",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getGroupSavingCompletionPercentage",
    inputs: [{ name: "groupID", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getGroupSavingDetailByID",
    inputs: [{ name: "groupID", type: "uint256", internalType: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct ICollectiveCore.GroupSavingDetails",
        components: [
          { name: "groupID", type: "uint256", internalType: "uint256" },
          { name: "purpose", type: "string", internalType: "string" },
          { name: "creator", type: "address", internalType: "address" },
          {
            name: "recipient",
            type: "address",
            internalType: "address",
          },
          {
            name: "savingStartTime",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "savingStopTime",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "members", type: "uint256", internalType: "uint256" },
          {
            name: "target",
            type: "tuple",
            internalType: "struct ICollectiveCore.CrossChainAssets",
            components: [
              {
                name: "wAVAX",
                type: "uint256",
                internalType: "uint256",
              },
              { name: "wOP", type: "uint256", internalType: "uint256" },
              {
                name: "wMATIC",
                type: "uint256",
                internalType: "uint256",
              },
            ],
          },
          {
            name: "amountRaised",
            type: "tuple",
            internalType: "struct ICollectiveCore.CrossChainAssets",
            components: [
              {
                name: "wAVAX",
                type: "uint256",
                internalType: "uint256",
              },
              { name: "wOP", type: "uint256", internalType: "uint256" },
              {
                name: "wMATIC",
                type: "uint256",
                internalType: "uint256",
              },
            ],
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getGroupSavingTimeLeft",
    inputs: [{ name: "groupID", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getInterestPoolBalance",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getOngoinGroupSavings",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct ICollectiveCore.GroupSavingDetails[]",
        components: [
          { name: "groupID", type: "uint256", internalType: "uint256" },
          { name: "purpose", type: "string", internalType: "string" },
          { name: "creator", type: "address", internalType: "address" },
          {
            name: "recipient",
            type: "address",
            internalType: "address",
          },
          {
            name: "savingStartTime",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "savingStopTime",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "members", type: "uint256", internalType: "uint256" },
          {
            name: "target",
            type: "tuple",
            internalType: "struct ICollectiveCore.CrossChainAssets",
            components: [
              {
                name: "wAVAX",
                type: "uint256",
                internalType: "uint256",
              },
              { name: "wOP", type: "uint256", internalType: "uint256" },
              {
                name: "wMATIC",
                type: "uint256",
                internalType: "uint256",
              },
            ],
          },
          {
            name: "amountRaised",
            type: "tuple",
            internalType: "struct ICollectiveCore.CrossChainAssets",
            components: [
              {
                name: "wAVAX",
                type: "uint256",
                internalType: "uint256",
              },
              { name: "wOP", type: "uint256", internalType: "uint256" },
              {
                name: "wMATIC",
                type: "uint256",
                internalType: "uint256",
              },
            ],
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getProtocolProfit",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getRouter",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTotalChainSavers",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTotalChainSavings",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct ICollectiveCore.CrossChainAssets",
        components: [
          { name: "wAVAX", type: "uint256", internalType: "uint256" },
          { name: "wOP", type: "uint256", internalType: "uint256" },
          { name: "wMATIC", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTotalExpectedSaveTime",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getUnlockPeriod",
    inputs: [
      {
        name: "cosmicProvider",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getUsdtBalances",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct ICollectiveCore.UsdtBalances",
        components: [
          {
            name: "Avalanche",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "Optimism",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "Polygon", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getUserGroupContribution",
    inputs: [
      { name: "groupID", type: "uint256", internalType: "uint256" },
      { name: "user", type: "address", internalType: "address" },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct ICollectiveCore.CrossChainAssets",
        components: [
          { name: "wAVAX", type: "uint256", internalType: "uint256" },
          { name: "wOP", type: "uint256", internalType: "uint256" },
          { name: "wMATIC", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getUserMeetsSavingTarget",
    inputs: [{ name: "user", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getUserMemebrshipStatus",
    inputs: [
      { name: "groupID", type: "uint256", internalType: "uint256" },
      { name: "user", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getUserSavingBalance",
    inputs: [{ name: "user", type: "address", internalType: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct ICollectiveCore.CrossChainAssets",
        components: [
          { name: "wAVAX", type: "uint256", internalType: "uint256" },
          { name: "wOP", type: "uint256", internalType: "uint256" },
          { name: "wMATIC", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getUserSavingCompletionPercentage",
    inputs: [{ name: "user", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getUserSavingStatus",
    inputs: [{ name: "user", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getUserSavingTime",
    inputs: [{ name: "user", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getUserSavingsDetails",
    inputs: [{ name: "user", type: "address", internalType: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct ICollectiveCore.SavingDetails",
        components: [
          { name: "status", type: "bool", internalType: "bool" },
          {
            name: "savingsStartTime",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "savingsEndTime",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "savingsBalance",
            type: "tuple",
            internalType: "struct ICollectiveCore.CrossChainAssets",
            components: [
              {
                name: "wAVAX",
                type: "uint256",
                internalType: "uint256",
              },
              { name: "wOP", type: "uint256", internalType: "uint256" },
              {
                name: "wMATIC",
                type: "uint256",
                internalType: "uint256",
              },
            ],
          },
          {
            name: "savingsTarget",
            type: "tuple",
            internalType: "struct ICollectiveCore.CrossChainAssets",
            components: [
              {
                name: "wAVAX",
                type: "uint256",
                internalType: "uint256",
              },
              { name: "wOP", type: "uint256", internalType: "uint256" },
              {
                name: "wMATIC",
                type: "uint256",
                internalType: "uint256",
              },
            ],
          },
          { name: "reason", type: "string", internalType: "string" },
          {
            name: "withdrawalChainSelector",
            type: "uint64",
            internalType: "uint64",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getUserTimeLeftForSavingInSeconds",
    inputs: [{ name: "user", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getUsersShareInInterestPool",
    inputs: [{ name: "user", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "groupSavingDetails",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "groupID", type: "uint256", internalType: "uint256" },
      { name: "purpose", type: "string", internalType: "string" },
      { name: "creator", type: "address", internalType: "address" },
      { name: "recipient", type: "address", internalType: "address" },
      {
        name: "savingStartTime",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "savingStopTime",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "members", type: "uint256", internalType: "uint256" },
      {
        name: "target",
        type: "tuple",
        internalType: "struct ICollectiveCore.CrossChainAssets",
        components: [
          { name: "wAVAX", type: "uint256", internalType: "uint256" },
          { name: "wOP", type: "uint256", internalType: "uint256" },
          { name: "wMATIC", type: "uint256", internalType: "uint256" },
        ],
      },
      {
        name: "amountRaised",
        type: "tuple",
        internalType: "struct ICollectiveCore.CrossChainAssets",
        components: [
          { name: "wAVAX", type: "uint256", internalType: "uint256" },
          { name: "wOP", type: "uint256", internalType: "uint256" },
          { name: "wMATIC", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "reedemUSDT",
    inputs: [
      { name: "amount", type: "uint256", internalType: "uint256" },
      {
        name: "selectedChainSelector",
        type: "uint64",
        internalType: "uint64",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "s_avaxPriceFeed",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "s_franfranSwap",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract FranFranSwap",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "s_linkToken",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract LinkTokenInterface",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "s_maticPriceFeed",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "s_opEthPriceFeed",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "s_totalExpectedSaveTime",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "s_usdt",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "s_wAVAX",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "startSavings",
    inputs: [
      { name: "asset", type: "address", internalType: "address" },
      { name: "amount", type: "uint256", internalType: "uint256" },
      { name: "time", type: "uint256", internalType: "uint256" },
      { name: "reason", type: "string", internalType: "string" },
      { name: "target", type: "uint256[3]", internalType: "uint256[3]" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "supportsInterface",
    inputs: [{ name: "interfaceId", type: "bytes4", internalType: "bytes4" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "topUpSavings",
    inputs: [
      { name: "asset", type: "address", internalType: "address" },
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updateCollectiveCoreContractAddressForOtherChains_",
    inputs: [
      {
        name: "optimismContractAddress",
        type: "address",
        internalType: "address",
      },
      {
        name: "polygonContractAddress",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "withdrawSavings",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "StartedSaving",
    inputs: [
      {
        name: "user",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "startDate",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "endDate",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "reason",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "target",
        type: "tuple",
        indexed: false,
        internalType: "struct ICollectiveCore.CrossChainAssets",
        components: [
          { name: "wAVAX", type: "uint256", internalType: "uint256" },
          { name: "wOP", type: "uint256", internalType: "uint256" },
          { name: "wMATIC", type: "uint256", internalType: "uint256" },
        ],
      },
      {
        name: "chainSelector",
        type: "uint64",
        indexed: false,
        internalType: "uint64",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "CollectiveCore__AmountMustBeGreaterThanZero",
    inputs: [],
  },
  {
    type: "error",
    name: "CollectiveCore__AssetNotSupported",
    inputs: [],
  },
  {
    type: "error",
    name: "CollectiveCore__CanOnlyBreakAnExistingSaving",
    inputs: [],
  },
  {
    type: "error",
    name: "CollectiveCore__CanOnlyWithdrawAnExistingSaving",
    inputs: [],
  },
  {
    type: "error",
    name: "CollectiveCore__CannotClaimContribution",
    inputs: [],
  },
  {
    type: "error",
    name: "CollectiveCore__CannotCreateGroupSavingsOnThisChain",
    inputs: [],
  },
  {
    type: "error",
    name: "CollectiveCore__CannotJoinGroupSavingsAnymore",
    inputs: [],
  },
  {
    type: "error",
    name: "CollectiveCore__CannotUpdateDestinationChainContractAddress",
    inputs: [],
  },
  {
    type: "error",
    name: "CollectiveCore__CannotWithdrawOnThisChain",
    inputs: [],
  },
  {
    type: "error",
    name: "CollectiveCore__ContractDoesntHaveSufficientUsdtToFulFillWithdrawal",
    inputs: [],
  },
  {
    type: "error",
    name: "CollectiveCore__ContractDoesntHaveSufficientUsdtToReedemOnThisChain",
    inputs: [],
  },
  {
    type: "error",
    name: "CollectiveCore__ContributionAlreadyClaimed",
    inputs: [],
  },
  {
    type: "error",
    name: "CollectiveCore__ERC20TransferFromFailed",
    inputs: [],
  },
  {
    type: "error",
    name: "CollectiveCore__GroupDidNotMeetSavingsTarget",
    inputs: [],
  },
  {
    type: "error",
    name: "CollectiveCore__GroupSavingsActiveStatusIsFalse",
    inputs: [],
  },
  {
    type: "error",
    name: "CollectiveCore__GroupSavingsAlreadyDispatched",
    inputs: [],
  },
  {
    type: "error",
    name: "CollectiveCore__GroupSavingsTimeHasntArrived",
    inputs: [],
  },
  {
    type: "error",
    name: "CollectiveCore__InsufficientIouUsdtBalance",
    inputs: [],
  },
  {
    type: "error",
    name: "CollectiveCore__InsufficientIouUsdtBalanceForSelectedChain",
    inputs: [],
  },
  {
    type: "error",
    name: "CollectiveCore__InsufficientUsdtBalance",
    inputs: [],
  },
  {
    type: "error",
    name: "CollectiveCore__NotAMemberOfThisGroup",
    inputs: [],
  },
  {
    type: "error",
    name: "CollectiveCore__NotEnoughBalanceForCrossChainTransfer",
    inputs: [],
  },
  {
    type: "error",
    name: "CollectiveCore__OnlyContributorsCanDispatchFunds",
    inputs: [],
  },
  {
    type: "error",
    name: "CollectiveCore__SaveCanBeWithdrawnSuccessfully",
    inputs: [],
  },
  {
    type: "error",
    name: "CollectiveCore__SavingsGroupDoesNotExist",
    inputs: [],
  },
  {
    type: "error",
    name: "CollectiveCore__SavingsTimeHasPassed",
    inputs: [],
  },
  {
    type: "error",
    name: "CollectiveCore__SavingsTimeIssZero",
    inputs: [],
  },
  {
    type: "error",
    name: "CollectiveCore__TargetAmountEqualsZero",
    inputs: [{ name: "targetIndex", type: "uint256", internalType: "uint256" }],
  },
  {
    type: "error",
    name: "CollectiveCore__UnlockPeriodHasntArrived",
    inputs: [],
  },
  {
    type: "error",
    name: "CollectiveCore__UserDidNotMeetSavingsTarget",
    inputs: [],
  },
  {
    type: "error",
    name: "CollectiveCore__UserDoesntHaveAnActiveSaving",
    inputs: [],
  },
  {
    type: "error",
    name: "CollectiveCore__UserHasAnExistingSaving",
    inputs: [],
  },
  {
    type: "error",
    name: "CollectiveCore__WithdrawalTimeHasntArrived",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidRouter",
    inputs: [{ name: "router", type: "address", internalType: "address" }],
  },
];

export const ERC20_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "allowance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256",
      },
    ],
    name: "ERC20InsufficientAllowance",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256",
      },
    ],
    name: "ERC20InsufficientBalance",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "approver",
        type: "address",
      },
    ],
    name: "ERC20InvalidApprover",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "ERC20InvalidReceiver",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "ERC20InvalidSender",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "ERC20InvalidSpender",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];
