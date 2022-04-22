import crypto = require("crypto");
import redis = require("redis");
import { Reaction } from "../../interface/post_entry";
import { REDIS_CLIENTS } from "./redis_clients";

export class PostEntryRedisCounter {
  private static SHARDS_PER_CLIENT = ["1", "2"];

  public constructor(
    private redisClients: Array<[string, redis.RedisClientType]>
  ) {}

  public static create(): void {
    POST_ENTRY_REDIS_COUNTER = new PostEntryRedisCounter(REDIS_CLIENTS);
  }

  public async incView(postEntryId: string): Promise<void> {
    let [client, shard] = this.getClientAndShard(postEntryId);
    await client
      .multi()
      .sAdd(shard, postEntryId)
      .hIncrBy(postEntryId, "views", 1)
      .exec();
  }

  public async incReact(
    postEntryId: string,
    reaction: Reaction
  ): Promise<void> {
    let [client, shard] = this.getClientAndShard(postEntryId);
    await client
      .multi()
      .sAdd(shard, postEntryId)
      .hIncrBy(postEntryId, Reaction[reaction], 1)
      .exec();
  }

  private getClientAndShard(
    postEntryId: string
  ): [redis.RedisClientType, string] {
    let clientChosen: redis.RedisClientType;
    let shardChosen: string;
    let highestWeight = "";
    for (let [url, client] of this.redisClients) {
      for (let shard of PostEntryRedisCounter.SHARDS_PER_CLIENT) {
        let weight = crypto
          .createHash("sha256")
          .update(`${url}:${shard}:${postEntryId}`)
          .digest("hex");
        if (highestWeight < weight) {
          highestWeight = weight;
          clientChosen = client;
          shardChosen = shard;
        }
      }
    }
    return [clientChosen, shardChosen];
  }
}

export let POST_ENTRY_REDIS_COUNTER: PostEntryRedisCounter;
