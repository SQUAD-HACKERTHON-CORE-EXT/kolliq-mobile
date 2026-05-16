import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { useAppStore } from '../../store/useAppStore';
import { createJob } from '../../services/jobsService';
import { getErrorMessage } from '../../utils/handleApiError';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(advancedFormat);

import { COLORS, FONTS, SPACING, BORDER_RADIUS, LAYOUT, ONBOARDING_CONFIG } from '../../constants';

export default function PostJobScreen() {
  const navigation = useNavigation<any>();
  // Use Job Skills from constants instead of Marketplace categories
  const jobSkills = ONBOARDING_CONFIG.SKILLS;
  
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [title, setTitle] = useState('');
  const [workers, setWorkers] = useState('1');
  const [location, setLocation] = useState('');
  const [locationCity, setLocationCity] = useState('');
  
  // Date and Time states
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [finishDate, setFinishDate] = useState(new Date().toISOString().split('T')[0]);
  const [finishTime, setFinishTime] = useState('17:00');

  const [pay, setPay] = useState('');
  const [description, setDescription] = useState('');
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState('');

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1B4D3E" />
      </View>
    );
  }

  const isValid =
    ((category as string) !== '' ||
      ((category as string) === 'other' && customCategory !== '')) &&
    title !== '' &&
    location !== '' &&
    pay !== '';
  const totalEscrow = isValid ? parseInt(pay, 10) * parseInt(workers, 10) : 0;

  const calculateDuration = () => {
    try {
      const start = new Date(`${startDate}T${startTime}:00`);
      const finish = new Date(`${finishDate}T${finishTime}:00`);
      const diffMs = finish.getTime() - start.getTime();
      const diffHrs = diffMs / (1000 * 60 * 60);
      return diffHrs > 0 ? diffHrs.toFixed(1) : "1.0";
    } catch {
      return "1.0";
    }
  };

  const handlePostJob = async () => {
    if (!isValid) return;
    try {
      setPosting(true);
      setPostError('');
      const duration = calculateDuration();
      const startDateTime = new Date(`${startDate}T${startTime}:00`).toISOString();

      const finalDescription = category === 'other' 
        ? `[Category: ${customCategory}]\n${description}`
        : description;

      const result: any = await createJob({
        title,
        description: finalDescription || undefined,
        location_area: location,
        location_city: locationCity,
        pay_per_worker: pay,
        workers_needed: workers,
        required_skills: [category === 'other' ? customCategory : category],
        start_date: startDateTime,
        availability: duration,
      });

      const payload = result?.job_id || result?.id ? result : result?.data || result;
      navigation.navigate('EscrowInstructions', {
        job_id: payload.job_id || payload.id || `J${Date.now()}`,
        escrow_account: payload.escrow_instructions?.account_number || '—',
        bank_name: payload.escrow_instructions?.bank_name || '',
        amount: String(totalEscrow),
        reference: payload.escrow_instructions?.reference || `ESC-${Date.now()}`,
      });
    } catch (error: any) {
      setPostError(getErrorMessage(error, 'Failed to post job'));
    } finally {
      setPosting(false);
    }
  };

  const formatSchedulePreview = () => {
    try {
      const start = dayjs(`${startDate}T${startTime}`);
      const finish = dayjs(`${finishDate}T${finishTime}`);
      const loc = location ? `${location}${locationCity ? ', ' + locationCity : ''}` : '';
      
      const datePart = start.format('MMM Do') + (startDate !== finishDate ? ` to ${finish.format('MMM Do')}` : '');
      return `${datePart}${loc ? ' at ' + loc : ''}`;
    } catch {
      return '';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1A1A18" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post a Job</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          
          {/* STEP 1: JOB DETAILS */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>1</Text></View>
              <Text style={styles.cardTitle}>What are you looking for?</Text>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.label}>Select Category</Text>
              <View style={styles.pillGrid}>
                {jobSkills.map((skill: string) => (
                  <TouchableOpacity
                    key={skill}
                    style={[styles.pill, category === skill && styles.pillSelected]}
                    onPress={() => setCategory(skill)}
                  >
                    <Text style={[styles.pillText, category === skill && styles.pillTextSelected]}>{skill}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={[styles.pill, category === 'other' && styles.pillSelected]}
                  onPress={() => setCategory('other')}
                >
                  <Text style={[styles.pillText, category === 'other' && styles.pillTextSelected]}>Other</Text>
                </TouchableOpacity>
              </View>

              {category === 'other' && (
                <TextInput
                  style={[styles.input, { marginTop: 12 }]}
                  placeholder="Specify type (e.g. Electrician)"
                  placeholderTextColor="#888880"
                  value={customCategory}
                  onChangeText={setCustomCategory}
                />
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Job Title</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Heavy Load Carrier"
                placeholderTextColor="#888880"
                value={title}
                onChangeText={setTitle}
              />
            </View>
          </View>

          {/* STEP 2: LOCATION & PEOPLE */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>2</Text></View>
              <Text style={styles.cardTitle}>Location & Team</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Where is the work?</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="location-outline" size={20} color="#888880" style={styles.inputIcon} />
                <TextInput
                  style={styles.inputWithIcon}
                  placeholder="Area / Landmark (e.g. Ikeja)"
                  placeholderTextColor="#888880"
                  value={location}
                  onChangeText={setLocation}
                />
              </View>
              <TextInput
                style={[styles.input, { marginTop: 10 }]}
                placeholder="City (e.g. Lagos)"
                placeholderTextColor="#888880"
                value={locationCity}
                onChangeText={setLocationCity}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>How many workers needed?</Text>
              <View style={styles.rowButtons}>
                {['1', '2', '3', '5', '10'].map(num => (
                  <TouchableOpacity
                    key={num}
                    style={[styles.numButton, workers === num && styles.numButtonSelected]}
                    onPress={() => setWorkers(num)}
                  >
                    <Text style={[styles.numText, workers === num && styles.numTextSelected]}>{num}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* STEP 3: SCHEDULE */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>3</Text></View>
              <Text style={styles.cardTitle}>Schedule</Text>
            </View>
            
            <View style={styles.dateTimeContainer}>
              <View style={{ flex: 1 }}>
                <Text style={styles.subLabel}>Starts</Text>
                <TextInput style={styles.smallInput} value={startDate} onChangeText={setStartDate} />
                <TextInput style={[styles.smallInput, { marginTop: 8 }]} value={startTime} onChangeText={setStartTime} />
              </View>
              <View style={styles.divider} />
              <View style={{ flex: 1 }}>
                <Text style={styles.subLabel}>Finishes</Text>
                <TextInput style={styles.smallInput} value={finishDate} onChangeText={setFinishDate} />
                <TextInput style={[styles.smallInput, { marginTop: 8 }]} value={finishTime} onChangeText={setFinishTime} />
              </View>
            </View>
            <View style={styles.infoBox}>
              <Ionicons name="time-outline" size={16} color="#1B4D3E" />
              <Text style={styles.infoText}>Estimated Duration: {calculateDuration()} hours</Text>
            </View>
          </View>

          {/* STEP 4: BUDGET */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>4</Text></View>
              <Text style={styles.cardTitle}>Budget & Details</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Pay Per Worker (₦)</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.nairaSymbol}>₦</Text>
                <TextInput
                  style={styles.inputWithIcon}
                  placeholder="e.g. 5000"
                  placeholderTextColor="#888880"
                  keyboardType="numeric"
                  value={pay}
                  onChangeText={setPay}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Job Description (optional)</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                placeholder="Explain the task to workers..."
                placeholderTextColor="#888880"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
              />
            </View>
          </View>
        </ScrollView>

        {/* BOTTOM FIXED SUMMARY */}
        <View style={styles.bottomFixed}>
          {isValid && (
            <View style={styles.summaryCard}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total for {workers} workers</Text>
                <Text style={styles.summaryValue}>₦{totalEscrow.toLocaleString()}</Text>
              </View>
              <View style={styles.summaryPreview}>
                <Ionicons name="calendar" size={14} color="rgba(255,255,255,0.7)" />
                <Text style={styles.summaryPreviewText}>{formatSchedulePreview()}</Text>
              </View>
              <Text style={styles.summaryNote}>Funds will be held in secure escrow</Text>
            </View>
          )}
          
          {postError ? <Text style={styles.errorText}>{postError}</Text> : null}
          
          <TouchableOpacity 
            style={[styles.primaryButton, !isValid && styles.primaryButtonDisabled]} 
            onPress={handlePostJob}
            disabled={!isValid || posting}
          >
            <Text style={styles.primaryButtonText}>
              {posting ? 'Creating Job...' : 'Confirm and Post Job'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F7F2',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F2',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 45 : 10,
    paddingBottom: 16,
    backgroundColor: '#F7F7F2',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
    color: '#1A1A18',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 220,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EAEAE0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 17,
    color: '#1A1A18',
  },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1B4D3E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  stepBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#66665C',
    marginBottom: 8,
  },
  subLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: '#999990',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  pillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  pill: {
    backgroundColor: '#F0F0E8',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    margin: 4,
  },
  pillSelected: {
    backgroundColor: '#1B4D3E',
  },
  pillText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: '#444440',
  },
  pillTextSelected: {
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: '#F9F9F6',
    borderWidth: 1,
    borderColor: '#E0E0D8',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: '#1A1A18',
  },
  smallInput: {
    backgroundColor: '#F9F9F6',
    borderWidth: 1,
    borderColor: '#E0E0D8',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#1A1A18',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  divider: {
    width: 1,
    backgroundColor: '#E0E0D8',
    marginHorizontal: 20,
    alignSelf: 'stretch',
    marginTop: 20,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF5EF',
    padding: 12,
    borderRadius: 12,
    marginTop: 20,
  },
  infoText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: '#1B4D3E',
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F6',
    borderWidth: 1,
    borderColor: '#E0E0D8',
    borderRadius: 14,
    height: 52,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  nairaSymbol: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: '#1A1A18',
    marginRight: 8,
  },
  inputWithIcon: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: '#1A1A18',
    height: '100%',
  },
  multilineInput: {
    height: 120,
    paddingTop: 14,
  },
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  numButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#F0F0E8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 3,
  },
  numButtonSelected: {
    backgroundColor: '#1B4D3E',
  },
  numText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
    color: '#444440',
  },
  numTextSelected: {
    color: '#FFFFFF',
  },
  bottomFixed: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EAEAE0',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  summaryCard: {
    backgroundColor: '#1B4D3E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  summaryValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  summaryPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 8,
    borderRadius: 8,
  },
  summaryPreviewText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginLeft: 6,
  },
  summaryNote: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  errorText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: '#B91C1C',
    marginBottom: 12,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#1B4D3E',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1B4D3E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonDisabled: {
    backgroundColor: '#E0E0D8',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    fontSize: 17,
  },
});
