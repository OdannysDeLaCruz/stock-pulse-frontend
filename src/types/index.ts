export interface StockPriceHistory {
  target_from: number
  target_to: number
  time: string
}

export interface Stock {
  id: number
  ticker: string
  target_from: number
  target_to: number
  company: string
  action: string
  brokerage: string
  rating_from: string
  rating_to: string
  time: string
  analysis: {
    change_percentage: number
    change_value: number
  }
  price_history: StockPriceHistory[]
}

export interface StockPartialWebsocketResponse {
  ticker: string
  target_from: number
  target_to: number
  rating_from: string
  rating_to: string
  analysis: {
    change_percentage: number
    change_value: number
  }
  new_item_price_history: StockPriceHistory
}
