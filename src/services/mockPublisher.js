import { ContentStatus, transitionContent } from "../domain/content.js";

export class MockPublisher {
  constructor() {
    this.published = new Map();
  }

  publish(content) {
    if (content.status !== ContentStatus.SCHEDULED) {
      throw new Error("Only SCHEDULED content can be published");
    }

    const idempotencyKey = `${content.id}:${content.platform}`;
    if (this.published.has(idempotencyKey)) {
      return this.published.get(idempotencyKey);
    }

    const publishing = transitionContent(content, ContentStatus.PUBLISHING);
    const result = {
      content: transitionContent(publishing, ContentStatus.PUBLISHED),
      externalId: `mock-${content.platform}-${content.id}`,
      url: `https://example.invalid/${content.platform}/${content.id}`,
      idempotencyKey,
      publishedAt: new Date().toISOString()
    };

    this.published.set(idempotencyKey, result);
    return result;
  }
}
