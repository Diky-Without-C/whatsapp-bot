import {
  DisconnectReason,
  makeWASocket,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import handleChatResponse from "./src/core/chat-response";

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

    if (msg.key.fromMe) return;

    if (m.type == "notify" && isFromPerson) {
      console.log(JSON.stringify(m, undefined, 2));

      const text = await handleChatResponse(msg.message.conversation);

      await sock.sendMessage(msg.key.remoteJid, {
        text: JSON.stringify(text),
      });
    }
  });
}
connectToWhatsApp();
