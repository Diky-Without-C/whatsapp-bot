import message_log from "../../message_log.json" assert { type: "json" };
import fs from "fs";

const msg_log = message_log.messages;

export function getMessageLog() {
  return msg_log;
}

export function updateMessageLog(newMessage) {
  msg_log.push(newMessage);
  const update = JSON.stringify({ messages: msg_log });

  fs.writeFile("message_log.json", update, (error) => {
    if (error) throw error;
  });
}
