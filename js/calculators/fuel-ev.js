/**
 * Fuel & EV Charging Cost Calculation Engines
 */
const FuelAndEVCalculator = {
  /**
   * Calculate fuel cost for a trip or period
   */
  calculateFuel(distanceKm, consumption, unit, pricePerLiter) {
    const dist = Math.max(0, GLTUtils.parseNumber(distanceKm, 0));
    let rawCons = Math.max(0.1, GLTUtils.parseNumber(consumption, 6.5));
    const price = Math.max(0, GLTUtils.parseNumber(pricePerLiter, 1.75));

    // Convert km/L to L/100km if needed
    let l100km = (unit === "kmPerLiter") ? (100 / rawCons) : rawCons;

    const fuelRequiredLiters = (dist / 100) * l100km;
    const totalCost = fuelRequiredLiters * price;
    const costPer100km = (dist > 0) ? (totalCost / dist) * 100 : l100km * price;
    const costPerKm = (dist > 0) ? totalCost / dist : costPer100km / 100;

    return {
      distanceKm: dist,
      fuelRequiredLiters,
      totalCost,
      costPer100km,
      costPerKm
    };
  },

  /**
   * Calculate EV charging cost & per-100km rates
   */
  calculateEV(batteryCapacityKwh, startPct, targetPct, pricePerKwh, consumptionKwh100) {
    const capacity = Math.max(5, GLTUtils.parseNumber(batteryCapacityKwh, 60));
    const start = Math.max(0, Math.min(100, GLTUtils.parseNumber(startPct, 10)));
    const target = Math.max(start, Math.min(100, GLTUtils.parseNumber(targetPct, 80)));
    const price = Math.max(0, GLTUtils.parseNumber(pricePerKwh, 0.35));
    const consumption = Math.max(5, GLTUtils.parseNumber(consumptionKwh100, 18));

    const pctToAdd = (target - start) / 100;
    const energyAddedKwh = capacity * pctToAdd;
    const sessionCost = energyAddedKwh * price;
    const costPer100km = consumption * price;
    const costPerKm = costPer100km / 100;

    // Comparison benchmark: Gas car with 7.0 L/100km @ €1.75 = €12.25/100km
    const gasBenchmark100km = 12.25;
    const savingsPer100km = Math.max(0, gasBenchmark100km - costPer100km);

    return {
      energyAddedKwh,
      sessionCost,
      costPer100km,
      costPerKm,
      savingsPer100km
    };
  }
};

