import getCurrentTime from "./src/utils/time.js";
import { getData } from "./src/services/axios.js";
import { getLastMsgLog, updateMsgLog } from "./src/utils/message-log.js";

export default async function handleChatResponse(message) {
  const last_msg_log = getLastMsgLog();
  updateMsgLog(message);

  if (message === ".checkrepo" || last_msg_log === ".checkrepo") {
    const repositories = await handleCheckRepo();
    const names = repositories.map((repo) => repo.name);
    const list_name = names.map((name) => `- ${name}`);

    if (last_msg_log == ".checkrepo") {
      if (names.includes(message)) {
        const index = names.indexOf(message);
        const repo = repositories[index];
        return `name: ${repo.name}\nlocation: ${repo.url}\npage: ${repo.page}`;
      } else {
        return `tidak ada ${message} didalam repositories anda!`;
      }
    }

    return `berikut adalah repositories anda :\n\n${list_name.join("\n")}
      \nsilahkan masukkan nama repositories untuk mendapatkan info lebih lanjut`;
  }

  const currentTime = getCurrentTime("id");
  return `Halo! Selamat ${currentTime} master\n\n\nberikut adalah beberapa menu yang tersedia :\n- .checkrepo`;
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
