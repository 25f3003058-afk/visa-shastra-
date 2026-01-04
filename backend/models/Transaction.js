/**
 * Transaction Model
 * Represents an individual payment transaction
 */
class Transaction {
  constructor(data) {
    this.id = data.id || this.generateId();
    this.amount = data.amount;
    this.currency = data.currency || 'USD';
    this.status = data.status; // 'success', 'failed', 'pending', 'refunded'
    this.type = data.type; // 'purchase', 'refund', 'chargeback'
    this.merchant = data.merchant;
    this.customer = data.customer;
    this.cardType = data.cardType; // 'visa', 'mastercard', 'amex', etc.
    this.timestamp = data.timestamp || new Date();
    this.metadata = data.metadata || {};
  }

  generateId() {
    return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  toJSON() {
    return {
      id: this.id,
      amount: this.amount,
      currency: this.currency,
      status: this.status,
      type: this.type,
      merchant: this.merchant,
      customer: this.customer,
      cardType: this.cardType,
      timestamp: this.timestamp,
      metadata: this.metadata
    };
  }
}

module.exports = Transaction;
