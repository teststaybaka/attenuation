import {
  ExpiredQueryBuilder,
  POST_ENTRY_MODEL,
} from "../data_model/post_entry_model";
import { PubSub } from "@google-cloud/pubsub";
import { DatastoreClient } from "@selfage/datastore_client";

export class ExpiredPostEntriesCleaner {
  public constructor(
    private pubSub: PubSub,
    private datastoreClient: DatastoreClient,
    private getNow: () => number
  ) {}

  public static create(): ExpiredPostEntriesCleaner {
    return new ExpiredPostEntriesCleaner(
      new PubSub(),
      DatastoreClient.create(),
      () => Date.now()
    ).init();
  }

  public init(): this {
    let subscription = this.pubSub.subscription("CleanExpiredPostEntriesSub");
    subscription.on("message", (message) => this.handle(message));
    return this;
  }

  public async handle(message: any): Promise<void> {
    let deletionPromises = new Array<Promise<void>>();
    let cursor: string;
    for (let i = 0; i < 100; i++) {
      let response = await this.datastoreClient.query(
        new ExpiredQueryBuilder()
          .lessThanExpiration(this.getNow() / 1000)
          .start(cursor)
          .limit(100)
          .build()
      );
      let ids = response.values.map((postEntry) => postEntry.id);
      deletionPromises.push(this.datastoreClient.delete(ids, POST_ENTRY_MODEL));
      if (!response.cursor) {
        cursor = response.cursor;
      } else {
        break;
      }
    }
    if (!cursor) {
      console.warn("Too many post entries to clean up.");
    }
    message.ack();
    await Promise.all(deletionPromises);
  }
}
