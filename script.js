// ===== script.js =====
// ナビゲーション・ログインは index.html のインラインスクリプトで処理済み
// このファイルでは showToast, copyText, 各タブの機能のみを担当

function showToast(msg) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(function(){ t.classList.remove('show'); }, 2000);
}

function copyText(text, btn) {
    navigator.clipboard.writeText(text);
    btn.textContent = 'コピー完了！';
    btn.classList.add('copied');
    setTimeout(function(){ btn.textContent = 'コピーして使う'; btn.classList.remove('copied'); }, 2000);
    showToast('クリップボードにコピーしました');
}

function escapeHtml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function escapeForJs(s) { return s.replace(/\\/g,'\\\\').replace(/`/g,'\\`').replace(/\$/g,'\\$'); }

function createPostCard(title, content, type, badge) {
    type = type || 'affiliate'; badge = badge || '';
    var card = document.createElement('div');
    var cls = type==='non-affiliate'?'non-affiliate':type==='buzz'?'buzz':type==='longform'?'longform':'';
    card.className = 'post-card ' + cls;
    var bc = type==='non-affiliate'?'non-affi':'';
    var bh = badge ? '<span class="post-badge '+bc+'">'+badge+'</span>' : '';
    card.innerHTML = '<div class="post-card-header"><h4>'+title+'</h4>'+bh+'</div><p class="post-content">'+escapeHtml(content)+'</p><div class="post-actions"><button class="copy-btn" onclick="copyText(`'+escapeForJs(content)+'`, this)">コピーして使う</button></div>';
    return card;
}

// ================================================================
// TAB 1: ポスト一括生成
// ================================================================
document.getElementById('generateAllBtn').addEventListener('click', function(){
    var d = getGeneratorInputs(); if(!d) return; generateAllPosts(d, false);
});
document.getElementById('generateSalesBtn').addEventListener('click', function(){
    var d = getGeneratorInputs(); if(!d) return; generateAllPosts(d, true);
});

function getGeneratorInputs() {
    var pn = document.getElementById('productName').value.trim();
    if (!pn) { showToast('商品名を入力してください'); return null; }
    return {
        name: pn,
        price: document.getElementById('price').value.trim() || '（価格未入力）',
        category: document.getElementById('category').value || 'おすすめ商品',
        target: document.getElementById('target').value.trim() || 'みんな',
        benefits: document.getElementById('benefits').value.split('\n').filter(function(b){return b.trim();}),
        url: document.getElementById('affiliateUrl').value.trim()
    };
}

// ================================================================
// TAB 2: バズ職人
// ================================================================
document.getElementById('generateBuzzBtn').addEventListener('click', function(){
    var product = document.getElementById('buzzProduct').value.trim();
    var price = document.getElementById('buzzPrice').value.trim();
    var target = document.getElementById('buzzTarget').value.trim();
    var features = document.getElementById('buzzFeatures').value.split('\n').filter(function(f){ return f.trim(); });
    if(!product){ showToast('商品名を入力してください'); return; }
    var feat = features.join('、') || 'デスクワーク中に使える';
    var f1 = features[0] || 'デスクワーク中に使える';
    var f2 = features[1] || '座ったままでOK';
    var f3 = features[2] || 'コスパが良い';
    var out = document.getElementById('buzzOutput');
    out.innerHTML = '';

    var hd = document.createElement('div');
    hd.style.cssText = 'margin-bottom:1.5rem;padding:1rem;background:rgba(244,114,182,0.05);border-radius:12px;border:1px solid rgba(244,114,182,0.15);';
    hd.innerHTML = '<p style="font-size:0.85rem;color:#94a3b8;">🔥 <strong style="color:#f1f5f9;">' + escapeHtml(product) + '</strong> | ' + escapeHtml(price || '価格未入力') + ' | 🎯 ' + escapeHtml(target || 'デスクワーカー') + '</p>';
    out.appendChild(hd);

    var bp = [
        {
            t: '【1】目撃系：オフィスで見かけた',
            c: '会社で隣の席の人がデスクの下で何か使ってて、\n気になりすぎて聞いたら' + product + 'だった。\n\n' + f1 + 'らしくて、\n帰り道に調べたら想像以上にレビュー良い。\n\n座り仕事の人は見てみて。'
        },
        {
            t: '【2】進化系：Before/After',
            c: '3ヶ月前の自分に教えたい。\n座りっぱなしでブヨブヨだった体、\n' + product + '使い始めてから明らかに変わった。\n\n' + f1 + '\n' + f2 + '\n\nデスクワーカーのBefore/Afterって地味だけど確実。'
        },
        {
            t: '【3】価格バグ：ジム代と比較',
            c: 'ジム月1万×12ヶ月＝年間12万。\n' + product + '、' + (price || 'この値段') + '。買い切り。\n\n' + f1 + 'で、\nしかも' + f2 + '。\n\n座り仕事で時間ない人は\nジム行くよりこっちのが現実的。'
        },
        {
            t: '【4】ながら系：座ったまま',
            c: 'これ、仕事しながら使えるのがズルい。\n\n' + product + '、' + f1 + '。\n\nわざわざ時間作らなくていいのがデカすぎる。\nデスクワーカーの「ながらケア」の正解、これかも。\n\nリンク貼っとくね。'
        },
        {
            t: '【5】まとめ系：デスクワーカー必需品',
            c: 'デスクワーカーが買うべきもの、本気で考えた。\n\n結論から言うと' + product + 'は入れていい。\n\n' + f1 + '、\n' + f2 + '、\n' + f3 + '。\n\n全部入りで' + (price || 'この値段') + 'は正直すごい。\n在庫あるうちに見て。'
        },
        {
            t: '【6】共感系：悩みの代弁',
            c: '座りっぱなしで腰バキバキ、夕方は脚パンパン、\n気づいたら腹だけ出てきた。\n\n…って人、仲間です。\n\n私は' + product + '使い始めてから少しずつマシになった。\n' + f1 + 'のがちょうどいい。\n\n同じ悩みの人だけ見てみて。'
        }
    ];

    bp.forEach(function(p){
        out.appendChild(createPostCard(p.t, p.c, 'buzz', 'バズ'));
    });

    showToast('バズ投稿6パターン生成完了！');
    incrementPostCount(6);
});

// ================================================================
// TAB 3: 長文生成
// ================================================================
document.getElementById('generateLongPromptBtn').addEventListener('click', function(){
    var genre=document.getElementById('longGenre').value;
    var target=document.getElementById('longTarget').value.trim();
    var theme=document.getElementById('longTheme').value.trim();
    if(!genre||!target||!theme){showToast('ジャンル・ターゲット・テーマを全て入力してください');return;}
    var out=document.getElementById('longformOutput');
    out.innerHTML='';
    var lp='あなたはThreadsで月間数百万インプレッションを獲得する投稿設計の専門家です。滞在時間60秒以上、高エンゲージメントを獲得できる投稿を3パターン作成してください。\n\n【入力情報】\n1. ジャンル: '+genre+'\n2. ターゲット: '+target+'\n3. 発信したいテーマ: '+theme+'\n\n【出力する投稿は3パターン】\nパターン1: 逆張り否定型\nパターン2: ビフォーアフター型\nパターン3: 失敗パターン暴露型\n\n【超重要】内容の完全差別化ルール\n同じテーマでも、3パターンで扱う「具体的な内容・方法・ポイント」は完全に異なるものにする。\n\n【投稿構成（絶対厳守）】\n1. 本文投稿（150-300文字厳守）\n2. コメント欄1（400-500文字厳守）\n3. コメント欄2（400-500文字厳守）\n\n【口調ルール（超重要）】\n* 語尾: 「〜だよ」「〜なんだよね」「〜から」「〜してみて」\n* 「です・ます調」は絶対禁止\n* カジュアル表現: 「マジで」「ちょっと」「なんか」「めっちゃ」\n* 箇条書き・番号付きリスト・記号「・」は絶対に使わない\n* 中学生が理解できる言葉\n* 説教臭くしない\n\n【各ブロックの役割】\n本文投稿（150-300文字）:\n冒頭フックで注意を引く → 問題提起で共感 → 空白3行 → 転換ワード → 核心の入口だけ見せる → 情報を中途半端に終わらせる\n\nコメント欄1（400-500文字）:\n本文の続きを一部明かす → 全ては明かさない → コメント欄2への期待感\n\nコメント欄2（400-500文字）:\n残りの情報を全て明かす → 具体的行動を自然な文章で提案（箇条書き禁止）\n\n【情報の正確性ルール】\n* 一般常識として広く知られている事実のみ使用\n* 憶測や推測は完全禁止\n* 「絶対」「必ず」「100%」などの断定表現禁止\n\n【出力フォーマット】\nパターン1〜3それぞれで【本文投稿】【コメント欄1】【コメント欄2】を出力してください。';
    out.appendChild(createPostCard('📝 長文投稿プロンプト（'+genre+' × '+theme+'）',lp,'longform','Claude推奨'));
    var note=document.createElement('div');
    note.style.cssText='margin-top:1rem;padding:1rem;background:rgba(251,191,36,0.05);border:1px solid rgba(251,191,36,0.15);border-radius:12px;font-size:0.85rem;color:#94a3b8;line-height:1.6;';
    note.innerHTML='<strong style="color:#fbbf24;">📋 使い方</strong><br>1. 上のプロンプトを「コピーして使う」でコピー<br>2. <strong>Claude（推奨）</strong>またはChatGPTにペースト<br>3. 生成された投稿を確認し、AI臭い部分を手直し<br>4. 本文 → コメント欄1 → コメント欄2 の順でThreadsに投稿';
    out.appendChild(note);
    showToast('長文投稿プロンプトを生成しました！');
});

// ================================================================
// TAB 4: フック & CTA
// ================================================================
var selectedHook='', selectedCta='';
document.querySelectorAll('.hook-item:not(.cta)').forEach(function(item){
    item.addEventListener('click',function(){
        document.querySelectorAll('.hook-item:not(.cta)').forEach(function(h){h.classList.remove('selected');});
        item.classList.add('selected');
        selectedHook=item.getAttribute('data-hook');
        document.getElementById('selectedHook').textContent=selectedHook;
    });
});
document.querySelectorAll('.hook-item.cta').forEach(function(item){
    item.addEventListener('click',function(){
        document.querySelectorAll('.hook-item.cta').forEach(function(c){c.classList.remove('selected');});
        item.classList.add('selected');
        selectedCta=item.getAttribute('data-hook');
        document.getElementById('selectedCta').textContent=selectedCta;
    });
});
document.getElementById('copyComboBtn').addEventListener('click',function(){
    if(!selectedHook&&!selectedCta){showToast('フックとCTAを選択してください');return;}
    navigator.clipboard.writeText('【フック】'+(selectedHook||'未選択')+'\n\n【本文】\n（ここに商品紹介を書く）\n\n【CTA】'+(selectedCta||'未選択')+'↓\n#PR');
    showToast('フック＋CTA組み合わせをコピーしました！');
});

// ================================================================
// TAB 5: 分析・記録
// ================================================================
var STORAGE_KEY='threads_affi_records';
function loadRecords(){var d=localStorage.getItem(STORAGE_KEY);return d?JSON.parse(d):[];}
function saveRecords(r){localStorage.setItem(STORAGE_KEY,JSON.stringify(r));}

function renderRecords(){
    var records=loadRecords(),tbody=document.getElementById('recordsBody'),hint=document.getElementById('noRecordsHint');
    tbody.innerHTML='';
    if(records.length===0){hint.style.display='block';return;}
    hint.style.display='none';
    records.sort(function(a,b){return new Date(b.date)-new Date(a.date);});
    records.forEach(function(r,i){
        var tr=document.createElement('tr');
        tr.innerHTML='<td>'+r.date+'</td><td>'+escapeHtml(r.product)+'</td><td>'+r.postType+'</td><td>'+r.hookType+'</td><td>'+r.views.toLocaleString()+'</td><td>'+r.likes.toLocaleString()+'</td><td>'+r.clicks.toLocaleString()+'</td><td><button class="delete-btn" onclick="deleteRecord('+i+')">🗑️</button></td>';
        tbody.appendChild(tr);
    });
    analyzeWinningPatterns(records);
}

window.deleteRecord=function(i){var r=loadRecords();r.splice(i,1);saveRecords(r);renderRecords();showToast('記録を削除しました');};

document.getElementById('addRecordBtn').addEventListener('click',function(){
    var date=document.getElementById('recordDate').value,product=document.getElementById('recordProduct').value.trim();
    var hookType=document.getElementById('recordHookType').value,postType=document.getElementById('recordPostType').value;
    var views=parseInt(document.getElementById('recordViews').value)||0;
    var likes=parseInt(document.getElementById('recordLikes').value)||0;
    var clicks=parseInt(document.getElementById('recordClicks').value)||0;
    if(!date||!product){showToast('日付と商品名を入力してください');return;}
    var r=loadRecords();r.push({date:date,product:product,hookType:hookType,postType:postType,views:views,likes:likes,clicks:clicks});
    saveRecords(r);renderRecords();
    document.getElementById('recordProduct').value='';document.getElementById('recordViews').value='';
    document.getElementById('recordLikes').value='';document.getElementById('recordClicks').value='';
    showToast('投稿記録を追加しました！');
});

function analyzeWinningPatterns(records){
    var c=document.getElementById('winningPatterns');
    if(records.length<3){c.innerHTML='<p class="hint">データが3件以上蓄積されると、勝ちパターンが自動表示されます</p>';return;}
    var hs={};
    records.forEach(function(r){if(!hs[r.hookType])hs[r.hookType]={views:0,likes:0,clicks:0,count:0};hs[r.hookType].views+=r.views;hs[r.hookType].likes+=r.likes;hs[r.hookType].clicks+=r.clicks;hs[r.hookType].count++;});
    var sorted=Object.entries(hs).sort(function(a,b){return(b[1].views/b[1].count)-(a[1].views/a[1].count);});
    c.innerHTML='';
    sorted.forEach(function(e,i){var hook=e[0],s=e[1];var item=document.createElement('div');item.className='pattern-item';item.innerHTML='<strong>'+(i===0?'🏆 ':'')+hook+'</strong>（'+s.count+'件）<br>平均: 表示 '+Math.round(s.views/s.count).toLocaleString()+' / いいね '+Math.round(s.likes/s.count).toLocaleString()+' / クリック '+Math.round(s.clicks/s.count).toLocaleString();c.appendChild(item);});
}

// ================================================================
// TAB 6: チェックリスト
// ================================================================
var CK='threads_affi_checklist';
function loadCL(){var d=localStorage.getItem(CK);return d?JSON.parse(d):{};}
function saveCL(s){localStorage.setItem(CK,JSON.stringify(s));}
document.querySelectorAll('.checklist input[type="checkbox"]').forEach(function(cb,i){
    var st=loadCL();if(st[i])cb.checked=true;
    cb.addEventListener('change',function(){var s=loadCL();s[i]=cb.checked;saveCL(s);});
});

// ================================================================
// Daily Quota
// ================================================================
var QK='threads_affi_daily_quota';
function getTodayKey(){return new Date().toISOString().split('T')[0];}
function getQuotaCount(){var d=JSON.parse(localStorage.getItem(QK)||'{}');return d[getTodayKey()]||0;}
function incrementPostCount(count){var d=JSON.parse(localStorage.getItem(QK)||'{}'),t=getTodayKey();d[t]=(d[t]||0)+count;localStorage.setItem(QK,JSON.stringify(d));updateQuotaUI();}
function updateQuotaUI(){var c=getQuotaCount(),mx=6,p=Math.min((c/mx)*100,100);document.getElementById('quotaFill').style.width=p+'%';document.getElementById('quotaText').textContent=c+' / '+mx+' 投稿';}

// ================================================================
// TAB 7: バズ設計GPT
// ================================================================
document.getElementById('analyzeStructureBtn').addEventListener('click',function(){
    var sample=document.getElementById('buzzSample').value.trim();
    var genre=document.getElementById('myGenre').value.trim();
    var product=document.getElementById('myProduct').value.trim();
    if(!sample){showToast('バズ投稿を貼り付けてください');return;}
    if(!genre){showToast('あなたのジャンルを入力してください');return;}
    var out=document.getElementById('structureOutput');out.innerHTML='';
    var lines=sample.split('\n').filter(function(l){return l.trim();}),tl=sample.length,sc=lines.length;
    var hl=lines[0]||'',bl=lines.slice(1,-1).join('\n')||lines.slice(1).join('\n'),cl=lines[lines.length-1]||'';
    var ht='独自型';
    if(/知ってた|え[、？?]/.test(hl))ht='好奇心刺激型';
    else if(/やばい|バグ|衝撃|マジ/i.test(hl))ht='驚愕型';
    else if(/悩んで|辛い|しんどい/.test(hl))ht='共感型';
    else if(/円|安|コスパ|値段/.test(hl))ht='価格バグ型';
    else if(/見て|聞いて|教えて/.test(hl))ht='呼びかけ型';
    else if(/ランキング|まとめ|保存版/.test(hl))ht='リスト型';
    var ts='ニュートラル';
    if(/です|ます|ございます/.test(sample))ts='丁寧語（※非推奨）';
    else if(/だよね|じゃん|笑|www|めっちゃ/.test(sample))ts='カジュアルタメ口（推奨）';

    var ac=document.createElement('div');ac.className='structure-card';
    ac.innerHTML='<h4>🔬 構造分析結果</h4><div class="structure-label">フックタイプ</div><div class="structure-value"><strong>'+ht+'</strong>「'+escapeHtml(hl.substring(0,50))+'」</div><div class="structure-label">展開部分</div><div class="structure-value">'+escapeHtml(bl.substring(0,150))+'</div><div class="structure-label">クロージング</div><div class="structure-value">「'+escapeHtml(cl.substring(0,50))+'」</div><div class="structure-label">文体</div><div class="structure-value">'+ts+'</div><div class="structure-label">統計</div><div class="structure-value">'+tl+'文字 / '+sc+'行</div>';
    out.appendChild(ac);

    var pn=product||(genre+'のアイテム');
    var eh=document.createElement('div');eh.style.cssText='margin:1rem 0 0.5rem;font-size:0.9rem;font-weight:600;color:#f1f5f9;';eh.textContent='🔄 '+genre+'ジャンルに横展開した投稿：';out.appendChild(eh);

    [{t:'横展開1：同じフック型',s:'same'},{t:'横展開2：フック変換型',s:'conv'},{t:'横展開3：売上特化型',s:'sale'}].forEach(function(v){
        out.appendChild(createPostCard(v.t, genExp(ht,genre,pn,v.s), 'buzz', '横展開'));
    });

    var aip='以下のバズ投稿の構造を分析し、「'+genre+'」ジャンル'+(product?'（商品: '+product+'）':'')+' で同じ構造の投稿を5パターン生成してください。\n\n【分析対象のバズ投稿】\n'+sample+'\n\n【構造分析で判明したこと】\n- フックタイプ: '+ht+'\n- 文体: '+ts+'\n- 文字数: '+tl+'文字\n\n【生成ルール】\n1. 元の投稿と構造を一致させる\n2. 内容は完全に「'+genre+'」ジャンルに変換する\n3. 口調はカジュアルなタメ口\n4. 「です・ます」は禁止'+(product?'\n5. 商品名「'+product+'」を自然に組み込む':'');
    out.appendChild(createPostCard('🤖 AI用プロンプト',aip,'longform','AI用'));
    showToast('構造分析 & 横展開が完了しました！');
});

function genExp(ht,g,p,s){
    if(s==='same'){
        var m={'好奇心刺激型':'え、これ知ってた？'+g+'で今いちばん売れてるやつ、意外すぎた。\n'+p+'なんだけど、使ってる人がみんな同じこと言うの。\n「もっと早く知りたかった」って。\n気になる人はチェックしてみて。','驚愕型':g+'界隈がざわついてるの知ってる？\n'+p+'のクオリティがバグってる。\nこの値段でこれは正直ありえない。\nリンク貼っとくね。','共感型':g+'で悩んでる人多いよね...\n私もずっとそうだった。\nでも'+p+'に出会ってからマジで変わった。\n同じ悩みの人は見てみて。','価格バグ型':p+'の値段見て二度見した。\nこのクオリティでこの価格はバグ。\n'+g+'にこだわる人ほど、これの価値がわかるはず。\n在庫あるうちに見て。','呼びかけ型':'聞いて、'+g+'で最近これがめちゃくちゃ良い。\n'+p+'、使った瞬間にわかるやつ。\n気になったら見てみて。','リスト型':'永久保存版！！！\n'+g+'ガチ勢が選ぶ神アイテム！！！\n\n結論から言うと'+p+'が最強。\n理由はシンプルで、使えばわかる。','独自型':g+'に全振りしてる私が、最近ハマってるやつ。\n'+p+'、これはガチ。\n使ってみればわかるけど、概念が変わる。'};
        return m[ht]||m['独自型'];
    }else if(s==='conv'){
        return '正直、'+g+'なんて何でもいいと思ってたけど、\n'+p+'使ってから考え方変わった。\n\n「安いのでいいじゃん」って思ってた過去の自分に教えたい。\nちゃんと選ぶだけで毎日の快適さが全然違う。\n\nリンク貼っとくね。';
    }else{
        return g+'の中でも'+p+'は別格だった。\n使ってから実感してるのが、日々の満足度が明らかに上がったこと。\n\n「変えるだけでこんなに違うんだ」って衝撃。\n同じ悩みの人ほど刺さると思う。\n→\nコメント欄にリンク貼っとくね #PR';
    }
}

// ================================================================
// TAB 8: リサーチ
// ================================================================
var NETA_DB = {
    '座りっぱなし対策': [
        '座りっぱなしで太る本当の理由は代謝じゃなかった',
        '1時間に1回立つだけで血糖値が安定するらしい',
        'デスクワーカーの消費カロリー、想像以上に低い件',
        '8時間座ると寿命が縮むデータがある',
        '座り時間が長い人ほど内臓脂肪がつきやすい理由',
        '立つだけで消費カロリーが1.5倍になるって本当？',
        'テレワークになってから5kg増えた人の共通点',
        '座りっぱなしの人がまずやるべき1つのこと',
        'スタンディングデスクって実際どうなの？1ヶ月試した',
        '座り仕事でも痩せてる人がやってること3つ',
        'オフィスで1時間に1回立つを習慣化する方法',
        '座り時間と体脂肪率の相関データが衝撃だった',
        'デスクワーク10年目の体型変化がリアルすぎる',
        '在宅ワークで激太りした人の生活パターン',
        '座りっぱなしの人が最初に感じる体の変化',
        'エコノミー症候群は飛行機だけじゃない。デスクも同じ',
        '座り仕事でも代謝を落とさないコツ5つ',
        'デスクワーカーが健康診断で引っかかる項目TOP3',
        '1日の座り時間を記録してみたら怖くなった',
        '座りっぱなしが老化を加速させる仕組み',
        '通勤がなくなって消えたカロリー、月換算がヤバい',
        'オフィスチェアに8時間座った体に起きてること',
        '座りっぱなしで硬くなる筋肉ベスト3',
        '腰痛の原因、座り方じゃなくて「座り時間」だった',
        '午後になると集中力が落ちるのは座りすぎのせいかも',
        'デスクワーカーの運動量、1日何歩か計ってみた',
        '座り仕事のリスク、タバコ並みっていうデータがある',
        '休日にまとめて運動しても座りすぎは帳消しにならない',
        '会議中にできる地味だけど効果ある運動',
        '座り仕事の人が寿命を延ばすためにやるべきこと'
    ],
    '食事・プロテイン': [
        'プロテイン5種飲み比べたガチ感想',
        'デスクワーカーの昼飯、白米やめたら体重が動いた',
        'オートミール、まずいって言ってる人は作り方が違う',
        'プロテイン飲むタイミング、朝と夜でこんなに違う',
        '冷凍弁当3社を2週間ずつ試した結論',
        'コンビニで買える高タンパク低脂質メシBEST5',
        'プロテインバーのコスパ最強はどれか問題',
        '低糖質パン、正直うまいのはこの2つだけ',
        'デスクに常備すべき食品3つ',
        'オートミールのレシピ、これだけ覚えればOK',
        'MCTオイルをコーヒーに入れ始めて変わったこと',
        'タンパク質が足りてない人の体に出るサイン5つ',
        '冷凍弁当の糖質量、比較したら差がえぐかった',
        'プロテインを間食にしたら午後の効率が変わった',
        'ソイとホエイ、デスクワーカーが選ぶべきはどっち',
        '鶏むね肉を美味しく食べる方法をガチで研究した',
        '食べる順番変えただけで血糖値スパイクが消えた',
        'サラダチキンに飽きた人へ。次の高タンパク質食品',
        '朝プロテインを始めて1ヶ月の体の変化',
        'ナッツの食べすぎはNG。1日の適量は○g',
        'デスクワーカーの1日の必要タンパク質量を計算してみた',
        'プロテイン、水と牛乳どっちで割るべきか問題',
        'カロリー制限より先にやるべき食事改善があった',
        'コンビニ昼飯、同じ500円でタンパク質2倍にする方法',
        '炭水化物を完全に抜くと逆に太る理由',
        '間食をナッツに変えて2週間の体重変化',
        'プロテインの味、ハズレを引かない選び方',
        '朝食抜きは太る？デスクワーカーの場合',
        '外食ランチでもタンパク質を確保するコツ',
        '水を1日2リットル飲むだけでむくみが減った件'
    ],
    'ながらダイエット': [
        'EMSパッド、仕事中に腹に貼ってたら変化が出た',
        'デスクワーク中にできるカーフレイズが地味に効く',
        '座ったままできる腹筋運動がある',
        '会議中にこっそりやってる筋トレ3つ',
        '姿勢矯正クッション、1週間で腰痛が消えた',
        'フォームローラー、寝る前5分で翌朝の体が違う',
        'ストレッチポールに乗るだけで背中がバキバキ鳴った',
        'デスク下で使えるステッパーが意外と良い',
        '椅子に座ったままできるストレッチ5選',
        'ながら筋トレ、1ヶ月で目に見える変化が出るか検証',
        'テレビ見ながらフォームローラーが最強の習慣',
        'トイレに立つたびにスクワット5回を1ヶ月続けた結果',
        'デスクワーク中の姿勢を変えるだけでカロリー消費が変わる',
        '歯磨き中のかかと上げ下げを舐めてた',
        'エレベーターやめて階段にしたら1ヶ月で体重が動いた',
        'マッサージガンを風呂上がりに使ったらむくみが激減',
        '座りながらできるドローインが腹に効きすぎる',
        '通勤中にできる地味トレーニング3つ',
        '昼休みの10分散歩で午後の眠気が消えた',
        'ふくらはぎを揉むだけで血流が変わる実感があった',
        'バランスボールを椅子にして1週間、腹筋に効いてる',
        '仕事中にできる肩甲骨ストレッチで肩こり激減',
        '座ったまま太もも裏を伸ばす方法が気持ちいい',
        'スキマ時間に腹式呼吸するだけでウエストが変わるか',
        'デスクワーカーが通勤時間でできるダイエット',
        '「ながら」でいいから1ヶ月続いたダイエット法',
        'EMSの強度設定、最初はレベル○がおすすめ',
        'デスク周りに置いて良かったダイエットグッズ3選',
        '寝る前3分のストレッチで睡眠の質が変わった',
        '休日もソファで座りっぱなしの人がやるべき1つのこと'
    ],
    'むくみ・血流改善': [
        '夕方の脚のむくみが消えた方法がシンプルだった',
        'ふくらはぎを揉む→第二の心臓を動かすって意味',
        'むくみの原因、水の飲みすぎじゃなくて水の飲まなすぎ',
        '座りっぱなしの血流、こうやって改善した',
        'デスクワーカーの脚がパンパンになるメカニズム',
        '着圧ソックス、騙されたと思って履いたら感動した',
        'ふくらはぎの筋肉が弱いとむくみやすい理由',
        'カリウムが多い食品を意識したらむくみが減った',
        '塩分を気にし始めたら体重が2日で1kg減った',
        'むくみと脂肪の見分け方',
        '朝の顔のむくみを5分で取る方法',
        'デスクの下でできるむくみ対策3つ',
        'むくみ体質の人は水を飲め。逆説だけど本当',
        '脚を組む癖がむくみを悪化させる理由',
        'お風呂でできるむくみ解消マッサージ',
        '座りっぱなしで血栓ができるリスク、知ってた？',
        'むくみを放置すると脂肪になるって本当？',
        '足首を回すだけで血流が変わる実験をした',
        'デスクワーク中に足を上げるだけで違う',
        'むくみが取れた日の体重計、毎回驚く',
        'マッサージガンでふくらはぎをほぐしたら翌朝スッキリ',
        '冷え性の人がむくみやすい科学的な理由',
        'むくみ対策サプリ、効果あるのか1ヶ月試した',
        '夕方のむくみ、予防と解消どっちが大事か',
        'デスクの下に足置き台を置いたらむくみが減った',
        'むくみが消えると見た目がここまで変わる',
        '座りっぱなしのリンパの流れを良くする方法',
        '水分の取り方でむくみ方がこんなに変わる',
        'むくみ解消に効く食べ物TOP5',
        '昼間にむくんで夜には戻る人と戻らない人の違い'
    ],
    '間食・食欲コントロール': [
        '午後3時の間食欲、これで消した',
        'デスクにお菓子を置かなくなってから変わったこと',
        '間食のカロリー、月換算したら衝撃の数字だった',
        'チョコをナッツに変えて2週間の体重変化',
        '食欲が暴走するのは意志が弱いからじゃない',
        'プロテインを間食にしたら夕飯のドカ食いが減った',
        '空腹感と偽の食欲の見分け方',
        '午後の眠気と食欲の関係がわかったら対策できた',
        '間食に200円以内で買える高タンパク質おやつ5選',
        'コーヒー飲むタイミングで食欲が変わる',
        'デスクワーカーが間食する本当の理由はストレス',
        'ガム噛むだけで間食欲が減るのか試してみた',
        '間食をやめるんじゃなくて「変える」のが正解',
        '水を飲んでから10分待つと食欲が消える件',
        'ナッツの1日適量、手のひら1杯分って知ってた？',
        '高カカオチョコは間食OKという話の真相',
        'お菓子を買わない仕組みを作ったら自然に痩せた',
        '甘いもの欲が出た時の対処法3つ',
        'コンビニで買える間食、太るやつと痩せるやつ',
        'プロテインバーの糖質、商品によって全然違う件',
        '空腹を我慢するのは逆効果な理由',
        '間食のタイミングは15時が科学的にベスト',
        'デスクにナッツを常備してから間食の質が変わった',
        'ドライフルーツは健康的に見えて糖質が高い罠',
        '間食を記録するだけで食べる量が減った',
        '食べたい衝動、5分待てば消えるか実験した',
        '午前中にお腹が空く人は朝食の内容を変えるべき',
        'スムージーを間食にしたら満足感が段違いだった',
        '間食費を計算したら月8,000円で震えた',
        '食欲コントロールに効く栄養素はタンパク質と食物繊維'
    ],
    '体型記録・数字管理': [
        '体重を毎日記録するだけで痩せるって本当？',
        '体組成計を買ってから意識が変わった',
        '体脂肪率と体重、どっちを見るべきかの答え',
        'ウエストを週1で測るのが一番モチベ維持になる',
        '体重が増えたのに見た目が締まった理由',
        '体重の変動、水分で1日1kgは普通に動く',
        'アプリで食事記録を始めたらカロリーの現実を知った',
        '筋肉量が増えると体重は増えるけど見た目は変わる',
        '体組成計のデータ、朝と夜で全然違う問題',
        '基礎代謝を知ると食事の目安が明確になる',
        'BMIより体脂肪率を見るべき理由',
        '体重記録のコツ、毎朝トイレ後に裸で量る',
        '目標体重より目標ウエストを設定すべき理由',
        '体重が停滞した時にやるべきことと、やっちゃダメなこと',
        '写真で体型記録するのが一番モチベ上がる',
        '体脂肪率の測り方で数字が変わるカラクリ',
        '3ヶ月で-5kgした人のリアルなグラフを見せる',
        '体型管理アプリ、結局どれがいいか比較した',
        '数字を記録してる人としてない人、3ヶ月後の差',
        '体重よりもベルトの穴の位置を見る方がリアル',
        '体組成計のおすすめ、タニタとオムロン比較した',
        '記録を続けるコツ、完璧主義を捨てること',
        '週に1回だけ体重を量る方が精神的にラク説',
        '体脂肪率20%と25%の見た目の差がデカすぎる',
        '食事記録アプリのカロリー計算、どこまで正確か',
        'ダイエット開始時に測っておくべき数字5つ',
        'スマート体重計のデータをスマホで見返すと面白い',
        '体重が減らなくても体型は変わることがある証拠',
        '記録の習慣化、21日続ければ自動化される',
        '目に見える変化が出るまでの期間は平均3週間'
    ],
    'デスク環境改善': [
        'デスク周りを変えるだけで健康になれる説',
        'スタンディングデスク、高さ調整できるやつが正解',
        '椅子を変えたら腰痛が消えた話',
        '姿勢矯正クッションは安いやつでも効果あるか検証',
        'モニターの高さを変えたら肩こりが激減した',
        'デスクライトを変えたら目の疲れが減った',
        'フットレストを置いたらむくみが減った',
        'キーボードの位置で手首の痛みが変わる',
        'デスク周りに観葉植物を置くとストレスが減る研究',
        'ノートPCスタンドで姿勢が変わった',
        'デスクワーカーが揃えるべきグッズTOP5',
        'エルゴノミクスチェアの選び方で失敗しないコツ',
        'デスクの上を片付けたら集中力が上がった',
        '外付けキーボードで姿勢が変わる理由',
        'デスクワーク環境に投資すべき順番',
        '昇降デスクを導入して3ヶ月のレビュー',
        'バランスボールチェア、続く人と続かない人の差',
        '椅子の座面の高さ、正解は膝が90度',
        'デスク周りの温度管理で集中力が変わる',
        '休憩タイマーアプリを入れたら1時間に1回立てるようになった',
        'ワイヤレスマウスに変えたら肩の負担が減った',
        'ブルーライトカットメガネの効果を体感した',
        'デスク下のヒーターでふくらはぎ温めたら血流改善',
        '在宅ワークの人がリビングで仕事しちゃダメな理由',
        'デスク環境投資、コスパ最強はモニターアーム',
        '正しい椅子の座り方、実は腰を丸めないだけ',
        'ケーブル整理で精神的にスッキリした話',
        'デスクワーク環境の整え方、優先順位をつけた',
        '仕事部屋の空気を変えたら午後の眠気が減った',
        'デスク周りのBefore/After、環境で体が変わる'
    ],
    'メンタル・モチベ': [
        'ダイエットが続かない本当の理由は意志力じゃない',
        '完璧主義を捨てたら痩せ始めた話',
        '1kg減るまでのモチベ維持法',
        '「明日から」を今日にする方法',
        'ダイエットの停滞期を乗り越えるメンタル術',
        '人と比べるのをやめたら楽に痩せた',
        '小さな習慣を1つ変えるだけでいい理由',
        '体重計に毎日乗るのが怖い人へ',
        '失敗しても戻ればいい。リバウンドとの付き合い方',
        'ダイエットを義務じゃなくて実験だと思うと続く',
        '周りに宣言すると成功率が上がる心理学的な理由',
        '3日坊主でもいい。3日を10回やれば30日',
        'モチベが下がった時にやるべきたった1つのこと',
        '見た目の変化に気づくのは本人が最後',
        'ダイエット仲間がいると成功率が2倍になるデータ',
        '運動が嫌いでもいい。好きなことだけで痩せる方法',
        '「1ヶ月で10kg」は危険。現実的な目標の立て方',
        'ストレス太りの人がまずやるべきことは運動じゃない',
        '体重が減らない日のメンタルの保ち方',
        '自分を褒めるのが下手な人ほどリバウンドする',
        'ダイエットの成功は準備が8割',
        '毎日1%だけ改善すると1年で37倍になる計算',
        'SNSのビフォーアフターに騙されるな',
        'チートデイの正しい使い方と頻度',
        '我慢するダイエットは100%リバウンドする理由',
        '習慣化のコツは「ハードルを限界まで下げる」こと',
        'やる気がない日も体重計には乗る。それだけでいい',
        '「痩せたい」より「健康でいたい」の方が続く',
        'ダイエットは短距離走じゃなくて散歩',
        '1ヶ月で辞める人が9割。3ヶ月で上位10%に入れる'
    ]
};

document.getElementById('generateNetaBtn').addEventListener('click',function(){
    var genre=document.getElementById('netaGenre').value,netas=NETA_DB[genre]||[],out=document.getElementById('netaOutput');
    out.innerHTML='';
    if(netas.length===0){out.innerHTML='<p class="hint">準備中です</p>';return;}
    var sh=netas.slice().sort(function(){return Math.random()-0.5;}).slice(0,30);
    sh.forEach(function(n,i){var item=document.createElement('div');item.className='neta-item';item.innerHTML='<span>'+(i+1)+'. '+n+'</span><span class="neta-copy">📋</span>';item.addEventListener('click',function(){navigator.clipboard.writeText(n);showToast('ネタをコピー');});out.appendChild(item);});
    showToast(genre+'のネタを'+sh.length+'個生成しました！');
});

var POWER_WORDS={urgency:['今日だけ','期間限定','在庫わずか','終了間近','今すぐ','見逃し厳禁','ラストチャンス','本日限り','先着順','早い者勝ち','売り切れ必至','タイムセール'],social:['話題の','SNSで大反響','口コミ殺到','ランキング1位','芸能人愛用','プロ御用達','楽天1位','Amazon高評価','インスタで話題','満足度97%','リピート率90%'],curiosity:['え、知ってた？','実は','意外と知らない','誰も教えてくれない','裏ワザ','隠れた名品','衝撃の事実','99%の人が知らない','損してた','ヤバい','まだ知らないの？','プロが教える','常識を覆す'],emotion:['感動','号泣','鳥肌','震えた','人生変わった','救われた','衝撃','最高','幸せ','感謝','奇跡','一生モノ'],number:['3選','5つの方法','たった1分','30秒で','月1万円','年間10万','2倍','半分以下','1日30円','3日で実感','90%の人が','TOP10','100均','ワンコイン'],contrast:['高いけど安い','ズボラでもできる','努力なしで','簡単なのにプロ級','安いのに高品質','地味だけど最強','誰でもできるのにやらない','不器用でもOK','知識ゼロから','初心者でも失敗しない','放置するだけ']};
var PW_LABELS={urgency:'緊急性ワード',social:'社会的証明ワード',curiosity:'好奇心ワード',emotion:'感情ワード',number:'数字系ワード',contrast:'対比ワード'};

document.getElementById('showPowerWordsBtn').addEventListener('click',function(){
    var cat=document.getElementById('pwCategory').value,words=POWER_WORDS[cat]||[],out=document.getElementById('powerWordsOutput');
    out.innerHTML='<p style="font-size:0.8rem;color:#94a3b8;margin-bottom:0.5rem;">'+PW_LABELS[cat]+' (クリックでコピー)</p>';
    words.forEach(function(w){var span=document.createElement('span');span.className='power-word';span.textContent=w;span.addEventListener('click',function(){navigator.clipboard.writeText(w);showToast('コピー: '+w);});out.appendChild(span);});
});

var SEASONAL_EVENTS={1:[{date:'1月1日〜7日',event:'🎍 お正月セール',tip:'福袋・時短家電'},{date:'1月中旬',event:'❄️ 寒さ対策ピーク',tip:'暖房グッズ・保湿'},{date:'1月下旬',event:'📚 新年の目標',tip:'手帳・副業・学習'}],2:[{date:'2月上旬',event:'💝 バレンタイン準備',tip:'チョコ・ギフト・コスメ'},{date:'2月14日',event:'💕 バレンタインデー',tip:'美容・ご褒美'},{date:'2月下旬',event:'🌸 春の準備',tip:'花粉対策・春コーデ'}],3:[{date:'3月上旬',event:'🌸 卒業・入学準備',tip:'文房具・バッグ'},{date:'3月14日',event:'🍫 ホワイトデー',tip:'ギフト・アクセ'},{date:'3月下旬',event:'🏠 新生活準備',tip:'家電・収納・引越し'}],4:[{date:'4月上旬',event:'🌸 新生活スタート',tip:'時短家電・弁当'},{date:'4月中旬',event:'🧴 紫外線対策',tip:'日焼け止め・帽子'},{date:'4月下旬',event:'🗓️ GW準備',tip:'旅行・レジャー'}],5:[{date:'5月上旬',event:'🎏 GW・母の日前',tip:'旅行・ギフト'},{date:'5月第2日曜',event:'💐 母の日',tip:'コスメ・癒しグッズ',highlight:true},{date:'5月下旬',event:'☔ 梅雨対策',tip:'除湿器・室内干し'}],6:[{date:'6月上旬',event:'☔ 梅雨本番',tip:'傘・レインブーツ'},{date:'6月中旬',event:'🎁 父の日前',tip:'ガジェット・お酒'},{date:'6月第3日曜',event:'👔 父の日',tip:'家電・健康グッズ',highlight:true}],7:[{date:'7月上旬',event:'🏖️ 夏の準備',tip:'日焼け止め・水着'},{date:'7月中旬',event:'🛒 プライムデー',tip:'家電・ガジェット',highlight:true},{date:'7月下旬',event:'🌞 夏本番',tip:'冷感グッズ・虫除け'}],8:[{date:'8月上旬',event:'🍉 お盆準備',tip:'手土産・旅行'},{date:'8月中旬',event:'🎐 夏休み',tip:'レジャー・知育'},{date:'8月下旬',event:'📚 新学期準備',tip:'文房具・制服'}],9:[{date:'9月上旬',event:'🍂 秋の準備',tip:'秋コーデ・乾燥対策'},{date:'9月中旬',event:'🎑 敬老の日',tip:'健康グッズ・食品'},{date:'9月下旬',event:'🛍️ 楽天スーパーSALE',tip:'家電・日用品',highlight:true}],10:[{date:'10月上旬',event:'🎃 ハロウィン',tip:'コスメ・仮装'},{date:'10月中旬',event:'🍁 秋の味覚',tip:'食品・キッチン'},{date:'10月下旬',event:'❄️ 冬の準備',tip:'暖房・冬コーデ'}],11:[{date:'11月上旬',event:'🛒 BF準備',tip:'欲しい物リスト'},{date:'11月下旬',event:'🏷️ ブラックフライデー',tip:'家電・コスメ',highlight:true},{date:'11月下旬',event:'🎁 クリスマス準備',tip:'プレゼント'}],12:[{date:'12月上旬',event:'🎄 クリスマス',tip:'ギフト・コスメ'},{date:'12月中旬',event:'📦 楽天大感謝祭',tip:'まとめ買い',highlight:true},{date:'12月下旬',event:'🎍 年末準備',tip:'大掃除・おせち・福袋'}]};

function renderSeasonalCalendar(){
    var c=document.getElementById('seasonalCalendar');if(!c)return;
    var cm=new Date().getMonth()+1,months=[cm,(cm%12)+1,((cm+1)%12)+1];
    c.innerHTML='';
    months.forEach(function(m){
        var evs=SEASONAL_EVENTS[m]||[];
        var ml=document.createElement('div');ml.style.cssText='grid-column:1/-1;font-size:0.85rem;font-weight:600;margin-top:0.5rem;color:#f1f5f9;';ml.textContent=m+'月';c.appendChild(ml);
        evs.forEach(function(ev){var card=document.createElement('div');card.className='season-card'+(ev.highlight?' highlight':'');card.innerHTML='<div class="season-date">'+ev.date+'</div><div class="season-event">'+ev.event+'</div><div class="season-tip">狙い目: '+ev.tip+'</div>';c.appendChild(card);});
    });
}

document.getElementById('generateHashBtn').addEventListener('click',function(){
    var genre=document.getElementById('hashGenre').value.trim(),product=document.getElementById('hashProduct').value.trim(),out=document.getElementById('hashOutput');
    out.innerHTML='';if(!genre){showToast('ジャンルを入力してください');return;}
    var tags=['PR','広告','楽天お買い物マラソン','楽天スーパーセール','楽天ROOM','おすすめ商品'];
    genre.split(/[・\/、]/).forEach(function(g){g=g.trim();if(g)tags.push(g);});
    if(product)product.split(/[\s・]/).forEach(function(p){p=p.trim();if(p)tags.push(p);});
    [genre+'好きと繋がりたい',genre+'おすすめ',genre+'レビュー','買ってよかった','暮らしを整える','QOL爆上げ','本気でおすすめ','愛用品','リピ買い','コスパ最強'].forEach(function(t){tags.push(t);});
    var seen={},unique=[];tags.forEach(function(t){if(!seen[t]){seen[t]=true;unique.push(t);}});
    var group=document.createElement('div');group.className='hashtag-group';
    unique.forEach(function(tag){var item=document.createElement('span');item.className='hashtag-item';item.textContent='#'+tag;item.addEventListener('click',function(){navigator.clipboard.writeText('#'+tag);showToast('#'+tag+'をコピー');});group.appendChild(item);});
    out.appendChild(group);
    var btn=document.createElement('button');btn.className='btn btn-sm btn-primary';btn.style.marginTop='0.75rem';btn.textContent='📋 全てコピー';
    btn.addEventListener('click',function(){navigator.clipboard.writeText(unique.map(function(t){return '#'+t;}).join(' '));showToast('全ハッシュタグをコピー！');});
    out.appendChild(btn);
    showToast(unique.length+'個のハッシュタグを生成しました！');
});

// ===== Init =====
document.addEventListener('DOMContentLoaded',function(){
    renderRecords();updateQuotaUI();renderSeasonalCalendar();
    var di=document.getElementById('recordDate');if(di)di.value=getTodayKey();
});
