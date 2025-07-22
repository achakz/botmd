export const speak = (text) => {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  window.speechSynthesis.speak(utter);
};
