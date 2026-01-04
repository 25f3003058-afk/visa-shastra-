/**
 * Insight Model
 * Represents AI-generated insights from payment data
 */
class Insight {
  constructor(data) {
    this.id = data.id || this.generateId();
    this.reportId = data.reportId;
    this.type = data.type; // 'anomaly', 'trend', 'prediction', 'recommendation'
    this.title = data.title;
    this.description = data.description;
    this.severity = data.severity; // 'low', 'medium', 'high', 'critical'
    this.confidence = data.confidence || 0.8; // 0-1
    this.data = data.data || {};
    this.createdAt = data.createdAt || new Date();
    this.aiModel = data.aiModel || 'gpt-4';
    this.actionable = data.actionable || false;
    this.recommendations = data.recommendations || [];
  }

  generateId() {
    return `INS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  toJSON() {
    return {
      id: this.id,
      reportId: this.reportId,
      type: this.type,
      title: this.title,
      description: this.description,
      severity: this.severity,
      confidence: this.confidence,
      data: this.data,
      createdAt: this.createdAt,
      aiModel: this.aiModel,
      actionable: this.actionable,
      recommendations: this.recommendations
    };
  }
}

module.exports = Insight;
