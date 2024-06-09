import { getLastMsgLog, updateMsgLog } from "../utils/message-log.js";
import getCurrentTime from "../utils/time.js";
import handleCheckRepo from "./command/checkrepo.js";

export default async function handleChatResponse(message) {
  const last_msg_log = getLastMsgLog();
  const currentTime = getCurrentTime("id");
  const commands = [".checkrepo", ".addrepo", ".deleterepo"];
  const command_list = commands.map((command) => `- ${command}`);

  if (message.includes(".checkrepo") || last_msg_log.includes(".checkrepo")) {
    return await handleCheckRepo(message);
  }

  updateMsgLog(message);

  return `Halo! Selamat ${currentTime} master\n\nberikut adalah beberapa command yang tersedia :\n${command_list.join(
    "\n"
  )}`;
}
