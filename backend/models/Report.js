/**
 * Report Model
 * Represents a payment report with transactions and metadata
 */
class Report {
  constructor(data) {
    this.id = data.id || this.generateId();
    this.title = data.title;
    this.type = data.type; // 'transaction', 'settlement', 'chargeback', 'reconciliation'
    this.period = data.period; // { start: Date, end: Date }
    this.transactions = data.transactions || [];
    this.summary = data.summary || {};
    this.status = data.status || 'active';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.metadata = data.metadata || {};
  }

  generateId() {
    return `RPT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  addTransaction(transaction) {
    this.transactions.push(transaction);
    this.updateSummary();
  }

  updateSummary() {
    this.summary = {
      totalTransactions: this.transactions.length,
      totalAmount: this.transactions.reduce((sum, t) => sum + t.amount, 0),
      successfulTransactions: this.transactions.filter(t => t.status === 'success').length,
      failedTransactions: this.transactions.filter(t => t.status === 'failed').length,
      averageAmount: this.transactions.length > 0 
        ? this.transactions.reduce((sum, t) => sum + t.amount, 0) / this.transactions.length 
        : 0
    };
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      type: this.type,
      period: this.period,
      transactions: this.transactions,
      summary: this.summary,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      metadata: this.metadata
    };
  }
}

module.exports = Report;
