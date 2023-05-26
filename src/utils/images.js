const ethIcon = require("../assets/images/Bitcoins/Ether.png");
const bnbIcon = require("../assets/images/Bitcoins/BNB.png");
const btcIcon = require("../assets/images/Bitcoins/Bitcoin.png");
const etcIcon = require("../assets/images/Bitcoins/etc.png");
const avaxIcon = require("../assets/images/Bitcoins/avax.png");
const solIcon = require("../assets/images/Bitcoins/sol.png");

export { ethIcon, bnbIcon, btcIcon };

export const getCoinIcon = (name) => {
  let coinIcon;
  switch (name) {
    case "BNB":
      coinIcon = bnbIcon;
      break;

    case "ETH":
      coinIcon = ethIcon;
      break;

    case "BTC":
      coinIcon = btcIcon;
      break;
    case "ETC":
      coinIcon = etcIcon;
      break;
    case "AVAX":
      coinIcon = avaxIcon;
      break;
    case "SOL":
      coinIcon = solIcon;
      break;

    default:
      break;
  }
  return coinIcon;
};
