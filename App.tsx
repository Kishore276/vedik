import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toaster } from 'sonner-native';
import HomeScreen from "./screens/HomeScreen";
import RemindersScreen from "./screens/RemindersScreen";
import PlannerScreen from "./screens/PlannerScreen";
import VendorsScreen from "./screens/VendorsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import EventDetailsScreen from "./screens/EventDetailsScreen";
import VendorDetailsScreen from "./screens/VendorDetailsScreen";
import { Ionicons } from '@expo/vector-icons';
import { EventProvider } from './context/EventContext';
import { StatusBar } from 'expo-status-bar';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ focused, color }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';
          if (route.name === 'HomeTab') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'RemindersTab') iconName = focused ? 'calendar' : 'calendar-outline';
          else if (route.name === 'PlannerTab') iconName = focused ? 'add-circle' : 'add-circle-outline';
          else if (route.name === 'VendorsTab') iconName = focused ? 'business' : 'business-outline';
          else if (route.name === 'ProfileTab') iconName = focused ? 'person' : 'person-outline';

          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: '#FF4A87',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarLabelStyle: styles.tabLabel,
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="RemindersTab" component={RemindersScreen} options={{ tabBarLabel: 'Reminders' }} />
      <Tab.Screen name="PlannerTab" component={PlannerScreen} options={{ tabBarLabel: 'Plan Event' }} />
      <Tab.Screen name="VendorsTab" component={VendorsScreen} options={{ tabBarLabel: 'Vendors' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
      <Stack.Screen name="VendorDetails" component={VendorDetailsScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <EventProvider>
          <Toaster />
          <NavigationContainer>
            <RootStack />
          </NavigationContainer>
        </EventProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    height: 60,
    paddingBottom: 8,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});
