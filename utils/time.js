export default function getCurrentTime(lang) {
  const date = new Date();
  const hour = date.getHours();

  if (hour >= 4) {
    return lang == "id" ? "pagi" : "morning";
  } else if (hour >= 10) {
    return lang == "id" ? "siang" : "noon";
  } else if (hour >= 15) {
    return lang == "id" ? "sore" : "afternoon";
  } else {
    return lang == "id" ? "malam" : "evening";
  }
}
