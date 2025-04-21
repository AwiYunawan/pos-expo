import { StyleSheet, Text, View , Button} from "react-native";
import React from "react";

const index = () => {
  const handleUpload = () => {
    console.log("Upload button pressed");
  };

  const handleDownload = () => {
    console.log("Download button pressed");
  };

  return (
    <View>
      <Text>ini halaman untuk coba storage</Text>
      <Text>Upload File to Firebase Storage</Text>
      <Button title="Upload File" onPress={handleUpload} />
      <Text>Download File from Firebase Storage</Text>
      <Button title="Download File" onPress={handleDownload} />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
