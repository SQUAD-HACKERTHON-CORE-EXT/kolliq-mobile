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
  const [cacNumber, setCacNumber] = useState('');

  // New Question States
  const [availability, setAvailability] = useState<string[]>([]);
  const [transport, setTransport] = useState<string | null>(null);
  const [workRadius, setWorkRadius] = useState<string | null>(null);
  const [experienceLevel, setExperienceLevel] = useState<string | null>(null);
  
  const [weeklyEarnings, setWeeklyEarnings] = useState<string | null>(null);
  const [tradeTenure, setTradeTenure] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  const [businessType, setBusinessType] = useState<string | null>(null);
  const [hiringFrequency, setHiringFrequency] = useState<string | null>(null);
  const [payRange, setPayRange] = useState<string | null>(null);
  const [teamSize, setTeamSize] = useState<string | null>(null);

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

  const businessTypeOptions = ['Retail', 'Food and Catering', 'Logistics', 'Construction', 'Cleaning', 'Events', 'Education', 'Other'];

  const toggleSelection = (item: string, list: string[], setList: (l: string[]) => void, max: number = 99) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else if (list.length < max) {
      setList([...list, item]);
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
      availability: isJobSeeker ? availability : undefined,
      transport: isJobSeeker ? transport || undefined : undefined,
      workRadius: isJobSeeker ? workRadius || undefined : undefined,
      experienceLevel: isJobSeeker ? experienceLevel || undefined : undefined,
      weeklyEarnings: isTrader ? weeklyEarnings || undefined : undefined,
      tradeTenure: isTrader ? tradeTenure || undefined : undefined,
      paymentMethod: isTrader ? paymentMethod || undefined : undefined,
      businessType: isEmployer ? businessType || undefined : undefined,
      hiringFrequency: isEmployer ? hiringFrequency || undefined : undefined,
      payRange: isEmployer ? payRange || undefined : undefined,
      teamSize: isEmployer ? teamSize || undefined : undefined,
      cacNumber: isEmployer ? cacNumber || undefined : undefined,
    });
    navigation.navigate('WalletLoading');
  };

  const isFormValid = firstName && lastName && location && selectedSkills.length > 0 && (
    (isJobSeeker && transport && workRadius && experienceLevel && availability.length > 0) ||
    (isTrader && weeklyEarnings && tradeTenure && paymentMethod) ||
    (isEmployer && businessType && hiringFrequency && payRange && teamSize)
  );

  const Section = ({ title, options, selected, onSelect, multi = false, hint }: any) => (
    <View style={styles.sectionContainer}>
      <View style={styles.skillHeader}>
        <Text style={styles.inputLabel}>{title}</Text>
        {hint && <Text style={styles.hintText}>{hint}</Text>}
      </View>
      <View style={styles.pillContainer}>
        {options.map((opt: string) => {
          const isSelected = multi ? selected.includes(opt) : selected === opt;
          return (
            <TouchableOpacity
              key={opt}
              style={[styles.pill, isSelected && styles.selectedPill]}
              onPress={() => onSelect(opt)}
            >
              <Text style={[styles.pillText, isSelected && styles.selectedPillText]}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

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

          {/* Basic Info */}
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

            {/* Role Specific Sections */}
            {isJobSeeker && (
              <>
                <Section 
                  title="What kind of work do you do?" 
                  options={skillOptions}
                  selected={selectedSkills}
                  onSelect={(s: string) => toggleSelection(s, selectedSkills, setSelectedSkills, 3)}
                  multi={true}
                  hint="Select up to 3"
                />
                <Section 
                  title="When are you available?" 
                  options={['Morning', 'Afternoon', 'Evening', 'Full Day', 'Weekends']}
                  selected={availability}
                  onSelect={(s: string) => toggleSelection(s, availability, setAvailability)}
                  multi={true}
                  hint="Multiple selection"
                />
                <Section 
                  title="Do you have transport?" 
                  options={['Yes motorcycle', 'Yes car', 'No']}
                  selected={transport}
                  onSelect={setTransport}
                />
                <Section 
                  title="Preferred work radius?" 
                  options={['Within 2km', 'Within 5km', 'Within 10km', 'Anywhere']}
                  selected={workRadius}
                  onSelect={setWorkRadius}
                />
                <Section 
                  title="Experience level?" 
                  options={['Just starting', 'Some experience', 'Very experienced']}
                  selected={experienceLevel}
                  onSelect={setExperienceLevel}
                />
              </>
            )}

            {isTrader && (
              <>
                <Section 
                  title="What do you sell or offer?" 
                  options={skillOptions}
                  selected={selectedSkills}
                  onSelect={(s: string) => toggleSelection(s, selectedSkills, setSelectedSkills, 3)}
                  multi={true}
                  hint="Select up to 3"
                />
                <Section 
                  title="Approximate weekly earnings?" 
                  options={['Under 5,000 ₦', '5,000 to 20,000 ₦', '20,000 to 50,000 ₦', 'Above 50,000 ₦']}
                  selected={weeklyEarnings}
                  onSelect={setWeeklyEarnings}
                />
                <Section 
                  title="Trade tenure?" 
                  options={['Less than 1 year', '1 to 3 years', '3 to 5 years', '5 plus years']}
                  selected={tradeTenure}
                  onSelect={setTradeTenure}
                />
                <Section 
                  title="Primary payment method?" 
                  options={['Cash only', 'Sometimes digital', 'Mostly digital']}
                  selected={paymentMethod}
                  onSelect={setPaymentMethod}
                />
              </>
            )}

            {isEmployer && (
              <>
                <Section 
                  title="Business type?" 
                  options={businessTypeOptions}
                  selected={businessType}
                  onSelect={setBusinessType}
                />
                <Section 
                  title="What type of workers do you need?" 
                  options={skillOptions}
                  selected={selectedSkills}
                  onSelect={(s: string) => toggleSelection(s, selectedSkills, setSelectedSkills, 3)}
                  multi={true}
                  hint="Select up to 3"
                />
                <Section 
                  title="How often do you hire?" 
                  options={['Daily', 'Weekly', 'Monthly', 'Occasionally']}
                  selected={hiringFrequency}
                  onSelect={setHiringFrequency}
                />
                <Section 
                  title="Typical pay range?" 
                  options={['Under 3,000 ₦', '3,000 to 5,000 ₦', '5,000 to 10,000 ₦', 'Above 10,000 ₦']}
                  selected={payRange}
                  onSelect={setPayRange}
                />
                <Section 
                  title="Team size?" 
                  options={['1 to 2', '3 to 5', '6 to 10', '10 plus']}
                  selected={teamSize}
                  onSelect={setTeamSize}
                />
                <View style={styles.sectionContainer}>
                  <Text style={styles.inputLabel}>CAC Registration Number (Optional)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. RC1234567"
                    placeholderTextColor={COLORS.textSecondary}
                    value={cacNumber}
                    onChangeText={setCacNumber}
                  />
                  <TouchableOpacity style={styles.skipLink} onPress={handleCreateWallet}>
                    <Text style={styles.skipLinkText}>Skip for now</Text>
                  </TouchableOpacity>
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
  sectionContainer: {
    marginTop: 8,
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    marginBottom: 12,
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
  skipLink: {
    marginTop: 12,
    alignSelf: 'center',
  },
  skipLinkText: {
    fontSize: 13,
    fontFamily: FONTS.weights.medium,
    color: COLORS.textSecondary,
    textDecorationLine: 'underline',
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
    fontSize: 15,
    fontFamily: FONTS.weights.semibold,
    paddingHorizontal: 8,
  },
});

export default ProfileSetupScreen;
