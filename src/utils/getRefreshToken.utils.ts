import { OAuth2Client } from 'google-auth-library'
import { envs } from '../configuration/environments'

const oauth2Client = new OAuth2Client(
  envs.GOOGLE_CLIENT_ID,
  envs.GOOGLE_CLIENT_SECRET,
  envs.GOOGLE_REDIRECT_URI
)

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/gmail.send'],
  prompt: 'consent',
})

console.log('Autoriza la aplicación visitando esta URL:', authUrl)

async function getToken(code: string) {
  const { tokens } = await oauth2Client.getToken(code)
  console.log('Refresh token:', tokens.refresh_token);
  return tokens
}