import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Alert } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { getJobDetail } from '../../services/jobsService'
import { getWallet } from '../../services/walletService'
import { COLORS, FONTS, LAYOUT } from '../../constants'

export default function FundEscrowScreen() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const params = route.params || {}

  const [jobId, setJobId] = useState<string>(String(params.job_id ?? ''))
  const [amount, setAmount] = useState<string>(String(params.amount ?? ''))
  const [reference, setReference] = useState<string>(String(params.reference ?? `ESC-${Date.now()}`))
  const [bankName, setBankName] = useState<string>(String(params.bank_name ?? ''))
  const [polling, setPolling] = useState(false)
  const [job, setJob] = useState<any>(params.job || null)
  const [remoteWallet, setRemoteWallet] = useState<any>(null)
  const pollRef = useRef<any>(null)

  useEffect(() => {
    let mounted = true

    const loadInitial = async () => {
      try {
        if (!job && (params.job_id || params.jobId || params.id)) {
          const jId = params.job_id || params.jobId || params.id
          const j = await getJobDetail(String(jId))
          if (mounted && j) {
            setJob(j)
            // default amount to job total if amount was not passed
            if (!params.amount) {
              const per = Number(j.pay_per_worker ?? j.pay ?? 0)
              const workers = Number(j.workers_needed ?? 1)
              setAmount(String(per * workers))
            }
          }
        }
      } catch (e) {
        // ignore
      }

      try {
        const w = await getWallet()
        if (mounted && w) {
          setRemoteWallet(w)
          setBankName(String(w?.bank_name ?? w?.bank ?? params.bank_name ?? ''))
        }
      } catch (e) {
        // ignore
      }
    }

    loadInitial()

    return () => {
      mounted = false
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [])

  const startPollingJob = (jobIdToPoll: string) => {
    setPolling(true)
    let attempts = 0
    pollRef.current = setInterval(async () => {
      attempts++
      try {
        const job = await getJobDetail(jobIdToPoll)
        if (job?.escrow_funded) {
          clearInterval(pollRef.current)
          setPolling(false)
          Alert.alert('Escrow funded', 'Escrow funding has been confirmed.')
          navigation.navigate('EmployerDashboard')
        }
      } catch (e) {
        // ignore transient errors
      }
      if (attempts >= 24) { // ~2 minutes at 5s
        clearInterval(pollRef.current)
        setPolling(false)
        Alert.alert('Not confirmed', 'We could not confirm the escrow yet. Please try again later.')
      }
    }, 5000)
  }

  const handleViewInstructions = () => {
    if (!jobId || !amount) {
      Alert.alert('Missing details', 'Please provide both Job ID and amount')
      return
    }
    navigation.navigate('EscrowInstructions', {
      job_id: jobId,
      amount,
      reference,
      escrow_account: remoteWallet?.account_number || undefined,
      bank_name: bankName || remoteWallet?.bank_name || remoteWallet?.bank || '',
    })
  }

  const handleMarkPaid = () => {
    if (!jobId) {
      Alert.alert('Missing job id', 'Please provide the Job ID to poll for confirmation')
      return
    }
    startPollingJob(jobId)
    Alert.alert('Checking for payment', 'We will check your job status and notify when confirmed')
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fund Escrow</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Job</Text>
        <TextInput value={jobId} onChangeText={setJobId} style={styles.input} placeholder="Job ID" />
        {job && (
          <View style={{ marginTop: 8 }}>
            <Text style={{ fontFamily: FONTS.weights.semibold, color: COLORS.text }}>{job.title}</Text>
            <Text style={{ color: COLORS.textMuted }}>Total: ₦{(Number(job.pay_per_worker ?? job.pay ?? 0) * Number(job.workers_needed ?? 1)).toLocaleString('en-NG')}</Text>
          </View>
        )}

        <Text style={[styles.label, { marginTop: 12 }]}>Amount (₦)</Text>
        <TextInput value={amount} onChangeText={setAmount} style={styles.input} placeholder="Amount" keyboardType="numeric" />

        <Text style={[styles.label, { marginTop: 12 }]}>Reference</Text>
        <TextInput value={reference} onChangeText={setReference} style={styles.input} placeholder="Reference" />

        <Text style={[styles.label, { marginTop: 12 }]}>Bank</Text>
        <View style={styles.readOnlyField}>
          <Text style={bankName ? styles.readOnlyValue : styles.readOnlyPlaceholder}>
            {bankName || 'Bank name not provided by server'}
          </Text>
        </View>

        <Text style={styles.infoText}>
          Fund this job via bank transfer using escrow instructions, then tap check status after payment.
        </Text>

        <TouchableOpacity style={styles.primaryButton} onPress={handleViewInstructions} disabled={polling}>
          <Text style={styles.primaryText}>View escrow instructions</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={handleMarkPaid} disabled={polling}>
          <Text style={styles.secondaryText}>{polling ? 'Checking…' : 'I paid via bank — Check status'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7F2' },
  header: { padding: 16, paddingTop: 32 },
  title: { fontSize: 20, fontFamily: FONTS.weights.bold, color: COLORS.text },
  content: { padding: LAYOUT.paddingHorizontal },
  label: { color: COLORS.textMuted, marginBottom: 6 },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#E6E6E0' },
  primaryButton: { marginTop: 20, backgroundColor: COLORS.primary, padding: 14, borderRadius: 10, alignItems: 'center' },
  primaryText: { color: '#fff', fontFamily: FONTS.weights.semibold },
  secondaryButton: { marginTop: 12, padding: 12, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, backgroundColor: '#fff' },
  secondaryText: { color: COLORS.text, fontFamily: FONTS.weights.medium },
  infoText: { marginTop: 10, color: COLORS.textMuted, fontFamily: FONTS.weights.regular, fontSize: 12 },
  readOnlyField: { backgroundColor: '#fff', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#E6E6E0' },
  readOnlyValue: { color: COLORS.text, fontFamily: FONTS.weights.medium },
  readOnlyPlaceholder: { color: COLORS.textMuted, fontFamily: FONTS.weights.regular },
})
