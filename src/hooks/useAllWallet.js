import { useEffect, useState, useCallback, useRef } from "react";
import useRefresh from "./useRefresh";
import { decryptWallets } from "../utils/WalletOperations";
import { getGlobleMarketBTCPrice } from "../utils/binance";
import { getBNBBalance } from "../utils/binance";
import { getBTCBalance } from "../utils/btc";
import { getETHBalance } from "../utils/eth";
import { getSolanaBalance } from "../utils/solana";
import { getAvaxBalance } from "../utils/avax";
import { getETCBalance } from "../utils/etc";
import { INFURA_URL as erc20Infura } from "../utils/eth";
import { BNB_URL as bep20Infura } from "../utils/binance";
import erc20 from "../utils/erc20.json";
import { getWeb3ContractObject, getWeb3Obj } from "../utils/erc20";

import { getCoinIcon } from "../utils/images";

const getWalletBalance = async (name, address) => {
  let balance;
  if (name === "bnb") {
    balance = await getBNBBalance(address);
  } else if (name === "btc") {
    balance = await getBTCBalance(address);
  } else if (name === "eth") {
    balance = await getETHBalance(address);
  } else if (name === "sol") {
    balance = await getSolanaBalance(address);
  } else if (name === "avax") {
    balance = await getAvaxBalance(address);
  } else if (name === "etc") {
    balance = await getETCBalance(address);
  }
  return balance;
};
const getContractBalance = async (name, contractAdd, address, decimals) => {
  const rpcurl = name === "ERC20" ? erc20Infura : bep20Infura;
  const tokenContract = getWeb3ContractObject(erc20, contractAdd, rpcurl);
  const balance = await tokenContract.methods.balanceOf(address).call();

  const finalBalance = balance / Math.pow(10, decimals);
  return Number(finalBalance);
};

export default function useAllWallet() {
  const { fastRefresh } = useRefresh();
  const [wallets, setWallets] = useState();

  useEffect(() => {
    const getPrice = async () => {
      const data = await decryptWallets();
      if (data) {
        const allMarketPrice = await getGlobleMarketBTCPrice();
        const temp = await Promise.all(
          data.map(async (item) => {
            const symbol = item.symbol;
            const filterToken = allMarketPrice.filter((token) => {
              return token.symbol === symbol;
            });
            const crtToken = filterToken[0];
            let totalBalance = 0;
            let totalUSDPrice = 0;

            let newWallets;
            if (!item.tokenType) {
              newWallets = await Promise.all(
                item.wallets.map(async (wallet) => {
                  const crtWalletBalance = await getWalletBalance(
                    symbol,
                    wallet.address
                  );
                  if (crtWalletBalance !== "error") {
                    totalBalance = totalBalance + crtWalletBalance;
                    const usdPrice = crtWalletBalance * crtToken.current_price;
                    totalUSDPrice = totalUSDPrice + usdPrice;
                    return {
                      ...wallet,
                      balance: crtWalletBalance,
                      usdPrice,
                    };
                  } else {
                    totalBalance = wallet.balance;
                    const usdPrice = wallet.usdPrice;
                    totalUSDPrice = totalUSDPrice + usdPrice;
                    return {
                      ...wallet,
                      balance: crtWalletBalance,
                      usdPrice,
                    };
                  }
                })
              );
            } else {
              let crtWallet;

              if (item.tokenType === "ERC20") {
                const coinName = data.filter((token) => {
                  return token.symbol === "eth";
                });
                crtWallet = coinName[0];
              } else {
                const coinName1 = data.filter((token) => {
                  return token.symbol === "bnb";
                });
                crtWallet = coinName1[0];
              }

              newWallets = await Promise.all(
                crtWallet.wallets.map(async (wallet) => {
                  const crtWalletBalance = await getContractBalance(
                    item.tokenType,
                    item.contract,
                    wallet.address,
                    item.decimals
                  );
                  totalBalance = totalBalance + crtWalletBalance;
                  const usdPrice = crtWalletBalance * crtToken.current_price;
                  totalUSDPrice = totalUSDPrice + usdPrice;
                  return {
                    ...wallet,
                    balance: crtWalletBalance,
                    usdPrice,
                  };
                })
              );
            }
            const newData = {
              ...item,
              current_price: crtToken.current_price,
              price_change_percentage_24h:
                crtToken.price_change_percentage_24h === null
                  ? 0
                  : crtToken.price_change_percentage_24h,
              wallets: newWallets,
              totalBalance,
              totalUSDPrice,
              image: !item.tokenType
                ? getCoinIcon(item.showSymbol)
                : item.image,
            };
            return newData;
          })
        );
        setWallets(temp);
      }
    };

    getPrice();
  }, [fastRefresh]);

  // console.log("I am out", prevRefresh, fastRefresh);

  return wallets;
}
