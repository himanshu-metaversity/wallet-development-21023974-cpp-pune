var axios = require("axios");
const ethers = require("ethers");
import Web3 from "web3";
// const RPCURL = "https://4f7504905a8943d1bbd6b131a63ff30e.etc.rpc.rivet.cloud/"; // mainnet
const RPCURL = "https://www.ethercluster.com/mordor";
const API_URL = "https://blockscout.com/etc/mordor";

const EthereumTx = require("ethereumjs-tx").Transaction;
const Common = require("ethereumjs-common");

const web3 = new Web3(new Web3.providers.HttpProvider(RPCURL));

export const generateETCWallet = (count, mnemonic) => {
  try {
    // m/1852'/1815'/0'
    let path = `m/44'/61'/0'/0/${count}`;
    let secondMnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic, path);
    let address = secondMnemonicWallet.address;
    let publicKey = secondMnemonicWallet.publicKey;
    let privateKey = secondMnemonicWallet.privateKey;
    // console.log(
    //   `address: ${address} \n privateKey: ${privateKey} \n publicKey: ${publicKey} \n `
    // );
    const obj = {
      address: address,
      publicKey: publicKey,
      privateKey: privateKey.substring(2),
    };
    console.log("ETC", obj);
    return { address, privateKey };
  } catch (error) {
    // console.log(error);
    console.log({
      responseMessage: "Couldn't Generate Wallet",
      responseResult: error,
    });
  }
};

export const getETCBalance = async (address) => {
  try {
    const bal = await web3.eth.getBalance(address);
    let balance = web3.utils.fromWei(bal);
    return Number(balance);
  } catch (error) {
    console.log({
      Status: "ETC",
      Message: `Internal Server Error`,
      Error: `${error}`,
    });
    return "error";
  }
};

export const inComingETC = async (address) => {
  try {
    const response = await axios.get(
      `${API_URL}/api?module=account&action=txlist&address=${address}`
    );
    let data = response.data.result;
    let matchedData = new Array();
    for (let i = 0; i < data.length; i++) {
      if (data[i].to.toLowerCase() == address.toLowerCase()) {
        data[i].type = "Incoming";
        data[i].value = Number(web3.utils.fromWei(data[i].value));
        matchedData.push(data[i]);
      } else if (data[i].from.toLowerCase() == address.toLowerCase()) {
        data[i].type = "Outgoing";
        data[i].value = Number(web3.utils.fromWei(data[i].value));
        matchedData.push(data[i]);
      }
    }
    return matchedData;
  } catch (error) {
    console.log(error.response);
    return [];
  }
};

export async function txListETC(address) {
  // const data1 = await inComingETC(address);
  // const finalData = data1.sort((a, b) =>
  //   a.timeStamp > b.timeStamp ? -1 : b.timeStamp > a.timeStamp ? 1 : 0
  // );

  const allAdd = address.map((add) => {
    return add.address;
  });
  let finalTx = [];
  const allTx = await Promise.all(
    allAdd.map(async (wallet) => {
      const data = await inComingETC(wallet);
      return data;
    })
  );
  allTx.forEach((item) => {
    finalTx = [...finalTx, ...item];
  });
  const finalData = finalTx.sort((a, b) =>
    a.timeStamp > b.timeStamp ? -1 : b.timeStamp > a.timeStamp ? 1 : 0
  );

  return finalData;
}

export const preTransfer = async (senderAddress, amountToSend) => {
  const { fee } = await ethHelper();
  let balance = await getETCBalance(senderAddress);

  if (balance - amountToSend - fee < 0) {
    console.log("insufficient funds", balance);
    return { status: false, message: "Low Balance" };
  } else {
    // console.log('Transfer Possible==>', balance);
    return { status: true, message: "Transfer Possible" };
  }
};

export const ethHelper = async () => {
  let currentGasPrice = await getCurrentGasPrices();

  let gasPrice = currentGasPrice.high * 1000000000;

  let gasLimit = 21000;
  let fee = gasLimit * gasPrice;

  let txFee = Number(web3.utils.fromWei(fee.toString(), "ether"));

  return { fee: txFee, gasPrice: gasPrice };
};

export const getCurrentGasPrices = async () => {
  let response = await axios.get(
    "https://ethgasstation.info/api/ethgasAPI.json?api-key=ce8da4d2e680dad6465330e7869efe101517aad8274be133e44a8119d5c0"
  );
  let prices = {
    low: response.data.safeLow / 10,
    medium: response.data.average / 10,
    high: response.data.fast / 10,
  };
  return prices;
};

export const withdrawETC = async (
  fromAddress,
  fromPrivateKey,
  toAddress,
  amountToSend
) => {
  try {
    var nonce = await web3.eth.getTransactionCount(fromAddress);
    const { gasPrice } = await ethHelper();

    const { status } = await preTransfer(fromAddress, amountToSend);
    if (status == false) {
      console.log({ status: status, message: "Low Balance" });
    }

    let txObject = {
      to: toAddress,
      value: web3.utils.toHex(
        web3.utils.toWei(amountToSend.toString(), "ether")
      ),
      gas: 21000,
      gasPrice: gasPrice,
      nonce: nonce,
    };
    const common = Common.default.forCustomChain(
      "mainnet",
      {
        name: "metc",
        networkId: "0x3F",
        chainId: "0x3F",
      },
      "petersburg"
    );
    const transaction = new EthereumTx(txObject, { common: common });
    const pvtKey = fromPrivateKey.slice(2);
    let privKey = Buffer.from(pvtKey, "hex");
    transaction.sign(privKey);
    const serializedTransaction = transaction.serialize();
    const raw = "0x" + Buffer.from(serializedTransaction).toString("hex");
    const signTransaction = await web3.eth.sendSignedTransaction(raw);
    console.log({
      responseCode: 200,
      status: "Success",
      Hash: signTransaction.transactionHash,
    });
    return {
      status: true,
      Hash: signTransaction.transactionHash,
      message: "Success",
    };
  } catch (error) {
    console.log("error", error);
    return {
      status: false,
      message: "Something went wrong!",
    };
  }
};
