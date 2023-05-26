import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { hdkey } from "ethereumjs-wallet";
import Web3 from "web3";
// import EthereumTx from "ethereumjs-tx";
const EthereumTx = require("ethereumjs-tx").Transaction;
// import Common from "ethereumjs-common";
import { validate } from "bitcoin-address-validation";
import { isValidSOLAddress } from "./solana";
export const BNB_URL = "https://data-seed-prebsc-2-s1.binance.org:8545/"; // testnet
// "https://bsc-dataseed1.ninicoin.io"; //mainnet
import { getPrivateKey } from "./WalletOperations";
const bip39 = require("bip39");
export const API_URL = "https://api-testnet.bscscan.com";
const Common = require("ethereumjs-common");
const { privateToAddress, toBuffer } = require("ethereumjs-util");
const web3 = new Web3(new Web3.providers.HttpProvider(BNB_URL));

export const isValidAddress = (address, type) => {
  if (type === "BTC") {
    const check = validate(address);
    return check;
  } else if (type === "SOL") {
    const check = isValidSOLAddress(address);
    return check;
  } else {
    try {
      web3.utils.toChecksumAddress(address);
      return true;
    } catch (e) {
      return false;
    }
  }
};

export const generateAddress = (req, res) => {
  try {
    const address = crypto.generatePrivateKey();
    return res.status(200).send({
      responseCode: 200,
      responseMessage: "Address generated successfully.",
      address: address,
    });
  } catch (error) {
    console.log("Error===>>", error);
    return res.status(501).send({
      responseCode: 501,
      responseMessage: "Something went wrong!",
      error: error,
    });
  }
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

export const preTransfer = async (senderAddress, amountToSend) => {
  const { fee } = await ethHelper();
  let balance = await getBNBBalance(senderAddress);

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

export const generateMnemonic = () => {
  try {
    const mnemonic = bip39.generateMnemonic();
    return mnemonic;
  } catch (error) {
    console.log({
      responseMessage: "Couldn't Generate Wallet",
      responseResult: error,
    });
  }
};

export const generateBNBWallet = (count, mnemonic) => {
  try {
    const seed = bip39.mnemonicToSeedSync(mnemonic);

    let hdwallet = hdkey.fromMasterSeed(seed);
    let path = `m/44'/60'/0'/0/${count}`;

    let wallet = hdwallet.derivePath(path).getWallet();
    let address = "0x" + wallet.getAddress().toString("hex");
    let privateKey = "0x" + wallet.getPrivateKey().toString("hex");

    console.log({
      responseCode: 200,
      responseMessage: "Account Created successfully.",
      Address: address,
      PrivateKey: privateKey,
    });
    return { address, privateKey };
  } catch (error) {
    console.log({
      responseCode: 501,
      responseMessage: "Something went wrong!",
      error: error,
    });
  }
};
export const getBNBBalance = async (senderAddress) => {
  try {
    const bal = await web3.eth.getBalance(senderAddress);
    let balance = web3.utils.fromWei(bal);
    return Number(balance);
  } catch (error) {
    console.log({
      responseCode: 501,
      responseMessage: "Something went wrong!",
      error: error,
    });
    return "error";
  }
};

export const withdrawBNB = async (
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
        name: "bnb",
        networkId: "0x61",
        chainId: "0x61",
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

export const getGlobleMarketBTCPrice = async () => {
  const allCoins = await AsyncStorage.getItem("allCoins");
  let marketpriceURL = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${allCoins}&order=market_cap_desc&price_change_percentage=1h%2C24h`;
  try {
    const response = await axios.get(marketpriceURL);
    // let newArray = response.data.filter(
    //   (item) =>
    //     item.id === "bitcoin" ||
    //     item.id === "ethereum" ||
    //     item.id === "ethereum-classic" ||
    //     item.id === "avalanche-2" ||
    //     item.id === "solana" ||
    //     item.id === "binancecoin"
    // );
    // console.log("response.data", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    return 0;
  }
};

export const inComingBNB = async (address) => {
  console.log("address", address);
  try {
    const response = await axios.get(
      `${API_URL}/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=SW7P987MNFPM6SU9J4SWWAQ13SFMP56778`
    );
    let resData = response.data.result;
    const data = resData.filter((item) => {
      return item.value > 0;
    });
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
    console.log("BNB Tx", error.response);
    return [];
  }
};

export async function txListBNB(address) {
  const allAdd = address.map((add) => {
    return add.address;
  });
  let finalTx = [];
  const allTx = await Promise.all(
    allAdd.map(async (wallet) => {
      const data = await inComingBNB(wallet);
      return data;
    })
  );
  allTx.forEach((item) => {
    finalTx = [...finalTx, ...item];
  });
  const finalData = finalTx.sort((a, b) =>
    a.timeStamp > b.timeStamp ? -1 : b.timeStamp > a.timeStamp ? 1 : 0
  );
  console.log({ finalData });
  return finalData;
}

export const importBNBWallet = (pvtKey) => {
  try {
    const privateKey = pvtKey.startsWith("0x")
      ? pvtKey.toString()
      : "0x" + pvtKey.toString();

    const wallet = privateToAddress(toBuffer(privateKey));
    const address = "0x" + wallet.toString("hex");
    let obj = {
      privateKey,
      address,
    };
    return obj;
  } catch (error) {
    console.log("import Wallet", error);
    return false;
  }
};

export const browserTx = async (data, symbol) => {
  console.log("data", data);

  try {
    const key = await getPrivateKey(data.from);
    const pvtKey = key.slice(2);
    const privKey = Buffer.from(pvtKey, "hex");
    var nonce = await web3.eth.getTransactionCount(data.from);
    const { gasPrice } = await ethHelper();
    console.log({ nonce, gasPrice });

    let txObject = {
      ...data,
      gasPrice: gasPrice,
      nonce: nonce,
    };
    let common;

    if (symbol === "ETH") {
      common = Common.default.forCustomChain(
        "mainnet",
        {
          name: "eth",
          networkId: "0x2a",
          chainId: "0x2a",
        },
        "petersburg"
      );
    } else if (symbol === "BNB") {
      common = Common.default.forCustomChain(
        "mainnet",
        {
          name: "bnb",
          networkId: "0x61",
          chainId: "0x61",
        },
        "petersburg"
      );
    } else if (symbol === "AVAX") {
      common = Common.default.forCustomChain(
        "mainnet",
        {
          name: "avax",
          networkId: "0xA869",
          chainId: "0xA869",
        },
        "petersburg"
      );
    }

    console.log("common", common);
    const transaction = new EthereumTx(txObject, { common: common });
    console.log("transaction", transaction);
    transaction.sign(privKey);
    const serializedTransaction = transaction.serialize();
    console.log("serializedTransaction", serializedTransaction);
    const raw = "0x" + Buffer.from(serializedTransaction).toString("hex");
    console.log("raw", raw);
    const signTransaction = await web3.eth.sendSignedTransaction(raw);
    console.log("signTransaction", signTransaction);
    return signTransaction;
  } catch (error) {
    console.log("error", error);
    return null;
  }
};
