import { useEffect, useState } from "react";
import useRefresh from "./useRefresh";
import { getSelectedWallets } from "../utils/WalletOperations";

export default function useSelectedWallet(wallets) {
  const { fastRefresh } = useRefresh();
  const [selectedWallet, setSelectedWallet] = useState();

  useEffect(() => {
    const getData = async () => {
      const walletsData = await getSelectedWallets();
      let data = {};
      Object.values(wallets).forEach((item) => {
        if (!item.tokenType) {
          const coinName = item.showSymbol;
          const selectedAddress = walletsData[coinName].address;
          const selectedData = item.wallets.filter((add) => {
            return selectedAddress.toLowerCase() === add.address.toLowerCase();
          });
          if (selectedData.length !== 0) {
            data[coinName] = selectedData[0];
          }
        }
      });
      setSelectedWallet(data);
    };
    if (wallets) {
      getData();
    }
  }, [wallets, fastRefresh]);

  return selectedWallet;
}
