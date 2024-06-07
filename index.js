import {
  DisconnectReason,
  makeWASocket,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import getCurrentTime from "./utils/time.js";

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

      console.log(
        `connection closed due to : ${lastDisconnect.error}\n
         reconnecting : ${shouldReconnect}`
      );

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

    const text = handleResponse(
      msg.message.conversation.toLowerCase()
    ).toString();

    await sock.sendMessage(msg.key.remoteJid, {
      text: text,
    });
  });
}
connectToWhatsApp();

function handleResponse(message) {
  if (message == ".checkrepo") {
    return "waiting...";
  }

  const currentTime = getCurrentTime("id");
  return `Halo! Selamat ${currentTime} master\n\n\nberikut adalah beberapa menu yang tersedia :\n- .checkrepo`;
}
