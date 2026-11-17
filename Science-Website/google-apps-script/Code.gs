// Deploy as Web App: Execute as "Me", access "Anyone".
var TO = "ayushmaurya.education@gmail.com";
function esc(s){return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");}
function out(ok,message){return ContentService.createTextOutput(JSON.stringify({ok:ok,message:message})).setMimeType(ContentService.MimeType.JSON);}
function doGet(){return out(true,"Contact service is running.");}
function doPost(e){
  try{
    var d=JSON.parse((e.postData&&e.postData.contents)||"{}");
    if(d.website) return out(false,"Rejected."); // honeypot
    var name=String(d.name||"").trim(), email=String(d.email||"").trim(), mobile=String(d.mobile||"").trim(), msg=String(d.message||"").trim();
    if(!name||!email||!msg) return out(false,"Name, email and message are required.");
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return out(false,"Invalid email address.");
    if(mobile&&!/^[0-9+\-\s]{7,15}$/.test(mobile)) return out(false,"Invalid mobile number.");
    if(name.length>100||email.length>150||msg.length>3000) return out(false,"Input is too long.");
    var cache=CacheService.getScriptCache(), key="m_"+Utilities.base64EncodeWebSafe(email).slice(0,40);
    if(cache.get(key)) return out(false,"Please wait a minute before sending another message.");
    cache.put(key,"1",60);
    var html="<h3>New message from UP Board Class 10 Science</h3><p><b>Name:</b> "+esc(name)+"</p><p><b>Email:</b> "+esc(email)+"</p><p><b>Mobile:</b> "+(esc(mobile)||"Not provided")+"</p><p><b>Message:</b><br>"+esc(msg).replace(/\n/g,"<br>")+"</p>";
    MailApp.sendEmail({to:TO,replyTo:email,subject:"Website message from "+name,htmlBody:html,body:"Name: "+name+"\nEmail: "+email+"\nMobile: "+mobile+"\n\n"+msg});
    return out(true,"Message sent.");
  }catch(err){return out(false,"Server error. Please try again.");}
}
