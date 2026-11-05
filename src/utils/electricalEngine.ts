import { Product, SmartRecommendationQuery, CompatibilityCheck } from '../types';

export const CHEMISTRY_DOD_MAP: Record<string, number> = {
  LiFePO4: 0.90, // 90% Depth of Discharge
  'Li-ion': 0.80, // 80% DoD
  'Lead-Acid': 0.50, // 50% max safe DoD
  Tubular: 0.55,
  VRLA: 0.60,
  NiMH: 0.75,
  'N/A': 0.70
};

export const INVERTER_EFFICIENCY = 0.90;

export function calculateBackupHours(
  voltage: number,
  capacityAh: number,
  chemistry: string | undefined,
  loadWatts: number
): number {
  if (loadWatts <= 0 || voltage <= 0 || capacityAh <= 0) return 0;
  const dod = CHEMISTRY_DOD_MAP[chemistry || 'LiFePO4'] ?? 0.75;
  const usableWh = voltage * capacityAh * dod * INVERTER_EFFICIENCY;
  return Number((usableWh / loadWatts).toFixed(1));
}

export function evaluateCompatibility(
  product: Product,
  query: SmartRecommendationQuery
): CompatibilityCheck {
  const notes: string[] = [];
  const specs = product.specifications;

  // 1. Voltage validation
  let voltageCompatible = false;
  if (!query.requiredVoltage || query.requiredVoltage <= 0) {
    voltageCompatible = true;
  } else {
    // Check if within 10% tolerance or matches operating range
    const targetV = query.requiredVoltage;
    const nominalV = specs.nominalVoltage;
    const minV = specs.operatingVoltageMin ?? nominalV * 0.85;
    const maxV = specs.operatingVoltageMax ?? nominalV * 1.15;

    if (
      Math.abs(nominalV - targetV) / targetV <= 0.10 ||
      (targetV >= minV && targetV <= maxV)
    ) {
      voltageCompatible = true;
    } else {
      notes.push(`Voltage mismatch: System operates at ${nominalV}V vs requested ${targetV}V.`);
    }
  }

  // 2. Continuous Power Rating
  let powerCompatible = false;
  if (!query.requiredPowerWatts || query.requiredPowerWatts <= 0) {
    powerCompatible = true;
  } else {
    if (specs.continuousPowerWatts >= query.requiredPowerWatts) {
      powerCompatible = true;
      const headroom = Math.round((specs.continuousPowerWatts - query.requiredPowerWatts) / query.requiredPowerWatts * 100);
      if (headroom > 0) {
        notes.push(`Provides ${headroom}% power safety headroom above requested ${query.requiredPowerWatts}W.`);
      }
    } else {
      notes.push(`Insufficient power: Continuous rating ${specs.continuousPowerWatts}W is below required ${query.requiredPowerWatts}W.`);
    }
  }

  // 3. Chemistry Check
  let chemistryCompatible = true;
  if (query.batteryChemistry && specs.batteryChemistry && specs.batteryChemistry !== 'N/A') {
    const qChem = query.batteryChemistry.toLowerCase();
    const pChem = specs.batteryChemistry.toLowerCase();
    if (qChem.includes(pChem) || pChem.includes(qChem)) {
      chemistryCompatible = true;
      notes.push(`Matched desired ${specs.batteryChemistry} chemistry.`);
    } else {
      chemistryCompatible = false;
      notes.push(`Chemistry differs: Requested ${query.batteryChemistry}, product is ${specs.batteryChemistry}.`);
    }
  }

  // 4. Connector Compatibility
  let connectorCompatible = true;
  if (query.connectorType && query.connectorType.trim() !== '') {
    const qConn = query.connectorType.toLowerCase();
    const pConn = specs.connectorType.toLowerCase();
    if (
      pConn.includes(qConn) ||
      qConn.includes(pConn) ||
      pConn.includes('terminal') ||
      pConn.includes('screw') ||
      pConn.includes('universal')
    ) {
      connectorCompatible = true;
    } else {
      connectorCompatible = false;
      notes.push(`Connector variation: Uses ${specs.connectorType}. Adapter or lug crimping recommended.`);
    }
  }

  // 5. Stock Check
  const stockAvailable = product.stockQuantity > 0;
  if (!stockAvailable) {
    notes.push('Out of stock currently.');
  }

  // Calculate estimated backup runtime
  let backupHoursEstimated = 0;
  if (specs.capacityAh && specs.capacityAh > 0 && query.requiredPowerWatts) {
    backupHoursEstimated = calculateBackupHours(
      specs.nominalVoltage,
      specs.capacityAh,
      specs.batteryChemistry,
      query.requiredPowerWatts
    );
  }

  // Overall compatibility is strictly bounded: NEVER bypass technical constraints or stock
  const isCompatible = voltageCompatible && powerCompatible && chemistryCompatible && stockAvailable;

  // Composite technical score (0 - 100)
  let score = 0;
  if (voltageCompatible) score += 40;
  if (powerCompatible) {
    const ratio = specs.continuousPowerWatts / Math.max(query.requiredPowerWatts || 1, 1);
    score += ratio >= 1.0 && ratio <= 2.5 ? 35 : 20;
  }
  if (chemistryCompatible) score += 15;
  if (connectorCompatible) score += 10;
  if (query.budget && product.price <= query.budget) {
    score += 5; // bonus within budget
  }

  return {
    isCompatible,
    voltageCompatible,
    powerCompatible,
    chemistryCompatible,
    connectorCompatible,
    stockAvailable,
    backupHoursEstimated,
    compatibilityScore: Math.min(100, Math.round(score)),
    notes
  };
}

export function rankProductsWithML(
  products: Product[],
  query: SmartRecommendationQuery
): { product: Product; check: CompatibilityCheck; explanation: string }[] {
  return products.map(product => {
    const check = evaluateCompatibility(product, query);
    
    let explanation = '';
    if (check.isCompatible) {
      explanation = `Fully compatible with ${product.specifications.nominalVoltage}V system and supports up to ${product.specifications.continuousPowerWatts}W continuous load.`;
      if (check.backupHoursEstimated > 0) {
        explanation += ` Estimated runtime: ~${check.backupHoursEstimated} hours.`;
      }
    } else {
      explanation = `Not recommended: ${check.notes.join(' ')}`;
    }

    return { product, check, explanation };
  }).sort((a, b) => {
    // Strictly sort compatible first, then by composite score, then by price proximity
    if (a.check.isCompatible !== b.check.isCompatible) {
      return a.check.isCompatible ? -1 : 1;
    }
    return b.check.compatibilityScore - a.check.compatibilityScore;
  });
}

export function findCheaperCompatibleAlternatives(
  referenceProduct: Product,
  allProducts: Product[],
  targetBudget?: number
): Product[] {
  const refSpecs = referenceProduct.specifications;
  return allProducts.filter(p => {
    if (p.id === referenceProduct.id) return false;
    if (p.stockQuantity <= 0) return false;
    if (p.price >= referenceProduct.price) return false; // Must be strictly cheaper

    // Check strict electrical compatibility with the reference product's baseline
    const vMatch = Math.abs(p.specifications.nominalVoltage - refSpecs.nominalVoltage) / refSpecs.nominalVoltage <= 0.10;
    const powerAdequate = p.specifications.continuousPowerWatts >= refSpecs.continuousPowerWatts * 0.75;
    const budgetFit = targetBudget ? p.price <= targetBudget : true;

    return vMatch && powerAdequate && budgetFit;
  }).sort((a, b) => a.price - b.price);
}
