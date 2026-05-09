import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, BORDER_RADIUS } from '../../constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuthStore } from '../../store/authStore';
import { UserRole } from '../../types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ProfileSetupScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { role } = route.params || { role: 'jobseeker' };
  const updateUser = useAuthStore((state) => state.updateUser);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [location, setLocation] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [extraPill, setExtraPill] = useState<string | null>(null);

  // Constants based on role
  const isJobSeeker = role === 'jobseeker';
  const isTrader = role === 'trader';
  const isEmployer = role === 'employer';

  const title = isJobSeeker ? 'Tell us about yourself' : 'Tell us about your business';
  const subtext = isJobSeeker 
    ? 'Employers will see this information when you apply for gigs. Make it count.'
    : isTrader 
      ? 'This helps us match you with the right financial services and customers.'
      : 'This helps workers understand who they are applying to work for.';

  const roleLabel = isJobSeeker ? 'Job Seeker Profile' : isTrader ? 'Trader Profile' : 'Employer Profile';

  const skillOptions = isJobSeeker || isEmployer 
    ? ['Delivery', 'Cleaning', 'Labor and Construction', 'Event Catering', 'Security', 'Warehousing', 'Cooking', 'Market Assistant', 'Teaching']
    : ['Food and Groceries', 'Clothing and Fabric', 'Electronics', 'Household Goods', 'Artisan Services', 'Hair and Beauty', 'Phone Repairs', 'Farming Produce', 'Other'];

  const extraLabel = isTrader ? 'Approximate weekly earnings' : isEmployer ? 'How often do you hire' : null;
  const extraOptions = isTrader 
    ? ['Under 5000', '5000 to 20000', '20000 to 50000', 'Above 50000']
    : isEmployer ? ['Daily', 'Weekly', 'Monthly', 'Occasionally'] : [];

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else if (selectedSkills.length < 3) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleCreateWallet = () => {
    updateUser({
      firstName,
      lastName,
      businessName: isTrader || isEmployer ? businessName : undefined,
      location,
      skills: isJobSeeker || isEmployer ? selectedSkills : undefined,
      categories: isTrader ? selectedSkills : undefined,
      weeklyEarnings: isTrader ? extraPill || undefined : undefined,
      hireFrequency: isEmployer ? extraPill || undefined : undefined,
    });
    navigation.navigate('WalletLoading');
  };

  const isFormValid = firstName && lastName && location && selectedSkills.length > 0 && (!extraLabel || extraPill);

  return (
    <View style={[styles.container, { paddingTop: insets.top || 16 }]}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.roleLabel}>{roleLabel}</Text>
          </View>

          {/* Heading */}
          <View style={styles.headingSection}>
            <Text style={styles.heading}>{title}</Text>
            <Text style={styles.subtext}>{subtext}</Text>
          </View>

          {/* Profile Photo */}
          <View style={styles.photoSection}>
            <View style={styles.photoPlaceholder}>
              <Feather name="camera" size={32} color={COLORS.textSecondary} />
              <View style={styles.plusButton}>
                <Ionicons name="add" size={16} color={COLORS.white} />
              </View>
            </View>
            <Text style={styles.photoLabel}>Add Profile Photo</Text>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            <View style={styles.row}>
              <View style={styles.flex1}>
                <Text style={styles.inputLabel}>First Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Chidi"
                  placeholderTextColor={COLORS.textSecondary}
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>
              <View style={{ width: 12 }} />
              <View style={styles.flex1}>
                <Text style={styles.inputLabel}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Okonkwo"
                  placeholderTextColor={COLORS.textSecondary}
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
            </View>

            {(isTrader || isEmployer) && (
              <>
                <Text style={styles.inputLabel}>{isTrader ? 'Business or Trade Name' : 'Business Name'}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={isTrader ? "e.g. Mama Cass Kitchen" : "e.g. Tech Solutions Ltd"}
                  placeholderTextColor={COLORS.textSecondary}
                  value={businessName}
                  onChangeText={setBusinessName}
                />
              </>
            )}

            <Text style={styles.inputLabel}>
              {isJobSeeker ? 'Your Primary Location' : isTrader ? 'Your Market or Business Location' : 'Business Location'}
            </Text>
            <View style={styles.inputWithIcon}>
              <Ionicons name="location-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.inputIconText}
                placeholder="Search your city or area"
                placeholderTextColor={COLORS.textSecondary}
                value={location}
                onChangeText={setLocation}
              />
            </View>

            {/* Skills / Categories */}
            <View style={styles.skillHeader}>
              <Text style={styles.inputLabel}>
                {isTrader ? 'What do you sell or offer?' : isEmployer ? 'What type of workers do you usually need?' : 'What kind of work do you do?'}
              </Text>
              <Text style={styles.hintText}>Select up to 3</Text>
            </View>
            <View style={styles.pillContainer}>
              {skillOptions.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <TouchableOpacity
                    key={skill}
                    style={[styles.pill, isSelected && styles.selectedPill]}
                    onPress={() => toggleSkill(skill)}
                  >
                    <Text style={[styles.pillText, isSelected && styles.selectedPillText]}>{skill}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Extra Options (Earnings / Frequency) */}
            {extraLabel && (
              <>
                <Text style={styles.inputLabel}>{extraLabel}</Text>
                <View style={styles.pillContainer}>
                  {extraOptions.map((option) => {
                    const isSelected = extraPill === option;
                    return (
                      <TouchableOpacity
                        key={option}
                        style={[styles.pill, isSelected && styles.selectedPill]}
                        onPress={() => setExtraPill(option)}
                      >
                        <Text style={[styles.pillText, isSelected && styles.selectedPillText]}>{option}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>
            )}
          </View>

          {/* Bottom Space for Scroll */}
          <View style={{ height: 160 }} />
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
          <TouchableOpacity 
            style={[styles.primaryButton, !isFormValid && styles.inactiveButton]}
            disabled={!isFormValid}
            onPress={handleCreateWallet}
          >
            <Text style={styles.primaryButtonText}>Create My Kolliq Wallet</Text>
            <Ionicons name="checkmark" size={20} color={COLORS.white} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  roleLabel: {
    fontSize: 12,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headingSection: {
    marginBottom: 32,
  },
  heading: {
    fontSize: 26,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 32,
  },
  subtext: {
    fontSize: 15,
    fontFamily: FONTS.weights.regular,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.inputBorder,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  plusButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  photoLabel: {
    marginTop: 12,
    fontSize: 13,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.textSecondary,
  },
  form: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.primary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    height: 56,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.inputBorder,
    paddingHorizontal: 16,
    fontSize: 15,
    fontFamily: FONTS.weights.medium,
    color: COLORS.text,
  },
  inputWithIcon: {
    height: 56,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.inputBorder,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  inputIconText: {
    flex: 1,
    fontSize: 15,
    fontFamily: FONTS.weights.medium,
    color: COLORS.text,
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  hintText: {
    fontSize: 11,
    fontFamily: FONTS.weights.regular,
    color: COLORS.textSecondary,
  },
  pillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 99,
    borderWidth: 1.5,
    borderColor: COLORS.inputBorder,
    backgroundColor: COLORS.white,
  },
  selectedPill: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.selectedBg,
  },
  pillText: {
    fontSize: 13,
    fontFamily: FONTS.weights.medium,
    color: COLORS.textSecondary,
  },
  selectedPillText: {
    color: COLORS.primary,
    fontFamily: FONTS.weights.bold,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.inputBorder,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  inactiveButton: {
    backgroundColor: COLORS.inactive,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.weights.semibold,
  },
});

export default ProfileSetupScreen;
