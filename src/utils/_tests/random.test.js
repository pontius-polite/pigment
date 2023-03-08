import { randomInt, randomNum } from '../random';

describe('Random utility', () => {
  
  test('generates random integer correctly', () => {
    expect(randomInt(10, 10)).toBe(10);

    for (let i = 0; i < 100; i += 1) {
      const r1 = randomInt(0, 1);
      expect(r1 <= 1).toBe(true);
      expect(r1 >= 0).toBe(true);

      const r2 = randomInt(-100, i);
      expect(r2 <= i).toBe(true);
      expect(r2 >= -100).toBe(true);
    }
  })

  test('generates random decimal correctly', () => {
    expect(randomNum(10, 10)).toBe(10);

    for (let i = 0; i < 100; i += 1) {
      const r1 = randomNum(0, 100);
      expect(r1 < 100).toBe(true);
      expect(r1 >= 0).toBe(true);

      const r2 = randomNum(-100, i);
      expect(r2 <= i).toBe(true);
      expect(r2 >= -100).toBe(true);
    }
  })
})