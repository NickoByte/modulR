export interface ElementSize {
  value: number;
}

export class UnitSize implements ElementSize {
  constructor(public value: number) {}
}

export class PercentageSize implements ElementSize {
  constructor(public value: number) {}

  asUnitSize(totalLenght: number): ElementSize {
    return Size.Unit((this.value / 100) * totalLenght);
  }
}

export class FractionSize implements ElementSize {
  constructor(public value: number) {}

  asUnitSize(remainingSpace: number, totalFractions: number): ElementSize {
    return Size.Unit((this.value / totalFractions) * remainingSpace);
  }
}

export const Size = {
  Unit: (value: number) => new UnitSize(value),
  Fraction: (value: number) => new FractionSize(value),
  Percentage: (value: number) => new PercentageSize(value),
};
