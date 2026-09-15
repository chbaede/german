/**
 * German Housing, Rent & Rental Deposit (Mietkaution) Calculator Engine
 */
const RentCalculator = {
  /**
   * Calculate Warmmiete & Total Monthly Housing Costs
   */
  calculateRent(params) {
    const kaltmiete = Math.max(0, GLTUtils.parseNumber(params.kaltmiete, 0));
    const nebenkosten = Math.max(0, GLTUtils.parseNumber(params.nebenkosten, 0));
    const isHeatingIncluded = Boolean(params.isHeatingIncluded);
    const extraHeating = isHeatingIncluded ? 0 : Math.max(0, GLTUtils.parseNumber(params.extraHeating, 0));
    const electricity = Math.max(0, GLTUtils.parseNumber(params.electricity, 0));
    const internet = Math.max(0, GLTUtils.parseNumber(params.internet, 0));
    const gezFee = params.includeGez !== false ? 18.36 : 0; // GEZ Rundfunkbeitrag is standard €18.36/mo
    const otherCosts = Math.max(0, GLTUtils.parseNumber(params.otherCosts, 0));
    const netIncome = Math.max(0, GLTUtils.parseNumber(params.netIncome, 0));

    const warmmiete = kaltmiete + nebenkosten + extraHeating;
    const totalHousingMonthly = warmmiete + electricity + internet + gezFee + otherCosts;
    const totalHousingAnnual = totalHousingMonthly * 12;

    const rentRatio = netIncome > 0 ? (totalHousingMonthly / netIncome) * 100 : null;

    return {
      kaltmiete,
      nebenkosten,
      extraHeating,
      warmmiete,
      electricity,
      internet,
      gezFee,
      otherCosts,
      totalHousingMonthly,
      totalHousingAnnual,
      rentRatio
    };
  },

  /**
   * Calculate German Rental Deposit (Kaution) under BGB § 551
   */
  calculateDeposit(kaltmieteAmount) {
    const kalt = Math.max(0, GLTUtils.parseNumber(kaltmieteAmount, 0));
    const maxKaution = kalt * 3; // Legally capped at 3 net cold rents
    const installment1 = maxKaution / 3;
    const installment2 = maxKaution / 3;
    const installment3 = maxKaution / 3;
    const moveInLiquidity = kalt + installment1; // 1st month rent + 1st installment

    return {
      kaltmiete: kalt,
      maxKaution,
      installment1,
      installment2,
      installment3,
      moveInLiquidity
    };
  }
};

