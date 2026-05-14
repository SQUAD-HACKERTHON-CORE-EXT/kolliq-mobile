import apiClient from './apiClient'
import { ENDPOINTS } from '../constants/endpoints'

export const getCategories = async () => {
  const response = await apiClient.get(ENDPOINTS.CATEGORIES)
  return response.data
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
  return response.data
}

export const getListingDetail = async (listingId: string) => {
  const response = await apiClient.get(
    `/api/marketplace/listings/${listingId}/`
  )
  return response.data
}

export const getMyListings = async (status?: string) => {
  const response = await apiClient.get(ENDPOINTS.MY_LISTINGS, {
    params: status ? { status } : undefined,
  })
  return response.data
}

export const getSavedListings = async () => {
  const response = await apiClient.get(ENDPOINTS.SAVED_LISTINGS)
  return response.data
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
  return response.data
}

export const updateListing = async (
  listingId: string,
  data: Record<string, any>
) => {
  const response = await apiClient.patch(
    `/api/marketplace/listings/${listingId}/update/`,
    data
  )
  return response.data
}

export const deleteListing = async (listingId: string) => {
  const response = await apiClient.delete(
    `/api/marketplace/listings/${listingId}/delete/`
  )
  return response.data
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
  return response.data
}

export const saveListing = async (listingId: string) => {
  const response = await apiClient.post(
    `/api/marketplace/listings/${listingId}/save/`
  )
  return response.data
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
  return response.data
}

export const sendEnquiry = async (data: {
  listing_id: string
  message: string
}) => {
  const response = await apiClient.post('/api/marketplace/enquiries/', data)
  return response.data
}

export const getMyEnquiries = async () => {
  const response = await apiClient.get('/api/marketplace/enquiries/mine/')
  return response.data
}

export const getReceivedEnquiries = async (listing_id?: string) => {
  const response = await apiClient.get(
    '/api/marketplace/enquiries/received/',
    { params: listing_id ? { listing_id } : undefined }
  )
  return response.data
}

export const respondToEnquiry = async (enquiryId: string) => {
  const response = await apiClient.patch(
    `/api/marketplace/enquiries/${enquiryId}/respond/`
  )
  return response.data
}
