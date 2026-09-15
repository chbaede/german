/**
 * German Car Ownership Total Cost of Ownership (TCO) Calculator Engine
 */
const CarCalculator = {
  calculateCarCost(params) {
    const monthlyFinancing = Math.max(0, GLTUtils.parseNumber(params.monthlyFinancing, 0));
    const annualKm = Math.max(100, GLTUtils.parseNumber(params.annualKm, 15000));
    const powertrain = params.powertrain || "petrol";
    const fuelConsumption = Math.max(0, GLTUtils.parseNumber(params.fuelConsumption, 6.5));
    const fuelPrice = Math.max(0, GLTUtils.parseNumber(params.fuelPrice, 1.75));
    const insuranceAnnual = Math.max(0, GLTUtils.parseNumber(params.insuranceAnnual, 650));
    const taxAnnual = Math.max(0, GLTUtils.parseNumber(params.taxAnnual, 150));
    const maintenanceAnnual = Math.max(0, GLTUtils.parseNumber(params.maintenanceAnnual, 450));
    const parkingMonthly = Math.max(0, GLTUtils.parseNumber(params.parkingMonthly, 0));
    const tiresAnnual = Math.max(0, GLTUtils.parseNumber(params.tiresAnnual, 200));
    const otherMonthly = Math.max(0, GLTUtils.parseNumber(params.otherMonthly, 0));

    // Annual fuel / energy cost
    const annualFuelCost = (annualKm / 100) * fuelConsumption * fuelPrice;

    // Annual fixed & recurring costs
    const annualFinancing = monthlyFinancing * 12;
    const annualParking = parkingMonthly * 12;
    const annualOther = otherMonthly * 12;

    const totalAnnualCost = annualFinancing + annualFuelCost + insuranceAnnual + taxAnnual + maintenanceAnnual + annualParking + tiresAnnual + annualOther;
    const monthlyCost = totalAnnualCost / 12;
    const costPerKm = totalAnnualCost / annualKm;
    const threeYearCost = totalAnnualCost * 3;
    const fiveYearCost = totalAnnualCost * 5;

    // Powertrain benchmark comparison (ICE vs Hybrid vs EV on the same annual km and base financing)
    // Gasoline: 7.2 L/100km @ €1.78, tax ~€160, maint ~€450
    const iceFuel = (annualKm / 100) * 7.2 * 1.78;
    const iceAnnual = annualFinancing + iceFuel + insuranceAnnual + 160 + 450 + annualParking + tiresAnnual;

    // Hybrid: 4.8 L/100km @ €1.78, tax ~€90, maint ~€420
    const hybridFuel = (annualKm / 100) * 4.8 * 1.78;
    const hybridAnnual = annualFinancing + hybridFuel + insuranceAnnual + 90 + 420 + annualParking + tiresAnnual;

    // EV: 17.5 kWh/100km @ €0.36, tax €0 (exempt in DE), maint ~€280
    const evEnergy = (annualKm / 100) * 17.5 * 0.36;
    const evAnnual = annualFinancing + evEnergy + insuranceAnnual + 0 + 280 + annualParking + tiresAnnual;

    return {
      monthlyCost,
      annualCost: totalAnnualCost,
      annualFuelCost,
      costPerKm,
      threeYearCost,
      fiveYearCost,
      comparison: {
        ice: { annual: iceAnnual, monthly: iceAnnual / 12, perKm: iceAnnual / annualKm },
        hybrid: { annual: hybridAnnual, monthly: hybridAnnual / 12, perKm: hybridAnnual / annualKm },
        ev: { annual: evAnnual, monthly: evAnnual / 12, perKm: evAnnual / annualKm }
      }
    };
  }
};

