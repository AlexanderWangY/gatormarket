import { api } from '@/lib/ky'

interface PortfolioSummary {
  balanceCents: number
  unrealizedPnlCents: number
  totalPortfolioValueCents: number
}

export const fetchMyPortfolioSummary = async () => {
  return api.get<PortfolioSummary>('portfolios/summary').json()
}
