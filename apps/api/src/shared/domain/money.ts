import { Currency } from "@shared/domain/currency.js";
import { MoneyError } from "@shared/domain/error/money.error.js";

export class Money {
  private constructor(
    private readonly amountMinor: bigint,
    private readonly currency: Currency,
  ) {}

  static of(amountMinor: bigint, currency: Currency): Money {
    return new Money(amountMinor, currency);
  }

  add(other: Money): Money {
    if (!this.hasSameCurrency(other.currency)) {
      throw MoneyError.currencyMismatch();
    }

    return new Money(this.amountMinor + other.amountMinor, this.currency);
  }

  subtract(other: Money): Money {
    if (!this.hasSameCurrency(other.currency)) {
      throw MoneyError.currencyMismatch();
    }

    return new Money(this.amountMinor - other.amountMinor, this.currency);
  }

  equals(other: Money): boolean {
    return (
      this.amountMinor === other.amountMinor && this.currency === other.currency
    );
  }

  isNegative(): boolean {
    return this.amountMinor < 0n;
  }

  isZero(): boolean {
    return this.amountMinor === 0n;
  }

  isPositive(): boolean {
    return this.amountMinor > 0n;
  }

  greaterThan(other: Money): boolean {
    if (!this.hasSameCurrency(other.currency)) {
      throw MoneyError.currencyMismatch();
    }

    return this.amountMinor > other.amountMinor;
  }

  lessThan(other: Money): boolean {
    if (!this.hasSameCurrency(other.currency)) {
      throw MoneyError.currencyMismatch();
    }

    return this.amountMinor < other.amountMinor;
  }

  private hasSameCurrency(otherCurrency: Currency): boolean {
    return otherCurrency === this.currency;
  }
}
