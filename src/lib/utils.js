import { format, formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'

export const formatDate = (date) =>
  format(new Date(date), 'dd MMM yyyy', { locale: id })

export const timeAgo = (date) =>
  formatDistanceToNow(new Date(date), { addSuffix: true, locale: id })

export const truncate = (text, length = 150) =>
  text?.length <= length ? text : text?.substring(0, length) + '...'

export const readingTime = (content) => {
  const words = content?.trim().split(/\s+/).length || 0
  return Math.ceil(words / 200)
}