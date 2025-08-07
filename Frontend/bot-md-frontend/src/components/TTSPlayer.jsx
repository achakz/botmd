//src/components/TTSPlayer.jsx
export const speak = (text) => {
  window.speechSynthesis.cancel(); // 🛑 Cancel any ongoing speech
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  window.speechSynthesis.speak(utter);
};
