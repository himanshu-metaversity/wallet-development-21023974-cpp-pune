import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Image,
  SectionList,
  Modal,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getHistory, getFav } from "../../utils/browser";
const { height, width } = Dimensions.get("screen");

const History = (props) => {
  console.log("props", props);
  const { type } = props.route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [historyData, setHistoryData] = useState();
  const [reLoad, setReLoad] = useState(false);

  useEffect(() => {
    const getdata = async () => {
      let data;
      if (type === "History") {
        data = await getHistory();
      } else {
        data = await getFav();
      }

      setHistoryData(data);
    };
    getdata();
  }, [props.route, reLoad]);

  const removeHistory = async () => {
    if (type === "History") {
      await AsyncStorage.removeItem("history");
    } else {
      await AsyncStorage.removeItem("fav");
    }
  };

  const Item = ({ data }) => (
    <TouchableOpacity
      style={styles.checkView}
      onPress={() => props.navigation.navigate("Browser", { url: data.url })}
    >
      {/* <Image
        source={{ uri: data.icon }}
        resizeMode="contain"
        style={{ width: width * 0.12 }}
      ></Image> */}
      <View style={{ justifyContent: "space-between" }}>
        <Text style={styles.simplexText}>{data.title}</Text>
        <Text style={styles.linkText}>{data.url}</Text>
      </View>
    </TouchableOpacity>
  );

  function renderModal() {
    return (
      <View style={styles.modalView}>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Are you sure you want to {"\n"} clear{" "}
              {type === "History" ? "History" : "Favorites"} ?
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: width * 0.45,
                alignSelf: "flex-end",
                paddingHorizontal: width * 0.04,
              }}
            >
              <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  removeHistory();
                  setReLoad(!reLoad);
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  function renderData() {
    return (
      <View style={{ height: height * 0.75 }}>
        <FlatList
          data={historyData}
          //   sections={historyData}
          //   keyExtractor={(item, index) => item.title + index}
          renderItem={({ item }) => <Item data={item} />}
        />
      </View>
    );
  }

  function renderHeader() {
    return (
      <View style={styles.securityView}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <ImageBackground
            source={require("../../assets/images/Onbording/Oval.png")}
            resizeMode="contain"
            style={styles.imgBack}
          >
            <Image
              source={require("../../assets/images/ButtonIcons/Back.png")}
              resizeMode="contain"
            ></Image>
          </ImageBackground>
        </TouchableOpacity>
        <View style={styles.pinView}>
          <Text style={styles.newPinText}>
            {type === "History" ? "History" : "Favorites"}
          </Text>
        </View>

        <TouchableOpacity onPress={() => setModalVisible(true)}>
          {historyData && (
            <Image
              source={require("../../assets/images/History/trash.png")}
              resizeMode="contain"
            ></Image>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  function renderNoFound() {
    return (
      <View>
        <Text style={styles.favrtText}>
          You don't have any {type === "History" ? "history" : "favourites"} yet
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.backgroundView}>
      {renderHeader()}
      {historyData === null && renderNoFound()}
      {historyData !== null && renderData()}
      {modalVisible && renderModal()}
    </View>
  );
};

export default History;

const styles = StyleSheet.create({
  backgroundView: {
    flex: 1,
    backgroundColor: "#0D1541",
  },
  favrtText: {
    fontSize: height / 45,
    color: "white",
    alignSelf: "center",
    marginTop: height * 0.05,
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "500",
  },

  securityView: {
    marginTop: height * 0.03,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: width * 0.02,
    justifyContent: "space-between",
    width: "90%",
  },

  imgBack: {
    height: height * 0.08,
    width: width * 0.14,
    justifyContent: "center",
    alignItems: "center",
  },

  modalView: {
    height: height * 0.25,
    width: width * 0.9,
    borderRadius: height / 35,
    backgroundColor: "#192255",
    justifyContent: "space-between",
    paddingVertical: height * 0.04,
    alignItems: "center",
    marginTop: height * 0.22,
    alignSelf: "center",
  },

  modalText: {
    fontSize: height / 45,
    color: "white",
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "500",
  },

  insideModal: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  textStyle: {
    fontSize: height / 45,
    color: "white",
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "500",
    marginRight: width * 0.04,
  },

  checkView: {
    flexDirection: "row",
    marginTop: height * 0.02,
    justifyContent: "space-between",
    marginHorizontal: width * 0.05,
    alignItems: "center",
    marginLeft: width * 0.06,
  },

  dateText: {
    fontSize: height / 45,
    color: "#A2A2AA",
    marginHorizontal: width * 0.05,
    marginTop: height * 0.05,
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "500",
  },

  pinView: {
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 10,
  },

  simplexText: {
    fontSize: height / 45,
    color: "white",
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "600",
  },

  timeText: {
    fontSize: height / 55,
    color: "white",
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "500",
  },

  linkText: {
    fontSize: height / 65,
    color: "#A2A2AA",
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "500",
    flexShrink: 1,
    width: width * 0.9,
  },

  newPinText: {
    fontSize: 25,
    color: "#FFFFFF",
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "500",
  },
});
