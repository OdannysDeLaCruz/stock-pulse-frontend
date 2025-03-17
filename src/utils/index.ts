import type { StockPriceHistory } from "@/types";
import type { AreaData, Time, UTCTimestamp } from "lightweight-charts";

// Function to format date ISO 8601 to UTCTimestamp
export function formatDate(date: string): UTCTimestamp {
  return new Date(date).getTime() as UTCTimestamp
}

export const transformDataToLW = (priceHistory: StockPriceHistory[]): AreaData<Time>[] => {
  return priceHistory.map((price) => {
    return {
      time: formatDate(price.time),
      value: price.target_to,
    }
  })
}
