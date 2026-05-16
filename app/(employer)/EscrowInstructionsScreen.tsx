import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, ToastAndroid, Platform, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { getJobDetail } from '../../services/jobsService';

export default function EscrowInstructionsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const params = route.params || {};
  const [instructions, setInstructions] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    const loadEscrowInstructions = async () => {
      try {
        setLoading(true);
        
        // Backend-first: escrow instructions MUST come from job details.
        // No hardcoded/default fallback values; if escrow data is missing we show error UI.
        if (params.job_id) {
          const jobDetail = await getJobDetail(params.job_id);
          const escrow = jobDetail?.escrow_instructions;
          console.log('EscrowInstructions: source data', {
            job_id: params.job_id,
            escrow,
            params_bank_name: params.bank_name,
            params_escrow_account: params.escrow_account,
          });

          // Use server data if available, otherwise fallback to params passed from PostJob screen
          const accountNumber = escrow?.account_number || params.escrow_account;
          const bank = escrow?.bank_name || params.bank_name || '';
          const reference = escrow?.reference || params.reference;

          if (!accountNumber || accountNumber === '—') {
            setInstructions(null);
            return;
          }

          setInstructions({
            accountNumber,
            bank: bank || 'Bank name not provided',
            amount: params.amount
              ? `₦${parseInt(params.amount as string).toLocaleString()}`
              : (escrow?.amount ? `₦${parseInt(String(escrow.amount)).toLocaleString()}` : '—'),
            reference: reference ?? '',
          });
        }
      } catch (e) {
        console.log('Error loading escrow instructions:', e);
      } finally {
        setLoading(false);
      }
    };

    loadEscrowInstructions();
  }, [params.job_id, params.escrow_account, params.bank_name, params.amount, params.reference]);

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1B4D3E" />
      </View>
    );
  }

  if (!instructions) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Text style={styles.heading}>Unable to load escrow details</Text>
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={() => navigation.navigate('EmployerDashboard')}
          >
            <Text style={styles.primaryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleCopy = async (text: string) => {
    await Clipboard.setStringAsync(text);
    if (Platform.OS === 'android') {
      ToastAndroid.show('Copied to clipboard', ToastAndroid.SHORT);
    } else {
      Alert.alert('Success', 'Copied to clipboard');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.successIconContainer}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={40} color="#FFFFFF" />
          </View>
        </View>

        <Text style={styles.heading}>Job Posted Successfully</Text>
        <Text style={styles.subtext}>
          Your job will go live the moment we confirm your escrow payment
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Escrow Payment Instructions</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>Account Number</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.value}>{instructions.accountNumber}</Text>
              <TouchableOpacity onPress={() => handleCopy(instructions.accountNumber as string)}>
                <Ionicons name="copy-outline" size={20} color="#1B4D3E" style={styles.copyIcon} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.divider} />
          
          <View style={styles.row}>
            <Text style={styles.label}>Bank</Text>
            <Text style={styles.value}>{instructions.bank}</Text>
          </View>
          <View style={styles.divider} />
          
          <View style={styles.row}>
            <Text style={styles.label}>Amount</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.payValue}>{instructions.amount}</Text>
              <TouchableOpacity onPress={() => handleCopy(instructions.amount as string)}>
                <Ionicons name="copy-outline" size={20} color="#1B4D3E" style={styles.copyIcon} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.divider} />
          
          <View style={styles.row}>
            <Text style={styles.label}>Reference</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.value}>{instructions.reference}</Text>
              <TouchableOpacity onPress={() => handleCopy(instructions.reference as string)}>
                <Ionicons name="copy-outline" size={20} color="#1B4D3E" style={styles.copyIcon} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.noticeBox}>
          <Text style={styles.noticeText}>
            Include the reference code in your payment narration. Your job goes live automatically when payment is confirmed by Squad.
          </Text>
          {instructions.bank === 'Bank name not provided' && (
            <Text style={styles.noticeText}>
              Bank name is missing from server response. Use the account number and contact support/backend admin to provide the correct bank name before transfer.
            </Text>
          )}
        </View>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => { console.log('EscrowInstructions: Check status pressed', { job_id: params.job_id, amount: params.amount }); navigation.navigate('FundEscrow', { job_id: params.job_id, amount: params.amount, reference: instructions.reference, escrow_account: instructions.accountNumber, bank_name: instructions.bank === 'Bank name not provided' ? '' : instructions.bank }) }}>
          <Text style={styles.secondaryButtonText}>I paid via bank - Check status</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomFixed}>
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={() => navigation.navigate('EmployerDashboard')}
        >
          <Text style={styles.primaryButtonText}>Done</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 40,
    alignItems: 'center',
  },
  successIconContainer: {
    marginBottom: 24,
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1B4D3E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontFamily: 'Inter_700Bold',
    fontSize: 26,
    color: '#1A1A18',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtext: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: '#888880',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 32,
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    padding: 16,
    marginBottom: 24,
  },
  cardTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#1A1A18',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0D8',
  },
  label: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: '#888880',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: '#1A1A18',
  },
  payValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#1B4D3E',
  },
  copyIcon: {
    marginLeft: 12,
  },
  noticeBox: {
    backgroundColor: '#FFF3EC',
    borderLeftWidth: 3,
    borderLeftColor: '#F4721E',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    marginBottom: 24,
  },
  noticeText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: '#C95A10',
    lineHeight: 20,
  },
  secondaryButton: {
    height: 50,
    borderWidth: 1,
    borderColor: '#1B4D3E',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  secondaryButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: '#1B4D3E',
  },
  bottomFixed: {
    padding: 16,
    backgroundColor: '#F5F5F0',
  },
  primaryButton: {
    backgroundColor: '#1B4D3E',
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  primaryButtonText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
    fontSize: 16,
  },
});
