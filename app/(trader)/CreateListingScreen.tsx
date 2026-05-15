import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, LAYOUT } from '../../constants';
import { Button } from '../../components/ui/Button';
import { getCategories } from '../../services/marketplaceService';
import { getErrorMessage } from '../../utils/handleApiError';
import { useAppStore } from '../../store/useAppStore';
import apiClient from '../../services/apiClient';
import { ENDPOINTS } from '../../constants/endpoints';

// ─── Types ────────────────────────────────────────────────────────────────────
type PriceType = 'fixed' | 'negotiable';
type Condition = 'new' | 'used';

interface FormState {
  title: string;
  description: string;
  price: string;
  price_type: PriceType;
  condition: Condition;
  category_id: number | null;
  category_name: string;
  quantity_available: string;
  unit: string;
  market_name: string;
  location_area: string;
  location_city: string;
  whatsapp_number: string;
  call_number: string;
  show_phone: boolean;
}

interface FormErrors {
  title?: string;
  price?: string;
  category_id?: string;
  location_city?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const ToggleGroup = ({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: any) => void;
}) => (
  <View style={styles.toggleGroup}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={styles.toggleRow}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={[styles.toggleBtn, value === opt.value && styles.toggleBtnActive]}
          onPress={() => onChange(opt.value)}
        >
          <Text style={[styles.toggleBtnText, value === opt.value && styles.toggleBtnTextActive]}>
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const FormField = ({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) => (
  <View style={styles.fieldWrap}>
    <Text style={styles.fieldLabel}>
      {label}
      {required && <Text style={styles.required}> *</Text>}
    </Text>
    {children}
    {error ? <Text style={styles.fieldError}>{error}</Text> : null}
  </View>
);

const InputBox = (props: React.ComponentProps<typeof TextInput> & { multiline?: boolean }) => (
  <TextInput
    style={[styles.input, props.multiline && styles.inputMultiline]}
    placeholderTextColor={COLORS.textMuted}
    {...props}
  />
);

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function CreateListingScreen({ navigation }: any) {
  const user = useAppStore((s) => s.user);

  const [form, setForm] = useState<FormState>({
    title: '',
    description: '',
    price: '',
    price_type: 'fixed',
    condition: 'new',
    category_id: null,
    category_name: '',
    quantity_available: '1',
    unit: 'piece',
    market_name: user?.market_name || '',
    location_area: '',
    location_city: user?.location_city || '',
    whatsapp_number: user?.phone || '',
    call_number: user?.phone || '',
    show_phone: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [categories, setCategories] = useState<any[]>([]);
  const [catModalVisible, setCatModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  const set = (field: keyof FormState) => (value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.title.trim()) e.title = 'Title is required.';
    if (!form.price.trim() || isNaN(Number(form.price))) e.price = 'Enter a valid price.';
    if (!form.category_id) e.category_id = 'Please select a category.';
    if (!form.location_city.trim()) e.location_city = 'City is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await apiClient.post(ENDPOINTS.CREATE_LISTING, {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        category: form.category_id,
        price: form.price.trim(),
        price_type: form.price_type,
        condition: form.condition,
        quantity_available: parseInt(form.quantity_available || '1', 10),
        unit: form.unit.trim() || 'piece',
        market_name: form.market_name.trim() || undefined,
        location_area: form.location_area.trim() || undefined,
        location_city: form.location_city.trim(),
        whatsapp_number: form.whatsapp_number.trim() || undefined,
        call_number: form.call_number.trim() || undefined,
        show_phone: form.show_phone,
        source_channel: 'app',
      });

      Alert.alert('Listing Posted! 🎉', 'Your item is now live on the marketplace.', [
        { text: 'View Marketplace', onPress: () => navigation.navigate('TraderMarket') },
        { text: 'Post Another', onPress: () => resetForm() },
      ]);
    } catch (err: any) {
      Alert.alert('Failed to Post', getErrorMessage(err, 'Please check your details and try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      price: '',
      price_type: 'fixed',
      condition: 'new',
      category_id: null,
      category_name: '',
      quantity_available: '1',
      unit: 'piece',
      market_name: user?.market_name || '',
      location_area: '',
      location_city: user?.location_city || '',
      whatsapp_number: user?.phone || '',
      call_number: user?.phone || '',
      show_phone: true,
    });
    setErrors({});
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Listing</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Section 1: Basic Info ── */}
          <SectionLabel icon="create-outline" title="Item Details" />

          <FormField label="Title" required error={errors.title}>
            <InputBox
              placeholder="e.g. Fresh tomatoes, Samsung Galaxy A15…"
              value={form.title}
              onChangeText={set('title')}
              maxLength={100}
            />
          </FormField>

          <FormField label="Description">
            <InputBox
              placeholder="Describe your item — size, brand, quality, etc."
              value={form.description}
              onChangeText={set('description')}
              multiline
              numberOfLines={4}
              maxLength={500}
              textAlignVertical="top"
            />
          </FormField>

          {/* ── Section 2: Category ── */}
          <SectionLabel icon="grid-outline" title="Category" />

          <FormField label="Category" required error={errors.category_id}>
            <TouchableOpacity
              style={[styles.input, styles.selectInput]}
              onPress={() => setCatModalVisible(true)}
            >
              <Text
                style={[
                  styles.selectText,
                  !form.category_name && { color: COLORS.textMuted },
                ]}
              >
                {form.category_name || 'Select a category…'}
              </Text>
              <Ionicons name="chevron-down" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          </FormField>

          {/* ── Section 3: Pricing ── */}
          <SectionLabel icon="cash-outline" title="Pricing & Condition" />

          <FormField label="Price (₦)" required error={errors.price}>
            <View style={styles.priceInputRow}>
              <Text style={styles.currencySymbol}>₦</Text>
              <TextInput
                style={[styles.input, styles.priceInput]}
                placeholder="0.00"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="decimal-pad"
                value={form.price}
                onChangeText={set('price')}
              />
            </View>
          </FormField>

          <ToggleGroup
            label="Price Type"
            value={form.price_type}
            onChange={set('price_type')}
            options={[
              { value: 'fixed', label: 'Fixed Price' },
              { value: 'negotiable', label: 'Negotiable' },
            ]}
          />

          <ToggleGroup
            label="Condition"
            value={form.condition}
            onChange={set('condition')}
            options={[
              { value: 'new', label: 'New' },
              { value: 'used', label: 'Used' },
            ]}
          />

          <View style={styles.rowFields}>
            <FormField label="Quantity">
              <InputBox
                placeholder="1"
                value={form.quantity_available}
                onChangeText={set('quantity_available')}
                keyboardType="number-pad"
                style={{ width: 100 }}
              />
            </FormField>
            <View style={{ flex: 1, marginLeft: SPACING.md }}>
              <FormField label="Unit">
                <InputBox
                  placeholder="piece, kg, bag…"
                  value={form.unit}
                  onChangeText={set('unit')}
                />
              </FormField>
            </View>
          </View>

          {/* ── Section 4: Location ── */}
          <SectionLabel icon="location-outline" title="Location" />

          <FormField label="Market / Shop Name">
            <InputBox
              placeholder="e.g. Wuse Market, Tejuosho…"
              value={form.market_name}
              onChangeText={set('market_name')}
            />
          </FormField>

          <FormField label="Area / Neighbourhood">
            <InputBox
              placeholder="e.g. Wuse II, Ikeja GRA…"
              value={form.location_area}
              onChangeText={set('location_area')}
            />
          </FormField>

          <FormField label="City" required error={errors.location_city}>
            <InputBox
              placeholder="e.g. Abuja, Lagos…"
              value={form.location_city}
              onChangeText={set('location_city')}
            />
          </FormField>

          {/* ── Section 5: Contact ── */}
          <SectionLabel icon="call-outline" title="Contact" />

          <FormField label="WhatsApp Number">
            <InputBox
              placeholder="+2348012345678"
              value={form.whatsapp_number}
              onChangeText={set('whatsapp_number')}
              keyboardType="phone-pad"
            />
          </FormField>

          <FormField label="Call Number">
            <InputBox
              placeholder="+2348012345678"
              value={form.call_number}
              onChangeText={set('call_number')}
              keyboardType="phone-pad"
            />
          </FormField>

          <View style={styles.switchRow}>
            <View>
              <Text style={styles.fieldLabel}>Show phone to buyers</Text>
              <Text style={styles.switchHint}>Buyers can see your number on the listing</Text>
            </View>
            <Switch
              value={form.show_phone}
              onValueChange={set('show_phone')}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>

          {/* ── Submit ── */}
          <Button
            title="Post Listing"
            onPress={handleSubmit}
            loading={submitting}
            fullWidth
            size="lg"
            style={styles.submitBtn}
          />

          <Text style={styles.termsNote}>
            By posting, you confirm this listing is accurate and complies with Kolliq's marketplace
            guidelines.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Category Modal */}
      <Modal
        visible={catModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setCatModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setCatModalVisible(false)}
        />
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Select Category</Text>
          <FlatList
            data={categories}
            keyExtractor={(item) => String(item.id)}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.catOption,
                  form.category_id === Number(item.id) && styles.catOptionActive,
                ]}
                onPress={() => {
                  set('category_id')(Number(item.id));
                  set('category_name')(item.name);
                  setCatModalVisible(false);
                }}
              >
                <Text style={styles.catOptionIcon}>{item.icon || '📦'}</Text>
                <Text
                  style={[
                    styles.catOptionText,
                    form.category_id === Number(item.id) && styles.catOptionTextActive,
                  ]}
                >
                  {item.name}
                </Text>
                {item.listing_count !== undefined && (
                  <Text style={styles.catCount}>{item.listing_count} items</Text>
                )}
                {form.category_id === Number(item.id) && (
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.catDivider} />}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const SectionLabel = ({
  icon,
  title,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
}) => (
  <View style={styles.sectionLabel}>
    <View style={styles.sectionIconWrap}>
      <Ionicons name={icon} size={16} color={COLORS.primary} />
    </View>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingVertical: SPACING.lg,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerTitle: { fontSize: 18, fontFamily: FONTS.weights.bold, color: COLORS.text },
  scrollContent: {
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingBottom: 48,
  },
  sectionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.badgeGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: { fontSize: 15, fontFamily: FONTS.weights.bold, color: COLORS.text },
  fieldWrap: { marginBottom: SPACING.lg },
  fieldLabel: { fontSize: 13, fontFamily: FONTS.weights.semibold, color: COLORS.text, marginBottom: 8 },
  required: { color: COLORS.error },
  fieldError: { fontSize: 12, fontFamily: FONTS.family, color: COLORS.error, marginTop: 4 },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.input,
    paddingHorizontal: SPACING.lg,
    height: LAYOUT.inputHeight,
    fontSize: 15,
    fontFamily: FONTS.family,
    color: COLORS.text,
  },
  inputMultiline: {
    height: 100,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: { fontSize: 15, fontFamily: FONTS.family, color: COLORS.text, flex: 1 },
  priceInputRow: { flexDirection: 'row', alignItems: 'center', gap: 0 },
  currencySymbol: {
    height: LAYOUT.inputHeight,
    lineHeight: LAYOUT.inputHeight,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRightWidth: 0,
    borderTopLeftRadius: BORDER_RADIUS.input,
    borderBottomLeftRadius: BORDER_RADIUS.input,
    fontSize: 18,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
  },
  priceInput: {
    flex: 1,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  toggleGroup: { marginBottom: SPACING.lg },
  toggleRow: { flexDirection: 'row', gap: SPACING.sm },
  toggleBtn: {
    flex: 1,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  toggleBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.selectedBg,
  },
  toggleBtnText: {
    fontSize: 14,
    fontFamily: FONTS.weights.medium,
    color: COLORS.textSecondary,
  },
  toggleBtnTextActive: {
    color: COLORS.primary,
    fontFamily: FONTS.weights.bold,
  },
  rowFields: { flexDirection: 'row', alignItems: 'flex-start' },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  switchHint: {
    fontSize: 12,
    fontFamily: FONTS.family,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  submitBtn: { marginTop: SPACING.xl, marginBottom: SPACING.lg },
  termsNote: {
    fontSize: 12,
    fontFamily: FONTS.family,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalSheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '65%',
    paddingBottom: 32,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: FONTS.weights.bold,
    color: COLORS.text,
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingVertical: SPACING.lg,
  },
  catOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: LAYOUT.paddingHorizontal,
    paddingVertical: SPACING.lg,
    gap: SPACING.md,
  },
  catOptionActive: { backgroundColor: COLORS.selectedBg },
  catOptionIcon: { fontSize: 22 },
  catOptionText: {
    flex: 1,
    fontSize: 15,
    fontFamily: FONTS.weights.medium,
    color: COLORS.text,
  },
  catOptionTextActive: { color: COLORS.primary, fontFamily: FONTS.weights.bold },
  catCount: { fontSize: 12, fontFamily: FONTS.family, color: COLORS.textMuted },
  catDivider: { height: 1, backgroundColor: COLORS.border, marginLeft: LAYOUT.paddingHorizontal },
});
