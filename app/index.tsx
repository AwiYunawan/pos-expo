import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import React from "react";
import { Auth } from "firebase/auth";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { router } from "expo-router";

const index = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  

  const signIn = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      if (user) router.push("/transaksi");
    } catch (error: any) {
      console.error(error);
      alert("Sign in failed: " + error.message);
    }
  };
  const signUp = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);}
  };

  return (
    <SafeAreaView>
      <Text>index</Text>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({});
