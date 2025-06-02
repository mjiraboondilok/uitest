import ky from 'ky-universal'

async function enqueue(url: string, body: unknown, delayInSeconds?: number) {
    url = `${process.env.COMASYNC_URL}${url}`
    const res = await ky.post(url, {
        json: body,
        timeout: false,
    })
    return res.text()
}

export default enqueue

