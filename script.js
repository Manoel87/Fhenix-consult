// WhatsApp da FHENIX: +55 (81) 99658-5557  →  DDI + DDD + número, só dígitos.
// Se o WhatsApp não abrir a conversa, confira o número e ajuste apenas esta linha.
var WA_NUMBER="5581996585557";
function wa(t){return "https://wa.me/"+WA_NUMBER+"?text="+encodeURIComponent(t)}
function openWA(url){
 // abre no app (celular) ou no WhatsApp Web (computador); se o pop-up for bloqueado, navega na mesma aba
 var w=null;
 try{w=window.open(url,"_blank")}catch(e){}
 if(w){try{w.opener=null}catch(e){}}else{window.location.href=url}
}
document.getElementById("wa").href=wa("Olá! Gostaria de falar com a FHENIX.");
var waCeo=document.getElementById("wa-ceo"),waFoot=document.getElementById("wa-foot");
if(waCeo)waCeo.href=wa("Olá, Flávio! Vim pelo site da FHENIX e gostaria de conversar.");
if(waFoot)waFoot.href=wa("Olá! Gostaria de falar com a FHENIX.");

var desktop=window.matchMedia("(min-width:1024px)");

// Menu mobile / tablet (< 1024px)
var m=document.getElementById("menu"),n=document.getElementById("nav");
function closeNav(){n.classList.remove("open");m.setAttribute("aria-expanded","false");m.setAttribute("aria-label","Abrir menu");m.textContent="☰"}
m.onclick=function(e){
 e.stopPropagation();
 var o=!n.classList.contains("open");
 n.classList.toggle("open",o);
 m.setAttribute("aria-expanded",o);m.setAttribute("aria-label",o?"Fechar menu":"Abrir menu");m.textContent=o?"✕":"☰";
 if(!o)closeDDs();
};
n.addEventListener("click",function(e){var a=e.target.closest("a");if(a)closeNav()});

// Dropdowns / acordeões (Treinamentos NRs e Prestação de Serviços)
var dds=Array.prototype.slice.call(document.querySelectorAll(".dd"));
function setDD(d,o){d.classList.toggle("open",o);d.querySelector(".dd-btn").setAttribute("aria-expanded",o)}
function closeDDs(){dds.forEach(function(d){setDD(d,false)})}
dds.forEach(function(d){
 d.querySelector(".dd-btn").onclick=function(e){
  e.stopPropagation();
  var o=!d.classList.contains("open");
  closeDDs();setDD(d,o);
  if(o&&!desktop.matches)setTimeout(function(){d.scrollIntoView({block:"nearest",behavior:"smooth"})},30);
 };
 // em telas com mouse o menu abre no hover (CSS); ao sair, fecha o estado "aberto por clique"
 d.addEventListener("mouseleave",function(){if(desktop.matches&&matchMedia("(hover:hover)").matches)setDD(d,false)});
});
document.addEventListener("click",function(e){
 if(!e.target.closest(".dd"))closeDDs();
 if(n.classList.contains("open")&&!e.target.closest("header"))closeNav();
});
document.addEventListener("keydown",function(e){
 if(e.key==="Escape"){closeDDs();if(n.classList.contains("open")){closeNav();m.focus()}}
});
function onBreakpoint(){if(desktop.matches){closeNav();closeDDs()}}
if(desktop.addEventListener)desktop.addEventListener("change",onBreakpoint);else desktop.addListener(onBreakpoint);

// Formulário
var f=document.getElementById("f"),msg=f.elements.msg,area=f.elements.area,lastAuto="";
function boxes(name){return Array.prototype.slice.call(f.querySelectorAll('input[name="'+name+'"]'))}
function sel(name){return boxes(name).filter(function(c){return c.checked}).map(function(c){return c.value})}
function autoText(){
 var a=area.value,nr=sel("nr"),sv=sel("sv"),p=[];
 if(nr.length)p.push("às seguintes normas: "+nr.join(", "));
 if(sv.length)p.push("aos seguintes serviços: "+sv.join(", "));
 return "Olá, gostaria de solicitar orçamento"+(a?" para "+a:"")+(p.length?" referente "+p.join(" e "):"")+".";
}
function updateMsg(){
 var next=autoText(),cur=msg.value;
 if(cur===""||cur===lastAuto){msg.value=next}
 else if(lastAuto&&cur.indexOf(lastAuto)===0){msg.value=next+cur.slice(lastAuto.length)}
 else if(!lastAuto){msg.value=next+"\n"+cur}
 lastAuto=next;
}
f.addEventListener("change",function(e){var nm=e.target.name;if(nm==="nr"||nm==="sv"){updateMsg();updateCount()}});

function flash(c){var l=c.parentNode;l.classList.remove("flash");void l.offsetWidth;l.classList.add("flash")}
var blocks={nr:document.getElementById("blk-nr"),sv:document.getElementById("blk-sv")};
// Dropdown multi-select agrupado (profissionais / serviços)
var msel=document.getElementById("msel"),mbtn=document.getElementById("msel-btn"),mpan=document.getElementById("msel-p"),mcnt=document.getElementById("msel-count");
function setMsel(o){msel.classList.toggle("open",o);mbtn.setAttribute("aria-expanded",o)}
function updateCount(){var c=sel("sv").length;mcnt.textContent=c;mcnt.hidden=!c}
function reveal(c){mpan.scrollTop=Math.max(0,c.closest("label").offsetTop-8)}
mbtn.onclick=function(){setMsel(!msel.classList.contains("open"))};
msel.addEventListener("keydown",function(e){if(e.key==="Escape"&&msel.classList.contains("open")){e.stopPropagation();setMsel(false);mbtn.focus()}});
function showBlock(name,show){
 var b=blocks[name];b.classList.toggle("open",show);
 if(!show)boxes(name).forEach(function(c){c.checked=false});
 if(name==="sv"){if(!show)setMsel(false);updateCount()}
}
// Mostra/oculta os blocos conforme a "Área de interesse"
function syncBlocks(){
 var a=area.value;
 showBlock("nr",a==="Treinamento de NRs"||a==="Consultoria em SST");
 showBlock("sv",a==="Prestação de Serviços");
 updateMsg();
}
area.addEventListener("change",syncBlocks);
function pick(name,value,areaValue,keepConsultoria){
 if(!(keepConsultoria&&area.value==="Consultoria em SST"))area.value=areaValue;
 syncBlocks();
 var c=boxes(name).filter(function(x){return x.value===value})[0];
 if(c){c.checked=true;flash(c)}
 if(name==="sv"){setMsel(true);updateCount();if(c)reveal(c)}
 updateMsg();
}
// Clique em um card de categoria: marca todas as funções do grupo
function pickGroup(g){
 area.value="Prestação de Serviços";syncBlocks();
 var cs=boxes("sv").filter(function(x){return x.dataset.g===g});
 cs.forEach(function(c){c.checked=true;flash(c)});
 setMsel(true);updateCount();if(cs[0])reveal(cs[0]);
 updateMsg();
}
// Rola suavemente até o formulário (notebook: início da seção; celular/tablet: campo "Área de interesse")
function goForm(){
 var t=desktop.matches?document.getElementById("contato"):area.closest("label");
 t.scrollIntoView({behavior:"smooth",block:"start"});
}
document.querySelectorAll("a[data-nr],a[data-sv],a[data-svg]").forEach(function(a){
 a.addEventListener("click",function(e){
  e.preventDefault();
  if(a.dataset.nr)pick("nr",a.dataset.nr,"Treinamento de NRs",true);
  else if(a.dataset.svg)pickGroup(a.dataset.svg);
  else pick("sv",a.dataset.sv,"Prestação de Serviços",false);
  closeDDs();closeNav();
  var ae=document.activeElement;if(ae&&ae.blur)ae.blur();
  goForm();
 });
});
if(area.value)syncBlocks();

// Envio via WhatsApp (app no celular / WhatsApp Web no computador)
var ok=document.getElementById("ok");
function say(t,err){ok.textContent=t;ok.classList.toggle("err",!!err)}
f.onsubmit=function(e){
 e.preventDefault();
 var d=new FormData(f),nome=(d.get("nome")||"").trim(),empresa=(d.get("empresa")||"").trim(),tel=(d.get("tel")||"").trim();
 var digits=tel.replace(/\D/g,"");
 if(nome.length<2){say("Informe o seu nome completo.",true);f.elements.nome.focus();return}
 if(empresa.length<2){say("Informe o nome da empresa.",true);f.elements.empresa.focus();return}
 if(digits.length<10||digits.length>13){say("Informe um telefone válido com DDD, por exemplo (81) 99999-9999.",true);f.elements.tel.focus();return}
 if(!d.get("area")){say("Escolha a área de interesse.",true);area.focus();return}
 var nr=sel("nr"),sv=sel("sv");
 var t="Olá! Meu nome é "+nome+", da empresa "+empresa+".\nTelefone: "+tel+"\nInteresse: "+d.get("area")+(nr.length?"\nNRs: "+nr.join(", "):"")+(sv.length?"\nServiços: "+sv.join(", "):"")+(d.get("msg")?"\n\n"+d.get("msg"):"");
 say("Abrindo o WhatsApp com a sua solicitação…",false);
 openWA(wa(t));
};

// Carrosséis (swipe por touch, arrastar com mouse, setas e bolinhas)
var reduceMotion=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
document.querySelectorAll(".car.fit .car-slide").forEach(function(s){var im=s.querySelector("img");if(im)s.style.setProperty("--bg","url('"+im.getAttribute("src")+"')")});
document.querySelectorAll("[data-car]").forEach(function(car){
 var frame=car.querySelector(".car-frame"),track=car.querySelector(".car-track"),
 slides=car.querySelectorAll(".car-slide"),dots=car.querySelectorAll(".car-dots button"),
 i=0,timer=null,tx=null,ty=null,mx=null;
 function go(k){
  i=(k+slides.length)%slides.length;
  track.style.transform="translateX(-"+i*100+"%)";
  slides.forEach(function(s,x){s.setAttribute("aria-hidden",x!==i)});
  dots.forEach(function(d,x){d.classList.toggle("on",x===i);d.setAttribute("aria-current",x===i)});
 }
 function stop(){clearInterval(timer);timer=null}
 function play(){stop();if(!reduceMotion)timer=setInterval(function(){go(i+1)},4500)}
 car.querySelector(".car-prev").onclick=function(){go(i-1);play()};
 car.querySelector(".car-next").onclick=function(){go(i+1);play()};
 dots.forEach(function(d,x){d.onclick=function(){go(x);play()}});

 // touch (celular e tablet)
 frame.addEventListener("touchstart",function(e){var t=e.touches[0];tx=t.clientX;ty=t.clientY;stop()},{passive:true});
 frame.addEventListener("touchend",function(e){
  if(tx!==null){
   var t=e.changedTouches[0],dx=t.clientX-tx,dy=t.clientY-ty;
   if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)*1.2)go(dx<0?i+1:i-1);
  }
  tx=ty=null;play();
 },{passive:true});
 frame.addEventListener("touchcancel",function(){tx=ty=null;play()},{passive:true});

 // mouse (arrastar) e pausa ao passar o mouse
 frame.addEventListener("pointerdown",function(e){if(e.pointerType==="mouse"){mx=e.clientX;stop()}});
 frame.addEventListener("pointerup",function(e){
  if(e.pointerType!=="mouse"||mx===null)return;
  var dx=e.clientX-mx;mx=null;if(Math.abs(dx)>40)go(dx<0?i+1:i-1);
 });
 car.addEventListener("pointerenter",function(e){if(e.pointerType==="mouse")stop()});
 car.addEventListener("pointerleave",function(e){if(e.pointerType==="mouse"){mx=null;play()}});
 car.addEventListener("focusin",stop);car.addEventListener("focusout",play);
 frame.addEventListener("keydown",function(e){if(e.key==="ArrowLeft"){go(i-1);play()}if(e.key==="ArrowRight"){go(i+1);play()}});
 go(0);play();
});