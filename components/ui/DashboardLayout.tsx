import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, LAYOUT } from '../../constants';

interface DashboardHeaderProps {
  userName?: string;
  greeting?: string;
  showNotification?: boolean;
  onProfilePress?: () => void;
  onNotificationPress?: () => void;
  rightElement?: React.ReactNode;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName,
  greeting = "Good Morning,",
  showNotification = true,
  onProfilePress,
  onNotificationPress,
  rightElement,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onProfilePress} style={styles.userProfile}>
        <View style={styles.avatarPlaceholder} />
        {userName && (
          <View style={styles.welcomeText}>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
        )}
      </TouchableOpacity>
      
      <View style={styles.headerRight}>
        {rightElement}
        {showNotification && (
          <TouchableOpacity style={styles.notificationButton} onPress={onNotificationPress}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.text} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

interface BottomNavProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
  tabs: Array<{ id: string; label: string; icon: keyof typeof Ionicons.glyphMap; activeIcon?: keyof typeof Ionicons.glyphMap }>;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabPress, tabs }) => {
  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity 
            key={tab.id} 
            style={styles.navItem} 
            onPress={() => onTabPress(tab.id)}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={isActive ? (tab.activeIcon || tab.icon) : tab.icon} 
              size={24} 
              color={isActive ? COLORS.primary : COLORS.textMuted} 
            />
            <Text style={[styles.navText, isActive && styles.activeNavText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1.5,
    borderColor: COLORS.surface,
  },
  welcomeText: {
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 12,
    fontFamily: FONTS.family,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  userName: {
    fontSize: 16,
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.text,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  notificationDot: {
    position: 'absolute',
    top: 12,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 88,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: 24,
    paddingHorizontal: SPACING.lg,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  navText: {
    fontSize: 11,
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.medium as any,
    color: COLORS.textMuted,
  },
  activeNavText: {
    color: COLORS.primary,
    fontWeight: FONTS.weights.bold as any,
  },
});

