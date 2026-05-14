import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { DUMMY_JOB_DETAIL } from '../../constants/dummyData';

export default function AcceptJobScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const params = route.params || {};

  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1B4D3E" />
      </View>
    );
  }

  // replace with real API call to GET /jobs/:id/status using nodeClient
  const job = {
    title: params.title || DUMMY_JOB_DETAIL.title,
    employer: params.employer || DUMMY_JOB_DETAIL.employer,
    location: params.location || DUMMY_JOB_DETAIL.location,
    pay: params.pay || DUMMY_JOB_DETAIL.pay,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.successIconContainer}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={40} color="#FFFFFF" />
          </View>
        </View>

        <Text style={styles.heading}>Gig Accepted</Text>
        <Text style={styles.subtext}>
          Your payment is secured in escrow. You will be paid the moment the job is confirmed done.
        </Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Job</Text>
            <Text style={styles.value}>{job.title}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>Employer</Text>
            <Text style={styles.value}>{job.employer}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>Location</Text>
            <Text style={styles.value}>{job.location}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>Your Pay</Text>
            <Text style={styles.payValue}>{job.pay}</Text>
          </View>
        </View>

        <View style={styles.protectionCard}>
          <View style={styles.protectionHeader}>
            <Ionicons name="shield-checkmark" size={20} color="#1B4D3E" />
            <Text style={styles.protectionTitle}>Payment Protection</Text>
          </View>
          <Text style={styles.protectionText}>
            Your payment of {job.pay} is held securely in a Squad escrow account. It will be released to your Kolliq wallet the moment the employer confirms the job is complete.
          </Text>
        </View>
      </View>

      <View style={styles.bottomFixed}>
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.primaryButtonText}>Go to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F0',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 40,
    alignItems: 'center',
  },
  successIconContainer: {
    marginBottom: 24,
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1B4D3E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontFamily: 'Inter_700Bold',
    fontSize: 26,
    color: '#1A1A18',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtext: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: '#888880',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 32,
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: '#E0E0D8',
    width: '100%',
    padding: 16,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0D8',
  },
  label: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: '#888880',
  },
  value: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: '#1A1A18',
  },
  payValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#1B4D3E',
  },
  protectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: '#E0E0D8',
    width: '100%',
    padding: 16,
  },
  protectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  protectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: '#1A1A18',
    marginLeft: 8,
  },
  protectionText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: '#888880',
    lineHeight: 20,
  },
  bottomFixed: {
    padding: 16,
    backgroundColor: '#F5F5F0',
  },
  primaryButton: {
    backgroundColor: '#1B4D3E',
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  primaryButtonText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
    fontSize: 16,
  },
});
