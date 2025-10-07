// 🌍 Jarvis Voice Reader – Multi-Language Voice System
class JarvisVoiceReader {
  constructor() {
    this.synth = window.speechSynthesis;
    this.isSpeaking = false;
    this.voiceSpeed = 1;
    this.selectedLang = localStorage.getItem("jarvis_language") || "en-US";
    this.voices = [];
    this.init();
  }

  init() {
    speechSynthesis.onvoiceschanged = () => this.voices = this.synth.getVoices();
    const voiceBtn = document.getElementById("voice-reader-btn");
    if (voiceBtn) {
      voiceBtn.addEventListener("click", () => {
        this.isSpeaking ? this.stopVoice() : this.startVoice();
      });
    }
    console.log("🗣️ Jarvis Voice Initialized → " + this.selectedLang);
  }

  async startVoice() {
    const news = await newsFetcher.fetchNews("all");
    const top3 = news.slice(0,3);
    const msg = this.selectedLang.startsWith("hi")
      ? `नमस्ते सर, आज की शीर्ष ${top3.length} खबरें ये हैं। ${top3.map((n,i)=>`खबर ${i+1}: ${n.title}`).join(". ")}।`
      : `Hello Sir, here are today’s top ${top3.length} stories. ${top3.map((n,i)=>`Story ${i+1}: ${n.title}.`).join(" ")}`;
    this.speak(msg);
  }

  speak(text) {
    if (this.synth.speaking) this.synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = this.selectedLang;
    const match = this.voices.find(v => v.lang === this.selectedLang);
    u.voice = match || this.voices.find(v => v.lang.startsWith("en")) || null;
    u.rate = this.voiceSpeed; u.pitch = 1.05; u.volume = 1;
    this.synth.speak(u);
    this.isSpeaking = true;
    u.onend = () => this.isSpeaking = false;
  }
  stopVoice(){this.synth.cancel();this.isSpeaking=false;}

  setLanguage(lang){this.selectedLang=lang;localStorage.setItem("jarvis_language",lang);}
}
document.addEventListener("DOMContentLoaded",()=>window.jarvisVoice=new JarvisVoiceReader());

// 🔊 Auto Save + Test Voice in Settings
document.addEventListener("DOMContentLoaded",()=>{
 const s=document.getElementById("preferred-language"),t=document.getElementById("test-voice-btn");
 if(s){
  const saved=localStorage.getItem("jarvis_language")||"en-US";
  s.value=saved.split("-")[0];
  s.addEventListener("change",e=>{
   const m={en:"en-US",hi:"hi-IN",es:"es-ES",fr:"fr-FR",de:"de-DE",zh:"zh-CN",ar:"ar-SA"};
   const n=m[e.target.value]||"en-US";
   localStorage.setItem("jarvis_language",n);
   const syn=window.speechSynthesis;
   const c=new SpeechSynthesisUtterance(n.startsWith("hi")?"भाषा सफलतापूर्वक बदल दी गई है, सर।":"Language changed successfully, sir.");
   c.lang=n;syn.speak(c);
   c.onend=()=>{
     const test=new SpeechSynthesisUtterance(n.startsWith("hi")?"नमस्ते सर, आपकी आवाज़ सेटिंग अब हिंदी में सक्रिय है।":"Hello Sir, your voice settings are now active.");
     test.lang=n;syn.speak(test);
   };
  });
 }
 if(t){
  t.addEventListener("click",()=>{
   const n=localStorage.getItem("jarvis_language")||"en-US";
   const syn=window.speechSynthesis;
   const msg=n.startsWith("hi")?"नमस्ते सर, आपकी आवाज़ सेटिंग अब हिंदी में सक्रिय है।":"Hello Sir, your voice settings are now active.";
   const u=new SpeechSynthesisUtterance(msg);u.lang=n;syn.speak(u);
  });
 }
});
