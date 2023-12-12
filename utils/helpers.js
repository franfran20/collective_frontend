export function formatTime(seconds) {
  const days = Math.floor(seconds / 86400);
  seconds %= 86400;
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  seconds %= 60;

  let result = "";
  if (days > 0) {
    result += `${days} day${days > 1 ? "s" : ""} `;
  }
  if (hours > 0) {
    result += `${hours} hr${hours > 1 ? "s" : ""} `;
  }
  if (minutes > 0) {
    result += `${minutes} min${minutes > 1 ? "s" : ""} `;
  }
  if (seconds > 0 || result === "") {
    result += `${seconds} sec${seconds > 1 ? "s" : ""}`;
  }

  return result.trim();
}

export function getGroupSavingTimeLeft(groupSavingStopTime, currentTimeStamp) {
  if (parseInt(groupSavingStopTime) > parseInt(currentTimeStamp)) {
    return formatTime(
      parseInt(groupSavingStopTime) - parseInt(currentTimeStamp)
    );
  } else {
    return "Completed";
  }
}

export function getGrouProgressPercent(amountRaised, target) {
  let avaxPercentage =
    (parseInt(amountRaised.wAVAX) * 100) / parseInt(target.wAVAX) > 100
      ? 100
      : (parseInt(amountRaised.wAVAX) * 100) / parseInt(target.wAVAX);

  let maticPercentage =
    (parseInt(amountRaised.wMATIC) * 100) / parseInt(target.wMATIC) > 100
      ? 100
      : (parseInt(amountRaised.wMATIC) * 100) / parseInt(target.wMATIC);

  let opEthPercentage =
    (parseInt(amountRaised.wOP) * 100) / parseInt(target.wOP) > 100
      ? 100
      : (parseInt(amountRaised.wOP) * 100) / parseInt(target.wOP);

  let percentage = (avaxPercentage + opEthPercentage + maticPercentage) / 3;

  return percentage.toFixed(2);
}

export function getAmountToDepositDependingOnChain(chainInfo) {
  if (chainInfo.name == "Avalanche") {
    return 1;
  }

  if (chainInfo.name == "Optimism") {
    return 2;
  }

  if (chainInfo.name == "Polygon") {
    return 3;
  }
}

export function truncateEthereumAddress(address, startChars = 6, endChars = 4) {
  if (!address || address.length !== 42) {
    console.error("Invalid Ethereum address");
    return address;
  }

  const prefix = address.substring(0, 2);
  const truncated =
    address.substring(2, startChars) + "..." + address.substring(42 - endChars);

  return prefix + truncated;
}

export function getProtocolProfitImage(chainName) {
  if (chainName == "Avalanche") {
    return "/avaxLogo.png";
  }
  if (chainName == "Optimism") {
    return "/optimismLogo.png";
  }
  if (chainName == "Polygon") {
    return "/maticLogo.png";
  }
}

export function getHashLink(hash, chainName) {
  if (chainName == "Avalanche") {
    return `https://testnet.snowtrace.io/tx/${hash}`;
  }
  if (chainName == "Optimism") {
    return `https://goerli-optimism.etherscan.io/tx/${hash}`;
  }
  if (chainName == "Polygon") {
    return `https://mumbai.polygonscan.com/tx/${hash}`;
  }
}

export function getProgressBarColor(progressPercent) {
  if (progressPercent < 50) {
    return "red";
  }
  if (progressPercent > 50 && progressPercent < 75) {
    return "yellow";
  }
  if ((progressPercent > 75) & (progressPercent < 100)) {
    return "teal";
  }
  if (progressPercent >= 100) {
    return "green";
  }
}

export const CURRENTCHAIN = "avalanche";
