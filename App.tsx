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
import * as SecureStore from 'expo-secure-store';

import WelcomeScreen from './app/(auth)/WelcomeScreen';
import PhoneEntryScreen from './app/(auth)/PhoneEntryScreen';
import CreatePinScreen from './app/(auth)/CreatePinScreen';
import LoginScreen from './app/(auth)/LoginScreen';
import OTPVerificationScreen from './app/(auth)/OTPVerificationScreen';
import PersonalDetailsScreen from './app/(auth)/PersonalDetailsScreen';
import UserTypeSelectionScreen from './app/(auth)/UserTypeSelectionScreen';
import OnboardingWorkerScreen from './app/(auth)/OnboardingWorkerScreen';
import OnboardingEmployerScreen from './app/(auth)/OnboardingEmployerScreen';
import OnboardingTraderDetailsScreen from './app/(auth)/OnboardingTraderDetailsScreen';
import OnboardingEmployerDetailsScreen from './app/(auth)/OnboardingEmployerDetailsScreen';
import OnboardingLocationScreen from './app/(auth)/OnboardingLocationScreen';
import OnboardingReviewScreen from './app/(auth)/OnboardingReviewScreen';
import SuccessScreen from './app/(auth)/SuccessScreen';
import ProfileSetupScreen from './app/(auth)/ProfileSetupScreen';
import WalletLoadingScreen from './app/(auth)/WalletLoadingScreen';
import JobSeekerHome from './app/(jobseeker)/HomeScreen';
import JobsFeedScreen from './app/(jobseeker)/JobsFeedScreen';
import GigDetailScreen from './app/(jobseeker)/GigDetailScreen';
import JobseekerProfile from './app/(jobseeker)/ProfileScreen';
import TraderIdentity from './app/(trader)/IdentityScreen';
import EmployerDashboard from './app/(employer)/DashboardScreen';
import EmployerProfile from './app/(employer)/ProfileScreen';
import WorkersScreen from './app/(employer)/WorkersScreen';
import WalletScreen from './app/(shared)/WalletScreen';
import LoansScreen from './app/(shared)/LoansScreen';
import InsuranceScreen from './app/(shared)/InsuranceScreen';
import SavingsScreen from './app/(shared)/SavingsScreen';
import SplashScreen from './app/(shared)/SplashScreen';
import JobDetailScreen from './app/(jobseeker)/JobDetailScreen';
import AcceptJobScreen from './app/(jobseeker)/AcceptJobScreen';
import PostJobScreen from './app/(employer)/PostJobScreen';
import EscrowInstructionsScreen from './app/(employer)/EscrowInstructionsScreen';
import EISScoreScreen from './app/(shared)/EISScoreScreen';
import { COLORS } from './constants';
import { useAppStore } from './store/useAppStore';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isSplashComplete, setIsSplashComplete] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [initialRoute, setInitialRoute] = useState('Welcome');
  const [fontsLoaded] = useFonts({
    'PlusJakartaSans_400Regular': PlusJakartaSans_400Regular,
    'PlusJakartaSans_500Medium': PlusJakartaSans_500Medium,
    'PlusJakartaSans_600SemiBold': PlusJakartaSans_600SemiBold,
    'PlusJakartaSans_700Bold': PlusJakartaSans_700Bold,
  });

  const loadUserFromStorage = useAppStore((state) => state.loadUserFromStorage);
  const isLoggedIn = useAppStore((state) => state.isLoggedIn);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Load user from storage first
        await loadUserFromStorage();
        
        // Get the stored role directly
        const storedRole = await SecureStore.getItemAsync('role');
        const storedToken = await SecureStore.getItemAsync('access_token');
        
        // Determine initial route based on stored data
        if (storedToken && storedRole) {
          // User is logged in, route based on role
          if (storedRole === 'worker') {
            setInitialRoute('Home');
          } else if (storedRole === 'employer') {
            setInitialRoute('EmployerDashboard');
          } else if (storedRole === 'trader') {
            setInitialRoute('TraderHome');
          } else {
            // Unknown role, send to welcome
            setInitialRoute('Welcome');
          }
        } else {
          // No token or role, user is not logged in
          setInitialRoute('Welcome');
        }
      } catch (error) {
        console.log('Auth check error:', error);
        setInitialRoute('Welcome');
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  if (!isSplashComplete || !fontsLoaded || !authChecked) {
    return <SplashScreen onAnimationComplete={() => setIsSplashComplete(true)} />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLORS.background },
          }}
        >
          {/* Auth Flow - Registration */}
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="PhoneEntry" component={PhoneEntryScreen} />
          <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
          <Stack.Screen name="CreatePin" component={CreatePinScreen} />
          <Stack.Screen name="PersonalDetails" component={PersonalDetailsScreen} />
          <Stack.Screen name="UserTypeSelection" component={UserTypeSelectionScreen} />
          <Stack.Screen name="OnboardingWorker" component={OnboardingWorkerScreen} />
          <Stack.Screen name="OnboardingTraderDetails" component={OnboardingTraderDetailsScreen} />
          <Stack.Screen name="OnboardingEmployerDetails" component={OnboardingEmployerDetailsScreen} />
          <Stack.Screen name="OnboardingLocation" component={OnboardingLocationScreen} />
          <Stack.Screen name="OnboardingReview" component={OnboardingReviewScreen} />
          <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
          
          {/* Auth Flow - Login */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
          <Stack.Screen name="WalletLoading" component={WalletLoadingScreen} />
          
          {/* JobSeeker Routes */}
          <Stack.Screen name="Home" component={JobSeekerHome} />
          <Stack.Screen name="JobsFeed" component={JobsFeedScreen} />
          <Stack.Screen name="GigDetail" component={GigDetailScreen} />
          <Stack.Screen name="JobseekerProfile" component={JobseekerProfile} />
          <Stack.Screen name="JobDetail" component={JobDetailScreen} />
          <Stack.Screen name="AcceptJob" component={AcceptJobScreen} />
          
          {/* Employer Routes */}
          <Stack.Screen name="EmployerDashboard" component={EmployerDashboard} />
          <Stack.Screen name="EmployerProfile" component={EmployerProfile} />
          <Stack.Screen name="Workers" component={WorkersScreen} />
          <Stack.Screen name="PostJob" component={PostJobScreen} />
          <Stack.Screen name="EscrowInstructions" component={EscrowInstructionsScreen} />
          
          {/* Trader Routes */}
          <Stack.Screen name="TraderHome" component={TraderIdentity} />
          
          {/* Shared Routes */}
          <Stack.Screen name="WalletScreen" component={WalletScreen} />
          <Stack.Screen name="LoansScreen" component={LoansScreen} />
          <Stack.Screen name="InsuranceScreen" component={InsuranceScreen} />
          <Stack.Screen name="SavingsScreen" component={SavingsScreen} />
          <Stack.Screen name="EISScoreScreen" component={EISScoreScreen} />
        </Stack.Navigator>
        <StatusBar style="dark" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
