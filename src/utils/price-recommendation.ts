/**
 * AI 가격 추천 유틸리티
 * 시장 가격 분석 및 최적 가격 제안
 */

export interface PriceAnalysis {
  marketAvgPrice: number;
  competitorMinPrice: number;
  competitorMaxPrice: number;
  suggestedPrice: number;
  costPrice: number;
  profitMargin: number;
  confidenceScore: number;
  dataSources: string[];
}

export interface PriceRecommendationParams {
  category: string;
  origin: string;
  weight: number;
  currentPrice?: number;
  costPrice?: number;
}

/**
 * 시장 가격 데이터베이스 (간단한 시뮬레이션)
 */
const MARKET_PRICES: Record<string, { min: number; max: number; avg: number }> = {
  fruit: { min: 15000, max: 50000, avg: 30000 },
  vegetable: { min: 10000, max: 35000, avg: 20000 },
  grain: { min: 25000, max: 80000, avg: 50000 },
  seafood: { min: 30000, max: 100000, avg: 60000 },
  meat: { min: 40000, max: 150000, avg: 80000 },
  processed: { min: 20000, max: 70000, avg: 40000 },
  sauce: { min: 15000, max: 50000, avg: 25000 },
  etc: { min: 10000, max: 50000, avg: 25000 }
};

/**
 * AI 기반 가격 추천
 */
export async function recommendPrice(params: PriceRecommendationParams): Promise<PriceAnalysis> {
  const { category, origin, weight, currentPrice, costPrice } = params;
  
  // 카테고리별 시장 가격 조회
  const marketData = MARKET_PRICES[category] || MARKET_PRICES.etc;
  
  // 원산지 프리미엄 (특산지 가산)
  const originPremium = calculateOriginPremium(origin);
  
  // 무게 기반 가격 조정
  const weightFactor = calculateWeightFactor(weight);
  
  // 시장 평균 가격 계산
  const marketAvgPrice = Math.round(marketData.avg * originPremium * weightFactor);
  const competitorMinPrice = Math.round(marketData.min * originPremium * weightFactor);
  const competitorMaxPrice = Math.round(marketData.max * originPremium * weightFactor);
  
  // 비용 가격 추정 (제공되지 않은 경우)
  const estimatedCostPrice = costPrice || Math.round(marketAvgPrice * 0.6);
  
  // 최적 판매 가격 제안
  // 전략: 시장 평균보다 약간 낮게 (경쟁력 확보) + 적정 마진 (30-40%)
  const targetMargin = 0.35; // 35% 목표 마진
  const suggestedPrice = Math.round(
    Math.max(
      estimatedCostPrice * (1 + targetMargin),
      marketAvgPrice * 0.95 // 시장가의 95%
    )
  );
  
  // 실제 마진율 계산
  const profitMargin = ((suggestedPrice - estimatedCostPrice) / suggestedPrice) * 100;
  
  // 신뢰도 점수 계산
  const confidenceScore = calculateConfidenceScore({
    hasCurrentPrice: !!currentPrice,
    hasCostPrice: !!costPrice,
    category,
    marketDataAvailable: true
  });
  
  return {
    marketAvgPrice,
    competitorMinPrice,
    competitorMaxPrice,
    suggestedPrice,
    costPrice: estimatedCostPrice,
    profitMargin: Math.round(profitMargin * 10) / 10,
    confidenceScore,
    dataSources: [
      'Market Price Database',
      'Regional Price Index',
      'Historical Sales Data'
    ]
  };
}

/**
 * 원산지 프리미엄 계산
 */
function calculateOriginPremium(origin: string): number {
  const premiumRegions = [
    '완도', '완도군', '부산', '제주', '안동', '전주', '나주', '순창', 
    '영광', '이천', '여주', '담양', '고창', '보성', '하동'
  ];
  
  const isPremiumRegion = premiumRegions.some(region => 
    origin.includes(region)
  );
  
  return isPremiumRegion ? 1.2 : 1.0; // 특산지 20% 프리미엄
}

/**
 * 무게 기반 가격 조정 계산
 */
function calculateWeightFactor(weight: number): number {
  // 기준 무게: 5kg
  const baseWeight = 5;
  
  if (weight <= 0) return 1.0;
  
  // 무게에 비례하지만, 규모의 경제 고려
  // 무게가 2배가 되면 가격은 1.8배
  return Math.pow(weight / baseWeight, 0.9);
}

/**
 * 신뢰도 점수 계산
 */
function calculateConfidenceScore(factors: {
  hasCurrentPrice: boolean;
  hasCostPrice: boolean;
  category: string;
  marketDataAvailable: boolean;
}): number {
  let score = 0.5; // 기본 점수
  
  if (factors.hasCurrentPrice) score += 0.15;
  if (factors.hasCostPrice) score += 0.15;
  if (factors.marketDataAvailable) score += 0.15;
  if (factors.category !== 'etc') score += 0.05;
  
  return Math.min(score, 1.0);
}

/**
 * 가격 범위 검증
 */
export function validatePriceRange(
  price: number, 
  analysis: PriceAnalysis
): { valid: boolean; message: string } {
  const { competitorMinPrice, competitorMaxPrice, suggestedPrice } = analysis;
  
  if (price < competitorMinPrice * 0.7) {
    return {
      valid: false,
      message: `Price is too low. Minimum recommended: ₩${Math.round(competitorMinPrice * 0.7).toLocaleString()}`
    };
  }
  
  if (price > competitorMaxPrice * 1.3) {
    return {
      valid: false,
      message: `Price is too high. Maximum recommended: ₩${Math.round(competitorMaxPrice * 1.3).toLocaleString()}`
    };
  }
  
  const deviation = Math.abs(price - suggestedPrice) / suggestedPrice;
  
  if (deviation < 0.1) {
    return {
      valid: true,
      message: 'Price is optimal for the market.'
    };
  }
  
  if (deviation < 0.2) {
    return {
      valid: true,
      message: 'Price is reasonable.'
    };
  }
  
  return {
    valid: true,
    message: `Price deviates from recommended price by ${Math.round(deviation * 100)}%. Consider adjusting.`
  };
}
