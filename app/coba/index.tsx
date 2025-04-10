import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

const Coba = () => {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>ini coba coba cuy</Text>
    </View>
  );
};

export default Coba;
