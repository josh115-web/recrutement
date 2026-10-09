import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateLong(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 18) return 'Good Afternoon'
  return 'Good Evening'
}

export function getPerformanceColor(score: number): string {
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-amber-600'
  if (score >= 40) return 'text-orange-600'
  return 'text-red-600'
}

export function getPerformanceBg(score: number): string {
  if (score >= 80) return 'bg-green-50 text-green-700 border-green-200'
  if (score >= 60) return 'bg-amber-50 text-amber-700 border-amber-200'
  if (score >= 40) return 'bg-orange-50 text-orange-700 border-orange-200'
  return 'bg-red-50 text-red-700 border-red-200'
}

export function getPerformanceLabel(score: number): string {
  if (score >= 85) return 'Excellent'
  if (score >= 70) return 'Very Good'
  if (score >= 55) return 'Good'
  if (score >= 40) return 'Average'
  return 'Needs Improvement'
}

export function calculateOverallPerformance(
  executionScore: number,
  followUpScore: number,
  attendanceRate: number
): number {
  const maxTotal = 100
  const totalRaw = executionScore + followUpScore
  const normalizedPerf = (totalRaw / maxTotal) * 80
  const attendanceBonus = (attendanceRate / 100) * 20
  return Math.round(normalizedPerf + attendanceBonus)
}

export function getMonthName(month: number): string {
  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ]
  return months[month - 1] || ''
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
