import CryptoJS from "crypto-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
const bip39 = require("bip39");
import { generateBNBWallet, importBNBWallet } from "./binance";
import { generateETHWallet } from "./eth";
import { generateBTCWallet } from "./btc";
import { generateAvaxWallet } from "./avax";
import { generateSolanaWallet } from "./solana";
import { generateETCWallet } from "./etc";

export const encryptMnemonic = (mnemonic) => {
  const ciphertext = CryptoJS.AES.encrypt(mnemonic, "mnemonic");
  AsyncStorage.setItem("mnemonic", ciphertext.toString());
};

export const decryptMnemonic = async () => {
  const ciphertext = await AsyncStorage.getItem("mnemonic");
  if (!ciphertext) {
    return null;
  }
  const bytes = CryptoJS.AES.decrypt(ciphertext, "mnemonic");
  const plaintext = bytes.toString(CryptoJS.enc.Utf8);
  return plaintext;
};

export const encryptPin = (pin) => {
  const ciphertext = CryptoJS.AES.encrypt(pin, "111111");
  AsyncStorage.setItem("pin", ciphertext.toString());
};

export const decryptPin = async () => {
  const ciphertext = await AsyncStorage.getItem("pin");
  if (!ciphertext) {
    return null;
  }
  const bytes = CryptoJS.AES.decrypt(ciphertext, "111111");
  const plaintext = bytes.toString(CryptoJS.enc.Utf8);
  return plaintext;
};

export const validateMnemonic = (mnemonic) => {
  const validate = bip39.validateMnemonic(mnemonic);
  return validate;
};

export const addWallet = async (data, wallets) => {
  let createWallet;
  const mnemonic = await decryptMnemonic();
  if (data.showSymbol === "BNB") {
    createWallet = generateBNBWallet;
  } else if (data.showSymbol === "ETH") {
    createWallet = generateETHWallet;
  } else if (data.showSymbol === "BTC") {
    createWallet = generateBTCWallet;
  } else if (data.showSymbol === "AVAX") {
    createWallet = generateAvaxWallet;
  } else if (data.showSymbol === "ETC") {
    createWallet = generateETCWallet;
  } else if (data.showSymbol === "SOL") {
    createWallet = generateSolanaWallet;
  }
  const newWallet = await createWallet(data.walletLenth, mnemonic);
  // console.log("Wallet", newWallet);
  const finalData = await saveNewWallet(newWallet, wallets, data);
  return finalData;
};

export const addToken = async (data, wallets, tokenType, contract) => {
  // console.log("TekenData", { data, wallets, tokenType, contract });
  const allCoins = await AsyncStorage.getItem("allCoins");

  const newTekenData = {
    walletLenth: 1,
    image: data.image,
    price_change_percentage_24h: "",
    current_price: "",
    name: data.name,
    symbol: data.symbol,
    showSymbol: data.symbol.toUpperCase(),
    tokenType,
    contract,
    decimals: Number(data.decimals),
  };

  const tempWallets = [...wallets, newTekenData];
  AsyncStorage.setItem("allCoins", `${allCoins},${data.id}`);
  encryptWallets(JSON.stringify(tempWallets));
  // console.log("TekenData", { data, wallets, tokenType, contract, tempWallets });
};

export const importWallet = async (data, wallets, privateKey) => {
  // console.log("data.showSymbol", { data, wallets, privateKey });
  let createWallet;
  if (
    data.showSymbol === "BNB" ||
    data.showSymbol === "ETH" ||
    data.showSymbol === "AVAX" ||
    data.showSymbol === "ETC"
  ) {
    createWallet = importBNBWallet;
  } else if (data.showSymbol === "BTC") {
    // createWallet = generateBTCWallet;
  } else if (data.showSymbol === "SOL") {
    // createWallet = generateSolanaWallet;
  }
  const newWallet = createWallet(privateKey);
  // console.log("newWallet", newWallet);
  if (newWallet) {
    const finalData = await saveNewWallet(newWallet, wallets, data);
    // console.log("finalData", finalData);
    return finalData;
  } else {
    return false;
  }
};

const saveNewWallet = async (newWallet, wallets, data) => {
  const tempWallets = [...wallets];
  const tempData = {
    ...data,
    walletLenth: data.walletLenth + 1,
    wallets: [
      ...data.wallets,
      {
        address: newWallet.address,
        usdPrice: 0,
        balance: 0,
        trx: [],
      },
    ],
  };
  for (let i = 0; i < tempWallets.length; i++) {
    if (tempWallets[i].showSymbol === data.showSymbol) {
      tempWallets[i] = tempData;
    }
  }
  const oldPvtKeys = await getPrivateKey();
  const oldSelectedWallets = await getSelectedWallets();
  const newPvtKeys = [...oldPvtKeys, newWallet];
  const newSelectedWallets = {
    ...oldSelectedWallets,
    [data.showSymbol]: { address: newWallet.address, index: 0 },
  };

  updateSelectedWallets(newSelectedWallets);
  encryptWallets(JSON.stringify(tempWallets));
  encryptPrivateKey(JSON.stringify(newPvtKeys));
  return { data: tempData, selectedWallet: newSelectedWallets };
};

export const changeWallet = async (type, address) => {
  const oldSelectedWallets = await getSelectedWallets();
  const newSelectedWallets = {
    ...oldSelectedWallets,
    [type]: { address, index: 0 },
  };
  updateSelectedWallets(newSelectedWallets);
};

export const generateAllWallet = async () => {
  const mnemonic = await decryptMnemonic();
  const btcWallet = generateBTCWallet(0, mnemonic);
  const bnbWallet = generateBNBWallet(0, mnemonic);
  const ethWallet = generateETHWallet(0, mnemonic);
  const avaxWallet = generateAvaxWallet(0, mnemonic);
  const etcWallet = generateETCWallet(0, mnemonic);
  const solanaWallet = await generateSolanaWallet(0, mnemonic);

  const wallets = [
    {
      wallets: [
        { address: ethWallet.address, usdPrice: 0, balance: 0, trx: [] },
      ],
      walletLenth: 1,
      image: "",
      price_change_percentage_24h: "",
      current_price: "",
      name: "Ethereum",
      symbol: "eth",
      showSymbol: "ETH",
    },
    {
      wallets: [
        { address: bnbWallet.address, usdPrice: 0, balance: 0, trx: [] },
      ],
      walletLenth: 1,
      image: "",
      price_change_percentage_24h: "",
      current_price: "",
      name: "Binance",
      symbol: "bnb",
      showSymbol: "BNB",
    },
    {
      wallets: [
        { address: btcWallet.address, usdPrice: 0, balance: 0, trx: [] },
      ],
      walletLenth: 1,
      image: "",
      price_change_percentage_24h: "",
      current_price: "",
      name: "Bitcoin",
      symbol: "btc",
      showSymbol: "BTC",
    },
    {
      wallets: [
        { address: avaxWallet.address, usdPrice: 0, balance: 0, trx: [] },
      ],
      walletLenth: 1,
      image: "",
      price_change_percentage_24h: "",
      current_price: "",
      name: "Avalanche",
      symbol: "avax",
      showSymbol: "AVAX",
    },
    {
      wallets: [
        { address: solanaWallet.address, usdPrice: 0, balance: 0, trx: [] },
      ],
      walletLenth: 1,
      image: "",
      price_change_percentage_24h: "",
      current_price: "",
      name: "Solana",
      symbol: "sol",
      showSymbol: "SOL",
    },
    {
      wallets: [
        { address: etcWallet.address, usdPrice: 0, balance: 0, trx: [] },
      ],
      walletLenth: 1,
      image: "",
      price_change_percentage_24h: "",
      current_price: "",
      name: "Ethereum Classic",
      symbol: "etc",
      showSymbol: "ETC",
    },
  ];

  const privateKeys = [
    ethWallet,
    bnbWallet,
    btcWallet,
    avaxWallet,
    etcWallet,
    solanaWallet,
  ];

  const selectedWallet = {
    ETH: { address: ethWallet.address, index: 0 },
    BNB: { address: bnbWallet.address, index: 0 },
    BTC: { address: btcWallet.address, index: 0 },
    AVAX: { address: avaxWallet.address, index: 0 },
    ETC: { address: etcWallet.address, index: 0 },
    SOL: { address: solanaWallet.address, index: 0 },
  };
  updateSelectedWallets(selectedWallet);
  encryptWallets(JSON.stringify(wallets));
  encryptPrivateKey(JSON.stringify(privateKeys));
  AsyncStorage.setItem(
    "allCoins",
    "bitcoin,ethereum,ethereum-classic,avalanche-2,solana,binancecoin"
  );
  AsyncStorage.setItem("selectedChain", "BNB");
};

export const updateSelectedWallets = async (data) => {
  AsyncStorage.setItem("selectedWallet", JSON.stringify(data));
};

export const getSelectedWallets = async () => {
  const data = await AsyncStorage.getItem("selectedWallet");
  return JSON.parse(data);
};

export const encryptWallets = (wallets) => {
  const ciphertext = CryptoJS.AES.encrypt(wallets, "222222");
  AsyncStorage.setItem("wallets", ciphertext.toString());
};

export const encryptPrivateKey = (privateKeys) => {
  const cipherKeys = CryptoJS.AES.encrypt(privateKeys, "333333");
  AsyncStorage.setItem("privateKeys", cipherKeys.toString());
};

export const decryptWallets = async () => {
  const ciphertext = await AsyncStorage.getItem("wallets");
  const bytes = CryptoJS.AES.decrypt(ciphertext, "222222");
  const plaintext = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(plaintext);
};

export const getPrivateKey = async (address) => {
  const ciphertext = await AsyncStorage.getItem("privateKeys");
  const bytes = CryptoJS.AES.decrypt(ciphertext, "333333");
  const plaintext = bytes.toString(CryptoJS.enc.Utf8);
  const data = JSON.parse(plaintext);
  if (address) {
    const filterAdd = data.filter((item) => {
      return address === item.address;
    });
    return filterAdd[0].privateKey;
  } else {
    return data;
  }
};

export function sortAddress(add) {
  const sortAdd = `${add.slice(0, 6)}...${add.slice(add.length - 4)}`;
  return sortAdd;
}
