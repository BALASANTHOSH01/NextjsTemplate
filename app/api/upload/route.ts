import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import { uploadFile } from '@/lib/s3'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    if (!file) {
      return NextResponse.json({ message: 'No file provided' }, { status: 400 })
    }

    const fileSizeLimit = 10 * 1024 * 1024 // 10MB
    if (file.size > fileSizeLimit) {
      return NextResponse.json({ message: 'File size exceeds the limit' }, { status: 400 })
    }

    const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif']
    if (!allowedFileTypes.includes(file.type)) {
      return NextResponse.json({ message: 'File type is not supported' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileName = `${session.user.id}/${Date.now()}-${file.name}`
    const url = await uploadFile(buffer, fileName)

    return NextResponse.json({ url })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { message: 'Error uploading file' },
      { status: 500 }
    )
  }
}