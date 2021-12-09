const is_dev = false
const url = is_dev
  ? 'https://2c8b-73-241-107-13.ngrok.io/api/figma_analytics'
  : 'https://bernatfortet.com/api/figma_analytics'

const options: any = {
  method: 'POST',
}

type UserSession = {
  id: string
  name: string
  sessionId: string
}
export async function logSession(userSession: User) {
  console.log(`logSession -> `, userSession)
  try {
    const json = JSON.stringify(userSession)
    console.log('json: ', json)
    await fetch(url, { ...options, body: json })
    // const data = await reponse.json()
    // console.log('data: ', data)
  } catch (error) {
    console.error(error)
  }
}
