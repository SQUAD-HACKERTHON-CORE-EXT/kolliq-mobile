import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

import WelcomeScreen from './app/(auth)/WelcomeScreen';
import PhoneEntryScreen from './app/(auth)/PhoneEntryScreen';
import OTPVerificationScreen from './app/(auth)/OTPVerificationScreen';
import UserTypeSelectionScreen from './app/(auth)/UserTypeSelectionScreen';
import ProfileSetupScreen from './app/(auth)/ProfileSetupScreen';
import WalletLoadingScreen from './app/(auth)/WalletLoadingScreen';
import JobSeekerHome from './app/(jobseeker)/HomeScreen';
import GigDetailScreen from './app/(jobseeker)/GigDetailScreen';
import TraderIdentity from './app/(trader)/IdentityScreen';
import EmployerDashboard from './app/(employer)/DashboardScreen';
import EmployerProfile from './app/(employer)/ProfileScreen';
import SplashScreen from './app/(shared)/SplashScreen';
import { COLORS } from './constants';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isSplashComplete, setIsSplashComplete] = useState(false);
  const [fontsLoaded] = useFonts({
    'Inter': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
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
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="PhoneEntry" component={PhoneEntryScreen} />
          <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
          <Stack.Screen name="UserTypeSelection" component={UserTypeSelectionScreen} />
          <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
          <Stack.Screen name="WalletLoading" component={WalletLoadingScreen} />
          
          {/* JobSeeker Routes */}
          <Stack.Screen name="JobseekerHome" component={JobSeekerHome} />
          <Stack.Screen name="GigDetail" component={GigDetailScreen} />
          <Stack.Screen name="jobs" component={JobSeekerHome} />
          
          {/* Trader Routes */}
          <Stack.Screen name="TraderHome" component={TraderIdentity} />
          
          {/* Employer Routes */}
          <Stack.Screen name="EmployerHome" component={EmployerDashboard} />
          <Stack.Screen name="profile" component={EmployerProfile} />
          <Stack.Screen name="workers" component={EmployerDashboard} />
          
          {/* Shared/Missing Routes */}
          <Stack.Screen name="wallet" component={JobSeekerHome} />
        </Stack.Navigator>
        <StatusBar style="dark" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
