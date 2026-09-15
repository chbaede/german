/**
 * Moving Cost Calculator (Umzugskosten)
 */
const MovingCalculator = {
  calculateMovingCost(params) {
    const movingCompany = Math.max(0, GLTUtils.parseNumber(params.movingCompany, 0));
    const truckRental = Math.max(0, GLTUtils.parseNumber(params.truckRental, 0));
    const boxesPacking = Math.max(0, GLTUtils.parseNumber(params.boxesPacking, 0));
    const cleaningRenovation = Math.max(0, GLTUtils.parseNumber(params.cleaningRenovation, 0));
    const depositAmount = Math.max(0, GLTUtils.parseNumber(params.depositAmount, 0));
    const newFurniture = Math.max(0, GLTUtils.parseNumber(params.newFurniture, 0));
    const mailForwarding = Math.max(0, GLTUtils.parseNumber(params.mailForwarding, 0));
    const otherCosts = Math.max(0, GLTUtils.parseNumber(params.otherCosts, 0));

    const total = movingCompany + truckRental + boxesPacking + cleaningRenovation + depositAmount + newFurniture + mailForwarding + otherCosts;

    return {
      movingCompany,
      truckRental,
      boxesPacking,
      cleaningRenovation,
      depositAmount,
      newFurniture,
      mailForwarding,
      otherCosts,
      total
    };
  }
};
