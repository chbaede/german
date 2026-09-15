/**
 * German Family Tools: Kindergeld Reference & School Holiday Finder
 */
const FamilyTools = {
  // Current Kindergeld rate per child per month
  KINDERGELD_PER_CHILD: 250,

  calculateKindergeld(numChildren) {
    const count = Math.max(0, parseInt(numChildren || 1, 10));
    const monthlyTotal = count * this.KINDERGELD_PER_CHILD;
    const annualTotal = monthlyTotal * 12;

    return {
      numChildren: count,
      ratePerChild: this.KINDERGELD_PER_CHILD,
      monthlyTotal,
      annualTotal
    };
  },

  getSchoolHolidaysForState(year, stateCode) {
    return GERMAN_SCHOOL_HOLIDAYS.getSchoolHolidays(year, stateCode);
  }
};
