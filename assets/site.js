(function(){
  // 散步｜索引 — hash 控制，不依賴 history/localStorage（預覽環境為 opaque origin）
  var walk=document.getElementById('walk'), idx=document.getElementById('index');
  if(walk&&idx){
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
    window.addEventListener('hashchange',function(){
      var h=location.hash.replace('#','');
      if(h==='index'||h.indexOf('index/')===0||h==='walk'||h==='')fromHash();
      else if(h.indexOf('s-')===0){show('walk');var el=document.getElementById(h);if(el)el.scrollIntoView();}
    });
    fromHash();
    var h0=location.hash.replace('#','');
    if(h0.indexOf('s-')===0){var el0=document.getElementById(h0);if(el0)setTimeout(function(){el0.scrollIntoView()},30);}
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

/* 2026-11-18 不留殘字：每段結尾幾個字綁在一起，手機窄欄不會最後一行只剩一兩個字 */
(function(){
  var CJK=/[぀-ヿ㐀-鿿]/, PUNCT=/[\s」』）》〉】。，、！？：；…—．.,!?:;)\]"'”’]/;
  document.querySelectorAll('p,li,h1,h2,h3,blockquote,figcaption,dd,.q,.by,.sm,.h').forEach(function(el){
    if(el.querySelector('p,li,ul,ol,dl,table,img,figure,blockquote,div,.nb'))return;
    if((el.textContent||'').trim().length<8)return;
    var w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null),n,last=null;
    while((n=w.nextNode())){if(n.nodeValue.trim())last=n;}
    if(!last)return;
    var s=last.nodeValue.replace(/\s+$/,'');
    if(CJK.test(s.slice(-8))){
      var i=s.length,c=0;
      while(i>0&&c<3){i--;if(!PUNCT.test(s.charAt(i)))c++;}
      if(s.length-i<2)return;
      var sp=document.createElement('span');sp.className='nb';sp.textContent=s.slice(i);
      last.nodeValue=s.slice(0,i);last.parentNode.insertBefore(sp,last.nextSibling);
    }else{
      var j=s.lastIndexOf(' ');
      if(j>0&&s.length-j<=14)last.nodeValue=s.slice(0,j)+' '+s.slice(j+1);
    }
  });
})();
