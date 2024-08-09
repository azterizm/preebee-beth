import { configDotenv } from "dotenv"

configDotenv()
export const SELLER_APP_ENDPOINT = process.env.SELLER_APP_ENDPOINT ||
  'http://localhost:5000'
