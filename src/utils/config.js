const CONTRACT_NAME = process.env.CONTRACT_NAME || "dev-1664678846895-65978148816053";
export default function getConfig(env) {
  switch (env) {
    case "production":
    case "development":
    case "testnet":
      return {
        networkId: "testnet",
        nodeUrl: "https://rpc.testnet.near.org",
        contractName: CONTRACT_NAME,
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
      };
    default:
      throw Error(`Unconfigured environment '${env}'. Can be configured in src/config.js.`);
  }
}