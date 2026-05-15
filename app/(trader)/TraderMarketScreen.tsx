import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, LAYOUT } from '../../constants';
import { BottomNav } from '../../components/ui/DashboardLayout';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Card } from '../../components/ui/Card';
import { formatNumber } from '../../utils/formatCurrency';
import { getCategories, getListings, getMyListings } from '../../services/marketplaceService';
import { getErrorMessage } from '../../utils/handleApiError';
import { useAppStore } from '../../store/useAppStore';

const NAV_TABS = [
  { id: 'TraderHome', label: 'Home', icon: 'grid-outline' as const, activeIcon: 'grid' as const },
  { id: 'TraderMarket', label: 'Market', icon: 'cart-outline' as const, activeIcon: 'cart' as const },
  { id: 'TraderIdentityTab', label: 'Identity', icon: 'finger-print-outline' as const, activeIcon: 'finger-print' as const },
  { id: 'TraderAccount', label: 'Account', icon: 'person-outline' as const, activeIcon: 'person' as const },
];

export default function TraderMarketScreen({ navigation }: any) {
  const user = useAppStore((s) => s.user);

  const [categories, setCategories] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [myListings, setMyListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'browse' | 'mine'>('browse');
  const [error, setError] = useState('');

  const loadData = useCallback(
    async (catSlug?: string | null, query?: string) => {
      try {
        setError('');
        const [catRes, listRes, myListRes] = await Promise.allSettled([
          getCategories(),
          getListings({
            category: catSlug ?? undefined,
            q: query || undefined,
          }),
          getMyListings(),
        ]);

        if (catRes.status === 'fulfilled') setCategories(catRes.value ?? []);
        if (listRes.status === 'fulfilled') setListings(listRes.value ?? []);
        if (myListRes.status === 'fulfilled') setMyListings(myListRes.value ?? []);
      } catch (err: any) {
        setError(getErrorMessage(err, 'Failed to load marketplace'));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    loadData(selectedCategorySlug, searchQuery);
  }, [selectedCategorySlug]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData(selectedCategorySlug, searchQuery);
  };

  const handleSearch = () => {
    setLoading(true);
    loadData(selectedCategorySlug, searchQuery);
  };

  const handleCategorySelect = (slug: string | null) => {
    setSelectedCategorySlug((prev) => (prev === slug ? null : slug));
    setLoading(true);
  };

  const handleCreateListing = () => {
    navigation.navigate('CreateListing');
  };

  const displayListings = activeTab === 'browse' ? listings : myListings;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Marketplace</Text>
        <TouchableOpacity style={styles.createBtn} onPress={handleCreateListing}>
          <Ionicons name="add" size={20} color={COLORS.white} />
          <Text style={styles.createBtnText}>Sell Item</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search items…"
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                loadData(selectedCategorySlug, '');
              }}
            >
              <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Browse / My Listings Tabs */}
      <View style={styles.tabRow}>
        {(['browse', 'mine'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tabBtn, activeTab === t && styles.tabBtnActive]}
            onPress={() => setActiveTab(t)}
          >
            <Text style={[styles.tabBtnText, activeTab === t && styles.tabBtnTextActive]}>
              {t === 'browse' ? 'Browse All' : 'My Listings'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Category Chips — only on Browse tab */}
        {activeTab === 'browse' && categories.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryRow}
          >
            <TouchableOpacity
              style={[
                styles.categoryChip,
                selectedCategorySlug === null && styles.categoryChipActive,
              ]}
              onPress={() => handleCategorySelect(null)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategorySlug === null && styles.categoryChipTextActive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryChip,
                  selectedCategorySlug === cat.slug && styles.categoryChipActive,
                ]}
                onPress={() => handleCategorySelect(cat.slug)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    selectedCategorySlug === cat.slug && styles.categoryChipTextActive,
                  ]}
                >
                  {cat.icon ? `${cat.icon} ` : ''}{cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {!!error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {loading && !refreshing ? (
          <View style={styles.loadingCenter}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : displayListings.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="storefront-outline" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>
              {activeTab === 'mine' ? 'No listings yet' : 'No items found'}
            </Text>
            <Text style={styles.emptyDesc}>
              {activeTab === 'mine'
                ? 'Tap "Sell Item" to post your first listing.'
                : 'Try a different category or search term.'}
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.resultsCount}>
              {displayListings.length} {displayListings.length === 1 ? 'item' : 'items'}
            </Text>
            {displayListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </>
        )}
      </ScrollView>

      <BottomNav
        activeTab="TraderMarket"
        onTabPress={(tab) => navigation.navigate(tab)}
        tabs={NAV_TABS as any}
      />
    </SafeAreaView>
  );
}

const ListingCard = ({ listing }: { listing: any }) => (
  <Card variant="outline" style={styles.listingCard}>
    <View style={styles.listingRow}>
      <View style={styles.listingBody}>
        <View style={styles.listingTopRow}>
          {listing.category_name && (
            <View style={styles.categoryTag}>
              <Text style={styles.categoryTagText}>{listing.category_name}</Text>
            </View>
          )}
          {listing.condition && (
            <View style={styles.conditionTag}>
              <Text style={styles.conditionTagText}>{listing.condition}</Text>
            </View>
          )}
        </View>
        <Text style={styles.listingTitle}>{listing.title}</Text>
        <Text style={styles.listingMeta}>
          {[listing.market_name, listing.location_city].filter(Boolean).join(', ') ||
            'Marketplace'}
        </Text>
        {listing.description ? (
          <Text style={styles.listingDesc} numberOfLines={2}>
            {listing.description}
          </Text>
        ) : null}
      </View>
      <View style={styles.priceBlock}>
        <Text style={styles.priceLabel}>₦</Text>
        <Text style={styles.priceAmount}>{formatNumber(listing.price)}</Text>
      </View>
    </View>
    {listing.seller_name && (
      <Text style={styles.sellerText}>Seller: {listing.seller_name}</Text>
    )}
  </Card>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingVertical: SPACING.lg,
  },
  headerTitle: { fontSize: 24, fontFamily: FONTS.weights.bold, color: COLORS.text },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },
  createBtnText: { fontSize: 13, fontFamily: FONTS.weights.bold, color: COLORS.white },
  searchRow: {
    paddingHorizontal: LAYOUT.paddingHorizontal,
    marginBottom: SPACING.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    gap: 8,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: FONTS.family,
    color: COLORS.text,
  },
  tabRow: {
    flexDirection: 'row',
    marginHorizontal: LAYOUT.paddingHorizontal,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: BORDER_RADIUS.lg,
    padding: 4,
    marginBottom: SPACING.md,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
  },
  tabBtnActive: { backgroundColor: COLORS.white },
  tabBtnText: { fontSize: 14, fontFamily: FONTS.weights.medium, color: COLORS.textMuted },
  tabBtnTextActive: { color: COLORS.text, fontFamily: FONTS.weights.bold },
  scrollContent: { paddingHorizontal: LAYOUT.paddingHorizontal, paddingBottom: 100 },
  categoryRow: { gap: 8, paddingBottom: SPACING.md },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: { fontSize: 12, fontFamily: FONTS.weights.medium, color: COLORS.text },
  categoryChipTextActive: { color: COLORS.white },
  errorCard: {
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.18)',
    padding: 12,
    marginBottom: SPACING.md,
  },
  errorText: { fontSize: 13, fontFamily: FONTS.weights.medium, color: '#B91C1C' },
  loadingCenter: { paddingTop: 60, alignItems: 'center' },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyTitle: { fontSize: 18, fontFamily: FONTS.weights.bold, color: COLORS.text },
  emptyDesc: {
    fontSize: 14,
    fontFamily: FONTS.family,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  resultsCount: {
    fontSize: 13,
    fontFamily: FONTS.weights.medium,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  listingCard: { marginBottom: 12, padding: SPACING.lg },
  listingRow: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.md },
  listingBody: { flex: 1 },
  listingTopRow: { flexDirection: 'row', gap: 6, marginBottom: 6 },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surfaceAlt,
  },
  categoryTagText: { fontSize: 10, fontFamily: FONTS.weights.medium, color: COLORS.textMuted },
  conditionTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.badgeGreen,
  },
  conditionTagText: { fontSize: 10, fontFamily: FONTS.weights.medium, color: COLORS.primaryDark },
  listingTitle: { fontSize: 15, fontFamily: FONTS.weights.bold, color: COLORS.text, marginBottom: 2 },
  listingMeta: { fontSize: 12, fontFamily: FONTS.weights.medium, color: COLORS.textMuted, marginBottom: 4 },
  listingDesc: {
    fontSize: 13,
    fontFamily: FONTS.weights.regular,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  priceBlock: { alignItems: 'flex-end', minWidth: 70 },
  priceLabel: { fontSize: 12, fontFamily: FONTS.weights.bold, color: COLORS.primary },
  priceAmount: { fontSize: 16, fontFamily: FONTS.weights.bold, color: COLORS.primary },
  sellerText: {
    marginTop: SPACING.sm,
    fontSize: 12,
    fontFamily: FONTS.family,
    color: COLORS.textMuted,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
  },
});
