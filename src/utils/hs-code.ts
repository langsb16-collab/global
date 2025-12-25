/**
 * HS Code 추천 유틸리티
 * 상품 카테고리 및 설명 기반 HS Code 자동 분류
 */

export interface HSCodeRecommendation {
  hsCode: string;
  description: string;
  confidenceScore: number;
  tariffRate: number;
  restrictions: string[];
  requiredDocuments: string[];
}

/**
 * HS Code 데이터베이스 (간단한 버전)
 */
const HS_CODE_DATABASE: Record<string, HSCodeRecommendation> = {
  // 과일류
  fruit: {
    hsCode: '0808.10',
    description: 'Apples, fresh',
    confidenceScore: 0.9,
    tariffRate: 45.0,
    restrictions: ['Phytosanitary certificate required', 'Fumigation may be required'],
    requiredDocuments: ['Phytosanitary Certificate', 'Certificate of Origin', 'Commercial Invoice']
  },
  // 채소류
  vegetable: {
    hsCode: '0709.99',
    description: 'Other vegetables, fresh or chilled',
    confidenceScore: 0.85,
    tariffRate: 27.0,
    restrictions: ['Phytosanitary certificate required'],
    requiredDocuments: ['Phytosanitary Certificate', 'Certificate of Origin', 'Commercial Invoice']
  },
  // 곡물류
  grain: {
    hsCode: '1006.30',
    description: 'Rice, semi-milled or wholly milled',
    confidenceScore: 0.95,
    tariffRate: 513.0,
    restrictions: ['Import quota may apply', 'Quality certificate required'],
    requiredDocuments: ['Quality Certificate', 'Certificate of Origin', 'Commercial Invoice', 'Packing List']
  },
  // 수산물
  seafood: {
    hsCode: '0307.43',
    description: 'Cuttlefish and squid, frozen, dried, salted or in brine',
    confidenceScore: 0.88,
    tariffRate: 20.0,
    restrictions: ['Health certificate required', 'HACCP certification recommended'],
    requiredDocuments: ['Health Certificate', 'Certificate of Origin', 'Commercial Invoice', 'HACCP Certificate']
  },
  // 육류
  meat: {
    hsCode: '0201.30',
    description: 'Meat of bovine animals, boneless',
    confidenceScore: 0.92,
    tariffRate: 40.0,
    restrictions: ['Veterinary certificate required', 'Halal certification for Muslim countries'],
    requiredDocuments: ['Veterinary Certificate', 'Health Certificate', 'Certificate of Origin', 'Commercial Invoice']
  },
  // 가공식품
  processed: {
    hsCode: '2103.90',
    description: 'Sauces and preparations therefor; mixed condiments and seasonings',
    confidenceScore: 0.87,
    tariffRate: 8.0,
    restrictions: ['Food safety certificate required', 'Ingredient list must be provided'],
    requiredDocuments: ['Food Safety Certificate', 'Certificate of Origin', 'Commercial Invoice', 'Ingredient List']
  },
  // 소스류
  sauce: {
    hsCode: '2103.90',
    description: 'Sauces and preparations therefor',
    confidenceScore: 0.9,
    tariffRate: 8.0,
    restrictions: ['Food safety certificate required'],
    requiredDocuments: ['Food Safety Certificate', 'Certificate of Origin', 'Commercial Invoice']
  }
};

/**
 * 상품 정보 기반 HS Code 추천
 */
export async function recommendHSCode(params: {
  category: string;
  nameKo: string;
  descriptionKo: string;
  nameEn?: string;
}): Promise<HSCodeRecommendation> {
  const { category, nameKo, descriptionKo, nameEn } = params;
  
  // 카테고리 기반 기본 추천
  let recommendation = HS_CODE_DATABASE[category];
  
  if (!recommendation) {
    // 키워드 기반 매칭
    const keywords = `${nameKo} ${descriptionKo} ${nameEn || ''}`.toLowerCase();
    
    if (keywords.includes('사과') || keywords.includes('apple')) {
      recommendation = HS_CODE_DATABASE.fruit;
    } else if (keywords.includes('쌀') || keywords.includes('rice')) {
      recommendation = HS_CODE_DATABASE.grain;
    } else if (keywords.includes('오징어') || keywords.includes('squid') || keywords.includes('김') || keywords.includes('seaweed')) {
      recommendation = HS_CODE_DATABASE.seafood;
    } else if (keywords.includes('고추장') || keywords.includes('gochujang') || keywords.includes('소스') || keywords.includes('sauce')) {
      recommendation = HS_CODE_DATABASE.sauce;
    } else {
      // 기본값
      recommendation = {
        hsCode: '9999.99',
        description: 'Classification pending - please contact customs',
        confidenceScore: 0.3,
        tariffRate: 0,
        restrictions: ['Manual classification required'],
        requiredDocuments: ['Certificate of Origin', 'Commercial Invoice']
      };
    }
  }
  
  return recommendation;
}

/**
 * 국가별 수입 규제 확인
 */
export function getCountryRestrictions(hsCode: string, targetCountry: string): {
  allowed: boolean;
  restrictions: string[];
  additionalDocuments: string[];
} {
  // 국가별 특별 규제 (간단한 버전)
  const countryRules: Record<string, any> = {
    US: {
      restrictedCategories: ['meat', 'grain'],
      additionalDocs: ['FDA Registration', 'Prior Notice']
    },
    EU: {
      restrictedCategories: ['meat', 'seafood'],
      additionalDocs: ['EU Health Certificate', 'TRACES Registration']
    },
    JP: {
      restrictedCategories: ['grain', 'fruit'],
      additionalDocs: ['Japanese Agricultural Standards (JAS)', 'Plant Quarantine Certificate']
    },
    CN: {
      restrictedCategories: ['meat', 'fruit', 'grain'],
      additionalDocs: ['CIQ Certificate', 'Import License']
    }
  };
  
  const rules = countryRules[targetCountry.toUpperCase()];
  
  if (!rules) {
    return {
      allowed: true,
      restrictions: [],
      additionalDocuments: []
    };
  }
  
  return {
    allowed: true, // 간단한 버전에서는 항상 허용
    restrictions: [`${targetCountry} specific regulations apply`],
    additionalDocuments: rules.additionalDocs || []
  };
}

/**
 * 관세율 계산
 */
export function calculateCustomsDuty(params: {
  hsCode: string;
  price: number;
  quantity: number;
  weight: number;
  targetCountry: string;
}): {
  dutyAmount: number;
  tariffRate: number;
  totalCost: number;
} {
  const { price, quantity, targetCountry } = params;
  
  // 국가별 기본 관세율 (간단한 버전)
  const baseTariffRates: Record<string, number> = {
    US: 5.0,
    EU: 8.0,
    JP: 10.0,
    CN: 15.0,
    KR: 0 // 한국 내수는 관세 없음
  };
  
  const tariffRate = baseTariffRates[targetCountry.toUpperCase()] || 10.0;
  const totalPrice = price * quantity;
  const dutyAmount = Math.round(totalPrice * (tariffRate / 100));
  const totalCost = totalPrice + dutyAmount;
  
  return {
    dutyAmount,
    tariffRate,
    totalCost
  };
}
