import enqueue from '@/utils/enqueue'
import {NextResponse} from 'next/server'

export async function POST(
  request: Request
) {

  try {
    const body = await request.json()

    if (body.id) {
      await enqueue('/tasks/trigger', {
        id: body.id,
      })
    }
    return NextResponse.json(
      {error: 'Success'},
      {status: 200}
    )
  } catch (error) {
    return NextResponse.json(
      {error: 'Internal Server Error'},
      {status: 500}
    )
  }
}