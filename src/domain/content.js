export const ContentStatus = Object.freeze({
  DRAFT: "DRAFT",
  GENERATED: "GENERATED",
  CHECKING: "CHECKING",
  NEEDS_REVIEW: "NEEDS_REVIEW",
  READY: "READY",
  SCHEDULED: "SCHEDULED",
  PUBLISHING: "PUBLISHING",
  PUBLISHED: "PUBLISHED",
  FAILED: "FAILED"
});

export const RiskLevel = Object.freeze({
  GREEN: "GREEN",
  YELLOW: "YELLOW",
  RED: "RED"
});

const allowedTransitions = {
  DRAFT: ["GENERATED", "FAILED"],
  GENERATED: ["CHECKING", "FAILED"],
  CHECKING: ["READY", "NEEDS_REVIEW", "FAILED"],
  NEEDS_REVIEW: ["READY", "FAILED"],
  READY: ["SCHEDULED", "FAILED"],
  SCHEDULED: ["PUBLISHING", "FAILED"],
  PUBLISHING: ["PUBLISHED", "FAILED"],
  PUBLISHED: [],
  FAILED: []
};

export function transitionContent(content, nextStatus) {
  const allowed = allowedTransitions[content.status] ?? [];
  if (!allowed.includes(nextStatus)) {
    throw new Error(`Invalid content transition: ${content.status} -> ${nextStatus}`);
  }
  return {
    ...content,
    status: nextStatus,
    updatedAt: new Date().toISOString()
  };
}

export function classifyRisk(source = {}) {
  if (source.safetyEvent || source.visaRule || source.legalRule) return RiskLevel.RED;
  if (source.price || source.eventDate || source.promotion) return RiskLevel.YELLOW;
  return RiskLevel.GREEN;
}
