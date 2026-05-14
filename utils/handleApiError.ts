import { Alert } from 'react-native'

export const extractApiErrorMessage = (error: any, fallbackMessage?: string) => {
  const details = error?.response?.data ?? error
  const message =
    details?.error?.detail ||
    details?.error?.message ||
    details?.detail ||
    details?.message ||
    details?.error ||
    (Array.isArray(details?.errors) ? details.errors[0] : null) ||
    error?.message ||
    fallbackMessage ||
    'Something went wrong. Please try again.'

  return typeof message === 'string' ? message : 'Something went wrong. Please try again.'
}

export const handleApiError = (error: any, fallbackMessage?: string) => {
  const message = extractApiErrorMessage(error, fallbackMessage)

  Alert.alert('Error', message)
}

export const getErrorMessage = (error: any, fallbackMessage?: string) => {
  return extractApiErrorMessage(error, fallbackMessage)
}
