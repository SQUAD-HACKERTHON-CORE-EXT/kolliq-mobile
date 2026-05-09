import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, LAYOUT } from '../../constants';
import { Button } from '../../components/ui/Button';
import { SuccessAnimation } from '../../components/ui/SuccessAnimation';

export default function OnboardingScreen({ navigation, route }: any) {
  const { role } = route.params || { role: 'jobseeker' };
  const [isSuccess, setIsSuccess] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [location, setLocation] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const jobseekerTags = ['Delivery', 'Cleaning', 'Labor & Construction', 'Event Catering', 'Security', 'Warehousing'];
  const traderTags = ['Groceries', 'Fashion', 'Electronics', 'Food/Restaurant', 'Services', 'Other'];
  const employerTags = ['Delivery Riders', 'Laborers', 'Cleaners', 'Security', 'Event Staff'];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      if (selectedTags.length < 3) {
        setSelectedTags([...selectedTags, tag]);
      }
    }
  };

  const handleFinish = () => {
    setIsSuccess(true);
  };

  const onAnimationComplete = () => {
    if (role === 'jobseeker') {
      navigation.navigate('JobseekerHome');
    } else if (role === 'trader') {
      navigation.navigate('TraderHome');
    } else {
      navigation.navigate('EmployerHome');
    }
  };

  if (isSuccess) {
    return (
      <SafeAreaView style={styles.successWrapper}>
        <View style={styles.successInner}>
          <View style={styles.checkContainer}>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={48} color={COLORS.white} />
            </View>
            <View style={styles.dot1} />
            <View style={styles.dot2} />
          </View>

          <Text style={styles.successTitle}>You are all set, {firstName || 'Chidi'}!</Text>
          <Text style={styles.successSubtitle}>
            Your Kolliq profile is live and your Squad virtual wallet has been created. You can now start {role === 'employer' ? 'hiring' : 'earning'}.
          </Text>

          <View style={styles.walletCard}>
            <View style={styles.walletHeader}>
              <View style={styles.walletIconBg}>
                <Ionicons name="wallet-outline" size={24} color={COLORS.textSecondary} />
              </View>
              <View>
                <Text style={styles.walletLabel}>YOUR SQUAD WALLET</Text>
                <Text style={styles.walletStatus}>Active</Text>
              </View>
            </View>

            <View style={styles.walletDetails}>
              <View style={styles.walletRow}>
                <Text style={styles.detailLabel}>Account Name</Text>
                <Text style={styles.detailValue}>Kolliq - {firstName || 'Chidi'} {lastName || 'Okonkwo'}</Text>
              </View>
              <View style={styles.walletRow}>
                <Text style={styles.detailLabel}>Account Number</Text>
                <Text style={[styles.detailValue, { fontWeight: '700' }]}>1234567890</Text>
              </View>
              <View style={styles.walletRow}>
                <Text style={styles.detailLabel}>Bank</Text>
                <Text style={styles.detailValue}>Squad</Text>
              </View>
            </View>
          </View>

          <View style={styles.successFooter}>
            <Button 
              title="Go to Dashboard" 
              onPress={onAnimationComplete} 
              size="lg"
              fullWidth
              style={styles.blackButton}
              icon={<Ionicons name="arrow-forward" size={20} color={COLORS.white} style={{ marginLeft: 8 }} />}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const getRoleTitle = () => {
    if (role === 'jobseeker') return 'Tell us about yourself';
    if (role === 'trader') return 'Set up your business';
    return 'Set up your profile';
  };

  const getRoleBadge = () => {
    if (role === 'jobseeker') return 'Job Seeker Profile';
    if (role === 'trader') return 'Trader Setup';
    return 'Employer Setup';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerNav}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{getRoleBadge()}</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{getRoleTitle()}</Text>
            <Text style={styles.subtitle}>
              {role === 'jobseeker' && 'Employers will see this information when you apply for gigs. Make it count.'}
              {role === 'trader' && 'This information helps us create your Squad virtual account to receive payments.'}
              {role === 'employer' && 'Workers will see this information when you post jobs.'}
            </Text>
          </View>

          <View style={styles.photoContainer}>
            <TouchableOpacity style={styles.photoUpload}>
              <View style={styles.photoCircle}>
                <Ionicons 
                  name={role === 'jobseeker' ? "camera-outline" : (role === 'trader' ? "storefront-outline" : "business-outline")} 
                  size={32} 
                  color={COLORS.textMuted} 
                />
              </View>
              <View style={styles.addIcon}>
                <Ionicons name="add" size={16} color={COLORS.white} />
              </View>
            </TouchableOpacity>
            <Text style={styles.photoLabel}>
              {role === 'jobseeker' && 'Add Profile Photo'}
              {role === 'trader' && 'Add Business Logo'}
              {role === 'employer' && 'Add Company Logo'}
            </Text>
          </View>

          <View style={styles.form}>
            {role === 'jobseeker' ? (
              <View style={styles.row}>
                <View style={styles.flex1}>
                  <Text style={styles.fieldLabel}>First Name</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="Chidi" 
                    value={firstName} 
                    onChangeText={setFirstName} 
                  />
                </View>
                <View style={{ width: SPACING.lg }} />
                <View style={styles.flex1}>
                  <Text style={styles.fieldLabel}>Last Name</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="e.g. Okonkwo" 
                    value={lastName} 
                    onChangeText={setLastName} 
                  />
                </View>
              </View>
            ) : (
              <View>
                <Text style={styles.fieldLabel}>{role === 'trader' ? 'Business Name' : 'Company or Individual Name'}</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder={role === 'trader' ? "e.g. Mama Ngozi Provisions" : "e.g. FastLogistics Ltd."}
                  value={businessName} 
                  onChangeText={setBusinessName} 
                />
              </View>
            )}

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>{role === 'jobseeker' ? 'Your Primary Location' : 'Primary Location'}</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="location-outline" size={20} color={COLORS.textMuted} />
                <TextInput 
                  style={styles.inputNoBorder} 
                  placeholder="Search your city or area" 
                  value={location} 
                  onChangeText={setLocation} 
                />
              </View>
            </View>

            <View style={styles.field}>
              <View style={styles.tagHeader}>
                <Text style={styles.fieldLabel}>
                  {role === 'jobseeker' ? 'What kind of work do you do?' : (role === 'trader' ? 'What do you sell?' : 'Who do you usually hire?')}
                </Text>
                <Text style={styles.tagLimit}>Select up to 3</Text>
              </View>
              <View style={styles.tagsGrid}>
                {(role === 'jobseeker' ? jobseekerTags : (role === 'trader' ? traderTags : employerTags)).map(tag => (
                  <TouchableOpacity 
                    key={tag} 
                    onPress={() => toggleTag(tag)}
                    style={[
                      styles.tag, 
                      selectedTags.includes(tag) && styles.tagSelected
                    ]}
                  >
                    {selectedTags.includes(tag) && (
                      <Ionicons name="checkmark-circle" size={14} color={COLORS.primary} style={{ marginRight: 6 }} />
                    )}
                    <Text style={[
                      styles.tagText, 
                      selectedTags.includes(tag) && styles.tagTextSelected
                    ]}>
                      {tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {role !== 'jobseeker' && (
            <View style={styles.secureNotice}>
              <View style={styles.shieldIcon}>
                <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.flex1}>
                <Text style={styles.secureNoticeTitle}>{role === 'trader' ? 'Squad Verified' : 'Built on Trust'}</Text>
                <Text style={styles.secureText}>
                  {role === 'trader' 
                    ? 'Once you finish, you will get a dedicated Squad account number and QR code to start receiving payments instantly.'
                    : 'You will use Squad escrow to hold payment before work starts. This protects you and builds your Business Rating.'}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.footer}>
            <Button 
              title={role === 'jobseeker' ? "Create My Wallet & Finish" : (role === 'trader' ? "Create Virtual Account & Finish" : "Create Employer Profile")} 
              onPress={handleFinish} 
              size="lg"
              fullWidth
              icon={<Ionicons name="checkmark" size={20} color={COLORS.white} style={{ marginLeft: 8 }} />}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  content: {
    flex: 1,
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingTop: SPACING.lg,
  },
  headerNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING['2xl'],
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  badge: {
    backgroundColor: COLORS.surfaceAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.full,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: FONTS.family,
    color: COLORS.textSecondary,
    fontWeight: FONTS.weights.semibold as any,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  titleSection: {
    marginBottom: SPACING['2xl'],
  },
  title: {
    fontSize: 32,
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.text,
    lineHeight: 40,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: FONTS.family,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: SPACING['2xl'],
  },
  photoUpload: {
    width: 100,
    height: 100,
    marginBottom: SPACING.md,
  },
  photoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.black,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  photoLabel: {
    fontSize: 14,
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.semibold as any,
    color: COLORS.text,
  },
  form: {
    marginBottom: SPACING['2xl'],
  },
  row: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  flex1: {
    flex: 1,
  },
  field: {
    marginBottom: SPACING.lg,
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.semibold as any,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.xl,
    paddingHorizontal: SPACING.lg,
    fontSize: 16,
    fontFamily: FONTS.family,
    color: COLORS.text,
    backgroundColor: COLORS.white,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.xl,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.white,
  },
  inputNoBorder: {
    flex: 1,
    fontSize: 16,
    fontFamily: FONTS.family,
    color: COLORS.text,
    marginLeft: 10,
  },
  tagHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  tagLimit: {
    fontSize: 12,
    fontFamily: FONTS.family,
    color: COLORS.textMuted,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  tagSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.badgePurple,
    borderWidth: 1.5,
  },
  tagText: {
    fontSize: 14,
    fontFamily: FONTS.family,
    color: COLORS.textSecondary,
  },
  tagTextSelected: {
    color: COLORS.text,
    fontWeight: FONTS.weights.semibold as any,
  },
  secureNotice: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    marginBottom: SPACING['2xl'],
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secureNoticeTitle: {
    fontSize: 15,
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.text,
    marginBottom: 4,
  },
  shieldIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  secureText: {
    fontSize: 13,
    fontFamily: FONTS.family,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  footer: {
    paddingBottom: SPACING.xl,
  },
  successWrapper: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  successInner: {
    flex: 1,
    paddingHorizontal: LAYOUT.paddingHorizontal,
    alignItems: 'center',
    paddingTop: 80,
  },
  checkContainer: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING['3xl'],
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#829177',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  dot1: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    opacity: 0.6,
  },
  dot2: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.badgePurple,
  },
  successTitle: {
    fontSize: 32,
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  successSubtitle: {
    fontSize: 16,
    fontFamily: FONTS.family,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING['3xl'],
    paddingHorizontal: 20,
  },
  walletCard: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS['2xl'],
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  walletIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  walletLabel: {
    fontSize: 12,
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  walletStatus: {
    fontSize: 16,
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.text,
  },
  walletDetails: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  walletRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  detailLabel: {
    fontSize: 13,
    fontFamily: FONTS.family,
    color: COLORS.textMuted,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: FONTS.family,
    color: COLORS.text,
    fontWeight: FONTS.weights.medium as any,
  },
  successFooter: {
    position: 'absolute',
    bottom: SPACING.xl,
    width: '100%',
    paddingHorizontal: LAYOUT.paddingHorizontal,
  },
  blackButton: {
    backgroundColor: COLORS.black,
    height: 60,
  },
});
