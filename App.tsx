import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';

import WelcomeScreen from './app/(auth)/WelcomeScreen';
import PhoneEntryScreen from './app/(auth)/PhoneEntryScreen';
import OTPVerificationScreen from './app/(auth)/OTPVerificationScreen';
import UserTypeSelectionScreen from './app/(auth)/UserTypeSelectionScreen';
import ProfileSetupScreen from './app/(auth)/ProfileSetupScreen';
import WalletLoadingScreen from './app/(auth)/WalletLoadingScreen';
import JobSeekerHome from './app/(jobseeker)/HomeScreen';
import JobsFeedScreen from './app/(jobseeker)/JobsFeedScreen';
import GigDetailScreen from './app/(jobseeker)/GigDetailScreen';
import JobseekerProfile from './app/(jobseeker)/ProfileScreen';
import TraderIdentity from './app/(trader)/IdentityScreen';
import EmployerDashboard from './app/(employer)/DashboardScreen';
import EmployerProfile from './app/(employer)/ProfileScreen';
import WalletScreen from './app/(shared)/WalletScreen';
import LoansScreen from './app/(shared)/LoansScreen';
import InsuranceScreen from './app/(shared)/InsuranceScreen';
import SavingsScreen from './app/(shared)/SavingsScreen';
import SplashScreen from './app/(shared)/SplashScreen';
import { COLORS } from './constants';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isSplashComplete, setIsSplashComplete] = useState(false);
  const [fontsLoaded] = useFonts({
    'PlusJakartaSans_400Regular': PlusJakartaSans_400Regular,
    'PlusJakartaSans_500Medium': PlusJakartaSans_500Medium,
    'PlusJakartaSans_600SemiBold': PlusJakartaSans_600SemiBold,
    'PlusJakartaSans_700Bold': PlusJakartaSans_700Bold,
  });

  if (!isSplashComplete || !fontsLoaded) {
    return <SplashScreen onAnimationComplete={() => setIsSplashComplete(true)} />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLORS.background },
          }}
        >
          {/* Auth Flow */}
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="PhoneEntry" component={PhoneEntryScreen} />
          <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
          <Stack.Screen name="UserTypeSelection" component={UserTypeSelectionScreen} />
          <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
          <Stack.Screen name="WalletLoading" component={WalletLoadingScreen} />
          
          {/* JobSeeker Routes */}
          <Stack.Screen name="JobseekerHome" component={JobSeekerHome} />
          <Stack.Screen name="JobsFeed" component={JobsFeedScreen} />
          <Stack.Screen name="GigDetail" component={GigDetailScreen} />
          <Stack.Screen name="JobseekerProfile" component={JobseekerProfile} />
          
          {/* Trader Routes */}
          <Stack.Screen name="TraderHome" component={TraderIdentity} />
          <Stack.Screen name="market" component={TraderIdentity} />
          <Stack.Screen name="identity" component={TraderIdentity} />
          <Stack.Screen name="account" component={TraderIdentity} />
          
          {/* Employer Routes */}
          <Stack.Screen name="EmployerHome" component={EmployerDashboard} />
          <Stack.Screen name="profile" component={EmployerProfile} />
          <Stack.Screen name="workers" component={EmployerDashboard} />
          
          {/* Shared Routes */}
          <Stack.Screen name="WalletScreen" component={WalletScreen} />
          <Stack.Screen name="LoansScreen" component={LoansScreen} />
          <Stack.Screen name="InsuranceScreen" component={InsuranceScreen} />
          <Stack.Screen name="SavingsScreen" component={SavingsScreen} />
        </Stack.Navigator>
        <StatusBar style="dark" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
