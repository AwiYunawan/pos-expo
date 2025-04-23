import { StyleSheet, Text, View , Button} from "react-native";
import React from "react";
import { useState } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { initializeApp } from "firebase/app";

const index = () => {
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

initializeApp(firebaseConfig);

const index = () => {
  const [response, setResponse] = useState("");

  const callFunction = async () => {
    const functions = getFunctions();
    const testFunction = httpsCallable(functions, "testFunction");
    try {
      const result = await testFunction({ message: "Hello from React Native!" });
      setResponse(result.data);
    } catch (error) {
      console.error("Error calling function:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Firebase Function Response:</Text>
      <Text>{response}</Text>
      <Button title="Call Firebase Function" onPress={callFunction} />
    </View>
  );
};
};

export default index;

const styles = StyleSheet.create({});
