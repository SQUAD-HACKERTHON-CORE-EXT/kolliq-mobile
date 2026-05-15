import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, FONTS, SPACING, BORDER_RADIUS, LAYOUT } from '../../constants'
import { Card } from '../../components/ui/Card'
import { BottomNav } from '../../components/ui/DashboardLayout'
import { getJobsFeed } from '../../services/jobsService'
import { useAppStore } from '../../store/useAppStore'

const NAV_TABS = [
  { id: 'EmployerDashboard', label: 'Dashboard', icon: 'apps-outline', activeIcon: 'apps' },
  { id: 'Workers', label: 'Workers', icon: 'people-outline', activeIcon: 'people' },
  { id: 'WalletScreen', label: 'Wallet', icon: 'wallet-outline', activeIcon: 'wallet' },
  { id: 'EmployerProfile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
] as const

export default function WorkersScreen({ navigation }: any) {
  const insets = useSafeAreaInsets()
  const [activeTab] = useState('Workers')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [workers, setWorkers] = useState<any[]>([])
  const user = useAppStore((s) => s.user)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const feed = await getJobsFeed()
        // derive a lightweight workers list from accepted jobs (best-effort)
        const seen = new Map<string, any>()
        ;(feed || []).forEach((j: any) => {
          const acc = j.acceptedBy || j.accepted_by
          if (!acc) return
          const id = String(acc?.id ?? acc)
          if (!seen.has(id)) {
            seen.set(id, {
              id,
              name: acc?.full_name ?? acc?.name ?? acc,
              role: j.skill_required ?? j.skill_required ?? 'Worker',
              rating: acc?.rating ?? j.employer_rating ?? 0,
              eisScore: acc?.eis_score ?? 0,
              status: 'Available',
            })
          }
        })
        setWorkers(Array.from(seen.values()))
      } catch (e) {
        setWorkers([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = workers.filter((w) =>
    `${w.name} ${w.role}`.toLowerCase().includes(query.trim().toLowerCase())
  )

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 16) }]}> 
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Workers Directory</Text>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('EmployerProfile')}>
          <Ionicons name="person-circle-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={18} color={COLORS.textMuted} style={styles.searchIcon} />
        <TextInput
          placeholder="Search by name or role"
          placeholderTextColor={COLORS.textMuted}
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
        />
        <TouchableOpacity onPress={() => setQuery('')} style={styles.clearButton}>
          <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {loading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator />
            <Text style={styles.loadingText}>Loading workers…</Text>
          </View>
        )}

        {!loading && filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No workers found.</Text>
            <Text style={styles.emptySub}>Try widening your search or post a job to attract workers.</Text>
            <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('PostJob')}>
              <Text style={styles.primaryButtonText}>Post a Job</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && filtered.map((worker) => (
          <Card key={worker.id} variant="outline" style={styles.workerCard}>
            <View style={styles.workerTop}>
              <View style={styles.workerInfo}>
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarInitial}>{String(worker.name || '').charAt(0)}</Text>
                </View>
                <View style={styles.workerMeta}>
                  <Text style={styles.workerName}>{worker.name}</Text>
                  <Text style={styles.workerRole}>{worker.role} • {worker.rating}</Text>
                </View>
              </View>
              <View style={[styles.statusBadge, worker.status === 'Available' ? styles.statusAvailable : styles.statusBusy]}>
                <Text style={[styles.statusText, worker.status === 'Available' ? styles.statusTextAvailable : styles.statusTextBusy]}>
                  {worker.status}
                </Text>
              </View>
            </View>

            <View style={styles.workerDivider} />

            <View style={styles.workerBottom}>
              <Text style={styles.eisScore}>EIS Score: <Text style={styles.eisScoreValue}>{worker.eisScore}</Text></Text>
              <TouchableOpacity style={styles.hireButton} onPress={() => navigation.navigate('GigDetail', { workerId: worker.id })}>
                <Text style={styles.hireButtonText}>Hire Now</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))}

        <View style={{ height: 96 }} />
      </ScrollView>

      <BottomNav activeTab={activeTab} onTabPress={(tab) => navigation.navigate(tab)} tabs={NAV_TABS as any} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { fontSize: 20, fontFamily: FONTS.weights.bold, color: COLORS.text },
  iconButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 12,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: COLORS.text, fontFamily: FONTS.weights.medium },
  clearButton: { marginLeft: 8 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 8 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  loadingText: { marginLeft: 8, color: COLORS.textSecondary },
  emptyState: { alignItems: 'center', padding: 24 },
  emptyText: { fontSize: 16, color: COLORS.textSecondary },
  emptySub: { marginTop: 8, color: COLORS.textSecondary },
  primaryButton: { marginTop: 12, backgroundColor: COLORS.primary, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12 },
  primaryButtonText: { color: COLORS.white, fontFamily: FONTS.weights.semibold },
  workerCard: { marginBottom: 12, padding: 16 },
  workerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  workerInfo: { flexDirection: 'row', alignItems: 'center' },
  avatarPlaceholder: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarInitial: { fontFamily: FONTS.weights.bold, fontSize: 18, color: COLORS.primary },
  workerMeta: { justifyContent: 'center' },
  workerName: { fontFamily: FONTS.weights.bold, fontSize: 16, color: COLORS.text },
  workerRole: { fontFamily: FONTS.weights.medium, fontSize: 13, color: COLORS.textSecondary },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: BORDER_RADIUS.sm },
  statusAvailable: { backgroundColor: 'rgba(16, 185, 129, 0.08)' },
  statusBusy: { backgroundColor: 'rgba(245, 158, 11, 0.08)' },
  statusText: { fontFamily: FONTS.weights.semibold, fontSize: 11 },
  statusTextAvailable: { color: '#10B981' },
  statusTextBusy: { color: '#F59E0B' },
  workerDivider: { height: 1, backgroundColor: COLORS.border, marginVertical: 12 },
  workerBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eisScore: { fontFamily: FONTS.weights.medium, fontSize: 13, color: COLORS.textSecondary },
  eisScoreValue: { fontFamily: FONTS.weights.bold, color: COLORS.text },
  hireButton: { backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: BORDER_RADIUS.md },
  hireButtonText: { fontFamily: FONTS.weights.semibold, fontSize: 13, color: COLORS.white },
})
