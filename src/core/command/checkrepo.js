import { getData } from "../../services/axios.js";
import { getLastMsgLog, updateMsgLog } from "../../utils/message-log.js";

export default async function handleCheckRepo(message) {
  const keyword = ".checkrepo";
  const last_msg_log = getLastMsgLog();

  const repositories = await handleGetData();
  const names = repositories.map((repo) => repo.name);

  if (message.length > keyword.length) {
    const selected_repo = message.split(" ")[1];
    updateMsgLog(selected_repo);

    if (selected_repo) {
      if (names.includes(selected_repo)) {
        const index = names.indexOf(selected_repo);
        const repo = repositories[index];
        return `name: ${repo.name}\nsource: ${repo.url}\npage: ${repo.page}`;
      } else {
        return `tidak ada ${selected_repo} didalam repositories anda!`;
      }
    }
  }

  if (last_msg_log === keyword) {
    updateMsgLog(message);
    if (names.includes(message)) {
      const index = names.indexOf(message);
      const repo = repositories[index];
      return `name: ${repo.name}\nlocation: ${repo.url}\npage: ${repo.page}`;
    } else {
      return `tidak ada ${message} didalam repositories anda!`;
    }
  }

  updateMsgLog(message);
  const list_name = names.map((name) => `- ${name}`);
  return `berikut adalah repositories anda :\n\n${list_name.join(
    "\n"
  )}\nsilahkan masukkan nama repositories untuk mendapatkan info lebih lanjut`;
}

async function handleGetData() {
  try {
    const response = await getData();
    const data = response.data;
    return data;
  } catch (error) {
    return `error: ${error}`;
  }
}
