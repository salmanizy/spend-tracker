export type Category =
  | 'Food & Drinks'
  | 'Shopping'
  | 'Travel'
  | 'Services'
  | 'Entertainment'
  | 'Health'
  | 'Transportation'
  | 'Other'

export type PaymentMethod = 'Bank' | 'Cash'

export interface Expense {
  id: string
  user_id: string
  amount: number
  description: string
  date: string
  category: Category
  payment_method: PaymentMethod
  created_at: string
}

export interface MonthlyTotal {
  month: string
  total: number
}
