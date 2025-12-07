/* style.css - Corrigido e Otimizado */

:root{
  /* Cores Base */
  --accent1: #2D9CDB; 
  --accent2: #1E6FB3;
  --accent-cta: #00bfff;
  --success: #00C851;
  --danger: #ff4444;
  --radius: 16px; 
  --shadow: 0 12px 36px rgba(2,8,23,0.35); 

  /* Cores Padrão (Tema Escuro Implícito) */
  --bg: #0f1724;
  --card: #1c273a;
  --muted: #9aa7bf;
  --glass: rgba(255,255,255,0.06);
  --text: #e6eef8;
  --input-border: rgba(255,255,255,0.1);
  --tab-bg: #2d3b54; 
  --tab-active-bg: var(--accent1);
}

/* Light theme overrides */
.theme-light {
  --bg: #f2f6fb;
  --card: #ffffff;
  --muted: #556270;
  --glass: rgba(0,0,0,0.04);
  --text: #071128;
  --input-border: rgba(0,0,0,0.15);
  --tab-bg: #e0e5eb;
  --tab-active-bg: var(--accent1);
}

/* Dark theme overrides */
.theme-dark {
  /* Já definido como padrão, mas mantido para clareza */
}

/* system theme (follows prefers-color-scheme) */
.theme-system {
  color-scheme: light dark;
}
@media (prefers-color-scheme: light) {
  .theme-system {
    /* Herda o tema light */
    --bg: #f2f6fb;
    --card: #ffffff;
    --muted: #556270;
    --glass: rgba(0,0,0,0.04);
    --text: #071128;
    --input-border: rgba(0,0,0,0.15);
    --tab-bg: #e0e5eb;
    --tab-active-bg: var(--accent1);
  }
}

/* -------------------- GERAL -------------------- */
* {
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
body {
    margin: 0;
    background-color: var(--bg);
    color: var(--text);
    transition: background-color .3s, color .3s;
}

/* Container principal para centralizar o app */
#app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    max-width: 800px;
    margin: 0 auto;
    box-shadow: 0 0 40px rgba(0,0,0,0.1); /* Sombra para desktop */
}

.main {
    flex-grow: 1;
    position: relative; /* Base para o posicionamento absoluto das telas */
    padding: 20px 10px;
}

/* -------------------- LAYOUT DE TELAS (CRUCIAL!) -------------------- */

/* CORREÇÃO: Posiciona as telas para que elas não se sobreponham, 
   e garante que apenas a tela ativa use o espaço */
#start-screen, #quiz-screen, #result-screen {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 100%; /* Ocupa a altura total do .main */
    padding: 20px 10px;
    transition: opacity 0.3s ease, transform 0.3s ease;
    /* Adicione 'display: none' no seu JS (o que já está sendo feito) 
       ou use a classe .hidden */
}

/* A classe hidden (oculta) é essencial para o JavaScript */
.hidden {
    display: none !important;
}

.container {
    padding: 0 10px;
    max-width: 600px;
    margin: 0 auto;
    width: 100%;
}

.card {
    background-color: var(--card);
    padding: 24px;
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    margin-bottom: 20px;
}

.card.center {
    text-align: center;
}

/* -------------------- HEADER -------------------- */
.header {
    background: linear-gradient(135deg, var(--accent1), var(--accent2));
    height: 180px;
    position: relative;
    color: white;
    padding-top: 20px;
    text-align: center;
}

.header-inner {
    max-width: 600px;
    margin: 0 auto;
    padding: 0 20px;
}

.app-title {
    font-size: 28px;
    margin: 0;
    text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.app-sub {
    margin: 4px 0 0;
    font-size: 14px;
    opacity: 0.9;
}

/* Decoração da Onda */
.header-deco {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40px; 
    background-color: var(--bg);
}
.header-deco rect {
    fill: var(--bg);
}


/* -------------------- TEMA (Toggle) -------------------- */
.theme-toggle {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    font-size: 20px;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}
.theme-toggle:hover {
    background: rgba(255, 255, 255, 0.3);
}

.icon-moon::after {
    content: "🌙";
}
.theme-light .icon-moon::after {
    content: "☀️";
}

/* -------------------- FORMULÁRIO / INÍCIO -------------------- */
.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--text);
    font-size: 15px;
}

select {
    width: 100%;
    padding: 12px;
    border-radius: var(--radius);
    border: 1px solid var(--input-border);
    background-color: var(--card);
    color: var(--text);
    font-size: 16px;
    appearance: none; /* Remove seta padrão */
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='%236B7280' d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    padding-right: 30px;
}


/* --- Abas (Tabs) --- */
.tabs-menu {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
}

.tab-btn {
    flex: 1;
    padding: 10px 0;
    border: none;
    border-radius: 10px;
    background-color: var(--tab-bg);
    color: var(--text);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 14px;
}

.tab-btn.active {
    background-color: var(--tab-active-bg);
    color: white;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* Painéis de Conteúdo */
.themes-tab-pane {
    display: none;
    padding: 5px;
}
.themes-tab-pane.active {
    display: block;
}

.checkbox-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 12px;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid var(--input-border);
    background: var(--bg); /* Usa o fundo do app, não do card */
    cursor: pointer;
    font-weight: normal;
    transition: background-color 0.2s, border-color 0.2s;
}

.checkbox-label:hover {
    background: var(--glass);
}

.checkbox-label input:checked + span {
    color: var(--accent1);
    font-weight: 700;
}

/* Botões */
.actions {
    display: flex;
    gap: 15px;
    margin-top: 25px;
}

.btn {
    flex: 1;
    padding: 12px 20px;
    border-radius: 10px;
    border: none;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    text-transform: uppercase;
}

.btn.primary {
    background-color: var(--accent1);
    color: white;
}

.btn.danger {
    background-color: var(--danger);
    color: white;
}

.btn:hover {
    opacity: 0.9;
    transform: translateY(-1px);
}

/* -------------------- TELA DO QUIZ -------------------- */
.banner {
    position: relative;
    padding: 15px;
    margin-top: -30px; /* Sobrepõe um pouco o header */
    border-radius: 14px;
    color: white;
    font-size: 16px;
    font-weight: 700;
    text-align: center;
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
    transition: background 0.3s;
}

.question-card {
    padding: 18px;
    border-radius: 20px;
    margin-top: 20px;
}

.time-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px dashed var(--input-border);
}
.q-number {
    font-weight: 600;
}
.time {
    font-weight: 700;
    font-size: 16px;
    color: var(--success); /* Cor inicial, JS ajusta */
}

.question-text {
    font-size: 18px;
    margin: 6px 0 20px 0;
    text-align: center;
    min-height: 40px; /* Para evitar saltos de layout */
}

/* answers */
.answers {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.answer-btn {
    background: var(--card);
    border-radius: 14px;
    padding: 14px;
    border: 1px solid var(--input-border);
    text-align: left;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    transition: all .18s;
    box-shadow: 0 6px 14px rgba(8,18,36,0.06);
    color: var(--text);
}

.answer-btn:hover:not(.disabled) {
    background-color: var(--glass);
    border-color: var(--accent1);
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(8,18,36,0.1);
}

.answer-btn.disabled {
    opacity: 0.7;
    pointer-events: none;
    transform: none;
    box-shadow: none;
}

/* correct/incorrect states */
.answer-correct {
    background: var(--success);
    color: white;
    border-color: var(--success);
    transform: scale(1.02);
}
.answer-wrong {
    background: var(--danger);
    color: white;
    border-color: var(--danger);
}

/* progress */
.progress-wrap {
    margin-top: 20px;
}
.progress-bar {
    height: 8px;
    background: var(--input-border);
    border-radius: 999px;
    overflow: hidden;
}
#progress-fill {
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, var(--accent1), var(--accent2));
    transition: width .5s ease;
}

/* -------------------- TELA DE RESULTADO -------------------- */
#result-screen {
    /* Centralizado via flexbox no main content */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.card-inner {
    max-width: 450px;
    width: 100%;
    padding: 24px;
}

.big {
    font-size: 22px;
    font-weight: 800; 
    color: var(--accent1);
    margin-top: 10px;
    margin-bottom: 5px;
}

.muted {
    color: var(--muted);
    font-weight: 500;
    margin-bottom: 20px;
}

.summary {
    white-space: pre-wrap;
    padding: 15px;
    border-radius: 10px;
    background: var(--glass);
    margin-top: 20px;
    font-size: 14px;
    text-align: left;
    color: var(--text);
}
.result-actions { 
    margin-top: 30px;
    width: 100%;
}
.result-actions .btn { 
    flex: 1; 
}

/* -------------------- RESPONSIVIDADE -------------------- */
@media (max-width: 600px){
    /* Header */
    .header { height: 160px; }
    .app-title { font-size: 24px; }
    .theme-toggle { top: 10px; right: 10px; }
    
    /* Layout */
    .actions { flex-direction: column; gap: 10px; }
    .btn { font-size: 15px; }

    /* Tabs */
    .tabs-menu { flex-direction: column; }
    .checkbox-grid { 
        grid-template-columns: 1fr; /* Uma coluna em mobile */
        gap: 8px;
    }
}
