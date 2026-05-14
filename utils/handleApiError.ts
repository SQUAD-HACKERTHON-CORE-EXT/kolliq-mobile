import { Alert } from 'react-native'

export const handleApiError = (error: any, fallbackMessage?: string) => {
  const message =
    error?.response?.data?.error?.detail ||
    error?.response?.data?.detail ||
    error?.message ||
    fallbackMessage ||
    'Something went wrong. Please try again.'

  Alert.alert('Error', message)
}

export const getErrorMessage = (error: any, fallbackMessage?: string) => {
  return (
    error?.response?.data?.error?.detail ||
    error?.response?.data?.detail ||
    error?.message ||
    fallbackMessage ||
    'Something went wrong. Please try again.'
  )
}
