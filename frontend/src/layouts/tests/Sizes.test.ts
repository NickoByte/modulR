import { describe, expect, test } from "vitest";
import { FractionSize, PercentageSize } from "../Sizes";

const percentageCases = [
  [20, 10, 2],
  [0, 10, 0],
  [100, 10, 10],
];
describe("PercentageSize", () => {
  describe("asUnitSize", () => {
    test.each(percentageCases)(
      "given %d% of total length equal to %d, returns %d",
      (percentage, totalLength, expectedResult) => {
        const percentageSize = new PercentageSize(percentage);
        const unitSize = percentageSize.asUnitSize(totalLength);
        expect(unitSize.value).toBe(expectedResult);
      }
    );
  });
});

const fractionCases = [
  [1, 1, 10, 10],
  [1, 2, 10, 5],
  [2, 2, 10, 10],
];
describe("FractionSize", () => {
  describe("asUnitSize", () => {
    test.each(fractionCases)(
      "given fraction value equal to %d, total fractions equal to %d and remaining space equal to %d, returns %d",
      (fraction, totalFractions, remainingSpace, expectedResult) => {
        const fractionSize = new FractionSize(fraction);
        const unitSize = fractionSize.asUnitSize(
          remainingSpace,
          totalFractions
        );
        expect(unitSize.value).toBe(expectedResult);
      }
    );
  });
});
