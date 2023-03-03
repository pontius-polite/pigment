import Point from '../Point';

describe("Point", () => {
  const p1 = new Point(0, 1);
  const p2 = new Point(3, 4);
  
  test('initializes correctly', () => {
    expect(p1.x).toBe(0);
    expect(p1.y).toBe(1);
    expect(p2.x).toBe(3);
    expect(p2.y).toBe(4);
  })

  test('is correct distance from origin', () => {
    expect(p1.distanceFromOrigin()).toBe(1);
    expect(p2.distanceFromOrigin()).toBe(5);
  })

  test('is correct distance from other point', () => {
    expect(p1.distanceFrom(new Point(0, 0))).toBe(1);
    expect(p1.distanceFrom(new Point(-10, 1))).toBe(10);
  })

  test('adds to other point correctly', () => {
    expect(p1.addTo(p2).x).toBe(3);
    expect(p1.addTo(p2).y).toBe(5);
  })

  test('interpolates between other point correctly', () => {
    const points = p1.interpolatePointsBetween(new Point(10, 1), 9);
    for (let i = 0; i < points.length; i += 1) {
      expect(points[i].x).toBe(i + 1);
      expect(points[i].y).toBe(1);
    }
  })
})