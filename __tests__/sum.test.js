const { describe, expect, test } = require("@jest/globals");

const sum = (value1, value2) => {
  return value1 + value2;
};

describe("sum module", () => {
  test("adds 1 + 2 to equal 3", () => {
    expect(sum(1, 2)).toBe(3);
  });

  test("adds 1 + 3 to not equal 3", () => {
    expect(sum(1, 3)).not.toBe(3);
  });
});
