import { useEffect, useState } from "react";
import useRefresh from "./useRefresh";

export default function useTotalUsdPirce(wallets) {
  const { fastRefresh } = useRefresh();
  const [totalUsdPrice, setTotalUsdPrice] = useState();

  useEffect(() => {
    if (wallets) {
      const total = Object.values(wallets).reduce((total, val) => {
        return total + val.totalUSDPrice;
      }, 0);
      setTotalUsdPrice(total);
    }
  }, [wallets, fastRefresh]);

  return totalUsdPrice;
}
