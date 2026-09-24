import { ContentStatus, transitionContent } from "./domain/content.js";
import { generateContentBatch } from "./services/contentEngine.js";
import { qualityCheck } from "./services/qualityEngine.js";
import { MockPublisher } from "./services/mockPublisher.js";

const topic = {
  id: "topic-lofoten-winter",
  title: "冬季羅浮敦群島值得去嗎？",
  summary: "冬季可看到雪景、極光與低角度光線，但需要留意日照時間與天候。",
  sourceIds: ["travel-source-001"],
  sourceFacts: {}
};

const generated = generateContentBatch({
  topic,
  platforms: ["facebook", "instagram", "threads", "tiktok", "youtube"]
});

const publisher = new MockPublisher();
const output = [];

for (const item of generated) {
  const checked = qualityCheck(item);
  if (checked.content.status !== ContentStatus.READY) {
    output.push({ id: item.id, status: checked.content.status, problems: checked.problems });
    continue;
  }
  const scheduled = transitionContent(checked.content, ContentStatus.SCHEDULED);
  output.push(publisher.publish(scheduled));
}

console.log(JSON.stringify(output, null, 2));
