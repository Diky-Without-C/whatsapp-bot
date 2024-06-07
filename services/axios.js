import axios from "axios";
import env from "dotenv";
env.config();

export default async function getData() {
  const response = await axios.get(process.env.DATA_BASE_URL);
  const data = await response.data;
  return data;
}
