import { StyleSheet, View, Text, TouchableOpacity, Dimensions, ScrollView, Platform, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top || 16 }]}>
      <StatusBar style="dark" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Ionicons name="layers" size={14} color={COLORS.white} />
            </View>
            <Text style={styles.logoText}>kolliq</Text>
          </View>
        </View>

        {/* Collage Section */}
        <View style={styles.collageSection}>
          <View style={styles.collageContainer}>
            {/* Photo 1 (Left, rotated) */}
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1542044896530-05d85be9b11a?auto=format&fit=crop&w=400&q=80' }}
              style={[styles.photoPlaceholder, styles.photo1]}
            />
            
            {/* Photo 2 (Center, overlapping) */}
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80' }}
              style={[styles.photoPlaceholder, styles.photo2]}
            />
            
            {/* Photo 3 (Front Center, most prominent) */}
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=400&q=80' }}
              style={[styles.photoPlaceholder, styles.photo3]}
            />

            {/* Floating Score Card */}
            <View style={styles.scoreCard}>
              <Text style={styles.scoreText}>Score 72</Text>
              <Text style={styles.scoreSubtext}>Economic Identity</Text>
            </View>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <View style={styles.headlineContainer}>
            <Text style={styles.headline}>Your Hustle.</Text>
            <Text style={styles.headline}>Your Identity.</Text>
            <Text style={[styles.headline, { color: COLORS.primary }]}>Your Future.</Text>
          </View>
          
          <Text style={styles.subtext}>
            The bridge connecting the informal economy to verified jobs, smart payments, and real financial services.
          </Text>
        </View>

        {/* Bottom Padding for scroll to avoid overlapping with floating buttons */}
        <View style={{ height: 180 }} />
      </ScrollView>

      {/* Action Buttons (Fixed at bottom) */}
      <View style={[styles.buttonSection, { paddingBottom: Math.max(insets.bottom, 24) }]}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => navigation.navigate('PhoneEntry')}
        >
          <Text style={styles.primaryButtonText}>Create an Account</Text>
          <Feather name="arrow-right" size={18} color={COLORS.white} style={{ marginLeft: 8 }} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.ghostButton}
          onPress={() => {}} 
        >
          <Text style={styles.ghostButtonText}>Log In</Text>
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
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.text,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  logoText: {
    fontSize: 18,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
    paddingRight: 4, // Prevent 'q' clipping
  },
  collageSection: {
    height: height * 0.4,
    maxHeight: 350,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  collageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  photoPlaceholder: {
    borderRadius: 24,
    borderWidth: 3,
    borderColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  photo1: {
    width: width * 0.38,
    height: width * 0.52,
    left: '8%',
    top: '8%',
    transform: [{ rotate: '-4deg' }],
    zIndex: 1,
  },
  photo2: {
    width: width * 0.4,
    height: width * 0.48,
    right: '8%',
    top: '5%',
    zIndex: 2,
  },
  photo3: {
    width: width * 0.58,
    height: width * 0.62,
    alignSelf: 'center',
    left: width * 0.21,
    bottom: '2%',
    zIndex: 3,
  },
  scoreCard: {
    position: 'absolute',
    bottom: '12%',
    right: '12%',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    zIndex: 4,
    borderWidth: 0.5,
    borderColor: COLORS.inputBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  scoreText: {
    fontSize: 18,
    fontFamily: FONTS.weights.bold,
    color: COLORS.primary,
  },
  scoreSubtext: {
    fontSize: 12,
    fontFamily: FONTS.weights.medium,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  contentSection: {
    paddingHorizontal: 28,
    marginTop: 15,
  },
  headlineContainer: {
    marginBottom: 16,
  },
  headline: {
    fontSize: width > 380 ? 36 : 32,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
    lineHeight: (width > 380 ? 36 : 32) * 1.2,
    letterSpacing: -0.5,
  },
  subtext: {
    fontSize: 15,
    fontFamily: FONTS.weights.regular,
    color: COLORS.textSecondary,
    lineHeight: 24,
    paddingRight: 10, // Ensure last words aren't clipped
  },
  buttonSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 32,
    backgroundColor: COLORS.background, // Solid background to cover scrolled content
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
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.weights.semibold,
    paddingHorizontal: 4,
  },
  ghostButton: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
    marginBottom: 8,
  },
  ghostButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: FONTS.weights.semibold,
    paddingHorizontal: 4,
  },
});

export default WelcomeScreen;
