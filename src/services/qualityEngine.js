import { ContentStatus, RiskLevel, transitionContent } from "../domain/content.js";

export function qualityCheck(content) {
  let checked = transitionContent(content, ContentStatus.CHECKING);

  const problems = [];
  if (!checked.body || checked.body.trim().length < 20) problems.push("content_too_short");
  if (checked.duplicate) problems.push("near_duplicate");
  if (!Array.isArray(checked.sourceIds) || checked.sourceIds.length === 0) {
    problems.push("missing_source");
  }

  if (checked.riskLevel === RiskLevel.RED) {
    return {
      content: transitionContent(checked, ContentStatus.NEEDS_REVIEW),
      problems: [...problems, "red_risk_requires_manual_review"]
    };
  }

  if (checked.riskLevel === RiskLevel.YELLOW || problems.length > 0) {
    return {
      content: transitionContent(checked, ContentStatus.NEEDS_REVIEW),
      problems
    };
  }

  return {
    content: transitionContent(checked, ContentStatus.READY),
    problems: []
  };
}
