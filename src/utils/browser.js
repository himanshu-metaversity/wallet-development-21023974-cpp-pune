import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveHistory = async (data) => {
  const oldHistory = await getHistory();
  const oldData = oldHistory === null ? [] : oldHistory;
  const temp = [...oldData];
  temp.unshift({
    url: data.navState.url,
    title: data.navState.title,
    // icon: data.navState.icon.replace("svg", "png"),
  });
  AsyncStorage.setItem("history", JSON.stringify(temp));
};

export const getHistory = async () => {
  const data = await AsyncStorage.getItem("history");
  return JSON.parse(data);
};

export const saveFav = async (data) => {
  const oldFev = await getFav();
  const oldData = oldFev === null ? [] : oldFev;
  const checkOldData = oldData.filter((item) => {
    return item.url === data.navState.url;
  });
  if (checkOldData.length > 0) {
    alert(`${data.navState.title} already in favourites!`);
    return;
  }
  const temp = [...oldData];
  temp.unshift({
    url: data.navState.url,
    title: data.navState.title,
    // icon: data.navState.icon.replace("svg", "png"),
  });
  AsyncStorage.setItem("fav", JSON.stringify(temp));
  alert(`${data.navState.title} added to favourites!`);
};

export const getFav = async () => {
  const data = await AsyncStorage.getItem("fav");
  return JSON.parse(data);
};
