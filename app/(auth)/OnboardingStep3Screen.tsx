import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, LAYOUT } from '../../constants';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

type UserRole = 'jobseeker' | 'trader' | 'employer';

const ROLES = [
  {
    id: 'jobseeker' as UserRole,
    title: 'I am looking for work',
    description: 'Find verified gigs, get paid directly to your Squad wallet, and build your Economic Identity Score.',
    icon: 'briefcase-outline',
  },
  {
    id: 'trader' as UserRole,
    title: 'I sell goods or services',
    description: 'Receive digital payments from customers, grow your business score, and unlock loans.',
    icon: 'storefront-outline',
  },
  {
    id: 'employer' as UserRole,
    title: 'I need to hire workers',
    description: 'Post jobs, securely escrow payments, and hire rated, reliable workers instantly.',
    icon: 'people-outline',
  },
];

export default function OnboardingStep3Screen({ navigation }: any) {
  const [selectedRole, setSelectedRole] = useState<UserRole>('jobseeker');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header Navigation */}
        <View style={styles.headerNav}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.stepText}>Step 3 of 3</Text>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>How will you use Kolliq?</Text>
          <Text style={styles.subtitle}>
            This sets up your wallet and features. You can only choose one.
          </Text>
        </View>

        {/* Role Cards */}
        <ScrollView showsVerticalScrollIndicator={false} style={styles.rolesList}>
          {ROLES.map((role) => (
            <TouchableOpacity 
              key={role.id} 
              onPress={() => setSelectedRole(role.id)}
              activeOpacity={0.8}
            >
              <Card 
                variant={selectedRole === role.id ? 'elevated' : 'outline'}
                style={[
                  styles.roleCard, 
                  selectedRole === role.id && styles.selectedCard
                ]}
              >
                <View style={[styles.roleIconContainer, selectedRole === role.id && styles.selectedIconContainer]}>
                  <Ionicons 
                    name={role.icon as any} 
                    size={24} 
                    color={selectedRole === role.id ? COLORS.white : COLORS.textSecondary} 
                  />
                </View>
                <View style={styles.roleTextContainer}>
                  <View style={styles.roleHeader}>
                    <Text style={[styles.roleTitle, selectedRole === role.id && styles.selectedText]}>
                      {role.title}
                    </Text>
                    {selectedRole === role.id && (
                      <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                    )}
                  </View>
                  <Text style={styles.roleDescription}>{role.description}</Text>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <Button 
            title="Complete Account Setup" 
            onPress={() => navigation.navigate('FinalOnboarding', { role: selectedRole })} 
            size="lg"
            fullWidth
            icon={<Ionicons name="arrow-forward" size={20} color={COLORS.white} style={{ marginLeft: 8 }} />}
          />
        </View>
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
    marginBottom: SPACING['3xl'],
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
  stepText: {
    fontSize: 14,
    fontFamily: FONTS.family,
    color: COLORS.textMuted,
    fontWeight: FONTS.weights.medium as any,
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
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: FONTS.family,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  rolesList: {
    flex: 1,
  },
  roleCard: {
    flexDirection: 'row',
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    alignItems: 'flex-start',
  },
  selectedCard: {
    borderColor: COLORS.primary,
    borderWidth: 1.5,
    backgroundColor: COLORS.badgeGreen,
  },
  roleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.lg,
  },
  selectedIconContainer: {
    backgroundColor: COLORS.primary,
  },
  roleTextContainer: {
    flex: 1,
  },
  roleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  roleTitle: {
    fontSize: 18,
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.text,
  },
  selectedText: {
    color: COLORS.text,
  },
  roleDescription: {
    fontSize: 14,
    fontFamily: FONTS.family,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  footer: {
    paddingVertical: SPACING.xl,
  },
});
