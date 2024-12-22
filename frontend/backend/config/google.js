import {google} from 'googleapis';

const GOOGle_CLIENT_ID = process.env.GOOGle_CLIENT_ID
const GOOGle_CLIENT_SECRET = process.env.GOOGle_CLIENT_SECRET

const oauth2client = new google.auth.OAuth2(
  GOOGle_CLIENT_ID,
  GOOGle_CLIENT_SECRET,
  'postmessage'
)

export default oauth2client;