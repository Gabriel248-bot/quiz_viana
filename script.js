/* script.js
   Conversão da lógica do quiz.py -> comportamento em JS.
   INCLUI:
   - Perguntas, timer por categoria, multiplicador de dificuldade.
   - Sons (Web Audio), shuffle, progresso, tema persistente.
   - LÓGICA DE ABAS (TABS) para seleção de temas.
   - REGISTRO DO SERVICE WORKER (PWA).
*/

/* -------------------- REGISTRO DO SERVICE WORKER -------------------- */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Note: Usamos o caminho absoluto /sw.js, o que funciona melhor com o GitHub Pages
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registrado com sucesso para PWA:', reg.scope))
      .catch(err => console.log('Registro do Service Worker falhou:', err));
  });
}
/* -------------------------------------------------------------------- */

/* ---------- Perguntas (copiado do seu quiz.py) ---------- */
const QUESTOES = [
  {"categoria":"Informática Geral","pergunta":"O que significa HTML?","opcoes":["HyperText Markup Language","HighText Machine Language","Hyper Transfer Markup Level","Hyperlinks Text Memory Language"],"resposta":"HyperText Markup Language"},
  {"categoria":"Informática Geral","pergunta":"Qual linguagem é executada no navegador?","opcoes":["Python","JavaScript","C#","Java"],"resposta":"JavaScript"},
  {"categoria":"Informática Geral","pergunta":"O que significa WWW?","opcoes":["Wide World Web","Wide Web Window","World Wide Web","World Web Wireless"],"resposta":"World Wide Web"},
  {"categoria":"Informática Geral","pergunta":"Qual desses é um sistema operacional?","opcoes":["Chrome","Firefox","Windows","Google Drive"],"resposta":"Windows"},
  {"categoria":"Informática Geral","pergunta":"Qual empresa criou o Windows?","opcoes":["Microsoft","Apple","IBM","Intel"],"resposta":"Microsoft"},
  {"categoria":"Hardware","pergunta":"Qual componente armazena dados permanentemente?","opcoes":["RAM","SSD/HDD","GPU","Fonte"],"resposta":"SSD/HDD"},
  {"categoria":"Hardware","pergunta":"Qual é responsável pelo processamento gráfico?","opcoes":["CPU","GPU","RAM","Fonte de alimentação"],"resposta":"GPU"},
  {"categoria":"Hardware","pergunta":"O que é RAM?","opcoes":["Memória de acesso rápido","Memória somente leitura","Memória de vídeo","Cache do processador"],"resposta":"Memória de acesso rápido"},
  {"categoria":"Hardware","pergunta":"Qual porta é usada para conectar um cabo de rede (internet)?","opcoes":["USB","HDMI","RJ45","VGA"],"resposta":"RJ45"},
  {"categoria":"Hardware","pergunta":"Qual componente é o 'cérebro' do computador?","opcoes":["Placa Mãe","Memória RAM","CPU","Placa de Vídeo"],"resposta":"CPU"},
  {"categoria":"Programação","pergunta":"O que é um 'bug'?","opcoes":["Um erro no código","Um tipo de dado","Um comando de loop","Um atalho de teclado"],"resposta":"Um erro no código"},
  {"categoria":"Programação","pergunta":"O que faz um loop 'for'?","opcoes":["Executa um código uma única vez","Executa um código sob uma condição","Executa um código repetidamente por um número fixo de vezes","Define uma função"],"resposta":"Executa um código repetidamente por um número fixo de vezes"},
  {"categoria":"Programação","pergunta":"Qual símbolo é usado para comentários em Python?","opcoes":["//","#","/* */","--"],"resposta":"#"},
  {"categoria":"Programação","pergunta":"Em JS, qual palavra-chave declara uma variável que não pode ser reatribuída?","opcoes":["var","let","const","func"],"resposta":"const"},
  {"categoria":"Programação","pergunta":"O que é uma API?","opcoes":["Interface de programação de aplicativos","Servidor de banco de dados","Linguagem de estilos","Protocolo de internet"],"resposta":"Interface de programação de aplicativos"}
];

/* ---------- Variáveis e Elementos ---------- */
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const btnStart = document.getElementById("btn-start");
const btnRestart = document.getElementById("btn-restart");
const btnExit = document.getElementById("btn-exit");
const questionText = document.getElementById("question-text");
const answersDiv = document.getElementById("answers");
const qNumber = document.getElementById("q-number");
const timeDisplay = document.getElementById("time");
const banner = document.getElementById("banner");
const progressFill = document.getElementById("progress-fill");
const scoreText = document.getElementById("score-text");
const perfText = document.getElementById("perf-text");
const summary = document.getElementById("summary");
const appContainer = document.getElementById("app");
const btnTheme = document.getElementById("btn-theme");
const themeTabs = document.querySelectorAll(".tab-btn");
const themePanes = document.querySelectorAll(".themes-tab-pane");
const form = document.getElementById("quiz-setup");

let perguntasAtivas = [];
let questaoAtual = 0;
let pontos = 0;
let timerInterval = null;
let tempoRestante = 0;
let dificuldade = 1.0; // 1.0 = normal
let tempoPorQuestaoBase = 30; // segundos

/* ---------- Funções de Utilidade (Show/Hide) ---------- */
function show(el) {
  el.classList.remove("hidden");
  el.style.display = "block";
}

function hide(el) {
  el.classList.add("hidden");
  el.style.display = "none";
}

/* ---------- 1. Lógica de Temas e Abas ---------- */

// Carrega tema do localStorage ou define como 'system'
function loadTheme() {
    const savedTheme = localStorage.getItem("theme") || "system";
    appContainer.className = savedTheme; // Define a classe principal
    appContainer.setAttribute("data-theme", savedTheme);

    // Ajusta o ícone de toggle
    const iconSpan = btnTheme.querySelector('.icon-moon');
    if (iconSpan) {
        iconSpan.classList.toggle('icon-moon', savedTheme !== 'theme-light');
        iconSpan.classList.toggle('icon-sun', savedTheme === 'theme-light');
        
        // Ativa a aba correta
        themeTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.theme === savedTheme) {
                tab.classList.add('active');
            }
        });
        themePanes.forEach(pane => {
             pane.classList.remove('active');
            if (pane.id.includes(savedTheme)) {
                pane.classList.add('active');
            }
        });
    }
}

function toggleTheme() {
    const currentTheme = appContainer.getAttribute("data-theme");
    let newTheme;

    // Define o próximo tema na ordem: system -> dark -> light -> system
    if (currentTheme === "system") {
        newTheme = "theme-dark";
    } else if (currentTheme === "theme-dark") {
        newTheme = "theme-light";
    } else {
        newTheme = "theme-system";
    }
    
    appContainer.className = newTheme;
    appContainer.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    loadTheme(); // Recarrega para atualizar o ícone e abas
}

// Lógica de Abas (Tabs) para seleção de temas na tela inicial
themeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const newTheme = tab.dataset.theme;
        appContainer.className = newTheme;
        appContainer.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        loadTheme(); 
    });
});

btnTheme.addEventListener("click", toggleTheme);
window.addEventListener("DOMContentLoaded", loadTheme);

/* ---------- 2. Lógica do Quiz (Setup e Navegação) ---------- */

function prepararPerguntas() {
  const temasSelecionados = Array.from(document.querySelectorAll('input[name="tema"]:checked')).map(cb => cb.value);
  const totalPerguntas = parseInt(document.getElementById("num-q").value) || 10;
  dificuldade = parseFloat(document.getElementById("dificuldade").value) || 1.0;

  let perguntasFiltradas = QUESTOES.filter(q => temasSelecionados.includes(q.categoria));
  
  if (perguntasFiltradas.length === 0) {
    alert("Selecione pelo menos um tema!");
    return false;
  }

  // Embaralha todas as perguntas filtradas
  perguntasFiltradas = perguntasFiltradas.sort(() => 0.5 - Math.random());

  // Limita ao número total desejado
  perguntasAtivas = perguntasFiltradas.slice(0, totalPerguntas);
  
  // Reinicia variáveis
  questaoAtual = 0;
  pontos = 0;
  return true;
}

function prepararETeleQuiz() {
  if (prepararPerguntas()) {
    // Esconde a tela inicial e mostra o quiz
    hide(startScreen);
    hide(resultScreen);
    show(quizScreen);
    
    buildQuizScreen();
  }
}

function buildQuizScreen() {
  if (questaoAtual >= perguntasAtivas.length) {
    showResult();
    return;
  }

  const q = perguntasAtivas[questaoAtual];
  const qIndex = questaoAtual + 1;
  const total = perguntasAtivas.length;

  // Atualiza metadados
  qNumber.textContent = `Pergunta ${qIndex} / ${total}`;
  banner.textContent = q.categoria.toUpperCase();
  questionText.textContent = q.pergunta;
  progressFill.style.width = `${(qIndex - 1) / total * 100}%`;

  // Limpa e constrói as opções
  answersDiv.innerHTML = "";
  const opcoesEmbaralhadas = q.opcoes.sort(() => 0.5 - Math.random());

  opcoesEmbaralhadas.forEach(opcao => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.textContent = opcao;
    btn.onclick = () => verificarResposta(btn, opcao, q.resposta);
    answersDiv.appendChild(btn);
  });
  
  // Inicia o timer
  iniciarTimer(q.categoria);
}

function verificarResposta(btn, respostaUsuario, respostaCorreta) {
  if (timerInterval) clearInterval(timerInterval);
  const todosBotoes = answersDiv.querySelectorAll(".answer-btn");
  
  // Desativa todos os botões
  todosBotoes.forEach(b => b.classList.add("disabled"));

  if (respostaUsuario === respostaCorreta) {
    btn.classList.add("answer-correct");
    pontos++;
    playSound("correct");
  } else {
    btn.classList.add("answer-wrong");
    // Destaca a resposta correta
    todosBotoes.forEach(b => {
      if (b.textContent === respostaCorreta) {
        b.classList.add("answer-correct");
      }
    });
    playSound("wrong");
  }

  // Próxima pergunta após um pequeno delay
  setTimeout(() => {
    questaoAtual++;
    buildQuizScreen();
  }, 1200);
}

/* ---------- show result ---------- */
function showResult(){
  if(timerInterval){ clearInterval(timerInterval); timerInterval = null; }
  
  // Esconde o quiz e mostra o resultado
  hide(quizScreen);
  show(resultScreen);
  
  // Atualiza o progresso para 100%
  progressFill.style.width = "100%";

  scoreText.textContent = `Você acertou ${pontos} de ${perguntasAtivas.length} perguntas`;
  const perc = Math.round((pontos / perguntasAtivas.length) * 100);
  let perf = "Precisa melhorar";
  
  if(perc === 100) perf = "PERFEITO! 🔥";
  else if(perc >= 80) perf = "Excelente!";
  else if(perc >= 60) perf = "Muito bom!";
  else if(perc >= 40) perf = "Regular";
  
  perfText.textContent = `Desempenho: ${perf} (${perc}%)`;

  // Resumo por categoria
  const resumo = {};
  perguntasAtivas.forEach(q => { resumo[q.categoria] = (resumo[q.categoria]||0) + 1; });
  summary.textContent = "Perguntas por categoria incluídas:\n" + Object.entries(resumo).map(([k,v])=>`${k}: ${v}`).join("\n");
}

/* ---------- Timer e Sons ---------- */

const TEMPO_BASE = {
  "Informática Geral": 30,
  "Hardware": 25,
  "Programação": 20 
};

function iniciarTimer(categoria) {
  if (timerInterval) clearInterval(timerInterval);
  
  let base = TEMPO_BASE[categoria] || 30;
  // Ajuste de dificuldade (ex: 20 * 1.5 = 30s)
  tempoRestante = Math.round(base * dificuldade); 

  timeDisplay.textContent = `Tempo: ${tempoRestante}s`;
  timeDisplay.style.color = "var(--success)"; 

  timerInterval = setInterval(() => {
    tempoRestante--;
    timeDisplay.textContent = `Tempo: ${tempoRestante}s`;

    if (tempoRestante <= 10 && tempoRestante > 0) {
      timeDisplay.style.color = "orange";
      playSound("tick");
    } else if (tempoRestante <= 0) {
      timeDisplay.style.color = "var(--danger)";
      clearInterval(timerInterval);
      verificarResposta(null, "TEMPO ESGOTADO", perguntasAtivas[questaoAtual].resposta);
    }
  }, 1000);
}

function playSound(type) {
  if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const frequency = type === 'correct' ? 660 : type === 'wrong' ? 220 : type === 'tick' ? 440 : 0;
      const duration = type === 'tick' ? 0.05 : 0.2;
      
      if (frequency > 0) {
          const oscillator = context.createOscillator();
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(frequency, context.currentTime);
          oscillator.connect(context.destination);
          oscillator.start();
          oscillator.stop(context.currentTime + duration);
      }
  } else {
      console.log('Web Audio API não suportada para sons.');
  }
}

/* ---------- Event Listeners Finais ---------- */
btnStart.addEventListener("click", prepararETeleQuiz);

btnRestart.addEventListener("click", () => {
  // Volta para a tela inicial
  hide(resultScreen);
  show(startScreen);
  // Limpa o formulário para novas seleções
  form.reset(); 
});

btnExit.addEventListener("click", () => {
  if (confirm("Tem certeza que deseja sair do quiz?")) {
    window.location.reload(); // Recarrega a página para reset total
  }
});/* style.css - Corrigido e Otimizado */

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

