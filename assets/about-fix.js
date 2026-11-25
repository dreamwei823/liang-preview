/* 2026-11-25 關於頁：展歷表同一年連續多筆，第二筆起加 .same-yr（年份隱去、位置保留）
   依畫面實際列順序比對上一列，不寫死年份；表格排序改了也照樣對 */
(function(){
  function run(){
    var tables=document.querySelectorAll('.about .table');
    for(var i=0;i<tables.length;i++){
      var prev=null,rows=tables[i].rows;
      for(var j=0;j<rows.length;j++){
        var c=rows[j].cells[0];
        if(!c)continue;
        var y=c.textContent.replace(/\s+/g,'');
        rows[j].classList.toggle('same-yr',y!==''&&y===prev);
        prev=y;
      }
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
