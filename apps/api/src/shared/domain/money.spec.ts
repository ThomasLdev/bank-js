import { MoneyError } from "./error/money.error.js";
import { Money } from "./money.js";

const eur = (amountMinor: bigint) => Money.of(amountMinor, "EUR");
const usd = (amountMinor: bigint) => Money.of(amountMinor, "USD");

describe("Money", () => {
  describe("add", () => {
    it.each([
      { a: 1000n, b: 250n, expected: 1250n },
      { a: 1000n, b: -250n, expected: 750n },
      { a: -1000n, b: 250n, expected: -750n },
      { a: 0n, b: 0n, expected: 0n },
    ])("$a + $b = $expected", ({ a, b, expected }) => {
      expect(eur(a).add(eur(b))).toEqual(eur(expected));
    });

    it("does not mutate its operands", () => {
      const a = eur(1000n);
      const b = eur(250n);

      a.add(b);

      expect(a).toEqual(eur(1000n));
      expect(b).toEqual(eur(250n));
    });
  });

  describe("subtract", () => {
    it.each([
      { a: 1000n, b: 250n, expected: 750n },
      { a: 250n, b: 1000n, expected: -750n },
      { a: 1000n, b: 1000n, expected: 0n },
      { a: 0n, b: -250n, expected: 250n },
    ])("$a - $b = $expected", ({ a, b, expected }) => {
      expect(eur(a).subtract(eur(b))).toEqual(eur(expected));
    });

    it("does not mutate its operands", () => {
      const a = eur(1000n);
      const b = eur(250n);

      a.subtract(b);

      expect(a).toEqual(eur(1000n));
      expect(b).toEqual(eur(250n));
    });
  });

  describe("equals", () => {
    it.each([
      {
        case: "same amount, same currency",
        a: eur(1000n),
        b: eur(1000n),
        expected: true,
      },
      {
        case: "different amounts, same currency",
        a: eur(1000n),
        b: eur(250n),
        expected: false,
      },
      {
        case: "same amount, different currencies",
        a: eur(1000n),
        b: usd(1000n),
        expected: false,
      },
      {
        case: "different amounts, different currencies",
        a: eur(1000n),
        b: usd(250n),
        expected: false,
      },
    ])("is $expected for $case", ({ a, b, expected }) => {
      expect(a.equals(b)).toBe(expected);
    });
  });

  describe("sign", () => {
    it.each([
      { amount: -10n, isNegative: true, isZero: false, isPositive: false },
      { amount: 0n, isNegative: false, isZero: true, isPositive: false },
      { amount: 10n, isNegative: false, isZero: false, isPositive: true },
    ])("reports the sign of $amount", ({
      amount,
      isNegative,
      isZero,
      isPositive,
    }) => {
      const money = eur(amount);

      expect(money.isNegative()).toBe(isNegative);
      expect(money.isZero()).toBe(isZero);
      expect(money.isPositive()).toBe(isPositive);
    });
  });

  describe("greaterThan", () => {
    it.each([
      { a: 1000n, b: 250n, expected: true },
      { a: 250n, b: 1000n, expected: false },
      { a: 1000n, b: 1000n, expected: false },
      { a: 0n, b: -10n, expected: true },
    ])("$a > $b is $expected", ({ a, b, expected }) => {
      expect(eur(a).greaterThan(eur(b))).toBe(expected);
    });
  });

  describe("lessThan", () => {
    it.each([
      { a: 250n, b: 1000n, expected: true },
      { a: 1000n, b: 250n, expected: false },
      { a: 1000n, b: 1000n, expected: false },
      { a: -10n, b: 0n, expected: true },
    ])("$a < $b is $expected", ({ a, b, expected }) => {
      expect(eur(a).lessThan(eur(b))).toBe(expected);
    });
  });

  describe("currency mismatch", () => {
    it.each([
      { operation: "add", act: (a: Money, b: Money) => a.add(b) },
      { operation: "subtract", act: (a: Money, b: Money) => a.subtract(b) },
      {
        operation: "greaterThan",
        act: (a: Money, b: Money) => a.greaterThan(b),
      },
      { operation: "lessThan", act: (a: Money, b: Money) => a.lessThan(b) },
    ])("$operation throws when currencies differ", ({ act }) => {
      expect(() => act(eur(1000n), usd(250n))).toThrow(MoneyError);
    });
  });

  describe("typing", () => {
    it("rejects a plain object shaped like Money (checked by `pnpm typecheck`)", () => {
      // @ts-expect-error private fields make Money nominal: a look-alike literal is not a Money
      const fake: Money = { amountMinor: 1000n, currency: "EUR" };

      expect(fake).toBeDefined();
    });
  });
});
