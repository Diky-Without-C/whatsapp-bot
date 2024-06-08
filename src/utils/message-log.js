import message_log from "../../message_log.json" assert { type: "json" };
import fs from "fs";

const msg_log = message_log.messages;

export function getLastMsgLog() {
  if (msg_log.length) {
    return msg_log[msg_log.length - 1];
  }
}

export function updateMsgLog(newMessage) {
  msg_log.push(newMessage);
  const update = JSON.stringify({ messages: msg_log });

  fs.writeFile("message_log.json", update, (error) => {
    if (error) throw error;
  });
}
