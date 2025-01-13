import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { cacheData, getCachedData } from './redis'

export function withCache(handler: NextApiHandler, expirationInSeconds: number = 3600) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const cacheKey = `${req.url}-${JSON.stringify(req.body)}`
    const cachedData = await getCachedData(cacheKey)

    if (cachedData) {
      return res.status(200).json(cachedData)
    }

    const originalJson = res.json
    res.json = function (body: any) {
      cacheData(cacheKey, body, expirationInSeconds)
      return originalJson.call(this, body)
    }

    return handler(req, res)
  }
}

