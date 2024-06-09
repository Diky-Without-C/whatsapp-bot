import getCurrentTime from "../utils/time.js";
import { getData } from "../services/axios.js";
import { getLastMsgLog, updateMsgLog } from "../utils/message-log.js";

export default async function handleChatResponse(message) {
  const last_msg_log = getLastMsgLog();
  updateMsgLog(message);

  if (message.includes(".checkrepo") || last_msg_log.includes(".checkrepo")) {
    const repositories = await handleCheckRepo();
    const names = repositories.map((repo) => repo.name);
    const selected_repo = message.split(" ")[1];

    if (selected_repo) {
      if (names.includes(selected_repo)) {
        const index = names.indexOf(selected_repo);
        const repo = repositories[index];
        return `name: ${repo.name}\nsource: ${repo.url}\npage: ${repo.page}`;
      } else {
        return `tidak ada ${selected_repo} didalam repositories anda!`;
      }
    }

    if (last_msg_log == ".checkrepo") {
      if (names.includes(message)) {
        const index = names.indexOf(message);
        const repo = repositories[index];
        return `name: ${repo.name}\nlocation: ${repo.url}\npage: ${repo.page}`;
      } else {
        return `tidak ada ${message} didalam repositories anda!`;
      }
    }

    const list_name = names.map((name) => `- ${name}`);
    return `berikut adalah repositories anda :\n\n${list_name.join("\n")}
      \nsilahkan masukkan nama repositories untuk mendapatkan info lebih lanjut`;
  }

  const currentTime = getCurrentTime("id");
  return `Halo! Selamat ${currentTime} master\n\nberikut adalah beberapa menu yang tersedia :\n- .checkrepo`;
}

async function handleCheckRepo() {
  try {
    const response = await getData();
    const data = response.data;
    return data;
  } catch (error) {
    return error;
  }
}
