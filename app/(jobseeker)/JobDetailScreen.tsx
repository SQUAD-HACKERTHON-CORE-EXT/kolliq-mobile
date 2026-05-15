import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { formatCurrency } from '../../utils/formatCurrency';

export default function JobDetailScreen() {
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

  const job = params.job || params;

  const handleAcceptGig = () => {
    navigation.navigate('AcceptJob', { job });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1A1A18" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topSection}>
          <View style={styles.iconContainer}>
            <Ionicons name="briefcase-outline" size={28} color="#1B4D3E" />
          </View>
          <Text style={styles.title}>{job.title || 'Job detail'}</Text>
          <View style={styles.employerRow}>
            <Text style={styles.employerText}>
              {typeof job.employer_name === 'string'
                ? job.employer_name
                : (job.employer_name as any)?.business_name ||
                  (job.employer_name as any)?.full_name ||
                  (typeof job.employer === 'string'
                    ? job.employer
                    : (job.employer as any)?.business_name || (job.employer as any)?.full_name || 'Employer')}
            </Text>
            <Ionicons name="star" size={14} color="#F4721E" style={{ marginLeft: 4, marginRight: 2 }} />
            <Text style={styles.employerText}>
              {typeof (job.employer_rating || job.rating) === 'number'
                ? job.employer_rating || job.rating
                : (job.employer_rating as any)?.avg_rating ||
                  (job.employer_rating as any)?.rating ||
                  (job.rating as any)?.avg_rating ||
                  (job.rating as any)?.rating ||
                  '—'}
            </Text>
          </View>

          <View style={styles.badge}>
            <Ionicons name="shield-checkmark" size={16} color="#1B4D3E" />
            <Text style={styles.badgeText}>Payment secured before you start</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#888880" />
            <Text style={styles.infoText}>{job.location_area || job.location_city || job.location || 'Location unavailable'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color="#888880" />
            <Text style={styles.infoText}>{job.duration_hours || job.duration || '—'} hours</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color="#888880" />
            <Text style={styles.infoText}>{job.start_time || job.startTime || '—'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="people-outline" size={20} color="#888880" />
            <Text style={styles.infoText}>{job.workers_needed || job.workersNeeded || '—'} workers needed</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About this job</Text>
          <Text style={styles.descriptionText}>{job.description || 'No description available.'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pay</Text>
          <Text style={styles.payText}>{formatCurrency(job.pay_per_worker ?? job.pay ?? 0)}</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomFixed}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleAcceptGig}>
          <Text style={styles.primaryButtonText}>Accept Gig</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ghostButton} onPress={() => navigation.goBack()}>
          <Text style={styles.ghostButtonText}>Not Interested</Text>
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  topSection: {
    alignItems: 'flex-start',
    marginTop: 8,
    marginBottom: 24,
  },
  iconContainer: {
    width: 56,
    height: 56,
    backgroundColor: '#EAF5EF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 26,
    color: '#1A1A18',
    marginBottom: 8,
  },
  employerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  employerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: '#888880',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF5EF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  badgeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: '#1B4D3E',
    marginLeft: 6,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: '#1A1A18',
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0D8',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 17,
    color: '#1A1A18',
    marginBottom: 12,
  },
  descriptionText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: '#888880',
    lineHeight: 22,
  },
  payText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    color: '#1B4D3E',
  },
  bottomFixed: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#F5F5F0',
    borderTopWidth: 1,
    borderTopColor: '#E0E0D8',
  },
  primaryButton: {
    backgroundColor: '#1B4D3E',
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  primaryButtonText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
    fontSize: 16,
  },
  ghostButton: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ghostButtonText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#888880',
    fontSize: 16,
  },
});
