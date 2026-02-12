// ===== Threads アフィリエイト完全攻略 Dashboard =====

// ===== Security / Password Protection =====
const CORRECT_PASSWORD = 'threads-conquest';
const loginOverlay = document.getElementById('loginOverlay');
const loginBtn = document.getElementById('loginBtn');
const passwordInput = document.getElementById('accessPassword');
const loginError = document.getElementById('loginError');

function checkAuth() {
    const isAuth = localStorage.getItem('isAuth');
    if (isAuth === 'true') {
        loginOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    } else {
        loginOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

loginBtn.addEventListener('click', function () {
    if (passwordInput.value === CORRECT_PASSWORD) {
        localStorage.setItem('isAuth', 'true');
        loginOverlay.style.opacity = '0';
        loginOverlay.style.pointerEvents = 'none';
        setTimeout(function () {
            loginOverlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
        showToast('ログインしました');
    } else {
        loginError.style.display = 'block';
        passwordInput.style.border = '1px solid #f87171';
    }
});

passwordInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') loginBtn.click();
});

checkAuth();

// ===== Tab Navigation & Mobile Menu =====
var sidebar = document.querySelector('.sidebar');
var menuToggle = document.getElementById('menuToggle');
var sidebarOverlay = document.getElementById('sidebarOverlay');

function openMenu() {
    sidebar.classList.add('active');
    menuToggle.classList.add('active');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    sidebar.classList.remove('active');
    menuToggle.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

menuToggle.addEventListener('click', function () {
    if (sidebar.classList.contains('active')) {
        closeMenu();
    } else {
        openMenu();
    }
});

sidebarOverlay.addEventListener('click', function () {
    closeMenu();
});

// ===== ページ切り替え（核心部分） =====
var navItems = document.querySelectorAll('.nav-item');
var tabPanels = document.querySelectorAll('.tab-panel');

navItems.forEach(function (item) {
    item.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var targetTab = item.getAttribute('data-tab');

        // 全ナビのアクティブ解除
        navItems.forEach(function (n) {
            n.classList.remove('active');
        });

        // 全タブ非表示
        tabPanels.forEach(function (p) {
            p.classList.remove('active');
        });

        // クリックしたナビをアクティブ
        item.classList.add('active');

        // 対応タブを表示
        var targetPanel = document.getElementById('tab-' + targetTab);
        if (targetPanel) {
            targetPanel.classList.add('active');
        }

        // スマホ時はメニューを閉じる
        if (window.innerWidth <= 1024) {
            closeMenu();
        }

        // ページトップにスクロール
        window.scrollTo(0, 0);
    });
});

// ===== Toast Notification =====
function showToast(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(function () {
        t.classList.remove('show');
    }, 2000);
}

// ===== Copy Helper =====
function copyText(text, btn) {
    navigator.clipboard.writeText(text);
    btn.textContent = 'コピー完了！';
    btn.classList.add('copied');
    setTimeout(function () {
        btn.textContent = 'コピーして使う';
        btn.classList.remove('copied');
    }, 2000);
    showToast('クリップボードにコピーしました');
}

// ===== Post Card Builder =====
function createPostCard(title, content, type, badge) {
    type = type || 'affiliate';
    badge = badge || '';
    var card = document.createElement('div');
    var cssClass = type === 'non-affiliate' ? 'non-affiliate' : type === 'buzz' ? 'buzz' : type === 'longform' ? 'longform' : '';
    card.className = 'post-card ' + cssClass;

    var badgeClass = type === 'non-affiliate' ? 'non-affi' : '';
    var badgeHtml = badge ? '<span class="post-badge ' + badgeClass + '">' + badge + '</span>' : '';

    card.innerHTML =
        '<div class="post-card-header"><h4>' + title + '</h4>' + badgeHtml + '</div>' +
        '<p class="post-content">' + escapeHtml(content) + '</p>' +
        '<div class="post-actions"><button class="copy-btn" onclick="copyText(`' + escapeForJs(content) + '`, this)">コピーして使う</button></div>';
    return card;
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeForJs(str) {
    return str.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
}

// ================================================================
// TAB 1: ポスト一括生成
// ================================================================
document.getElementById('generateAllBtn').addEventListener('click', function () {
    var data = getGeneratorInputs();
    if (!data) return;
    generateAllPosts(data, false);
});

document.getElementById('generateSalesBtn').addEventListener('click', function () {
    var data = getGeneratorInputs();
    if (!data) return;
    generateAllPosts(data, true);
});

function getGeneratorInputs() {
    var productName = document.getElementById('productName').value.trim();
    if (!productName) { showToast('商品名を入力してください'); return null; }
    return {
        name: productName,
        price: document.getElementById('price').value.trim() || '（価格未入力）',
        category: document.getElementById('category').value || 'おすすめ商品',
        target: document.getElementById('target').value.trim() || 'みんな',
        benefits: document.getElementById('benefits').value.split('\n').filter(function (b) { return b.trim(); }),
        url: document.getElementById('affiliateUrl').value.trim()
    };
}

function generateAllPosts(d, salesFocused) {
    var out = document.getElementById('generatorOutput');
    out.innerHTML = '';

    var benefitText = d.benefits.map(function (b) { return '・' + b; }).join('\n');
    var b1 = d.benefits[0] || 'とにかく便利';
    var b2 = d.benefits[1] || '使い心地が最高';
    var b3 = d.benefits[2] || '毎日が楽になった';
    var urlLine = d.url ? '\nこちら↓ #PR\n' + d.url : '\nこちら↓ #PR\n(URLはこちら)';
    var commentUrl = d.url ? 'こちら↓\n' + d.url : 'こちら↓\n(URLはこちら)';

    var header = document.createElement('div');
    header.style.cssText = 'margin-bottom:1.5rem;padding:1rem;background:rgba(129,140,248,0.05);border-radius:12px;border:1px solid rgba(129,140,248,0.15);';
    header.innerHTML = '<p style="font-size:0.85rem;color:#94a3b8;">📦 <strong style="color:#f1f5f9;">' + escapeHtml(d.name) + '</strong> | ' + escapeHtml(d.category) + ' | ' + escapeHtml(d.price) + '<br>🎯 ターゲット: ' + escapeHtml(d.target) + '</p>';
    out.appendChild(header);

    out.appendChild(createPostCard(
        salesFocused ? '【売上特化】意外性系' : '① 悩み→共感→変化型',
        salesFocused
            ? d.category + '変えるだけでこんなに違うんだって、ちょっと衝撃だった。\n' + d.target + 'ってさ、地味に毎日引きずるじゃん。\nでも' + d.name + '使い始めてから明らかに変わった。\n\n使ってから変わったのが\n' + benefitText + '\n\nこれは概念変わるやつ。\n→\nコメント欄\n' + commentUrl
            : d.target + 'で悩んでる人多いよね...😭\n私もずっとそうだった。でも' + d.name + '使ってみたらマジで変わった。\n\n使ってから変わったこと：\n' + benefitText + '\n\n今では毎日がめっちゃ楽。同じ悩みがある人、これマジでおすすめ✨' + urlLine,
        'affiliate', salesFocused ? '売上特化' : 'アフィ'
    ));

    out.appendChild(createPostCard(
        salesFocused ? '【売上特化】共感系' : '② Before→Afterストーリー型',
        salesFocused
            ? d.target + 'ってさ、地味に1日引きずるじゃん。\n' + d.category + 'が合わないと余計しんどいよね。\n' + d.name + '使い始めた日、いつもより早く効果感じてびびった。\n\n使ってから変わったのが\n' + benefitText + '\n\n同じ悩みの人ほど刺さる。\n→\nコメント欄\n' + commentUrl
            : '昔の自分に教えたい。' + d.category + 'で迷走してた頃の私へ。\n' + d.name + '、これに出会ってから世界変わった。\n\nBefore: 悩みだらけの毎日\nAfter: ' + b1 + ' で超快適✨\n\nもっと早く買えばよかった。迷ってる時間もったいないよ！' + urlLine,
        'affiliate', salesFocused ? '売上特化' : 'アフィ'
    ));

    out.appendChild(createPostCard(
        salesFocused ? '【売上特化】数字系' : '③ 比較型',
        salesFocused
            ? '「口コミ多いやつ」って半信半疑だったけど、\n使ったら理由わかるタイプだった。\n' + d.name + '、マジで' + b1 + '。\n\n使ってから変わったのが\n' + benefitText + '\n\n数字の意味、使って初めてわかるやつ。\n→\nコメント欄\n' + commentUrl
            : '今までいろんな' + d.category + '試してきたけど、結局これが正解だった。\n他のは微妙だったけど、' + d.name + 'は別格。\n\n【ここが違う】\n' + benefitText + '\n\nこれ以上のもの、今のところ見つからない。ガチです。' + urlLine,
        'affiliate', salesFocused ? '売上特化' : 'アフィ'
    ));

    out.appendChild(createPostCard(
        salesFocused ? '【売上特化】ひとこと系' : '④ 会話・口コミ型',
        salesFocused
            ? 'これ、' + d.target + 'ほど合うと思う。\n' + d.name + 'の使い心地が絶妙なんよ。\n\n使ってから変わったのが\n' + benefitText + '\n\n' + d.target + 'は試す価値ある。\n→\nコメント欄\n' + commentUrl
            : '友達に「' + d.category + '何使ってる？」って聞かれたから' + d.name + '教えたら、\n翌日「マジで良かった！」ってLINEきた笑\n\n' + b1 + 'で感動してた。\n\nそういう反応もらえると嬉しいよね☺️' + urlLine,
        'affiliate', salesFocused ? '売上特化' : 'アフィ'
    ));

    out.appendChild(createPostCard(
        salesFocused ? '【売上特化】ストーリー系' : '⑤ バズ・断言型',
        salesFocused
            ? '先週ね、' + d.target + 'がきつすぎて限界だったんよ。\nその日から' + d.name + '使い始めたら、翌日の感覚が違った。\n\n使ってから変わったのが\n' + benefitText + '\n\n同じ悩みの人ほど救われるやつ。\n→\nコメント欄\n' + commentUrl
            : d.category + '、変えるなら' + d.name + '一択。\n' + b1 + 'だけで、毎日の快適さが全然違う。\n\nたかが' + d.category + '、されど' + d.category + '。\nこれは"整う暮らし"の入口かも💤' + urlLine,
        'affiliate', salesFocused ? '売上特化' : 'アフィ'
    ));

    if (salesFocused) {
        out.appendChild(createPostCard(
            '【売上特化】2行フック投稿①',
            b1 + 'で、毎日のストレスがほぼ消えた。\n' + (b2 !== b1 ? b2 : b3) + 'も実感して、生活の質が上がった。',
            'affiliate', '2行フック'
        ));
        out.appendChild(createPostCard(
            '【売上特化】2行フック投稿②',
            (b3 !== b1 ? b3 : '日々の習慣が変わって、準備がスムーズになった') + '。\n' + d.name + 'に変えてから、もう前のには戻れない。',
            'affiliate', '2行フック'
        ));
    }

    var separator = document.createElement('div');
    separator.style.cssText = 'margin:1.5rem 0;padding:0.5rem;text-align:center;color:#94a3b8;font-size:0.8rem;border-top:1px solid rgba(255,255,255,0.06);';
    separator.textContent = '━━ 非アフィリエイト投稿（ファン化用） ━━';
    out.appendChild(separator);

    out.appendChild(createPostCard('① 有益情報型', d.category + 'の質を上げるだけで、人生の快適さってマジで変わるよね🌙\n最近意識してるのは「無理して頑張るより、環境を整える」こと。\n\n例えば、' + d.target + 'に気をつけるだけで毎日の感覚が全然違う。\n地味だけど、これが最強の自己投資かも。みんなはどうしてる？', 'non-affiliate', '有益'));
    out.appendChild(createPostCard('② 挨拶・自己紹介型', '最近、' + d.category + 'に全振りしてます。日々の快適さが人生の快適さだと思ってる🌙\n\n昔は気にしなかったけど、今はちゃんと環境を整えることの方がうれしい。\n無理して頑張るより、ちゃんと休むほうが結果が出る。そんな過ごし方をしたいなと思う。', 'non-affiliate', '自己紹介'));
    out.appendChild(createPostCard('③ 読者への問いかけ型', d.target + 'って、地味にショックじゃない？\nちゃんとケアしてるはずなのに変わらない。あの感覚、ずっと嫌だった。\n\nでも原因は努力不足じゃなくて"選び方"だったのかも。\nみんなの' + d.category + '選び、合ってる？', 'non-affiliate', '問いかけ'));
    out.appendChild(createPostCard('④ 共感ストーリー型', '昔は' + d.category + 'なんて何でもいいと思ってた。\nだけど、ちゃんと向き合ったら日々の快適さが全然違うって気づいた。\n\nしっかり環境を整えるって、最強の自己投資かもしれない🌙', 'non-affiliate', '共感'));
    out.appendChild(createPostCard('⑤ バズ型', '永久保存版！！！\n知らなきゃ損する' + d.category + '攻略リスト！！！\n\n・疲れた時 → まずは環境を見直す\n・' + d.target + ' → 適切なアイテムを選ぶ\n・継続できない → ハードルを極限まで下げる\n・迷った時 → レビューの数字だけ見る\n\nこれ自然にできてる人は強い✨', 'non-affiliate', 'バズ'));

    var sep2 = document.createElement('div');
    sep2.style.cssText = 'margin:1.5rem 0;padding:0.5rem;text-align:center;color:#94a3b8;font-size:0.8rem;border-top:1px solid rgba(255,255,255,0.06);';
    sep2.textContent = '━━ 一言投稿（画像に重ねる用） ━━';
    out.appendChild(sep2);

    var oneLiners = [
        b1.replace(/→.*$/, '').replace(/が.*$/, '') + 'が消えた',
        '寝るのが下手だった私へ',
        'もう普通の' + d.category + 'には戻れない',
        d.category + '、変えるならまずこれ',
        '努力より、' + d.category + 'の質で人生変わる'
    ];
    oneLiners.forEach(function (line, i) {
        out.appendChild(createPostCard('一言投稿 ' + (i + 1), line, 'affiliate', '一言'));
    });

    showToast((salesFocused ? '売上特化' : '全パターン') + 'で ' + out.children.length + ' 件生成しました！');
    incrementPostCount(salesFocused ? 7 : 10);
}

// ================================================================
// TAB 2: バズ職人
// ================================================================
document.getElementById('generateBuzzBtn').addEventListener('click', function () {
    var product = document.getElementById('buzzProduct').value.trim();
    var price = document.getElementById('buzzPrice').value.trim();
    var target = document.getElementById('buzzTarget').value.trim();
    var features = document.getElementById('buzzFeatures').value.split('\n').filter(function (f) { return f.trim(); });
    if (!product) { showToast('商品名を入力してください'); return; }

    var feat = features.join('、') || 'デザイン性が高い';
    var out = document.getElementById('buzzOutput');
    out.innerHTML = '';

    var header = document.createElement('div');
    header.style.cssText = 'margin-bottom:1.5rem;padding:1rem;background:rgba(244,114,182,0.05);border-radius:12px;border:1px solid rgba(244,114,182,0.15);';
    header.innerHTML = '<p style="font-size:0.85rem;color:#94a3b8;">🔥 <strong style="color:#f1f5f9;">' + escapeHtml(product) + '</strong> | ' + escapeHtml(price || '価格未入力') + ' | 🎯 ' + escapeHtml(target || 'ターゲット未入力') + '</p>';
    out.appendChild(header);

    var buzzPosts = [
        { title: '【1】きっかけ目撃スタイル', content: 'カフェで隣の人が' + product + '使ってて、\n' + feat + 'が気になりすぎて、\n帰り道にこっそり調べたら想像以上だった…\n気になる人だけ見てね。' },
        { title: '【2】進化ショックスタイル', content: '今の' + product + 'ってこんなクオリティなの？\nえ？ってなるくらい' + feat + '。\n' + (target || 'みんな') + 'は一回見たほうがいい。\nレビュー読めば理由がわかる。' },
        { title: '【3】価格バグスタイル', content: '値段見て二度見した…' + (price || 'この価格') + 'ってバグ？\n' + feat + 'でこの値段で買えるのは普通に強い。\n長く使えるやつってこういうの。\n分かる人は絶対共感すると思う。' },
        { title: '【4】センス一致スタイル', content: 'これ好きな人、確実に仲間。\n' + feat + 'にピンときた人絶対いるよね？\nこれ持ってるだけでセンスいい人に見えるやつ。\n気になる人はチェックしてみて。' },
        { title: '【5】情報ラッシュスタイル', content: 'え…' + product + '、良すぎない？\n' + features.map(function (f) { return f.trim(); }).join('、しかも') + '。\nしかも' + (price || 'コスパ') + 'もありがたい。\n在庫あるうちに見て。' },
        { title: '【6】問いかけ共感スタイル', content: '聞いて、' + (target || 'これで悩んでる人') + 'いない？\n正直"これだ"ってのが見つからなくて悩んでたから分かる。\n' + product + '、' + feat + 'のちょうどいいやつ。\nリンク貼っとくね。' }
    ];

    buzzPosts.forEach(function (p) {
        out.appendChild(createPostCard(p.title, p.content, 'buzz', 'バズ'));
    });

    var commentNote = document.createElement('div');
    commentNote.style.cssText = 'margin-top:1rem;padding:1rem;background:rgba(244,114,182,0.05);border:1px solid rgba(244,114,182,0.1);border-radius:12px;font-size:0.8rem;color:#94a3b8;';
    commentNote.innerHTML = '💡 <strong>投稿のコツ</strong>: 本文には画像を添付し、URLはコメント欄に貼ってください。<br>最後の誘導文は毎回自分の言葉にアレンジすると伸びやすいです！';
    out.appendChild(commentNote);

    showToast('バズ投稿6パターン生成完了！');
    incrementPostCount(6);
});

// ================================================================
// TAB 3: 長文生成プロンプト
// ================================================================
document.getElementById('generateLongPromptBtn').addEventListener('click', function () {
    var genre = document.getElementById('longGenre').value;
    var target = document.getElementById('longTarget').value.trim();
    var theme = document.getElementById('longTheme').value.trim();

    if (!genre || !target || !theme) {
        showToast('ジャンル・ターゲット・テーマを全て入力してください');
        return;
    }

    var out = document.getElementById('longformOutput');
    out.innerHTML = '';

    var longPrompt = 'あなたはThreadsで月間数百万インプレッションを獲得する投稿設計の専門家です。滞在時間60秒以上、高エンゲージメントを獲得できる投稿を3パターン作成してください。\n\n【入力情報】\n1. ジャンル: ' + genre + '\n2. ターゲット: ' + target + '\n3. 発信したいテーマ: ' + theme + '\n\n【出力する投稿は3パターン】\nパターン1: 逆張り否定型\nパターン2: ビフォーアフター型\nパターン3: 失敗パターン暴露型\n\n【超重要】内容の完全差別化ルール\n同じテーマでも、3パターンで扱う「具体的な内容・方法・ポイント」は完全に異なるものにする。\n\n【投稿構成（絶対厳守）】\n1. 本文投稿（150-300文字厳守）\n2. コメント欄1（400-500文字厳守）\n3. コメント欄2（400-500文字厳守）\n\n【口調ルール（超重要）】\n* 語尾: 「〜だよ」「〜なんだよね」「〜から」「〜してみて」\n* 「です・ます調」は絶対禁止\n* カジュアル表現: 「マジで」「ちょっと」「なんか」「めっちゃ」\n* 箇条書き・番号付きリスト・記号「・」は絶対に使わない\n* 中学生が理解できる言葉\n* 説教臭くしない\n\n【各ブロックの役割】\n本文投稿（150-300文字）:\n冒頭フックで注意を引く → 問題提起で共感 → 空白3行 → 転換ワード → 核心の入口だけ見せる → 情報を中途半端に終わらせる\n\nコメント欄1（400-500文字）:\n本文の続きを一部明かす → 全ては明かさない → コメント欄2への期待感\n\nコメント欄2（400-500文字）:\n残りの情報を全て明かす → 具体的行動を自然な文章で提案（箇条書き禁止）\n\n【情報の正確性ルール】\n* 一般常識として広く知られている事実のみ使用\n* 憶測や推測は完全禁止\n* 「絶対」「必ず」「100%」などの断定表現禁止\n\n【出力フォーマット】\nパターン1〜3それぞれで【本文投稿】【コメント欄1】【コメント欄2】を出力してください。';

    out.appendChild(createPostCard('📝 長文投稿プロンプト（' + genre + ' × ' + theme + '）', longPrompt, 'longform', 'Claude推奨'));

    var note = document.createElement('div');
    note.style.cssText = 'margin-top:1rem;padding:1rem;background:rgba(251,191,36,0.05);border:1px solid rgba(251,191,36,0.15);border-radius:12px;font-size:0.85rem;color:#94a3b8;line-height:1.6;';
    note.innerHTML = '<strong style="color:#fbbf24;">📋 使い方</strong><br>1. 上のプロンプトを「コピーして使う」でコピー<br>2. <strong>Claude（推奨）</strong>またはChatGPTにペースト<br>3. 生成された投稿を確認し、AI臭い部分を手直し<br>4. 本文 → コメント欄1 → コメント欄2 の順でThreadsに投稿<br><br>💡 <strong>ポイント</strong>: テーマを具体的にするほど精度UP！';
    out.appendChild(note);

    showToast('長文投稿プロンプトを生成しました！');
});

// ================================================================
// TAB 4: フック & CTA ライブラリ
// ================================================================
var selectedHook = '';
var selectedCta = '';

document.querySelectorAll('.hook-item:not(.cta)').forEach(function (item) {
    item.addEventListener('click', function () {
        document.querySelectorAll('.hook-item:not(.cta)').forEach(function (h) { h.classList.remove('selected'); });
        item.classList.add('selected');
        selectedHook = item.getAttribute('data-hook');
        document.getElementById('selectedHook').textContent = selectedHook;
        showToast('フック選択: ' + selectedHook);
    });
});

document.querySelectorAll('.hook-item.cta').forEach(function (item) {
    item.addEventListener('click', function () {
        document.querySelectorAll('.hook-item.cta').forEach(function (c) { c.classList.remove('selected'); });
        item.classList.add('selected');
        selectedCta = item.getAttribute('data-hook');
        document.getElementById('selectedCta').textContent = selectedCta;
        showToast('CTA選択: ' + selectedCta);
    });
});

document.getElementById('copyComboBtn').addEventListener('click', function () {
    if (!selectedHook && !selectedCta) { showToast('フックとCTAを選択してください'); return; }
    var combo = '【フック】' + (selectedHook || '未選択') + '\n\n【本文】\n（ここに商品紹介を書く）\n\n【CTA】' + (selectedCta || '未選択') + '↓\n#PR';
    navigator.clipboard.writeText(combo);
    showToast('フック＋CTA組み合わせをコピーしました！');
});

// ================================================================
// TAB 5: 分析・記録
// ================================================================
var STORAGE_KEY = 'threads_affi_records';

function loadRecords() {
    var data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function saveRecords(records) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function renderRecords() {
    var records = loadRecords();
    var tbody = document.getElementById('recordsBody');
    var hint = document.getElementById('noRecordsHint');
    tbody.innerHTML = '';

    if (records.length === 0) {
        hint.style.display = 'block';
        return;
    }
    hint.style.display = 'none';

    records.sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
    records.forEach(function (r, i) {
        var tr = document.createElement('tr');
        tr.innerHTML = '<td>' + r.date + '</td><td>' + escapeHtml(r.product) + '</td><td>' + r.postType + '</td><td>' + r.hookType + '</td><td>' + r.views.toLocaleString() + '</td><td>' + r.likes.toLocaleString() + '</td><td>' + r.clicks.toLocaleString() + '</td><td><button class="delete-btn" onclick="deleteRecord(' + i + ')">🗑️</button></td>';
        tbody.appendChild(tr);
    });

    analyzeWinningPatterns(records);
}

window.deleteRecord = function (index) {
    var records = loadRecords();
    records.splice(index, 1);
    saveRecords(records);
    renderRecords();
    showToast('記録を削除しました');
};

document.getElementById('addRecordBtn').addEventListener('click', function () {
    var date = document.getElementById('recordDate').value;
    var product = document.getElementById('recordProduct').value.trim();
    var hookType = document.getElementById('recordHookType').value;
    var postType = document.getElementById('recordPostType').value;
    var views = parseInt(document.getElementById('recordViews').value) || 0;
    var likes = parseInt(document.getElementById('recordLikes').value) || 0;
    var clicks = parseInt(document.getElementById('recordClicks').value) || 0;

    if (!date || !product) { showToast('日付と商品名を入力してください'); return; }

    var records = loadRecords();
    records.push({ date: date, product: product, hookType: hookType, postType: postType, views: views, likes: likes, clicks: clicks });
    saveRecords(records);
    renderRecords();

    document.getElementById('recordProduct').value = '';
    document.getElementById('recordViews').value = '';
    document.getElementById('recordLikes').value = '';
    document.getElementById('recordClicks').value = '';

    showToast('投稿記録を追加しました！');
});

function analyzeWinningPatterns(records) {
    var container = document.getElementById('winningPatterns');
    if (records.length < 3) {
        container.innerHTML = '<p class="hint">データが3件以上蓄積されると、勝ちパターンが自動表示されます</p>';
        return;
    }

    var hookStats = {};
    records.forEach(function (r) {
        if (!hookStats[r.hookType]) hookStats[r.hookType] = { views: 0, likes: 0, clicks: 0, count: 0 };
        hookStats[r.hookType].views += r.views;
        hookStats[r.hookType].likes += r.likes;
        hookStats[r.hookType].clicks += r.clicks;
        hookStats[r.hookType].count++;
    });

    var sorted = Object.entries(hookStats).sort(function (a, b) { return (b[1].views / b[1].count) - (a[1].views / a[1].count); });

    container.innerHTML = '';
    sorted.forEach(function (entry, i) {
        var hook = entry[0];
        var stats = entry[1];
        var avgViews = Math.round(stats.views / stats.count);
        var avgLikes = Math.round(stats.likes / stats.count);
        var avgClicks = Math.round(stats.clicks / stats.count);
        var item = document.createElement('div');
        item.className = 'pattern-item';
        item.innerHTML = '<strong>' + (i === 0 ? '🏆 ' : '') + hook + '</strong>（' + stats.count + '件）<br>平均: 表示 ' + avgViews.toLocaleString() + ' / いいね ' + avgLikes.toLocaleString() + ' / クリック ' + avgClicks.toLocaleString();
        container.appendChild(item);
    });
}

// ================================================================
// TAB 6: ガイド（チェックリスト永続化）
// ================================================================
var CHECKLIST_KEY = 'threads_affi_checklist';

function loadChecklist() {
    var data = localStorage.getItem(CHECKLIST_KEY);
    return data ? JSON.parse(data) : {};
}

function saveChecklist(state) {
    localStorage.setItem(CHECKLIST_KEY, JSON.stringify(state));
}

document.querySelectorAll('.checklist input[type="checkbox"]').forEach(function (cb, i) {
    var state = loadChecklist();
    if (state[i]) cb.checked = true;
    cb.addEventListener('change', function () {
        var st = loadChecklist();
        st[i] = cb.checked;
        saveChecklist(st);
    });
});

// ================================================================
// Daily Quota Tracker
// ================================================================
var QUOTA_KEY = 'threads_affi_daily_quota';

function getTodayKey() { return new Date().toISOString().split('T')[0]; }

function getQuotaCount() {
    var data = JSON.parse(localStorage.getItem(QUOTA_KEY) || '{}');
    return data[getTodayKey()] || 0;
}

function incrementPostCount(count) {
    var data = JSON.parse(localStorage.getItem(QUOTA_KEY) || '{}');
    var today = getTodayKey();
    data[today] = (data[today] || 0) + count;
    localStorage.setItem(QUOTA_KEY, JSON.stringify(data));
    updateQuotaUI();
}

function updateQuotaUI() {
    var count = getQuotaCount();
    var max = 6;
    var pct = Math.min((count / max) * 100, 100);
    document.getElementById('quotaFill').style.width = pct + '%';
    document.getElementById('quotaText').textContent = count + ' / ' + max + ' 投稿';
}

// ================================================================
// TAB 7: バズ設計GPT
// ================================================================
document.getElementById('analyzeStructureBtn').addEventListener('click', function () {
    var sample = document.getElementById('buzzSample').value.trim();
    var genre = document.getElementById('myGenre').value.trim();
    var product = document.getElementById('myProduct').value.trim();

    if (!sample) { showToast('バズ投稿を貼り付けてください'); return; }
    if (!genre) { showToast('あなたのジャンルを入力してください'); return; }

    var out = document.getElementById('structureOutput');
    out.innerHTML = '';

    var lines = sample.split('\n').filter(function (l) { return l.trim(); });
    var totalLength = sample.length;
    var sentenceCount = lines.length;
    var hookLine = lines[0] || '';
    var bodyLines = lines.slice(1, -1).join('\n') || lines.slice(1).join('\n');
    var closingLine = lines[lines.length - 1] || '';

    var hookType = '独自型';
    if (/知ってた|え[、？?]/.test(hookLine)) hookType = '好奇心刺激型';
    else if (/やばい|バグ|衝撃|マジ/i.test(hookLine)) hookType = '驚愕型';
    else if (/悩んで|辛い|しんどい/.test(hookLine)) hookType = '共感型';
    else if (/円|安|コスパ|値段/.test(hookLine)) hookType = '価格バグ型';
    else if (/見て|聞いて|教えて/.test(hookLine)) hookType = '呼びかけ型';
    else if (/ランキング|まとめ|保存版/.test(hookLine)) hookType = 'リスト型';

    var toneStyle = 'ニュートラル';
    if (/です|ます|ございます/.test(sample)) toneStyle = '丁寧語（※アフィ非推奨）';
    else if (/だよね|じゃん|笑|www|めっちゃ/.test(sample)) toneStyle = 'カジュアルタメ口（推奨）';

    var analysisCard = document.createElement('div');
    analysisCard.className = 'structure-card';
    analysisCard.innerHTML = '<h4>🔬 構造分析結果</h4><div class="structure-label">フックタイプ</div><div class="structure-value"><strong>' + hookType + '</strong>「' + escapeHtml(hookLine.substring(0, 50)) + (hookLine.length > 50 ? '...' : '') + '」</div><div class="structure-label">展開部分</div><div class="structure-value">' + escapeHtml(bodyLines.substring(0, 150)) + (bodyLines.length > 150 ? '...' : '') + '</div><div class="structure-label">クロージング</div><div class="structure-value">「' + escapeHtml(closingLine.substring(0, 50)) + '」</div><div class="structure-label">文体</div><div class="structure-value">' + toneStyle + '</div><div class="structure-label">統計</div><div class="structure-value">' + totalLength + '文字 / ' + sentenceCount + '行</div>';
    out.appendChild(analysisCard);

    var expansionHeader = document.createElement('div');
    expansionHeader.style.cssText = 'margin:1rem 0 0.5rem;font-size:0.9rem;font-weight:600;color:#f1f5f9;';
    expansionHeader.textContent = '🔄 ' + genre + 'ジャンルに横展開した投稿：';
    out.appendChild(expansionHeader);

    var productName = product || (genre + 'のアイテム');

    var variations = [
        { title: '横展開パターン1：同じフック型', content: generateExpansion(hookType, genre, productName, 'same_hook') },
        { title: '横展開パターン2：フック変換型', content: generateExpansion(hookType, genre, productName, 'converted_hook') },
        { title: '横展開パターン3：売上特化型', content: generateExpansion(hookType, genre, productName, 'sales_focus') }
    ];

    variations.forEach(function (v) {
        out.appendChild(createPostCard(v.title, v.content, 'buzz', '横展開'));
    });

    var aiPromptContent = '以下のバズ投稿の構造を分析し、「' + genre + '」ジャンル' + (product ? '（商品: ' + product + '）' : '') + 'で同じ構造の投稿を5パターン生成してください。\n\n【分析対象のバズ投稿】\n' + sample + '\n\n【構造分析で判明したこと】\n- フックタイプ: ' + hookType + '\n- 文体: ' + toneStyle + '\n- 文字数: ' + totalLength + '文字\n\n【生成ルール】\n1. 元の投稿と「構造（フック→展開→クロージング）」を一致させる\n2. 内容は完全に「' + genre + '」ジャンルに変換する\n3. 口調は友達への LINE のようなカジュアルなタメ口\n4. 「です・ます」は禁止' + (product ? '\n5. 商品名「' + product + '」を自然に組み込む' : '');

    out.appendChild(createPostCard('🤖 さらに深い分析用プロンプト（Claude/ChatGPT用）', aiPromptContent, 'longform', 'AI用'));

    showToast('構造分析 & 横展開が完了しました！');
});

function generateExpansion(hookType, genre, product, style) {
    if (style === 'same_hook') {
        var templates = {
            '好奇心刺激型': 'え、これ知ってた？' + genre + 'で今いちばん売れてるやつ、意外すぎた。\n' + product + 'なんだけど、使ってる人がみんな同じこと言うの。\n「もっと早く知りたかった」って。\n気になる人はチェックしてみて。',
            '驚愕型': genre + '界隈がざわついてるの知ってる？\n' + product + 'のクオリティがバグってる。\nこの値段でこれは正直ありえない。\nリンク貼っとくね。',
            '共感型': genre + 'で悩んでる人多いよね...\n私もずっとそうだった。\nでも' + product + 'に出会ってからマジで変わった。\n同じ悩みの人は見てみて。',
            '価格バグ型': product + 'の値段見て二度見した。\nこのクオリティでこの価格はバグ。\n' + genre + 'にこだわる人ほど、これの価値がわかるはず。\n在庫あるうちに見て。',
            '呼びかけ型': '聞いて、' + genre + 'で最近これがめちゃくちゃ良い。\n' + product + '、使った瞬間にわかるやつ。\n気になったら見てみて。',
            'リスト型': '永久保存版！！！\n' + genre + 'ガチ勢が選ぶ神アイテム！！！\n\n結論から言うと' + product + 'が最強。\n理由はシンプルで、使えばわかる。',
            '独自型': genre + 'に全振りしてる私が、最近ハマってるやつ。\n' + product + '、これはガチ。\n使ってみればわかるけど、概念が変わる。'
        };
        return templates[hookType] || templates['独自型'];
    } else if (style === 'converted_hook') {
        return '正直、' + genre + 'なんて何でもいいと思ってたけど、\n' + product + '使ってから考え方変わった。\n\n「安いのでいいじゃん」って思ってた過去の自分に教えたい。\nちゃんと選ぶだけで毎日の快適さが全然違う。\n\nリンク貼っとくね。';
    } else {
        return genre + 'の中でも' + product + 'は別格だった。\n使ってから実感してるのが、日々の満足度が明らかに上がったこと。\n\n「変えるだけでこんなに違うんだ」って衝撃。\n同じ悩みの人ほど刺さると思う。\n→\nコメント欄にリンク貼っとくね #PR';
    }
}

// ================================================================
// TAB 8: リサーチアシスタント
// ================================================================
var NETA_DB = {
    '美容・コスメ': ['1,000円以下で買えるデパコス級コスメBEST5','ほうれい線が3日で薄くなる方法があった','メイク崩れしない最強下地を発見した','夜塗るだけで翌朝ぷるぷるオイル','30代から始めるガチのシミ対策','コンビニで買える神スキンケア','ファンデいらずの美肌を作る朝ルーティン','唇が荒れない口紅の選び方','クマが消える裏ワザ','ドラコスだけで作る韓国メイク','毛穴が消えるクレンジングの正解','日焼け止め、塗り方間違えてる人99%','プチプラで作る透明感メイク','目の下のたるみに効いたもの','化粧水、叩き込むのは間違い','40代が垢抜けるリップの色','ニキビ跡を消した方法','メイク直しに最強のアイテム','毎日5分の顔マッサージで小顔に','まつ毛が伸びる美容液の真実','美容液の塗る順番、間違えてた','乾燥肌が治ったのは○○を変えたから','アイシャドウの塗り方で目が2倍に','肌荒れしない生活習慣5つ','石鹸洗顔が肌にいい理由','二重になれるアイプチの貼り方','首のシワを防ぐ方法','ハンドクリームの塗り方で手が変わる','美白になれる食べ物TOP3','髪の毛ツヤツヤにするヘアオイル'],
    '寝具・睡眠': ['入眠が20分→5分になった方法','枕を変えるだけで首の痛みが消えた','睡眠の質を上げる寝室環境の整え方','夜中に起きなくなった最強グッズ','朝スッキリ起きるための夜ルーティン','寝る前にやっちゃいけない5つのこと','横向き寝の人が選ぶべき枕','マットレスの硬さ、間違えてる人多い','90分サイクル睡眠法の真実','いびきが減ったアイテム','深い睡眠を増やす食べ物','寝る前のスマホ、いつやめるべき？','冬の布団、暖かさの正解','夏の快眠グッズBEST3','昼寝の最適な長さと取り方','睡眠アプリで分析したらヤバかった','パジャマの素材で睡眠が変わる','寝室の温度と湿度の正解','カフェインを何時までに止めるべき？','睡眠負債の返し方','寝つきが良くなるストレッチ3選','枕の高さの正解を見つけた','ベッドの位置で睡眠が変わる','睡眠に効くアロマオイル','朝活が続く人の睡眠ルーティン','子どもの寝かしつけ最短ルート','仮眠の取り方で午後が変わる','睡眠不足の肌への影響がヤバい','寝落ちしやすくなるBGMの選び方','布団から出られない朝の対処法'],
    'ダイエット': ['食事制限なしで-3kg落とした方法','腸活で痩せた人がやってること','お腹だけ痩せる方法があった','太らないおやつの選び方','1日5分で変わる宅トレ','置き換えダイエットの正解','プロテインの選び方で結果が変わる','痩せる食べ順ダイエットの真実','糖質制限のやりすぎは逆効果','水を飲むだけで痩せる理由','ストレス太りの解消法','基礎代謝を上げる生活習慣','産後ダイエットで成功した方法','むくみを取るだけで見た目が変わる','痩せ体質になる朝の習慣','外食でも太らないメニューの選び方','サプリメントの真実','体重より体脂肪率を見るべき理由','リバウンドしないダイエットの原則','二の腕を細くするストレッチ','太もも痩せの最短ルート','脚やせマッサージの正しいやり方','寝る前に食べても太らないもの','便秘解消で体重が落ちた','ダイエット中の停滞期の乗り越え方','モチベーション維持のコツ','1ヶ月で見た目が変わる方法','太る飲み物ランキング','痩せてる人の食習慣','ダイエットアプリの活用法'],
    '家電・ガジェット': ['買ってよかった家電ベスト5','時短家電で毎日1時間生まれた','ロボット掃除機の選び方の正解','ワイヤレスイヤホン、2万円以下の最適解','空気清浄機で花粉症が楽になった','モバイルバッテリーの選び方','スマートホームで生活が変わった','電動歯ブラシの効果がすごい','食洗機は人生を変える','iPadの活用法10選','PCデスク周りの最適解','サブスクの見直しで月5000円浮いた','4Kモニターの選び方','ノイキャンヘッドホンの効果','スマートウォッチで健康管理','充電器を1つにまとめた方法','電気代を下げる家電の使い方','プロジェクターで映画館を作った','キーボードの選び方で効率UP','Wi-Fiルーターを変えたら速度2倍','防水スピーカーで風呂時間が変わった','ドライヤーで髪質が変わった','加湿器の正しい選び方','照明を変えるだけで部屋が変わる','カメラ初心者の最初の1台','電子書籍リーダーのメリット','自動調理鍋の実力','ゲーミングチェアの正解','USBハブの選び方','ポータブル電源の活用法'],
    'ファッション': ['30代がやっちゃダメなコーデ5選','1万円以内で垢抜けるユニクロコーデ','靴を変えるだけで印象が変わる','ミニマリストのワードローブ','体型カバーできるトップスの選び方','小物で差がつくコーデ術','白Tシャツの正解ブランド','スニーカーの洗い方','バッグ1つで格上げするコーデ','プチプラで作る高見えコーデ','色合わせの基本ルール','骨格診断別の似合う服','パーソナルカラーで失敗しない','通勤服の正解','オンラインで失敗しない服の買い方','冬のアウターの選び方','デニムの洗濯頻度の正解','アクセサリーの重ね付けルール','40代のカジュアルコーデ','体型別パンツの選び方','夏の涼しいおしゃれ','帽子で変わる印象','時計の選び方','サングラスの似合う選び方','セール品の上手な買い方','古着の賢い選び方','季節の変わり目コーデ','ヘアアレンジで服が映える','靴下コーデの正解','スーツの着こなし'],
    '食品・健康': ['腸活で変わった体調の変化','免疫力アップの食品5選','疲れが取れないのは○○不足','プロテインの正しい飲み方','サプリの選び方で結果が変わる','朝フルーツの効果がすごい','白砂糖をやめた結果','グルテンフリー生活の実感','コーヒーの最適な飲み方','水分補給の正しいタイミング','ナッツの選び方','発酵食品で体調が激変','オートミールの美味しい食べ方','MCTオイルの効果','ビタミンDの不足が怖い','鉄分不足の症状チェック','プロバイオティクスの選び方','食事のタイミングで太りやすさが変わる','スーパーフードの真実','冷凍フルーツの活用法','体にいい油の選び方','カフェインの上手な摂り方','疲労回復に効く食べ物','アンチエイジング食品','食物繊維の取り方','コラーゲンの効果的な摂取法','ミネラル不足の怖さ','断食の正しいやり方','血糖値を上げない食べ方','タンパク質の必要量'],
    '育児・ベビー': ['0歳児の寝かしつけ30分以内ルート','離乳食の時短ワザ5選','ワーママの朝ルーティン','子どもが泣き止むグッズBEST3','お出かけ荷物の減らし方','イヤイヤ期の乗り越え方','幼児教育いつから始める？','知育玩具の選び方','ベビーカーの選び方の正解','チャイルドシートの正しい付け方','子連れ外食のコツ','育児の息抜き方法','保育園の持ち物リスト','子どもの風邪予防','お風呂の時短テク','絵本の読み聞かせのコツ','産後の体型戻し','子どもの食べムラ対策','ワンオペ風呂の攻略法','子連れ旅行の持ち物','習い事の選び方','子どものスマホルール','兄弟喧嘩の仲裁法','子どもの自己肯定感の育て方','入園準備リスト','小学校入学準備','子どもの睡眠時間の正解','産後うつの対処法','夫婦の育児分担','子育て支援制度の活用法'],
    '日用品・暮らし': ['100均の神アイテム10選','掃除の時短テク5つ','洗濯の失敗を防ぐコツ','収納術で部屋が広くなった','キッチン整理の正解','トイレ掃除の最短ルート','柔軟剤の使い方で香りが変わる','換気扇掃除のラクな方法','排水口の臭い対策','食器洗いの時短テク','カビ対策の正解','窓掃除のラクなやり方','生活費を月1万円下げた方法','ゴミ出しを楽にするコツ','冷蔵庫整理のルール','防災グッズの見直し','エアコン掃除の方法','タオルのニオイ対策','クローゼット整理のコツ','布団のダニ対策','食品ロスを減らす方法','照明の選び方で部屋が変わる','カーテンの洗濯頻度','ゴキブリ対策の決定版','インテリアのプチ変更で気分UP','断捨離のコツ','ルーティン家事で週末フリーに','引っ越しの段取り','お風呂掃除の時短法','部屋の模様替えのコツ'],
    '副業・お金': ['副業で月3万稼ぐまでのステップ','SNSで収益化する方法','アフィリエイトの始め方','ポイ活で年間5万円貯めた','投資信託の選び方','NISAの始め方ガイド','固定費を月2万円削減した方法','クレカの選び方で年間1万円得','ふるさと納税の攻略法','在宅ワークの始め方','ブログで稼ぐ方法','ハンドメイド販売のコツ','確定申告の基礎知識','自己アフィリエイトで5万円','フリーランスの始め方','お金が貯まる人の習慣','家計簿アプリの活用法','保険の見直しで節約','電気代を年間2万円削減','格安SIMで月5,000円節約','楽天経済圏の活用法','貯金ができない人の特徴','投資初心者が避けるべき失敗','AIを使った副業','スキルなしで始められる副業','時間管理術で副業時間を作る','ココナラで稼ぐコツ','メルカリで月1万円稼ぐ方法','Webライターの始め方','動画編集で稼ぐ方法'],
    '料理・時短': ['15分で作れる献立5パターン','作り置きの最強レシピ','冷凍庫フル活用の時短テク','電子レンジだけで作る夕飯','下味冷凍で毎日楽ちん','野菜嫌いの子が食べるレシピ','100円で作れるおかず','一人暮らしの自炊コツ','お弁当の簡単レシピ','包丁使わないレシピ5選','ズボラ飯の神レシピ','スープジャーで温かランチ','炊飯器で作る最強レシピ','買い物リストの作り方','食材のムダをなくす方法','調味料の使い切りテク','プロの味に近づくコツ','子どもが喜ぶ定番メニュー','麺類の時短レシピ','ホットプレート活用法','週末まとめ料理のコツ','キッチングッズの選び方','フライパン1つで完結レシピ','缶詰アレンジレシピ','朝食の時短メニュー','おやつを手作りする方法','カレーの隠し味','魚料理の簡単レシピ','鍋の素を使わない鍋レシピ','パスタの失敗しない茹で方']
};

document.getElementById('generateNetaBtn').addEventListener('click', function () {
    var genre = document.getElementById('netaGenre').value;
    var netas = NETA_DB[genre] || [];
    var out = document.getElementById('netaOutput');
    out.innerHTML = '';

    if (netas.length === 0) {
        out.innerHTML = '<p class="hint">このジャンルのネタはまだ準備中です</p>';
        return;
    }

    var shuffled = netas.slice().sort(function () { return Math.random() - 0.5; }).slice(0, 30);
    shuffled.forEach(function (neta, i) {
        var item = document.createElement('div');
        item.className = 'neta-item';
        item.innerHTML = '<span>' + (i + 1) + '. ' + neta + '</span><span class="neta-copy">📋 コピー</span>';
        item.addEventListener('click', function () {
            navigator.clipboard.writeText(neta);
            showToast('ネタをコピー: ' + neta.substring(0, 20) + '...');
        });
        out.appendChild(item);
    });
    showToast(genre + 'のネタを' + shuffled.length + '個生成しました！');
});

// ----- パワーワード辞典 -----
var POWER_WORDS = {
    urgency: ['今日だけ','期間限定','在庫わずか','残りあとわずか','終了間近','急いで','今すぐ','見逃し厳禁','再入荷なし','ラストチャンス','本日限り','先着順','早い者勝ち','売り切れ必至','タイムセール'],
    social: ['話題の','SNSで大反響','口コミ殺到','累計100万個','ランキング1位','芸能人愛用','美容師おすすめ','プロ御用達','楽天1位','Amazon高評価','インスタで話題','TikTokでバズった','満足度97%','リピート率90%','モンドセレクション'],
    curiosity: ['え、知ってた？','実は','意外と知らない','誰も教えてくれない','裏ワザ','隠れた名品','衝撃の事実','99%の人が知らない','損してた','ヤバい','まだ知らないの？','こっそり教える','プロが教える','業界の闇','常識を覆す'],
    emotion: ['感動','号泣','鳥肌','震えた','人生変わった','救われた','衝撃','最高','泣ける','幸せ','ありがとう','感謝','奇跡','運命','一生モノ'],
    number: ['3選','5つの方法','たった1分','30秒で','月1万円','年間10万','2倍','半分以下','1日30円','3日で実感','1週間で変化','90%の人が','TOP10','100均','ワンコイン'],
    contrast: ['高いけど安い','ズボラでもできる','努力なしで','我慢しないダイエット','簡単なのにプロ級','安いのに高品質','小さいのに大容量','地味だけど最強','誰でもできるのにやらない','面倒臭がりの','不器用でもOK','センスなくても','知識ゼロから','初心者でも失敗しない','放置するだけ']
};

var PW_LABELS = {urgency:'緊急性ワード',social:'社会的証明ワード',curiosity:'好奇心ワード',emotion:'感情ワード',number:'数字系ワード',contrast:'対比ワード'};

document.getElementById('showPowerWordsBtn').addEventListener('click', function () {
    var cat = document.getElementById('pwCategory').value;
    var words = POWER_WORDS[cat] || [];
    var out = document.getElementById('powerWordsOutput');
    out.innerHTML = '<p style="font-size:0.8rem;color:#94a3b8;margin-bottom:0.5rem;">' + PW_LABELS[cat] + ' (クリックでコピー)</p>';

    words.forEach(function (w) {
        var span = document.createElement('span');
        span.className = 'power-word';
        span.textContent = w;
        span.addEventListener('click', function () {
            navigator.clipboard.writeText(w);
            showToast('パワーワードをコピー: ' + w);
        });
        out.appendChild(span);
    });
});

// ----- 季節・イベントカレンダー -----
var SEASONAL_EVENTS = {
    1: [{date:'1月1日〜7日',event:'🎍 お正月セール',tip:'福袋・時短家電・健康グッズ'},{date:'1月中旬',event:'❄️ 寒さ対策ピーク',tip:'暖房グッズ・靴下・保湿ケア'},{date:'1月下旬',event:'📚 新年の目標',tip:'手帳・副業・学習教材'}],
    2: [{date:'2月上旬',event:'💝 バレンタイン準備',tip:'チョコ・ギフト・コスメ'},{date:'2月14日',event:'💕 バレンタインデー',tip:'美容・自分へのご褒美'},{date:'2月下旬',event:'🌸 春の準備',tip:'花粉対策・春コーデ'}],
    3: [{date:'3月上旬',event:'🌸 卒業・入学準備',tip:'文房具・バッグ・スーツ'},{date:'3月14日',event:'🍫 ホワイトデー',tip:'ギフト・アクセサリー'},{date:'3月下旬',event:'🏠 新生活準備',tip:'家電・収納・引越し'}],
    4: [{date:'4月上旬',event:'🌸 新生活スタート',tip:'時短家電・弁当グッズ・通勤'},{date:'4月中旬',event:'🧴 紫外線対策',tip:'日焼け止め・帽子・サングラス'},{date:'4月下旬',event:'🗓️ GW準備',tip:'旅行グッズ・レジャー・BBQ'}],
    5: [{date:'5月上旬',event:'🎏 GW・母の日前',tip:'旅行・ギフト・花'},{date:'5月第2日曜',event:'💐 母の日',tip:'コスメ・家電・癒しグッズ',highlight:true},{date:'5月下旬',event:'☔ 梅雨対策',tip:'除湿器・室内干し・防カビ'}],
    6: [{date:'6月上旬',event:'☔ 梅雨本番',tip:'傘・レインブーツ・部屋干し'},{date:'6月中旬',event:'🎁 父の日前',tip:'ガジェット・お酒・ファッション'},{date:'6月第3日曜',event:'👔 父の日',tip:'家電・健康グッズ・趣味',highlight:true}],
    7: [{date:'7月上旬',event:'🏖️ 夏の準備',tip:'日焼け止め・ダイエット・水着'},{date:'7月中旬',event:'🛒 Amazonプライムデー',tip:'家電・ガジェット・日用品',highlight:true},{date:'7月下旬',event:'🌞 夏本番',tip:'冷感グッズ・虫除け・アウトドア'}],
    8: [{date:'8月上旬',event:'🍉 お盆準備',tip:'手土産・旅行グッズ・帰省'},{date:'8月中旬',event:'🎐 夏休み',tip:'レジャー・知育・自由研究'},{date:'8月下旬',event:'📚 新学期準備',tip:'文房具・ランドセル・制服'}],
    9: [{date:'9月上旬',event:'🍂 秋の準備',tip:'秋コーデ・乾燥対策'},{date:'9月中旬',event:'🎑 敬老の日',tip:'健康グッズ・食品ギフト'},{date:'9月下旬',event:'🛍️ 楽天スーパーSALE',tip:'家電・日用品まとめ買い',highlight:true}],
    10: [{date:'10月上旬',event:'🎃 ハロウィン準備',tip:'コスメ・仮装・パーティー'},{date:'10月中旬',event:'🍁 秋の味覚',tip:'食品・キッチングッズ'},{date:'10月下旬',event:'❄️ 冬の準備',tip:'暖房・冬コーデ・保湿'}],
    11: [{date:'11月上旬',event:'🛒 ブラックフライデー準備',tip:'欲しい物リスト・比較記事'},{date:'11月下旬',event:'🏷️ ブラックフライデー',tip:'家電・ガジェット・コスメ',highlight:true},{date:'11月下旬',event:'🎁 クリスマスギフト準備',tip:'プレゼント・おもちゃ'}],
    12: [{date:'12月上旬',event:'🎄 クリスマス準備',tip:'ギフト・パーティー・コスメ'},{date:'12月中旬',event:'📦 楽天大感謝祭',tip:'まとめ買い・日用品',highlight:true},{date:'12月下旬',event:'🎍 年末準備',tip:'大掃除グッズ・おせち・福袋予約'}]
};

function renderSeasonalCalendar() {
    var container = document.getElementById('seasonalCalendar');
    if (!container) return;
    var currentMonth = new Date().getMonth() + 1;
    var months = [currentMonth, (currentMonth % 12) + 1, ((currentMonth + 1) % 12) + 1];

    container.innerHTML = '';
    months.forEach(function (m) {
        var events = SEASONAL_EVENTS[m] || [];
        var monthLabel = document.createElement('div');
        monthLabel.style.cssText = 'grid-column:1/-1;font-size:0.85rem;font-weight:600;margin-top:0.5rem;color:#f1f5f9;';
        monthLabel.textContent = m + '月';
        container.appendChild(monthLabel);

        events.forEach(function (ev) {
            var card = document.createElement('div');
            card.className = 'season-card' + (ev.highlight ? ' highlight' : '');
            card.innerHTML = '<div class="season-date">' + ev.date + '</div><div class="season-event">' + ev.event + '</div><div class="season-tip">狙い目: ' + ev.tip + '</div>';
            container.appendChild(card);
        });
    });
}

// ----- ハッシュタグ生成 -----
document.getElementById('generateHashBtn').addEventListener('click', function () {
    var genre = document.getElementById('hashGenre').value.trim();
    var product = document.getElementById('hashProduct').value.trim();
    var out = document.getElementById('hashOutput');
    out.innerHTML = '';

    if (!genre) { showToast('ジャンルを入力してください'); return; }

    var baseTags = ['PR','広告','アフィリエイト','楽天お買い物マラソン','楽天スーパーセール','楽天ROOM','おすすめ商品'];
    var genreTags = genre.split(/[・\/、]/).map(function (g) { return g.trim(); }).filter(Boolean);
    var productTags = product ? product.split(/[\s・]/).map(function (p) { return p.trim(); }).filter(Boolean) : [];
    var contextTags = [genre + '好きと繋がりたい', genre + 'おすすめ', genre + 'レビュー', '買ってよかった', '暮らしを整える', 'QOL爆上げ', '本気でおすすめ', '愛用品', 'リピ買い', 'コスパ最強'];

    var seen = {};
    var allTags = [];
    [].concat(baseTags, genreTags, productTags, contextTags).forEach(function (t) {
        if (!seen[t]) { seen[t] = true; allTags.push(t); }
    });

    var group = document.createElement('div');
    group.className = 'hashtag-group';

    allTags.forEach(function (tag) {
        var item = document.createElement('span');
        item.className = 'hashtag-item';
        item.textContent = '#' + tag;
        item.addEventListener('click', function () {
            navigator.clipboard.writeText('#' + tag);
            showToast('#' + tag + ' をコピーしました');
        });
        group.appendChild(item);
    });

    out.appendChild(group);

    var copyAllBtn = document.createElement('button');
    copyAllBtn.className = 'btn btn-sm btn-primary';
    copyAllBtn.style.marginTop = '0.75rem';
    copyAllBtn.textContent = '📋 全てコピー';
    copyAllBtn.addEventListener('click', function () {
        var allText = allTags.map(function (t) { return '#' + t; }).join(' ');
        navigator.clipboard.writeText(allText);
        showToast('全ハッシュタグをコピーしました！');
    });
    out.appendChild(copyAllBtn);

    showToast(allTags.length + '個のハッシュタグを生成しました！');
});

// ===== Init =====
document.addEventListener('DOMContentLoaded', function () {
    renderRecords();
    updateQuotaUI();
    renderSeasonalCalendar();
    var dateInput = document.getElementById('recordDate');
    if (dateInput) dateInput.value = getTodayKey();
});
