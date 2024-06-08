import {
  DisconnectReason,
  makeWASocket,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import getCurrentTime from "./utils/time.js";
import { getData } from "./services/axios.js";

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");
  const sock = makeWASocket({
    printQRInTerminal: true,
    auth: state,
  });
  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;

      console.log(`reconnecting : ${shouldReconnect}`);

      if (shouldReconnect) {
        connectToWhatsApp();
      }
    } else if (connection === "open") {
      console.log("opened connection");
    }
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async (m) => {
    const msg = m.messages[0];
    const isFromPerson = msg.key.remoteJid.includes("@s.whatsapp.net");

    if (msg.key.fromMe || m.type != "notify" || !isFromPerson) return;
    console.log(JSON.stringify(m, undefined, 2));

    const text = await handleChatResponse(
      msg.message.conversation.toLowerCase()
    );

    await sock.sendMessage(msg.key.remoteJid, {
      text: text,
    });
  });
}
connectToWhatsApp();

async function handleCheckRepo() {
  const response = await getData();
  const data = response.data;

  return data;
}

async function handleChatResponse(message) {
  if (message === ".checkrepo") {
    const repositories = await handleCheckRepo();
    const names = repositories.map((repo) => repo.name);
    const list_name = names.map((name) => `- ${name}`);

    // if (".checkrepo") {
    //   if (message) {
    //     return `name: ${repo.names}\nlocation: ${repo.url}\npage: ${repo.page}`;
    //   } else {
    //     return `tidak ada ${message} didalam repositories anda!`;
    //   }
    // }

    return `berikut adalah repositories anda :\n\n${list_name.join("\n")}
    \nsilahkan masukkan nama repositories untuk mendapatkan info lebih lanjut`;
  }

  const currentTime = getCurrentTime("id");
  return `Halo! Selamat ${currentTime} master\n\n\nberikut adalah beberapa menu yang tersedia :\n- .checkrepo`;
}
