import {constrainValueToRange} from "../range";

test('constrainValueToRange correctly', () => {
  expect(constrainValueToRange(10, 0, 100)).toBe(10);
  expect(constrainValueToRange(-100, 0, 10)).toBe(0);
  expect(constrainValueToRange(1000, -99, 65)).toBe(65);
})