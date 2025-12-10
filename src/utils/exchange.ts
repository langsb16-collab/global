// Exchange Rate Utility Functions
// Using free exchange rate API

export interface ExchangeRates {
  [currency: string]: number;
}

export async function getExchangeRates(baseCurrency: string = 'KRW'): Promise<ExchangeRates> {
  try {
    // Using exchangerate-api.com (Free tier: 1,500 requests/month)
    const url = `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.rates) {
      return data.rates;
    }
    
    // Fallback rates if API fails
    return {
      USD: 0.00077,
      EUR: 0.00071,
      JPY: 0.11,
      CNY: 0.0056,
      THB: 0.026,
      VND: 19.5,
      SGD: 0.0010
    };
  } catch (error) {
    console.error('Exchange rate fetch error:', error);
    // Return default rates
    return {
      USD: 0.00077,
      EUR: 0.00071,
      JPY: 0.11,
      CNY: 0.0056,
      THB: 0.026,
      VND: 19.5,
      SGD: 0.0010
    };
  }
}

export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number> {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const rates = await getExchangeRates(fromCurrency);
  const rate = rates[toCurrency];
  
  if (!rate) {
    throw new Error(`Exchange rate not found for ${toCurrency}`);
  }

  return amount * rate;
}

export function calculateSettlement(
  productRevenue: number,
  platformFeeRate: number = 0.15,
  shippingFee: number = 0,
  transactionFeeRate: number = 0.03
): {
  productRevenue: number;
  platformFee: number;
  shippingFee: number;
  transactionFee: number;
  netAmount: number;
} {
  const platformFee = productRevenue * platformFeeRate;
  const transactionFee = productRevenue * transactionFeeRate;
  const netAmount = productRevenue - platformFee - shippingFee - transactionFee;

  return {
    productRevenue,
    platformFee,
    shippingFee,
    transactionFee,
    netAmount: Math.max(0, netAmount)
  };
}
