
(function(){
'use strict';
var IDX='search_index.json', MAX=50, LEN=160;
var idx=null, loading=false, failed=false;
function esc(s){return String(s).replace(/[&<>"']/g,function(c){
  return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function hl(t,ts){var o=esc(t);ts.forEach(function(x){if(!x)return;
  o=o.replace(new RegExp('('+x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi'),'<mark>$1</mark>');});return o;}
function terms(q){return String(q).trim().toLowerCase().split(/\s+/).filter(Boolean);}
function snip(t,ts,len){if(t.length<=len)return t;var low=t.toLowerCase(),pos=-1;
  for(var i=0;i<ts.length;i++){var p=low.indexOf(ts[i]);if(p>=0){pos=p;break;}}
  if(pos<0)pos=0;var st=Math.max(0,pos-Math.floor(len/3));
  return (st>0?'…':'')+t.slice(st,st+len)+(st+len<t.length?'…':'');}
function load(cb){if(idx)return cb(idx);if(failed)return cb(null);
  if(loading)return setTimeout(function(){load(cb);},120);
  loading=true;
  fetch(IDX).then(function(r){return r.json();}).then(function(d){
    var recs=[];
    (d.chapters||d.pages||[]).forEach(function(u){
      (u.sections||[]).forEach(function(s){
        recs.push({file:u.file,lib:d.library||'',libT:d.libTitle||'',
          chapter:u.title,section:s.heading||'',anchor:s.anchor||'',paras:s.paras||[],
          key:(u.title+' '+(s.heading||'')).toLowerCase(),
          id:u.file+(s.anchor?'#'+s.anchor:'')});});});
    idx=recs;loading=false;cb(idx);
  }).catch(function(){loading=false;failed=true;cb(null);});}
function search(q){var ts=terms(q);if(!ts.length||!idx)return [];
  var hits=[];
  for(var i=0;i<idx.length;i++){var r=idx[i];
    if(ts.every(function(t){return r.key.indexOf(t)>=0;})){
      hits.push({rec:r,score:1000,snippet:snip(r.paras[0]||r.section||r.chapter||'',ts,LEN)});continue;}
    for(var j=0;j<r.paras.length;j++){var low=r.paras[j].toLowerCase(),ok=true,sc=0;
      for(var k=0;k<ts.length;k++){var p=low.indexOf(ts[k]);if(p<0){ok=false;break;}
        sc+=10-Math.min(9,Math.floor(p/400));}
      if(ok)hits.push({rec:r,score:sc,snippet:snip(r.paras[j],ts,LEN)});}}
  hits.sort(function(a,b){return b.score-a.score;});return hits;}
function initPanel(inp,pan){var sel=-1,cur=[];
  function close(){pan.className=pan.className.replace(/\s*open/g,'');pan.innerHTML='';sel=-1;}
  function render(q){load(function(d){if(!d){pan.innerHTML='<div class="sempty">索引加载失败</div>';
    pan.className+=' open';return;}
    cur=search(q);if(!q.trim())return close();
    if(!cur.length){pan.innerHTML='<div class="sempty">未找到「'+esc(q)+'」相关内容</div>';
      pan.className+=' open';return;}
    var ts=terms(q);
    pan.innerHTML='<div class="sh"><span>找到 '+cur.length+' 处</span><span>Enter 查看全部</span></div>'+
      cur.slice(0,MAX).map(function(h,i){return '<a class="sres" href="'+h.rec.id+'" data-i="'+i+'">'+
        '<div class="c">'+hl(h.rec.libT||h.rec.chapter,ts)+'</div>'+
        (h.rec.section?'<div class="s">'+hl(h.rec.section,ts)+'':'')+(h.rec.section?'</div>':'')+
        '<div class="t">'+hl(h.snippet,ts)+'</div></a>';}).join('');
    pan.className+=' open';sel=-1;});}
  function move(d){var it=pan.querySelectorAll('.sres');if(!it.length)return;
    sel=(sel+d+it.length)%it.length;
    for(var i=0;i<it.length;i++)it[i].className=it[i].className.replace(/\s*sel/g,'');
    it[sel].className+=' sel';it[sel].scrollIntoView({block:'nearest'});}
  inp.addEventListener('input',function(){render(inp.value);});
  inp.addEventListener('focus',function(){if(inp.value.trim())render(inp.value);});
  inp.addEventListener('keydown',function(e){
    if(e.key==='ArrowDown'){e.preventDefault();move(1);}
    else if(e.key==='ArrowUp'){e.preventDefault();move(-1);}
    else if(e.key==='Enter'){e.preventDefault();
      if(sel>=0&&cur[sel])location.href=cur[sel].rec.id;
      else if(inp.value.trim())location.href='search.html?q='+encodeURIComponent(inp.value.trim());}
    else if(e.key==='Escape'){inp.value='';close();inp.blur();}});
  pan.addEventListener('click',function(e){var it=e.target.closest?e.target.closest('.sres'):null;
    if(!it)return;e.preventDefault();location.href=it.getAttribute('href');});
  document.addEventListener('click',function(e){if(!pan.contains(e.target)&&e.target!==inp)close();});}
function initResult(){
  var inp=document.getElementById('s-page-q');if(!inp)return;
  var meta=document.getElementById('s-page-meta'),list=document.getElementById('s-page-list');
  var m=location.search.match(/[?&]q=([^&]*)/);
  var q=m?decodeURIComponent(m[1].replace(/\+/g,' ')):'';
  inp.value=q;
  function run(term){load(function(d){if(!d){meta.textContent='索引加载失败';return;}
    var hits=search(term);
    if(!term.trim()){meta.textContent='输入关键词开始搜索';list.innerHTML='';return;}
    meta.textContent=hits.length?('找到 '+hits.length+' 处结果'):('未找到「'+term+'」相关内容');
    var ts=terms(term);
    list.innerHTML=hits.map(function(h){return '<li><a class="sres" href="'+h.rec.id+'">'+
      '<div class="c">'+hl(h.rec.libT||h.rec.chapter,ts)+'</div>'+
      (h.rec.section?'<div class="s">'+hl(h.rec.section,ts)+'</div>':'')+
      '<div class="t">'+hl(h.snippet,ts)+'</div></a></li>';}).join('');});}
  run(q);var t=null;
  inp.addEventListener('input',function(){clearTimeout(t);t=setTimeout(function(){
    var v=inp.value.trim();
    try{history.replaceState(null,'',v?'search.html?q='+encodeURIComponent(v):'search.html');}catch(e){}
    run(v);},220);});}
function boot(){
  var inp=document.getElementById('s-q'),pan=document.getElementById('s-panel');
  if(inp&&pan)initPanel(inp,pan);
  var hi=document.getElementById('s-hero-q');
  if(hi&&inp){hi.addEventListener('input',function(){inp.value=hi.value;renderPanel(hi.value);});}
  initResult();
  document.addEventListener('keydown',function(e){
    var tag=(document.activeElement&&document.activeElement.tagName)||'';
    if(e.key==='/'&&!/^(INPUT|TEXTAREA|SELECT)$/.test(tag)){
      var box=document.getElementById('s-q')||document.getElementById('s-hero-q');
      if(box){e.preventDefault();box.focus();box.select();}}});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
