// 🧠 Jarvis Wake System + GPT Summary Integration
class JarvisWakeSystem{
 constructor(){this.isActive=false;this.recognition=null;this.init();}
 init(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR)return;
  this.recognition=new SR();
  this.recognition.lang=localStorage.getItem("jarvis_language")||"en-US";
  this.recognition.continuous=true;
  this.recognition.onresult=e=>{
    const t=e.results[e.results.length-1][0].transcript.trim().toLowerCase();
    if(typeof jarvisHUD!=="undefined")jarvisHUD.logUser(t);
    if(t.includes("jarvis"))this.onWake(t);
  };
  this.recognition.onend=()=>this.recognition.start();
  this.recognition.start();
 }

 onWake(text){
  if(this.isActive)return;this.isActive=true;
  if(typeof jarvisHUD!=="undefined")jarvisHUD.respond(text);
  setTimeout(()=>this.listenCmd(),1500);
 }

 listenCmd(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  const cmd=new SR();cmd.lang=localStorage.getItem("jarvis_language")||"en-US";
  cmd.onresult=e=>{
   const c=e.results[0][0].transcript.toLowerCase();
   if(typeof jarvisHUD!=="undefined")jarvisHUD.logUser(c);
   this.handle(c);
  };
  cmd.onend=()=>{this.isActive=false;this.recognition.start();};
  cmd.start();
 }

 async handle(c){
  const l=localStorage.getItem("jarvis_language")||"en-US";
  if(c.includes("theme")){
    const t=document.documentElement.getAttribute("data-theme");
    const n=t==="dark"?"light":"dark";
    document.documentElement.setAttribute("data-theme",n);
    localStorage.setItem("theme",n);
    const msg=n==="dark"?"Dark mode activated, Sir.":"Light mode activated, Sir.";
    this.say(msg,l);if(jarvisHUD)jarvisHUD.logJarvis(msg);return;
  }
  if(c.includes("summarize")){
    await this.summary(l);return;
  }
  if(c.includes("news")){
    jarvisVoice.startVoice();return;
  }
  this.say("Sorry Sir, I didn’t understand that command.",l);
 }

 async summary(l){
  try{
    const n=await newsFetcher.fetchNews("tech");
    const d=n.slice(0,3).map(x=>x.title+": "+x.content).join("\n");
    const s=await realAI.generateAISummary(d,"Tech News Summary");
    this.say("Here’s today’s tech news summary, Sir.",l);
    const u=new SpeechSynthesisUtterance(s);u.lang=l;u.rate=1;u.pitch=1.05;
    speechSynthesis.speak(u);
    if(jarvisHUD)jarvisHUD.logJarvis(s);
  }catch(e){this.say("Apologies Sir, I couldn’t fetch the summary.",l);}
 }

 say(t,l){const u=new SpeechSynthesisUtterance(t);u.lang=l;speechSynthesis.speak(u);}
}
document.addEventListener("DOMContentLoaded",()=>new JarvisWakeSystem());
