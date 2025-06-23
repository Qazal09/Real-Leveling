import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context"
import { Toaster } from 'sonner-native';
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import AdminScreen from "./screens/AdminScreen";
import MenuScreen from "./screens/MenuScreen";
import ShopScreen from "./screens/ShopScreen";
import BattleScreen from "./screens/BattleScreen";
import QuestScreen from "./screens/QuestScreen";
import SocialScreen from "./screens/SocialScreen";
import InventoryScreen from "./screens/InventoryScreen";

// Initialize global admin state
declare global {
  var isAdmin: boolean;
  var playerInventory: any[]; // To store all items the player owns
  var playerEquipment: {
    weapon: any | null;
    armor: any | null;
    accessory: any | null;
  }; // To store currently equipped items
  var playerStats: {
    level: number;
    xp: number;
    attack: number;
    defense: number;
    health: number;
    currency: number; // Gold/Coins
  };
}
global.isAdmin = false;
global.playerInventory = [];
global.playerEquipment = {
  weapon: null,
  armor: null,
  accessory: null,
};
global.playerStats = {
  level: 1,
  xp: 0,
  attack: 10,
  defense: 5,
  health: 100,
  currency: 1000,
};

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator screenOptions={{
    headerShown: false
  }} initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Admin" component={AdminScreen} />
      <Stack.Screen name="Menu" component={MenuScreen} />
      <Stack.Screen name="Shop" component={ShopScreen} />
      <Stack.Screen name="Battle" component={BattleScreen} />
      <Stack.Screen name="Quests" component={QuestScreen} />
      <Stack.Screen name="Social" component={SocialScreen} />
      <Stack.Screen name="Inventory" component={InventoryScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider style={styles.container}>
    <Toaster />
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    userSelect: "none"
  }
});