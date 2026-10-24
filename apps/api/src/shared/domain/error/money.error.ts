import { DomainError } from "@shared/domain/error/domain.error.js";

export class MoneyError extends DomainError {
  static currencyMismatch() {
    return new MoneyError(
      "Cannot manipulate different currencies in the same operation.",
    );
  }
}
