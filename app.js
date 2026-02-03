// AI Prompt Generator - メインロジック

// 状態管理
let currentMode = 'lite'; // 'lite', 'normal', 'hard'

// DOM要素の取得
const modeLite = document.getElementById('modeLite');
const modeNormal = document.getElementById('modeNormal');
const modeHard = document.getElementById('modeHard');
const expertRole = document.getElementById('expertRole');
const designPattern = document.getElementById('designPattern');
const referenceContent = document.getElementById('referenceContent');
const questionContent = document.getElementById('questionContent');
const logicalProof = document.getElementById('logicalProof');
const detailedSteps = document.getElementById('detailedSteps');
const promptPreview = document.getElementById('promptPreview');
const copyButton = document.getElementById('copyButton');
const copyFeedback = document.getElementById('copyFeedback');
const hardModeContent = document.getElementById('hardModeContent');

// Hard Mode用のDOM要素
const hardExpertRole = document.getElementById('hardExpertRole');
const hardLanguageVersion = document.getElementById('hardLanguageVersion');
const hardLibraries = document.getElementById('hardLibraries');
const hardIncludeLatest = document.getElementById('hardIncludeLatest');
const hardInternalLibs = document.getElementById('hardInternalLibs');
const hardNamingConvention = document.getElementById('hardNamingConvention');
const hardBlockedSites = document.getElementById('hardBlockedSites');
const hardIncludeComments = document.getElementById('hardIncludeComments');
const hardErrorHandling = document.getElementById('hardErrorHandling');
const hardDebugProcess = document.getElementById('hardDebugProcess');
const hardQuestionContent = document.getElementById('hardQuestionContent');
const hardLogicalProof = document.getElementById('hardLogicalProof');
const hardDetailedSteps = document.getElementById('hardDetailedSteps');


// モード切り替え関数
function switchMode(newMode) {
    currentMode = newMode;

    // タブのアクティブ状態を更新
    document.querySelectorAll('.mode-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    if (newMode === 'lite') {
        modeLite.classList.add('active');
    } else if (newMode === 'normal') {
        modeNormal.classList.add('active');
    } else if (newMode === 'hard') {
        modeHard.classList.add('active');
    }

    // UI表示の切り替え
    const normalOnlyElements = document.querySelectorAll('.mode-normal-only');
    const liteNormalOnlyElements = document.querySelectorAll('.mode-lite-normal-only');

    if (newMode === 'lite') {
        // Liteモード: Normal専用項目を非表示
        normalOnlyElements.forEach(el => el.classList.add('hidden'));
        liteNormalOnlyElements.forEach(el => el.classList.remove('hidden'));
        hardModeContent.style.display = 'none';
    } else if (newMode === 'normal') {
        // Normalモード: すべての項目を表示
        normalOnlyElements.forEach(el => el.classList.remove('hidden'));
        liteNormalOnlyElements.forEach(el => el.classList.remove('hidden'));
        hardModeContent.style.display = 'none';
    } else if (newMode === 'hard') {
        // Hardモード: 通常フォームを非表示、Hard Mode contentを表示
        normalOnlyElements.forEach(el => el.classList.add('hidden'));
        liteNormalOnlyElements.forEach(el => el.classList.add('hidden'));
        hardModeContent.style.display = 'block';
    }

    // プロンプトを再生成
    generatePrompt();
}


// プロンプト生成ロジック
function generatePrompt() {
    // Hardモードの場合は専用のプロンプト生成
    if (currentMode === 'hard') {
        generateHardModePrompt();
        return;
    }

    const role = expertRole.value;
    const pattern = designPattern.value.trim();
    const reference = referenceContent.value.trim();
    const question = questionContent.value.trim();
    const needsLogicalProof = logicalProof.checked;
    const needsDetailedSteps = detailedSteps.checked;

    // 質問内容が空の場合はプレースホルダーを表示
    if (!question) {
        promptPreview.innerHTML = '<p class="text-slate-500 italic">左側のフォームに入力すると、ここにプロンプトがリアルタイムで生成されます。</p>';
        return;
    }

    // プロンプトの構築
    let prompt = '';

    // ロールの追加（モード依存）
    if (currentMode === 'lite') {
        // Liteモード: 汎用的なRoleを自動使用
        prompt += '# Role\n';
        prompt += 'あなたはプロフェッショナルです。\n';
        prompt += '豊富な知識と経験を持ち、正確で実用的なアドバイスを提供できます。\n\n';
    } else if (currentMode === 'normal' && role) {
        // Normalモード: ユーザー指定のRoleを使用
        prompt += '# Role\n';
        prompt += `あなたは、${role}として振る舞ってください。\n`;
        prompt += 'その分野の専門知識と豊富な経験を持ち、正確で実用的なアドバイスを提供できます。\n\n';
    }

    // コンテキスト（質問内容）の追加
    prompt += '# Context\n';
    prompt += question + '\n\n';

    // 参照元/調査済み内容の追加（Normalモードのみ）
    if (currentMode === 'normal' && reference) {
        prompt += '# Reference / Prior Research\n';
        prompt += '以下は既に調査済みの内容、参照した情報です。これらを考慮した上で回答してください:\n\n';
        prompt += reference + '\n\n';
    }

    // デザインパターンの追加（Normalモードのみ）
    if (currentMode === 'normal' && pattern) {
        prompt += '# Design Pattern / Architecture\n';
        prompt += `推奨または使用するデザインパターン: ${pattern}\n\n`;
    }

    // 制約条件の追加（論理的証明モード）
    if (needsLogicalProof) {
        prompt += '# Constraints\n';
        prompt += '以下の制約に従って回答してください:\n\n';
        prompt += '- **論理的厳密性**: すべての主張に対して数学的・論理的に厳密な証明を提供してください\n';
        prompt += '- **メモリ計算量**: アルゴリズムや実装に関しては、メモリ計算量をビッグO記法で明記してください\n';
        prompt += '- **時間計算量**: 時間計算量もビッグO記法で分析し、最悪ケース・平均ケース・最良ケースを説明してください\n';
        prompt += '- **アルゴリズム選択の正当化**: なぜそのアルゴリズムや手法を選択したのか、代替案と比較して説明してください\n';
        prompt += '- **エッジケース**: 考えられるエッジケースとその対処方法を明記してください\n\n';
    }

    // 出力要求の追加（詳細手順モード）
    if (needsDetailedSteps) {
        prompt += '# Required Output\n';
        prompt += '以下の形式で詳細な回答を提供してください:\n\n';
        prompt += '1. **ステップバイステップの実装ガイド**\n';
        prompt += '   - 各ステップを順序立てて説明\n';
        prompt += '   - 初心者でも理解できる丁寧な解説\n\n';
        prompt += '2. **コード例**\n';
        prompt += '   - 実際に動作するコードサンプル\n';
        prompt += '   - コメントを含めた分かりやすい実装\n\n';
        prompt += '3. **使用例**\n';
        prompt += '   - 実際の使用シナリオ\n';
        prompt += '   - 入力と期待される出力の例\n\n';
        prompt += '4. **エッジケースの処理**\n';
        prompt += '   - 特殊なケースへの対応方法\n';
        prompt += '   - エラーハンドリングの実装\n\n';
    }

    // 一般的な指示（どちらのモードでも常に追加）
    if (!needsLogicalProof && !needsDetailedSteps) {
        prompt += '# Instructions\n';
        prompt += '上記の内容に基づいて、明確で実用的な回答を提供してください。\n';
        prompt += 'コード例がある場合は、コメントを含めて分かりやすく記述してください。\n';
    }

    // プレビューに表示（HTMLエスケープ＆フォーマット）
    displayFormattedPrompt(prompt);
}

// Hard Mode専用のプロンプト生成ロジック
function generateHardModePrompt() {
    const expertRoleValue = hardExpertRole.value.trim();
    const langVersion = hardLanguageVersion.value.trim();
    const libraries = hardLibraries.value.trim();
    const includeLatest = hardIncludeLatest.checked;
    const internalLibs = hardInternalLibs.value.trim();
    const namingConvention = hardNamingConvention.value.trim();
    const blockedSites = hardBlockedSites.value.trim();
    const includeComments = hardIncludeComments.checked;
    const errorHandling = hardErrorHandling.value.trim();
    const debugProcess = hardDebugProcess.value.trim();
    const question = hardQuestionContent.value.trim();
    const needsLogicalProof = hardLogicalProof.checked;
    const needsDetailedSteps = hardDetailedSteps.checked;

    // 質問内容が空の場合はプレースホルダーを表示
    if (!question) {
        promptPreview.innerHTML = '<p class="text-slate-500 italic">Hard Mode: 質問内容を入力すると、詳細なプロンプトがリアルタイムで生成されます。</p>';
        return;
    }

    // プロンプトの構築
    let prompt = '';

    // # Role（専門家ロール）
    if (expertRoleValue) {
        prompt += '# Role\n';
        prompt += `あなたは、${expertRoleValue}として振る舞ってください。\n`;
        prompt += 'その分野の専門知識と豊富な経験を持ち、正確で実用的なアドバイスを提供できます。\n\n';
    }

    // # Environment（開発環境）
    if (langVersion || libraries || includeLatest) {
        prompt += '# Environment\n';
        prompt += '以下の開発環境を前提として回答してください:\n\n';

        if (langVersion) {
            prompt += `- **言語/バージョン**: ${langVersion}\n`;
        }
        if (libraries) {
            prompt += `- **使用ライブラリ/フレームワーク**: ${libraries}\n`;
        }
        if (includeLatest) {
            prompt += '- **最新情報**: プレビュー版や最新の仕様情報も参照すること\n';
        }
        prompt += '\n';
    }

    // # Context (Internal Libraries)（内部ライブラリの説明）
    if (internalLibs) {
        prompt += '# Context (Internal Libraries)\n';
        prompt += '以下の外部/内部ライブラリについて理解した上で回答してください:\n\n';
        prompt += internalLibs + '\n\n';
    }

    // # Context（質問内容）
    prompt += '# Context\n';
    prompt += question + '\n\n';

    // # Constraints（制約条件）
    const hasConstraints = namingConvention || blockedSites || includeComments || needsLogicalProof;

    if (hasConstraints) {
        prompt += '# Constraints\n';
        prompt += '以下の制約に従って回答してください:\n\n';

        // コーディング規約関連
        if (namingConvention) {
            prompt += `- **命名規則**: ${namingConvention}に従うこと\n`;
        }
        if (blockedSites) {
            prompt += `- **参照禁止**: 以下のサイトの情報は使用しないこと: ${blockedSites}\n`;
        }
        if (includeComments) {
            prompt += '- **コメント**: コード内に詳細な解説コメントを含めること\n';
        }

        // 論理的証明モード
        if (needsLogicalProof) {
            prompt += '- **論理的厳密性**: すべての主張に対して数学的・論理的に厳密な証明を提供すること\n';
            prompt += '- **メモリ計算量**: アルゴリズムや実装に関しては、メモリ計算量をビッグO記法で明記すること\n';
            prompt += '- **時間計算量**: 時間計算量もビッグO記法で分析し、最悪ケース・平均ケース・最良ケースを説明すること\n';
            prompt += '- **アルゴリズム選択の正当化**: なぜそのアルゴリズムや手法を選択したのか、代替案と比較して説明すること\n';
            prompt += '- **エッジケース**: 考えられるエッジケースとその対処方法を明記すること\n';
        }

        prompt += '\n';
    }

    // # Error Handling & Debugging（エラーハンドリング＆デバッグ）
    if (errorHandling || debugProcess) {
        prompt += '# Error Handling & Debugging\n';

        if (errorHandling) {
            prompt += `- **エラーハンドリング**: ${errorHandling}\n`;
        }
        if (debugProcess) {
            prompt += `- **デバッグ処理**: ${debugProcess}\n`;
        }
        prompt += '\n';
    }

    // # Required Output（詳細手順モード）
    if (needsDetailedSteps) {
        prompt += '# Required Output\n';
        prompt += '以下の形式で詳細な回答を提供してください:\n\n';
        prompt += '1. **ステップバイステップの実装ガイド**\n';
        prompt += '   - 各ステップを順序立てて説明\n';
        prompt += '   - 技術的な背景も含めた丁寧な解説\n\n';
        prompt += '2. **コード例**\n';
        prompt += '   - 実際に動作するコードサンプル\n';
        prompt += '   - 指定された命名規則やコメント要件を満たす実装\n\n';
        prompt += '3. **使用例**\n';
        prompt += '   - 実際の使用シナリオ\n';
        prompt += '   - 入力と期待される出力の例\n\n';
        prompt += '4. **エッジケースの処理**\n';
        prompt += '   - 特殊なケースへの対応方法\n';
        prompt += '   - 指定されたエラーハンドリング方法に従った実装\n\n';
    }

    // 一般的な指示
    if (!needsLogicalProof && !needsDetailedSteps) {
        prompt += '# Instructions\n';
        prompt += '上記の内容に基づいて、明確で実用的な回答を提供してください。\n';
        prompt += '指定された環境、規約、制約を厳密に守ってください。\n';
    }

    // プレビューに表示
    displayFormattedPrompt(prompt);
}

// フォーマットされたプロンプトを表示
function displayFormattedPrompt(prompt) {
    // HTMLエスケープ
    const escaped = prompt
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // マークダウン風の簡易フォーマット（#をh1/h2タグに変換）
    const formatted = escaped
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/^## (.+)$/gm, '<h2>$2</h2>')
        .replace(/^\- (.+)$/gm, '<li>$1</li>')
        .replace(/\*\*(.+?)\*\*/g, '<strong style="color: #fbbf24;">$1</strong>');

    promptPreview.innerHTML = formatted;
    promptPreview.classList.add('fade-in');

    // アニメーションクラスを削除（再度アニメーションできるように）
    setTimeout(() => {
        promptPreview.classList.remove('fade-in');
    }, 400);
}

// クリップボードにコピー
async function copyToClipboard() {
    const text = promptPreview.innerText;

    // プレースホルダーテキストの場合はコピーしない
    if (!questionContent.value.trim()) {
        alert('コピーするプロンプトがありません。まず質問内容を入力してください。');
        return;
    }

    try {
        await navigator.clipboard.writeText(text);

        // フィードバック表示
        copyFeedback.classList.add('show');
        copyButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            コピー完了
        `;

        // 2秒後に元に戻す
        setTimeout(() => {
            copyFeedback.classList.remove('show');
            copyButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                コピー
            `;
        }, 2000);
    } catch (err) {
        console.error('クリップボードへのコピーに失敗しました:', err);
        alert('クリップボードへのコピーに失敗しました。ブラウザの設定を確認してください。');
    }
}

// イベントリスナーの設定
modeLite.addEventListener('click', () => switchMode('lite'));
modeNormal.addEventListener('click', () => switchMode('normal'));
modeHard.addEventListener('click', () => switchMode('hard'));

expertRole.addEventListener('change', generatePrompt);
designPattern.addEventListener('input', generatePrompt);
referenceContent.addEventListener('input', generatePrompt);
questionContent.addEventListener('input', generatePrompt);
logicalProof.addEventListener('change', generatePrompt);
detailedSteps.addEventListener('change', generatePrompt);
copyButton.addEventListener('click', copyToClipboard);

// Hard Mode用のイベントリスナー
hardExpertRole.addEventListener('input', generatePrompt);
hardLanguageVersion.addEventListener('input', generatePrompt);
hardLibraries.addEventListener('input', generatePrompt);
hardIncludeLatest.addEventListener('change', generatePrompt);
hardInternalLibs.addEventListener('input', generatePrompt);
hardNamingConvention.addEventListener('input', generatePrompt);
hardBlockedSites.addEventListener('input', generatePrompt);
hardIncludeComments.addEventListener('change', generatePrompt);
hardErrorHandling.addEventListener('input', generatePrompt);
hardDebugProcess.addEventListener('input', generatePrompt);
hardQuestionContent.addEventListener('input', generatePrompt);
hardLogicalProof.addEventListener('change', generatePrompt);
hardDetailedSteps.addEventListener('change', generatePrompt);

// キーボードショートカット（Ctrl+Enter でコピー）
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        copyToClipboard();
    }
});

// 初期表示（Liteモードで開始）
switchMode('lite');

