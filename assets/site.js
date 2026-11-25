(function(){
  // 散步（隨機）｜系列（hash 仍叫 index）— hash 控制，不依賴 history/localStorage（預覽環境為 opaque origin）
  var walk=document.getElementById('walk'), idx=document.getElementById('index');
  if(walk&&idx){
    // 散步＝隨機：每次進來把所有作品洗牌成一列（沒有 JS 時照年代排）
    var items=[].slice.call(walk.querySelectorAll('.walk-item'));
    if(items.length>1){
      for(var i=items.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=items[i];items[i]=items[j];items[j]=t;}
      var box=document.createElement('div');box.className='walk-random';
      items.forEach(function(it){box.appendChild(it)});
      walk.querySelectorAll('.series').forEach(function(s){s.hidden=true});
      walk.appendChild(box);
    }
    var btns=document.querySelectorAll('[data-view]');
    var fbtns=document.querySelectorAll('[data-filter]');
    var cells=idx.querySelectorAll('.cell');
    var empty=document.getElementById('empty');
    function setFilter(f){
      var n=0;
      cells.forEach(function(c){
        var ok=f==='all'||c.dataset.kind===f||(f==='inq'&&c.dataset.inq==='1')||(f==='sold'&&c.dataset.sold==='1');
        c.hidden=!ok; if(ok)n++;
      });
      // 系列：整組都被篩掉就把標題一起藏起來
      idx.querySelectorAll('.g-series').forEach(function(g){g.hidden=!g.querySelector('.cell:not([hidden])')});
      fbtns.forEach(function(b){b.setAttribute('aria-pressed',b.dataset.filter===f?'true':'false')});
      if(empty)empty.hidden=n>0;
    }
    function show(v,f){
      var isIdx=v==='index';
      walk.hidden=isIdx; idx.hidden=!isIdx;
      btns.forEach(function(b){b.setAttribute('aria-pressed',b.dataset.view===v?'true':'false')});
      if(isIdx)setFilter(f||'all');
    }
    function fromHash(){
      var h=(location.hash||'').replace('#','');
      if(h.indexOf('index')===0){show('index',h.split('/')[1]||'all');}
      else{show('walk');}
    }
    btns.forEach(function(b){b.addEventListener('click',function(){
      show(b.dataset.view);
      try{location.hash=b.dataset.view==='index'?'index':'walk'}catch(e){}
    })});
    fbtns.forEach(function(b){b.addEventListener('click',function(){
      setFilter(b.dataset.filter);
      try{location.hash='index/'+b.dataset.filter}catch(e){}
    })});
    function goTo(el){var stop=false,ro=null;var fn=function(){if(!stop)el.scrollIntoView()};var end=function(){stop=true;if(ro)ro.disconnect();['wheel','touchstart','keydown','mousedown'].forEach(function(e){window.removeEventListener(e,end)})};fn();if(window.ResizeObserver){ro=new ResizeObserver(fn);ro.observe(document.body)}['wheel','touchstart','keydown','mousedown'].forEach(function(e){window.addEventListener(e,end,{passive:true})});setTimeout(end,20000)}
    window.addEventListener('hashchange',function(){
      var h=location.hash.replace('#','');
      if(h==='index'||h.indexOf('index/')===0||h==='walk'||h==='')fromHash();
      else if(h.indexOf('s-')===0){show('index');var el=document.getElementById(h);if(el)goTo(el);}
    });
    fromHash();
    var h0=location.hash.replace('#','');
    if(h0.indexOf('s-')===0){show('index');var el0=document.getElementById(h0);if(el0)setTimeout(function(){goTo(el0)},30);}
  }

  // 只看畫：介面在 1.5 秒內淡出，移動或觸碰後再出現
  var openBtn=document.querySelector('[data-alone]'), box=document.getElementById('alone');
  if(openBtn&&box){
    var t=null, closeBtn=box.querySelector('[data-close]');
    function wake(){box.classList.remove('idle');clearTimeout(t);t=setTimeout(function(){box.classList.add('idle')},1500);}
    function open(){box.classList.add('on');document.body.style.overflow='hidden';wake();closeBtn.focus({preventScroll:true});}
    function close(){box.classList.remove('on','idle');document.body.style.overflow='';clearTimeout(t);openBtn.focus();}
    openBtn.addEventListener('click',open);
    closeBtn.addEventListener('click',close);
    ['mousemove','touchstart','keydown'].forEach(function(e){box.addEventListener(e,wake,{passive:true})});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&box.classList.contains('on'))close();});
    box.addEventListener('click',function(e){if(e.target===box||e.target.classList.contains('inner'))close();});
  }
})();

/* 2026-11-18 不留殘字：作品名的「-1」不跟前面拆開；每段結尾幾個字綁在一起，手機窄欄不會最後一行只剩一兩個字 */
(function(){
  var CJK=/[぀-ヿ㐀-鿿]/, PUNCT=/[\s」』）》〉】。，、！？：；…—．.,!?:;)\]"'”’]/;
  document.querySelectorAll('.t,.cap b,.work-info h1,.fields dd,title').forEach(function(el){
    var w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null),n;
    while((n=w.nextNode())){if(/-\d/.test(n.nodeValue))n.nodeValue=n.nodeValue.replace(/-(?=\d)/g,'-⁠');}
  });
  document.querySelectorAll('p,li,h1,h2,h3,blockquote,figcaption,dd,.q,.by,.sm,.h').forEach(function(el){
    if(el.querySelector('p,li,ul,ol,dl,table,img,figure,blockquote,div,.nb'))return;
    if((el.textContent||'').trim().length<8)return;
    var w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null),n,last=null;
    while((n=w.nextNode())){if(n.nodeValue.trim())last=n;}
    if(!last)return;
    var s=last.nodeValue.replace(/\s+$/,'');
    if(CJK.test(s.slice(-8))||CJK.test((el.textContent||'').trim().slice(-8))){
      var i=s.length,c=0;
      while(i>0&&c<3){i--;if(!PUNCT.test(s.charAt(i)))c++;}
      var sp=document.createElement('span');sp.className='nb';
      var prev=last.previousSibling;
      if(c<3&&i===0&&prev&&prev.nodeType===1&&last.parentNode===el&&(prev.textContent||'').length<=8){
        el.insertBefore(sp,prev);sp.appendChild(prev);sp.appendChild(last);return;
      }
      if(s.length-i<2)return;
      sp.textContent=s.slice(i);
      last.nodeValue=s.slice(0,i);last.parentNode.insertBefore(sp,last.nextSibling);
    }else{
      var j=s.lastIndexOf(' ');
      if(j>0&&s.length-j<=14)last.nodeValue=s.slice(0,j)+' '+s.slice(j+1);
    }
  });
})();

/* 2026-11-18 手機：語言收成一顆，點了才展開（沒有 JS 時照舊整排顯示） */
(function(){
  var l=document.querySelector('.lang');if(!l)return;
  var cur=l.querySelector('span[aria-current]');if(!cur)return;
  l.classList.add('js');cur.setAttribute('role','button');cur.setAttribute('tabindex','0');cur.setAttribute('aria-expanded','false');
  function t(){var o=l.classList.toggle('open');cur.setAttribute('aria-expanded',o?'true':'false');}
  cur.addEventListener('click',t);
  cur.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();t();}});
})();
