import { INFURA_URL as erc20Infura } from "./eth";
import { BNB_URL as bep20Infura } from "./binance";
import erc20 from "./erc20.json";
import axios from "axios";
var Web3 = require("web3");

export const getWeb3Obj = (RPC_URL) => {
  const httpProvider = new Web3.providers.HttpProvider(RPC_URL);
  const web3 = new Web3(httpProvider);
  return web3;
};

export const getWeb3ContractObject = (abi, contractAddress, RPC_URL) => {
  const web3 = getWeb3Obj(RPC_URL);
  const contract = new web3.eth.Contract(abi, contractAddress);
  return contract;
};

export const withdrawERC20 = async (
  fromAddress,
  fromPrivateKey,
  toAddress,
  amountToSend,
  contractAdd,
  decimals,
  activeType
) => {
  try {
    const rpcurl = activeType === "ERC20" ? erc20Infura : bep20Infura;
    const web3 = getWeb3Obj(rpcurl);
    const tokenContract = getWeb3ContractObject(erc20, contractAdd, rpcurl);

    const balance = Number(amountToSend * Math.pow(10, decimals));

    const Data = await tokenContract.methods
      .transfer(toAddress, balance.toString())
      .encodeABI();

    const rawTransaction = {
      to: contractAdd,
      gasPrice: web3.utils.toHex("30000000000"), // Always in Wei (30 gwei)
      gasLimit: web3.utils.toHex("200000"), // Always in Wei
      data: Data, // Setting the pid 12 with 0 alloc and 0 deposit fee
    };

    const signPromise = await web3.eth.accounts.signTransaction(
      rawTransaction,
      fromPrivateKey.toString()
    );
    try {
      const txDada = await web3.eth.sendSignedTransaction(
        signPromise.rawTransaction
      );
      return {
        status: true,
        Hash: signPromise.transactionHash,
        message: "Success",
      };
    } catch (error) {
      console.log("txError", error);
      return {
        status: false,
        message: "insufficient funds for gas * price + value",
      };
    }
  } catch (error) {
    console.log("Send ERC20 error", error);
    return {
      status: false,
      message: "Something went wrong!",
    };
  }
};

export const inComing = async (address, type, decimals) => {
  const apiUrl =
    type === "BEP20"
      ? `https://api-testnet.bscscan.com/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=999999999&sort=asc&apikey=SW7P987MNFPM6SU9J4SWWAQ13SFMP56778`
      : `https://api-goerli.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=999999999&sort=asc&apikey=5W4NCGJ843555VAVNJKNGGKT9G2XR3EXTI`;
  try {
    const response = await axios.get(apiUrl);
    let resData = response.data.result;
    const data = resData.filter((item) => {
      return item.value > 0;
    });
    let matchedData = new Array();
    for (let i = 0; i < data.length; i++) {
      if (data[i].to.toLowerCase() == address.toLowerCase()) {
        data[i].type = "Incoming";
        data[i].value = Number(data[i].value) / Math.pow(10, decimals);
        matchedData.push(data[i]);
      } else if (data[i].from.toLowerCase() == address.toLowerCase()) {
        data[i].type = "Outgoing";
        data[i].value = Number(data[i].value) / Math.pow(10, decimals);
        matchedData.push(data[i]);
      }
    }
    return matchedData;
  } catch (error) {
    console.log("BNB Tx", error.response);
    return [];
  }
};

export async function txListERC20(address, type, decimals) {
  const allAdd = address.map((add) => {
    return add.address;
  });
  let finalTx = [];
  const allTx = await Promise.all(
    allAdd.map(async (wallet) => {
      const data = await inComing(wallet, type, decimals);
      return data;
    })
  );
  allTx.forEach((item) => {
    finalTx = [...finalTx, ...item];
  });
  const finalData = finalTx.sort((a, b) =>
    a.timeStamp > b.timeStamp ? -1 : b.timeStamp > a.timeStamp ? 1 : 0
  );
  // console.log({ finalData });
  return finalData;
}
