const bip39 = require("bip39");
const bip32 = require("bip32");
const bitcoin = require("bitcoinjs-lib");

const axios = require("axios");
const bitcore = require("bitcore-lib");

const baseURL = `https://sochain.com/api/v2/`;
const sochain_network = "BTC";
// const sochain_network = "BTCTEST";
const satoshisPerByte = 20;

//accountBalance
export const getBTCBalance = async (senderAddress) => {
  try {
    const wallet = await axios.get(
      `${baseURL}get_address_balance/${sochain_network}/${senderAddress}`
    );
    // console.log("walletwallet", wallet);
    const accountBalance = wallet.data.data.confirmed_balance;
    // console.log("accountBalance", accountBalance);
    return Number(accountBalance);
  } catch (error) {
    return "error";
  }
};

export const preBTCTransfer = async (senderAddress, amountToSend) => {
  try {
    const { fee, totalAmountAvailable, satoshiToSend } = await btcTxHelper(
      senderAddress,
      amountToSend
    );
    if (totalAmountAvailable - satoshiToSend - fee < 0) {
      // throw new Error("Balance is too low for this transaction");
      console.log("false");
      return { status: false, message: "Low Balance" };
    }
    console.log("true");
    return { status: true, message: "Transfer Possible" };
  } catch (error) {
    alert("Wallet address is wrong.");
  }
};

export const transferBTC = async (
  senderAddress,
  privateKey,
  recieverAddress,
  amountToSend
) => {
  console.log(
    "senderAddress, privateKey, recieverAddress, amountToSend",
    senderAddress,
    privateKey,
    recieverAddress,
    amountToSend
  );

  const { fee, totalAmountAvailable, satoshiToSend, inputs } =
    await btcTxHelper(senderAddress, amountToSend);

  if (totalAmountAvailable - satoshiToSend - fee < 0) {
    // throw new Error("Balance is too low for this transaction");
    return { status: false, message: "Low Balance" };
  }

  const transaction = new bitcore.Transaction();

  //Set transaction input
  transaction.from(inputs);

  // set the recieving address and the amount to send
  transaction.to(recieverAddress, satoshiToSend);

  // Set change address - Address to receive the left over funds after transfer
  transaction.change(senderAddress);

  //manually set transaction fees: 20 satoshis per byte
  transaction.fee(fee * satoshisPerByte);

  // Sign transaction with your private key
  transaction.sign(privateKey);

  // serialize Transactions
  const serializedTransaction = transaction.serialize();

  console.log("serializedTransaction", serializedTransaction);

  return serializedTransaction;
};

const btcTxHelper = async (senderAddress, amountToSend) => {
  const satoshiToSend = amountToSend * 100000000;

  // Fetching UTXOs
  const utxos = await axios.get(
    `${baseURL}get_tx_unspent/${sochain_network}/${senderAddress}`
  );

  // console.log(utxos)

  let fee = 0;
  let inputCount = 0;
  let outputCount = 2;
  let totalAmountAvailable = 0;
  let inputs = [];

  utxos.data.data.txs.forEach(async (element) => {
    let utxo = {};
    utxo.satoshis = Math.floor(Number(element.value) * 100000000);
    utxo.script = element.script_hex;
    utxo.address = utxos.data.data.address;
    utxo.txId = element.txid;
    utxo.outputIndex = element.output_no;
    totalAmountAvailable += utxo.satoshis;
    inputCount += 1;
    inputs.push(utxo);
  });

  const transactionSize = inputCount * 180 + outputCount * 34 + 10 - inputCount;
  // Check if we have enough funds to cover the transaction and the fees assuming we want to pay 20 satoshis per byte

  fee = transactionSize * satoshisPerByte;

  return {
    fee: fee,
    totalAmountAvailable: totalAmountAvailable,
    satoshiToSend: satoshiToSend,
    inputs: inputs,
  };
};

export const BTCSendApi = async (serializedTransaction) => {
  console.log("serializedTransaction=======>", serializedTransaction);
  // Send transaction
  try {
    const result = await axios({
      method: "POST",
      url: `https://sochain.com/api/v2/send_tx/${sochain_network}`,
      data: {
        tx_hex: serializedTransaction,
      },
    });
    console.log("TxHash => ", result.data.data);
    return result.data.data;
  } catch (error) {
    alert(serializedTransaction.message);
    return false;
  }
};

export const importBTCWallet = (privatekey, accountName) => {
  try {
    const privateKey = privatekey.toString();
    var keyPair = bitcoin.ECPair.fromPrivateKey(
      Buffer.from(privateKey, "hex"),
      bitcoin.networks.bitcoin
    );

    let { address } = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey });
    console.log(address);
    alert("Private Key Imported successfully ");
    if (accountName === undefined || accountName === "") {
      accountName = `Account`;
    }
    let obj = {
      privateKey: privateKey,
      address: address,
      balance: 0,
      accountName: accountName,
    };
    return obj;
  } catch (error) {
    alert("Invalid Private Key");
  }
};

export const generateBTCWallet = (count, mnemonic) => {
  const seednew = bip39.mnemonicToSeedSync(mnemonic);
  console.log("bip32", bip32, bip39);
  let root = bip32.fromSeed(seednew);

  // Derivation path
  const path = `m/84'/0'/0'/0/${count}`; //mainnet
  let child = root.derivePath(path);
  let address = bitcoin.payments.p2wpkh({
    pubkey: child.publicKey,
    network: bitcoin.networks.bitcoin,
  }).address;

  const privateKey = child.privateKey.toString("hex");

  return { address, privateKey };
};

export const getMarketBTCValue = () => {
  return fetch(
    "https://min-api.cryptocompare.com/data/price?fsym=" + "BTC" + "&tsyms=USD"
  )
    .then((response) => response.json())
    .then((json) => {
      setUSDBTCPrice(json.USD);
    })
    .catch((error) => {
      console.error(error);
    });
};
let marketpriceURL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=27&page=1&sparkline=false&price_change_percentage=1h%2C%2024h";

export const getGlobleMarketBTCPrice = () => {
  return fetch(marketpriceURL)
    .then((response) => response.json())
    .then((json) => {
      console.log("getGlobleMarketBNBPrice", json);
      let newArray = json.filter(
        (item) =>
          item.id === "bitcoin" ||
          item.id === "ethereum" ||
          item.id === "binancecoin" ||
          item.id === "tron"
      );
      console.log("New Data BNB=======>>>>", newArray);
      return newArray;
    })
    .catch((error) => {
      console.error(error);
      return 0;
    });
};
