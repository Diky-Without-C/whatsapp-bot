import fs from "fs";

export function writeFile(change) {
  fs.writeFile("message-log.json", change, (error) => {
    if (error) throw error;
  });
}
