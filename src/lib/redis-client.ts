// import { Redis } from '@upstash/redis';
import Redis from 'ioredis';

const redis = new Redis({
	// url: process.env.KV_REST_API_URL,
	// token: process.env.KV_REST_API_TOKEN,
	host: process.env.REDIS_HOST,
	port: Number(process.env.REDIS_PORT),
	password: process.env.REDIS_PASSWORD,
	retryStrategy: () => null,
	enableOfflineQueue: false,
	maxRetriesPerRequest: 0,
});

redis.on('error', () => {});

export default redis;
