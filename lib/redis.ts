import { createClient } from 'redis'

const redisClient = createClient({
  url: process.env.REDIS_URL
})

redisClient.on('error', (err) => console.log('Redis Client Error', err))

export async function cacheData(key: string, data: any, expirationInSeconds: number = 3600) {
  await redisClient.set(key, JSON.stringify(data), {
    EX: expirationInSeconds
  })
}

export async function getCachedData(key: string) {
  const cachedData = await redisClient.get(key)
  return cachedData ? JSON.parse(cachedData) : null
}

export async function invalidateCache(key: string) {
  await redisClient.del(key)
}

export { redisClient }

