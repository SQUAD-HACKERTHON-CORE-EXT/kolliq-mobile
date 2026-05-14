import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { DUMMY_EIS_SCORE } from '../../constants/dummyData';

export default function EISScoreScreen() {
  const navigation = useNavigation<any>();

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

  // replace with real API call to GET /api/user/eis-score using djangoClient
  const { score, gigsDone, daysActive } = DUMMY_EIS_SCORE;

  const getTier = (s: number) => {
    if (s < 20) return 'Starter';
    if (s < 50) return 'Active';
    if (s < 60) return 'Trusted';
    if (s < 75) return 'Established';
    if (s < 90) return 'Champion';
    return 'Elite';
  };

  const tier = getTier(score);

  const getBadge = (requirement: number) => {
    if (score >= requirement) {
      return (
        <View style={styles.badgeUnlocked}>
          <Text style={styles.badgeUnlockedText}>Unlocked</Text>
        </View>
      );
    }
    return (
      <View style={styles.badgeLocked}>
        <Text style={styles.badgeLockedText}>Locked</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1A1A18" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Economic Identity Score</Text>

        <View style={styles.scoreSection}>
          <View style={styles.circleOuter}>
            {/* Simple representation of the progress circle */}
            <View style={[styles.circleInner, { borderColor: '#1B4D3E' }]}>
              <Text style={styles.scoreText}>{score}</Text>
              <Text style={styles.outOfText}>out of 100</Text>
              <Text style={styles.tierLabel}>{tier}</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Gigs Done</Text>
            <Text style={styles.statValue}>{gigsDone}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Days Active</Text>
            <Text style={styles.statValue}>{daysActive}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Score Tier</Text>
            <Text style={styles.statValueTier}>{tier}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What your score unlocks</Text>
          
          <View style={styles.unlockRow}>
            <View style={styles.unlockLeft}>
              <Ionicons name="wallet-outline" size={24} color="#1B4D3E" style={styles.unlockIcon} />
              <View>
                <Text style={styles.unlockName}>Savings</Text>
                <Text style={styles.unlockReq}>Score 20</Text>
              </View>
            </View>
            {getBadge(20)}
          </View>
          <View style={styles.divider} />
          
          <View style={styles.unlockRow}>
            <View style={styles.unlockLeft}>
              <Ionicons name="cash-outline" size={24} color="#1B4D3E" style={styles.unlockIcon} />
              <View>
                <Text style={styles.unlockName}>Loans</Text>
                <Text style={styles.unlockReq}>Score 50</Text>
              </View>
            </View>
            {getBadge(50)}
          </View>
          <View style={styles.divider} />
          
          <View style={styles.unlockRow}>
            <View style={styles.unlockLeft}>
              <Ionicons name="shield-checkmark-outline" size={24} color="#1B4D3E" style={styles.unlockIcon} />
              <View>
                <Text style={styles.unlockName}>Insurance</Text>
                <Text style={styles.unlockReq}>Score 70</Text>
              </View>
            </View>
            {getBadge(70)}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How to grow your score</Text>
          
          {['Complete more gigs', 'Save money daily', 'Repay loans on time', 'Transact regularly'].map((tip, index) => (
            <View key={index} style={styles.tipRow}>
              <Ionicons name="arrow-up-circle" size={20} color="#1B4D3E" />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomFixed}>
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.primaryButtonText}>Back to Dashboard</Text>
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
  heading: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    color: '#1A1A18',
    marginBottom: 32,
    textAlign: 'center',
  },
  scoreSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  circleOuter: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#E8EDE8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleInner: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  scoreText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 48,
    color: '#1B4D3E',
  },
  outOfText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: '#888880',
    marginTop: -4,
    marginBottom: 4,
  },
  tierLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: '#1B4D3E',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F5F5F0',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0D8',
  },
  statLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#888880',
    marginBottom: 8,
    textAlign: 'center',
  },
  statValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: '#1A1A18',
  },
  statValueTier: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#1B4D3E',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: '#1A1A18',
    marginBottom: 16,
  },
  unlockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  unlockLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unlockIcon: {
    marginRight: 16,
  },
  unlockName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#1A1A18',
  },
  unlockReq: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: '#888880',
  },
  badgeUnlocked: {
    backgroundColor: '#EAF5EF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeUnlockedText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: '#1B4D3E',
  },
  badgeLocked: {
    backgroundColor: '#E0E0D8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeLockedText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: '#888880',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0D8',
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tipText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: '#1A1A18',
    marginLeft: 12,
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
  },
  primaryButtonText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
    fontSize: 16,
  },
});
