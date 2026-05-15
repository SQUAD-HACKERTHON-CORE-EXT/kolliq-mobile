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
import { getMyJobs } from '../../services/jobsService'
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [workers, setWorkers] = useState<any[]>([])
  const user = useAppStore((s) => s.user)

  useEffect(() => {
    loadWorkers()
  }, [])

  const loadWorkers = async () => {
    setLoading(true)
    setError(null)
    try {
      // Get employer's own jobs and extract workers from them
      const myJobs: any = await getMyJobs()
      const jobsArray = Array.isArray(myJobs) ? myJobs : (myJobs?.jobs ?? myJobs?.results ?? [])
      
      if (!jobsArray || jobsArray.length === 0) {
        setWorkers([])
        return
      }

      // Extract unique workers from employer's jobs who have accepted/completed jobs
      const seen = new Map<string, any>()
      ;(jobsArray || []).forEach((j: any) => {
        // Check for accepted worker
        const acc = j.acceptedBy || j.accepted_by
        if (acc) {
          const id = String(acc?.id ?? acc?.user_id ?? acc)
          if (!seen.has(id)) {
            seen.set(id, {
              id,
              name: acc?.full_name ?? acc?.name ?? 'Worker',
              role: j.skill_required ?? 'Gig Worker',
              rating: Math.round((acc?.rating ?? j.employer_rating ?? 0) * 10) / 10,
              eisScore: Math.round((acc?.eis_score ?? 0) * 10) / 10,
              status: 'Available',
              phone: acc?.phone ?? '',
              skills: acc?.skills ?? [j.skill_required],
            })
          }
        }
      })
      const workersList = Array.from(seen.values()).sort((a, b) => b.rating - a.rating)
      setWorkers(workersList)
    } catch (e: any) {
      console.log('Error loading workers:', e)
      setError('Failed to load workers. Please try again.')
      setWorkers([])
    } finally {
      setLoading(false)
    }
  }

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
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" refreshControl={
        Platform.OS === 'ios' ? undefined : undefined
      }>
        {loading && workers.length === 0 && (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading workers…</Text>
          </View>
        )}

        {error && !loading && (
          <View style={styles.errorState}>
            <Ionicons name="alert-circle-outline" size={48} color={COLORS.warning} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadWorkers}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && filtered.length === 0 && !error && (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color={COLORS.textMuted} style={{ marginBottom: SPACING.md }} />
            <Text style={styles.emptyText}>{query ? 'No workers found' : 'No workers yet'}</Text>
            <Text style={styles.emptySub}>{query ? 'Try a different search' : 'Workers who accept your jobs will appear here'}</Text>
            {!query && (
              <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('PostJob')}>
                <Text style={styles.primaryButtonText}>Post Your First Job</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {!loading && filtered.map((worker) => (
          <Card key={worker.id} variant="outline" style={styles.workerCard}>
            <View style={styles.workerTop}>
              <View style={styles.workerInfo}>
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarInitial}>{String(worker.name || '').charAt(0).toUpperCase()}</Text>
                </View>
                <View style={styles.workerMeta}>
                  <Text style={styles.workerName}>{worker.name}</Text>
                  <View style={styles.workerRoleRow}>
                    <Text style={styles.workerRole}>{worker.role}</Text>
                    {worker.rating > 0 && (
                      <>
                        <Text style={styles.workerRoleSep}>•</Text>
                        <View style={styles.ratingBadge}>
                          <Ionicons name="star" size={12} color={COLORS.warning} />
                          <Text style={styles.ratingText}>{worker.rating}</Text>
                        </View>
                      </>
                    )}
                  </View>
                </View>
              </View>
              <View style={[styles.statusBadge, styles.statusAvailable]}>
                <Text style={styles.statusText}>{worker.status}</Text>
              </View>
            </View>

            <View style={styles.workerDivider} />

            <View style={styles.workerBottom}>
              <View>
                <Text style={styles.eisScore}>EIS Score</Text>
                <Text style={styles.eisScoreValue}>{worker.eisScore}</Text>
              </View>
              <TouchableOpacity style={styles.hireButton}>
                <Ionicons name="checkmark-outline" size={18} color={COLORS.white} />
                <Text style={styles.hireButtonText}>Hire</Text>
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
  loadingRow: { flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingVertical: 48, gap: SPACING.md },
  loadingText: { marginTop: 12, color: COLORS.textSecondary, fontFamily: FONTS.family },
  errorState: { alignItems: 'center', padding: 24, paddingTop: 48 },
  errorText: { fontSize: 16, color: COLORS.text, fontFamily: FONTS.family, marginTop: 12, textAlign: 'center' },
  retryButton: { marginTop: 16, backgroundColor: COLORS.primary, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12 },
  retryButtonText: { color: COLORS.white, fontFamily: FONTS.weights.semibold },
  emptyState: { alignItems: 'center', padding: 24, paddingTop: 48 },
  emptyText: { fontSize: 16, fontFamily: FONTS.weights.bold, color: COLORS.text },
  emptySub: { marginTop: 8, color: COLORS.textMuted, fontFamily: FONTS.family, textAlign: 'center' },
  primaryButton: { marginTop: 20, backgroundColor: COLORS.primary, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 },
  primaryButtonText: { color: COLORS.white, fontFamily: FONTS.weights.semibold },
  workerCard: { marginBottom: 12, padding: 16 },
  workerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  workerInfo: { flexDirection: 'row', alignItems: 'center' },
  avatarPlaceholder: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarInitial: { fontFamily: FONTS.weights.bold, fontSize: 18, color: COLORS.primary },
  workerMeta: { justifyContent: 'center' },
  workerName: { fontFamily: FONTS.weights.bold, fontSize: 16, color: COLORS.text },
  workerRoleRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 6 },
  workerRole: { fontFamily: FONTS.family, fontSize: 13, color: COLORS.textSecondary },
  workerRoleSep: { color: COLORS.textMuted },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: 'rgba(245, 158, 11, 0.1)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  ratingText: { fontFamily: FONTS.weights.bold, fontSize: 12, color: COLORS.warning },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: BORDER_RADIUS.sm },
  statusAvailable: { backgroundColor: 'rgba(16, 185, 129, 0.1)' },
  statusBusy: { backgroundColor: 'rgba(245, 158, 11, 0.1)' },
  statusText: { fontFamily: FONTS.weights.semibold, fontSize: 11, color: '#10B981' },
  workerDivider: { height: 1, backgroundColor: COLORS.border, marginVertical: 12 },
  workerBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eisScore: { fontFamily: FONTS.weights.medium, fontSize: 13, color: COLORS.textMuted },
  eisScoreValue: { fontFamily: FONTS.weights.bold, fontSize: 16, color: COLORS.text, marginTop: 2 },
  hireButton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.primary, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  hireButtonText: { fontFamily: FONTS.weights.semibold, fontSize: 13, color: COLORS.white },
})
