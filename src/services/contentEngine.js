import { classifyRisk, ContentStatus } from "../domain/content.js";
import { findNearDuplicate } from "./duplicate.js";

function platformVariant(topic, platform) {
  const base = topic.summary || topic.title;
  const variants = {
    facebook: `${topic.title}\n\n${base}\n\n想了解更多旅遊內容，歡迎持續關注。`,
    instagram: `${topic.title}｜${base}\n\n#旅行 #旅遊靈感`,
    threads: `${topic.title}：${base}`,
    tiktok: `30 秒短影音腳本：${topic.title}。開場 3 秒提出問題，中段說明 ${base}，結尾加入 CTA。`,
    youtube: `Shorts 腳本：${topic.title}。60 秒內說明：${base}`
  };
  return variants[platform] ?? `${topic.title}\n${base}`;
}

export function generateContentBatch({ topic, platforms, history = [] }) {
  const riskLevel = classifyRisk(topic.sourceFacts || {});
  return platforms.map((platform, index) => {
    const body = platformVariant(topic, platform);
    const duplicate = findNearDuplicate(body, history);
    return {
      id: `${topic.id}-${platform}-${index + 1}`,
      topicId: topic.id,
      platform,
      body,
      riskLevel,
      duplicate,
      status: ContentStatus.GENERATED,
      sourceIds: topic.sourceIds ?? [],
      createdAt: new Date().toISOString()
    };
  });
}
