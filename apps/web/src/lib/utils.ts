import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDollarNumber(num: number) {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B'
  } else if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
  } else {
    return num.toFixed(2).toString()
  }
}

/**
 * Compute total money in a binary LMSR market
 *
 * @param qYes - outstanding YES shares
 * @param qNo - outstanding NO shares
 * @param b - liquidity parameter (in cents)
 * @returns total money held in the market (in cents)
 */
export function lmsrMarketMoney(qYes: number, qNo: number, b: number): number {
  // cost function at current state
  const costNow = b * Math.log(Math.exp(qYes / b) + Math.exp(qNo / b))

  // initial cost at (0,0), subtract it off
  const costInitial = b * Math.log(2)

  return costNow - costInitial
}

export function formatDollarsWithNoSign(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}
