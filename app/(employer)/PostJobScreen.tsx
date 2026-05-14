import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { DUMMY_CATEGORIES } from '../../constants/dummyData';

export default function PostJobScreen() {
  const navigation = useNavigation<any>();
  
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [workers, setWorkers] = useState('1');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('Select date and time');
  const [duration, setDuration] = useState('');
  const [pay, setPay] = useState('');
  const [description, setDescription] = useState('');

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1B4D3E" />
      </View>
    );
  }

  const isValid = category !== '' && title !== '' && location !== '' && pay !== '';
  const totalAmount = isValid ? parseInt(pay || '0', 10) * parseInt(workers.replace('+', ''), 10) : 0;

  const handlePostJob = () => {
    if (!isValid) return;
    
    // replace with real API call to POST /jobs/create using nodeClient
    const dummyResponse = {
      job_id: 'J' + Math.floor(Math.random() * 1000000),
      escrow_account: '9876543210',
      bank_name: 'GTBank',
      amount: totalAmount.toString(),
      reference: 'SQD-' + Math.floor(Math.random() * 100000000).toString(16).toUpperCase(),
    };

    navigation.navigate('EscrowInstructions', dummyResponse);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1A1A18" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post a Job</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What kind of work</Text>
            <View style={styles.pillGrid}>
              {DUMMY_CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.pill, category === cat && styles.pillSelected]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[styles.pillText, category === cat && styles.pillTextSelected]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Job Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Office Cleaner"
              placeholderTextColor="#888880"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How many workers</Text>
            <View style={styles.rowButtons}>
              {['1', '2', '3', '4+'].map(num => (
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

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="location-outline" size={20} color="#888880" style={styles.inputIcon} />
              <TextInput
                style={styles.inputWithIcon}
                placeholder="Enter address"
                placeholderTextColor="#888880"
                value={location}
                onChangeText={setLocation}
              />
            </View>
            <TouchableOpacity style={styles.locationButton}>
              <Text style={styles.locationButtonText}>Use my location</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Start Date and Time</Text>
            <TouchableOpacity style={styles.inputContainer} onPress={() => setDate('Tomorrow, 9:00 AM')}>
              <Text style={[styles.inputWithIcon, date === 'Select date and time' && { color: '#888880' }]}>
                {date}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Duration in Hours</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 4"
              placeholderTextColor="#888880"
              keyboardType="numeric"
              value={duration}
              onChangeText={setDuration}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pay Per Worker in Naira</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.nairaSymbol}>₦</Text>
              <TextInput
                style={styles.inputWithIcon}
                placeholder="5000"
                placeholderTextColor="#888880"
                keyboardType="numeric"
                value={pay}
                onChangeText={setPay}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Job Description (optional)</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Add details about the task..."
              placeholderTextColor="#888880"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
          </View>
        </ScrollView>

        <View style={styles.bottomFixed}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Escrow Amount</Text>
            <Text style={styles.summaryValue}>₦{totalAmount.toLocaleString()}</Text>
          </View>
          <TouchableOpacity 
            style={[styles.primaryButton, !isValid && styles.primaryButtonDisabled]} 
            onPress={handlePostJob}
            disabled={!isValid}
          >
            <Text style={styles.primaryButtonText}>Preview and Post Job</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    color: '#1A1A18',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#1A1A18',
    marginBottom: 12,
  },
  pillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  pill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0D8',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 4,
  },
  pillSelected: {
    backgroundColor: '#1B4D3E',
    borderColor: '#1B4D3E',
  },
  pillText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#1A1A18',
  },
  pillTextSelected: {
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0D8',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: '#1A1A18',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0D8',
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 8,
  },
  nairaSymbol: {
    fontFamily: 'Inter_600SemiBold',
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
    height: 100,
    paddingTop: 12,
  },
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  numButton: {
    flex: 1,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0D8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  numButtonSelected: {
    backgroundColor: '#EAF5EF',
    borderColor: '#1B4D3E',
  },
  numText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: '#1A1A18',
  },
  numTextSelected: {
    color: '#1B4D3E',
  },
  locationButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  locationButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#1B4D3E',
  },
  bottomFixed: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0D8',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: '#888880',
  },
  summaryValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 17,
    color: '#1B4D3E',
  },
  primaryButton: {
    backgroundColor: '#1B4D3E',
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  primaryButtonDisabled: {
    backgroundColor: '#B0B0A8',
  },
  primaryButtonText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
    fontSize: 16,
  },
});
