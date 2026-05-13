import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, BORDER_RADIUS } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/authStore';
import { UserRole } from '../../types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const UserTypeSelectionScreen = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const updateUser = useAuthStore((state) => state.updateUser);

  const roles: { id: UserRole; title: string; description: string; icon: any; iconType: 'feather' | 'material' }[] = [
    {
      id: 'jobseeker',
      title: 'I am looking for work',
      description: 'Find verified gigs, get paid directly to your Squad wallet, and build your Economic Identity Score.',
      icon: 'briefcase',
      iconType: 'feather',
    },
    {
      id: 'trader',
      title: 'I sell goods or services',
      description: 'Receive digital payments from customers, grow your business score, and unlock loans.',
      icon: 'storefront-outline',
      iconType: 'material',
    },
    {
      id: 'employer',
      title: 'I need to hire workers',
      description: 'Post jobs, securely escrow payments, and hire rated reliable workers instantly.',
      icon: 'office-building-outline',
      iconType: 'material',
    },
  ];

  const handleComplete = () => {
    if (selectedRole) {
      updateUser({ role: selectedRole });
      navigation.navigate('ProfileSetup', { role: selectedRole });
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top || 16 }]}>
      <StatusBar style="dark" />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.stepText}>Step 3 of 3</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.heading}>How will you use Kolliq?</Text>
          <Text style={styles.subtext}>
            This sets up your wallet and features. You can only choose one.
          </Text>

          {/* Role Cards */}
          <View style={styles.cardsContainer}>
            {roles.map((role) => {
              const isSelected = selectedRole === role.id;
              return (
                <TouchableOpacity
                  key={role.id}
                  style={[
                    styles.card,
                    isSelected ? styles.selectedCard : styles.unselectedCard
                  ]}
                  onPress={() => setSelectedRole(role.id)}
                  activeOpacity={0.7}
                >
                  {isSelected && (
                    <View style={styles.checkIcon}>
                      <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                    </View>
                  )}
                  
                  <View style={styles.cardHeader}>
                    <View style={styles.iconContainer}>
                      {role.iconType === 'feather' ? (
                        <Feather name={role.icon} size={22} color={COLORS.primary} />
                      ) : (
                        <MaterialCommunityIcons name={role.icon} size={24} color={COLORS.primary} />
                      )}
                    </View>
                    <View style={styles.textContainer}>
                      <Text style={styles.cardTitle}>{role.title}</Text>
                      <Text style={styles.cardDescription}>{role.description}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        
        {/* Padding for footer */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
        <TouchableOpacity 
          style={[styles.primaryButton, !selectedRole && styles.inactiveButton]}
          disabled={!selectedRole}
          onPress={handleComplete}
        >
          <Text style={styles.primaryButtonText}>Complete Account Setup</Text>
          <Feather name="arrow-right" size={18} color={COLORS.white} style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
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
    marginBottom: 32,
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
  stepText: {
    fontSize: 12,
    fontFamily: FONTS.weights.semibold,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
  },
  heading: {
    fontSize: 26,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: 12,
    lineHeight: 32,
  },
  subtext: {
    fontSize: 15,
    fontFamily: FONTS.weights.regular,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 32,
  },
  cardsContainer: {
    gap: 12,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    position: 'relative',
    borderWidth: 1.5,
  },
  unselectedCard: {
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedCard: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.selectedBg,
  },
  checkIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  textContainer: {
    flex: 1,
    paddingRight: 24,
  },
  cardTitle: {
    fontSize: 17,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    fontFamily: FONTS.weights.regular,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: COLORS.background,
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

export default UserTypeSelectionScreen;
