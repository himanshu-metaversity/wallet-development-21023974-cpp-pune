import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// const baseUrl = "https://node-walletdevelopment.mobiloitte.com/api/vi";
const baseUrl = "http://182.72.203.250:1935/api/v1";

export const apiConfig = {
  login: `${baseUrl}/user/login`,
  resendOTP: `${baseUrl}/user/resendOTP`,
  verifyOTP: `${baseUrl}/user/verifyOTP`,
  fee: `${baseUrl}/admin/getTaxFee`,
  swap: `${baseUrl}/user/swap`,
  buyCoin: `${baseUrl}/user/buyCoin`,
  swapHistory: `${baseUrl}/user/swapHistory`,
  buyHistory: `${baseUrl}/user/buyHistory`,
};

export const userLogin = async (email) => {
  try {
    const res = await axios.post(apiConfig.login, {
      email,
    });
    return res;
  } catch (error) {
    // console.log(error.response);
    return error.response;
  }
};

export const verifyOTP = async (email, otp) => {
  console.log({ email, otp });
  try {
    const res = await axios.post(apiConfig.verifyOTP, {
      email,
      otp,
    });
    if (res.data.statusCode === 200) {
      await AsyncStorage.setItem("token", res.data.result.token);
    }
    return res;
  } catch (error) {
    // console.log(error.response);
    return error.response;
  }
};
export const resendOTP = async (email) => {
  try {
    const res = await axios.post(apiConfig.resendOTP, {
      email,
    });
    return res;
  } catch (error) {
    // console.log(error.response);
    return error.response;
  }
};
export const getFee = async (token) => {
  try {
    const res = await axios.get(apiConfig.fee, {
      headers: {
        token,
      },
    });
    return res;
  } catch (error) {
    console.log(error.response);
    await AsyncStorage.removeItem("token");
    return error.response;
  }
};
export const getNativeSwapAmount = async (fromData, toData, amount, txFee) => {
  try {
    console.log({ fromData, toData, amount, txFee });
    const swapTo = txFee.filter((item) => {
      return item.coinName === toData.showSymbol;
    });
    const swapFrom = txFee.filter((item) => {
      return item.coinName === fromData.showSymbol;
    });
    const feeData = swapTo[0];
    const value = (
      (fromData.current_price / toData.current_price) *
      amount
    ).toFixed(8);

    if (value < feeData.swapMin) {
      return {
        value: value.toString(),
        error: {
          message: `Invalid amount: minimal amount for ${toData.showSymbol} is ${feeData.swapMin}`, // Max amount is 2671.829495 eth.
        },
        fees: feeData,
      };
    }

    if (value > feeData.swapMax) {
      return {
        value: value.toString(),
        error: {
          message: `Invalid amount: Max amount for ${toData.showSymbol} is ${feeData.swapMax}`, // Max amount is 2671.829495 eth.
        },
        fees: feeData,
      };
    }

    return {
      value: value.toString(),
      fees: swapFrom[0],
    };
  } catch (error) {
    return error.response;
  }
};

export const swapToNative = async (data) => {
  try {
    console.log("data", data);
    const token = await AsyncStorage.getItem("token");
    const res = await axios.post(apiConfig.swap, data, {
      headers: {
        token,
      },
    });
    return res;
  } catch (error) {
    return error.response;
  }
};

export const buyCoin = async (data) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await axios.post(apiConfig.buyCoin, data, {
      headers: {
        token,
      },
    });
    return res;
  } catch (error) {
    return error.response;
  }
};

export const history = async (data) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await axios.post(
      apiConfig[data],
      {},
      {
        headers: {
          token,
        },
      }
    );
    return res;
  } catch (error) {
    return error.response;
  }
};
