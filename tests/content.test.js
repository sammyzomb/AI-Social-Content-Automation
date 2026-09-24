import test from "node:test";
import assert from "node:assert/strict";
import { ContentStatus, transitionContent, RiskLevel, classifyRisk } from "../src/domain/content.js";
import { jaccardSimilarity, findNearDuplicate } from "../src/services/duplicate.js";
import { generateContentBatch } from "../src/services/contentEngine.js";
import { qualityCheck } from "../src/services/qualityEngine.js";
import { MockPublisher } from "../src/services/mockPublisher.js";

test("risk classification protects price/date/legal content", () => {
  assert.equal(classifyRisk({}), RiskLevel.GREEN);
  assert.equal(classifyRisk({ price: 1000 }), RiskLevel.YELLOW);
  assert.equal(classifyRisk({ visaRule: true }), RiskLevel.RED);
});

test("duplicate detector identifies similar content", () => {
  assert.ok(jaccardSimilarity("冬季 羅浮敦 極光 旅行", "冬季 羅浮敦 極光 旅遊") > 0.5);
  const hit = findNearDuplicate("羅浮敦 冬季 極光", [{ id: "old", text: "羅浮敦 冬季 極光" }]);
  assert.equal(hit.id, "old");
});

test("green content reaches READY", () => {
  const [item] = generateContentBatch({
    topic: {
      id: "t1",
      title: "羅浮敦冬季",
      summary: "雪景與極光旅行資訊整理，適合規劃冬季旅程。",
      sourceIds: ["s1"],
      sourceFacts: {}
    },
    platforms: ["facebook"]
  });
  const checked = qualityCheck(item);
  assert.equal(checked.content.status, ContentStatus.READY);
});

test("yellow content requires review", () => {
  const [item] = generateContentBatch({
    topic: {
      id: "t2",
      title: "講座資訊",
      summary: "活動日期與報名資訊請依官方資料為準。",
      sourceIds: ["s2"],
      sourceFacts: { eventDate: "2026-10-01" }
    },
    platforms: ["facebook"]
  });
  const checked = qualityCheck(item);
  assert.equal(checked.content.status, ContentStatus.NEEDS_REVIEW);
});

test("mock publisher is idempotent", () => {
  const publisher = new MockPublisher();
  const content = {
    id: "p1",
    platform: "threads",
    status: ContentStatus.READY,
    updatedAt: new Date().toISOString()
  };
  const scheduled = transitionContent(content, ContentStatus.SCHEDULED);
  const first = publisher.publish(scheduled);
  const second = publisher.publish(scheduled);
  assert.equal(first.externalId, second.externalId);
  assert.equal(first.content.status, ContentStatus.PUBLISHED);
});
