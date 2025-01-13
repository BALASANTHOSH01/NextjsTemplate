import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Storage } from '@google-cloud/storage'
import { initializeApp, cert } from 'firebase-admin/app'
import { getStorage } from 'firebase-admin/storage'

const storageProvider = process.env.STORAGE_PROVIDER || 'local'

export async function uploadFile(file: Express.Multer.File, userId: string): Promise<string> {
  switch (storageProvider) {
    case 's3':
      return uploadToS3(file, userId)
    case 'gcs':
      return uploadToGCS(file, userId)
    case 'firebase':
      return uploadToFirebase(file, userId)
    default:
      return uploadToLocal(file, userId)
  }
}

async function uploadToS3(file: Express.Multer.File, userId: string): Promise<string> {
  const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
  })

  const key = `${userId}/${Date.now()}-${file.originalname}`
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
    Body: file.buffer
  })

  await s3Client.send(command)
  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
  return url
}

async function uploadToGCS(file: Express.Multer.File, userId: string): Promise<string> {
  const storage = new Storage({
    projectId: process.env.GCS_PROJECT_ID,
    keyFilename: process.env.GCS_KEY_FILE
  })

  const bucket = storage.bucket(process.env.GCS_BUCKET_NAME!)
  const blob = bucket.file(`${userId}/${Date.now()}-${file.originalname}`)
  await blob.save(file.buffer)

  const [url] = await blob.getSignedUrl({
    action: 'read',
    expires: Date.now() + 3600 * 1000
  })

  return url
}

async function uploadToFirebase(file: Express.Multer.File, userId: string): Promise<string> {
  if (!getStorage().app) {
    initializeApp({
      credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!))
    })
  }

  const bucket = getStorage().bucket(process.env.FIREBASE_STORAGE_BUCKET!)
  const blob = bucket.file(`${userId}/${Date.now()}-${file.originalname}`)
  await blob.save(file.buffer)

  const [url] = await blob.getSignedUrl({
    action: 'read',
    expires: Date.now() + 3600 * 1000
  })

  return url
}

async function uploadToLocal(file: Express.Multer.File, userId: string): Promise<string> {
  // Implement local file storage logic here
  // This is just a placeholder
  return `/uploads/${userId}/${Date.now()}-${file.originalname}`
}

