import apiClient from './apiClient'
import { ENDPOINTS } from '../constants/endpoints'

const toNumber = (value: any, fallback = 0) => {
  const parsed = typeof value === 'string' ? Number(value.replace(/[^\d.-]/g, '')) : Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const unwrap = (response: any, keys: string[] = []) => {
  if (!response) return response
  if (Array.isArray(response)) return response

  for (const key of keys) {
    if (response?.[key] !== undefined) return response[key]
  }

  return response?.data ?? response
}

const normalizeCategory = (category: any) => ({
  id: String(category?.id ?? category?.slug ?? category?.name ?? ''),
  slug: category?.slug ?? String(category?.id) ?? category?.name,
  name: category?.name ?? category?.title ?? 'Category',
  icon: category?.icon ?? '',
  listing_count: category?.listing_count,
  description: category?.description,
})

const normalizeListing = (listing: any) => ({
  id: String(listing?.id ?? listing?.listing_id ?? ''),
  title: listing?.title ?? listing?.name ?? 'Listing',
  description: listing?.description ?? '',
  price: toNumber(listing?.price ?? listing?.amount ?? 0),
  category_id: String(listing?.category_id ?? listing?.category?.id ?? listing?.category ?? ''),
  category_name: listing?.category_name ?? listing?.category?.name,
  condition: listing?.condition,
  quantity_available: toNumber(listing?.quantity_available ?? listing?.quantity ?? 1, 1),
  location_city: listing?.location_city ?? listing?.city ?? '',
  market_name: listing?.market_name ?? listing?.market ?? '',
  seller_name: listing?.seller_name ?? listing?.owner_name ?? listing?.user?.full_name,
  seller_phone: listing?.seller_phone ?? listing?.phone,
  is_saved: Boolean(listing?.is_saved ?? listing?.saved ?? false),
  created_at: listing?.created_at,
  image_url: listing?.image_url ?? listing?.primary_image,
})

export const getCategories = async () => {
  const response = await apiClient.get(ENDPOINTS.CATEGORIES)
  const categories = unwrap(response, ['categories', 'results'])
  return Array.isArray(categories) ? categories.map(normalizeCategory) : []
}

export const getListings = async (params?: {
  category?: string
  city?: string
  q?: string
  min_price?: number
  max_price?: number
  page?: number
}) => {
  const response = await apiClient.get(ENDPOINTS.LISTINGS, { params })
  const listings = unwrap(response, ['listings', 'results'])
  return Array.isArray(listings) ? listings.map(normalizeListing) : []
}

export const getListingDetail = async (listingId: string) => {
  const response = await apiClient.get(
    `/api/marketplace/listings/${listingId}/`
  )
  return normalizeListing(unwrap(response, ['listing', 'data']))
}

export const getMyListings = async (status?: string) => {
  const response = await apiClient.get(ENDPOINTS.MY_LISTINGS, {
    params: status ? { status } : undefined,
  })
  const listings = unwrap(response, ['listings', 'results'])
  return Array.isArray(listings) ? listings.map(normalizeListing) : []
}

export const getSavedListings = async () => {
  const response = await apiClient.get(ENDPOINTS.SAVED_LISTINGS)
  const listings = unwrap(response, ['listings', 'results'])
  return Array.isArray(listings) ? listings.map(normalizeListing) : []
}

export const createListing = async (data: {
  title: string
  description?: string
  price: number
  category_id?: string
  condition?: string
  quantity_available?: number
  location_city: string
  market_name?: string
  show_phone?: boolean
}) => {
  const response = await apiClient.post(ENDPOINTS.CREATE_LISTING, data)
  return normalizeListing(unwrap(response, ['listing', 'data']))
}

export const updateListing = async (
  listingId: string,
  data: Record<string, any>
) => {
  const response = await apiClient.patch(
    `/api/marketplace/listings/${listingId}/update/`,
    data
  )
  return normalizeListing(unwrap(response, ['listing', 'data']))
}

export const deleteListing = async (listingId: string) => {
  const response = await apiClient.delete(
    `/api/marketplace/listings/${listingId}/delete/`
  )
  return response
}

export const purchaseListing = async (
  listingId: string,
  quantity: number,
  message?: string
) => {
  const response = await apiClient.post(
    `/api/marketplace/listings/${listingId}/purchase/`,
    { quantity, message }
  )
  return response
}

export const saveListing = async (listingId: string) => {
  const response = await apiClient.post(
    `/api/marketplace/listings/${listingId}/save/`
  )
  return response
}

export const addListingImage = async (
  listingId: string,
  image_url: string,
  is_primary: boolean
) => {
  const response = await apiClient.post(
    `/api/marketplace/listings/${listingId}/images/`,
    { image_url, is_primary }
  )
  return response
}

export const sendEnquiry = async (data: {
  listing_id: string
  message: string
}) => {
  const response = await apiClient.post('/api/marketplace/enquiries/', data)
  return response
}

export const getMyEnquiries = async () => {
  const response = await apiClient.get('/api/marketplace/enquiries/mine/')
  return response
}

export const getReceivedEnquiries = async (listing_id?: string) => {
  const response = await apiClient.get(
    '/api/marketplace/enquiries/received/',
    { params: listing_id ? { listing_id } : undefined }
  )
  return response
}

export const respondToEnquiry = async (enquiryId: string) => {
  const response = await apiClient.patch(
    `/api/marketplace/enquiries/${enquiryId}/respond/`
  )
  return response
}
