import * as solanaWeb3 from "@solana/web3.js";
import * as ed25519 from "ed25519-hd-key";
import { Buffer } from "buffer";
import nacl from "tweetnacl";
const bip39 = require("bip39");
var axios = require("axios");
const connection = new solanaWeb3.Connection(
  solanaWeb3.clusterApiUrl("devnet"),
  "confirmed"
);

const LAMPORTS_PER_SOL = solanaWeb3.LAMPORTS_PER_SOL;

// var from;

const mnemonicToSeed = async (mnemonic) => {
  const seed = await bip39.mnemonicToSeed(mnemonic);
  return Buffer.from(seed).toString("hex");
};

export const generateSolanaWallet = async (walletIndex, mnemonic) => {
  const seed = await mnemonicToSeed(mnemonic);
  // console.log("seed", seed);
  const derivedSeed = deriveSeed(walletIndex, seed);
  // console.log("derivedSeed", derivedSeed);
  const keyPair = nacl.sign.keyPair.fromSeed(derivedSeed);
  const acc = new solanaWeb3.Keypair(keyPair);
  const address = acc.publicKey.toString();
  const privateKey = JSON.stringify(acc.secretKey);
  console.log("solana", { address, privateKey });
  return { address, privateKey };
};

const deriveSeed = (walletIndex, seed) => {
  const path44Change = `m/44'/501'/${walletIndex}'/0'`;
  return ed25519.derivePath(path44Change, Buffer.from(seed, "hex")).key;
};

const publicKeyFromString = (publicKeyString) => {
  return new solanaWeb3.PublicKey(publicKeyString);
};

const createConnection = () => {
  return new solanaWeb3.Connection(solanaWeb3.clusterApiUrl("devnet"));
};

export const getSolanaBalance = async (address) => {
  try {
    const connection = createConnection();
    const _publicKey = publicKeyFromString(address);
    const lamports = await connection.getBalance(_publicKey);
    const sol = lamports / LAMPORTS_PER_SOL;
    return sol;
  } catch (error) {
    console.log("error", error);
    return "error";
  }
};

export const isValidSOLAddress = (address) => {
  try {
    const publicKey = new solanaWeb3.PublicKey(address);
    const check = solanaWeb3.PublicKey.isOnCurve(publicKey);
    return check;
  } catch (error) {
    return false;
  }
};

export const getSolPvtString = async (fromPrivateKey) => {
  const fromKeyPair = JSON.parse(fromPrivateKey);
  console.log("fromPrivateKey", Object.values(fromKeyPair));
  const prvKey = Uint8Array.from(Object.values(fromKeyPair));
  const hex = Buffer.from(prvKey).toString("hex");
  return hex;
};

export const withdrawSOL = async (from, fromPrivateKey, to, amount) => {
  console.log("Executing transaction...");
  console.log("amount", fromPrivateKey);
  const fromKeyPair = JSON.parse(fromPrivateKey);
  console.log("fromPrivateKey", Object.values(fromKeyPair));
  const prvKey = Uint8Array.from(Object.values(fromKeyPair));

  const fromData = solanaWeb3.Keypair.fromSecretKey(prvKey);
  console.log("from", fromData);
  console.log("LAMPORTS_PER_SOL", LAMPORTS_PER_SOL);
  try {
    const transaction = new solanaWeb3.Transaction().add(
      solanaWeb3.SystemProgram.transfer({
        fromPubkey: publicKeyFromString(from),
        toPubkey: publicKeyFromString(to),
        lamports: Number(amount) * LAMPORTS_PER_SOL,
      })
    );
    console.log("transaction", transaction);
    // Sign transaction, broadcast, and confirm
    const connection = createConnection();
    console.log("connection", connection);
    const signature = await solanaWeb3.sendAndConfirmTransaction(
      connection,
      transaction,
      [fromData]
    );
    console.log("SIGNATURE", signature);
    return {
      status: true,
      Hash: signature,
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

export const inComing = async (address) => {
  try {
    // const address = "Dz7fhKnRqejw3pNVfnWkq7XpHvgd8ptArmZ3fzMZDria";
    const response = await axios.get(
      `https://public-api.solscan.io/account/solTransfers?account=${address}&offset=0&limit=10`
    );
    let data = response.data.data;
    // console.log("data", data);
    let matchedData = new Array();
    for (let i = 0; i < data.length; i++) {
      if (data[i].dst.toLowerCase() == address.toLowerCase()) {
        matchedData.push({
          type: "Incoming",
          value: data[i].txNumberSolTransfer,
          timeStamp: data[i].blockTime,
          hash: data[i].txHash,
          from: data[i].src,
          to: data[i].dst,
        });
      } else if (data[i].src.toLowerCase() == address.toLowerCase()) {
        matchedData.push({
          type: "Outgoing",
          value: data[i].txNumberSolTransfer,
          timeStamp: data[i].blockTime,
          hash: data[i].txHash,
          from: data[i].src,
          to: data[i].dst,
        });
      }
    }
    // console.log("matchedData", matchedData);
    return matchedData;
  } catch (error) {
    console.log(error.response);
    return [];
  }
};

export async function txListSOL(address) {
  const allAdd = address.map((add) => {
    return add.address;
  });
  let finalTx = [];
  const allTx = await Promise.all(
    allAdd.map(async (wallet) => {
      const data = await inComing(wallet);
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
