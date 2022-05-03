import redis = require("redis");
import { LOGGER } from "./logger";

// Pair of [URL, Redis client].
export let REDIS_CLIENTS = new Array<[string, redis.RedisClientType]>();

// URL format is `${host}:${port}`
export async function createRedisClients(
  ...urls: Array<string>
): Promise<void> {
  for (let url of urls) {
    let client: redis.RedisClientType = redis.createClient({
      url: `redis://${url}`,
    });
    client.on("error", (err) => {
      LOGGER.error(`Redis client error for url ${url}: ${err}.`);
      throw new Error(`Redis client error for url ${url}: ${err}.`);
    });
    REDIS_CLIENTS.push([url, client]);
  }
  await Promise.all(
    REDIS_CLIENTS.map(([url, client]) => {
      return client.connect();
    })
  );
}
