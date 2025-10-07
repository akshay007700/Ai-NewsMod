// 🎛️ Jarvis HUD + Neon Visualizer + Gender Response
class JarvisCommandCenter{
 constructor(){
  this.gender="male";this.init();
 }
 init(){
  const c=document.createElement("div");
  c.className="jarvis-hud";
  c.innerHTML=`
   <div class="hud-header"><i class="fas fa-robot"></i> J.A.R.V.I.S. Command Center</div>
   <div id="voice-visualizer" class="voice-visualizer"></div>
   <div id="hud-log" class="hud-log"></div>`;
  document.body.appendChild(c);
  this.visualizer=document.getElementById("voice-visualizer");
  for(let i=0;i<25;i++){const b=document.createElement("div");b.className="bar";this.visualizer.appendChild(b);}
 }
 animateBars(a=true){document.querySelectorAll(".bar").forEach(b=>{b.style.height=a?`${Math.random()*80+20}px`:"4px";b.style.opacity=a?"1":"0.3";});}
 startAnim(){this.stopAnim();this.int=setInterval(()=>this.animateBars(true),120);}
 stopAnim(){if(this.int)clearInterval(this.int);this.animateBars(false);}
 logUser(t){this.add("🗣️ You said",t,"user");}
 logJarvis(t){this.add("🤖 Jarvis",t,"jarvis");}
 add(p,t,y){const l=document.getElementById("hud-log"),i=document.createElement("div");i.className=`hud-item ${y}`;i.innerHTML=`<strong>${p}:</strong> ${t}`;l.appendChild(i);l.scrollTop=l.scrollHeight;}
 detectGender(v){const w=["okay","sure","hello","hi"],f=w.filter(x=>v.toLowerCase().includes(x)).length;this.gender=f>2?"female":"male";}
 speak(t){const s=window.speechSynthesis,l=localStorage.getItem("jarvis_language")||"en-US",u=new SpeechSynthesisUtterance(t);
  u.lang=l;u.pitch=this.gender==="female"?1.3:1.0;u.rate=1;u.volume=1;
  this.startAnim();s.speak(u);u.onend=()=>this.stopAnim();}
 respond(p){this.detectGender(p);const r=this.gender==="female"?"Yes Ma’am.":"Yes Sir.";this.speak(r);this.logJarvis(r);}
}
const jarvisHUD=new JarvisCommandCenter();
