import React, { useState, useEffect } from "react";
import useAllWallet from "../hooks/useAllWallet";
import useTotalUsdPirce from "../hooks/useTotalUsdPirce";
import useSelectedWallet from "../hooks/useSelectedWallet";
const WalletContext = React.createContext({ slow: 0, fast: 0 });

const WalletContextProvider = ({ children }) => {
  const wallets = useAllWallet();
  const totalUSDPrice = useTotalUsdPirce(wallets);
  const selectedWallets = useSelectedWallet(wallets);
  const [newSalectedWallets, setNewSalectedWallets] = useState();

  useEffect(() => {
    setNewSalectedWallets(selectedWallets);
  }, [selectedWallets]);

  const updateSalectedWallet = (data) => {
    setNewSalectedWallets(data);
  };

  return (
    <WalletContext.Provider
      value={{
        wallets,
        totalUSDPrice,
        selectedWallets: newSalectedWallets,
        updateSalectedWallet: updateSalectedWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export { WalletContext, WalletContextProvider };
