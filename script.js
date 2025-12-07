/* script.js
    Conversão da lógica do quiz.py -> comportamento em JS.
    INCLUI:
    - Perguntas, timer por categoria, multiplicador de dificuldade.
    - Sons (Web Audio), shuffle, progresso, tema persistente.
    - LÓGICA DE ABAS (TABS) para seleção de temas.
    - REGISTRO DO SERVICE WORKER (PWA).
    - CORREÇÃO DA EXIBIÇÃO DE TELA (USANDO CLASSE 'hidden').
*/

/* -------------------- REGISTRO DO SERVICE WORKER -------------------- */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
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
  {"categoria":"Hardware","pergunta":"Para que serve a memória RAM?","opcoes":["Armazenar arquivos para sempre","Guardar dados temporários","Aumentar a internet","Refrigerar o PC"],"resposta":"Guardar dados temporários"},
  {"categoria":"Hardware","pergunta":"Qual unidade mede a velocidade da CPU?","opcoes":["GHz","MB","Watts","RPM"],"resposta":"GHz"},
  {"categoria":"Hardware","pergunta":"Qual componente conecta CPU, RAM e periféricos?","opcoes":["Placa-mãe","BIOS","HD","SSD"],"resposta":"Placa-mãe"},
  {"categoria":"Hardware","pergunta":"O que é overclock?","opcoes":["Aumentar a frequência de um componente","Desfragmentar o disco","Instalar drivers","Aumentar a RAM"],"resposta":"Aumentar a frequência de um componente"},
  {"categoria":"Hardware","pergunta":"O que caracteriza um SSD NVMe?","opcoes":["Conecta via SATA","É mais lento que SSD comum","Usa PCIe e é mais rápido","Só funciona em notebooks"],"resposta":"Usa PCIe e é mais rápido"},
  {"categoria":"Hardware","pergunta":"Qual peça converte energia para o PC?","opcoes":["Fonte (PSU)","Cooler","CPU","Placa de vídeo"],"resposta":"Fonte (PSU)"},
  {"categoria":"Hardware","pergunta":"Qual componente é responsável por armazenar dados mesmo sem energia?","opcoes":["RAM","SSD","Cache L1","GPU"],"resposta":"SSD"},

  {"categoria":"Redes","pergunta":"O que significa IP?","opcoes":["Internet Protocol","Internal Port","Internet Program","Information Process"],"resposta":"Internet Protocol"},
  {"categoria":"Redes","pergunta":"O que é um roteador?","opcoes":["Armazenamento","Distribuidor de sinal de rede","Processador de vídeo","Antivírus"],"resposta":"Distribuidor de sinal de rede"},
  {"categoria":"Redes","pergunta":"Qual cabo é usado em redes Ethernet?","opcoes":["HDMI","UTP (RJ-45)","VGA","SATA"],"resposta":"UTP (RJ-45)"},
  {"categoria":"Redes","pergunta":"O Wi-Fi transmite dados por:","opcoes":["Cabos coaxiais","Ondas de rádio","Fibra ótica","Cabo VGA"],"resposta":"Ondas de rádio"},
  {"categoria":"Redes","pergunta":"O que significa DNS?","opcoes":["Domain Name System","Data Network Service","Digital Node Server","Dynamic Network Setup"],"resposta":"Domain Name System"},
  {"categoria":"Redes","pergunta":"O que significa HTTP?","opcoes":["Hyper Transfer Text Program","HyperText Transfer Protocol","High Text Transfer Platform","Home Terminal Text Protocol"],"resposta":"HyperText Transfer Protocol"},
  {"categoria":"Redes","pergunta":"Qual protocolo é utilizado para enviar e-mails?","opcoes":["FTP","SMTP","DNS","DHCP"],"resposta":"SMTP"},

  {"categoria":"Software","pergunta":"Qual é um exemplo de software?","opcoes":["CPU","Placa de vídeo","Windows","Cooler"],"resposta":"Windows"},
  {"categoria":"Software","pergunta":"Antivírus é:","opcoes":["Hardware","Software","Periférico","Componente de rede"],"resposta":"Software"},
  {"categoria":"Software","pergunta":"O que é driver?","opcoes":["Programa que faz hardware funcionar","Cabo de energia","Peça do computador","Antivírus"],"resposta":"Programa que faz hardware funcionar"},
  {"categoria":"Software","pergunta":"O que é um arquivo .EXE?","opcoes":["Vídeo","Executável","ZIP","Áudio"],"resposta":"Executável"},
  {"categoria":"Software","pergunta":"O que é um sistema operacional?","opcoes":["Gerencia o hardware","Placa de som","Antivírus","Processador de vídeo"],"resposta":"Gerencia o hardware"},
  {"categoria":"Software","pergunta":"Qual tipo de software gerencia diretamente os recursos do computador?","opcoes":["Driver","Sistema Operacional","Utilitário","Firmware"],"resposta":"Sistema Operacional"},

  {"categoria":"Periféricos","pergunta":"Qual destes é um periférico de entrada?","opcoes":["Monitor","Teclado","Caixa de som","Projetor"],"resposta":"Teclado"},
  {"categoria":"Periféricos","pergunta":"Qual destes é um dispositivo de saída?","opcoes":["Mouse","Webcam","Monitor","Teclado"],"resposta":"Monitor"},
  {"categoria":"Periféricos","pergunta":"O que é uma impressora multifuncional?","opcoes":["Somente imprime","Imprime, copia e digitaliza","Só envia e-mail","Só digitaliza"],"resposta":"Imprime, copia e digitaliza"},
  {"categoria":"Periféricos","pergunta":"Qual conector geralmente fornece áudio analógico?","opcoes":["RJ-45","HDMI","P2 (3.5mm)","VGA"],"resposta":"P2 (3.5mm)"},
  {"categoria":"Periféricos","pergunta":"Qual desses dispositivos é considerado um periférico de saída?","opcoes":["Mouse","Teclado","Monitor","Scanner"],"resposta":"Monitor"},

  {"categoria":"Programação","pergunta":"O que significa SQL?","opcoes":["Structured Query Language","System Query Level","Super Quick Language","Secure Query Link"],"resposta":"Structured Query Language"},
  {"categoria":"Programação","pergunta":"Qual desses é um banco de dados relacional?","opcoes":["MongoDB","SQLite","Firebase","Redis"],"resposta":"SQLite"},
  {"categoria":"Programação","pergunta":"Qual destes é uma linguagem de programação?","opcoes":["HTML","CSS","Java","Photoshop"],"resposta":"Java"},
  {"categoria":"Programação","pergunta":"O Python é muito usado para:","opcoes":["Jogos AAA","IA e programação simples","Cuidar da rede Wi-Fi","Substituir o Windows"],"resposta":"IA e programação simples"},
  {"categoria":"Programação","pergunta":"Um loop serve para:","opcoes":["Armazenar arquivos","Repetir instruções","Criar janelas","Instalar programas"],"resposta":"Repetir instruções"},
  {"categoria":"Programação","pergunta":"O que faz um compilador?","opcoes":["Executa código em tempo real","Tradução de código fonte para código de máquina","Faz backup","Gerencia a memória"],"resposta":"Tradução de código fonte para código de máquina"},
  {"categoria":"Programação","pergunta":"Qual estrutura representa um laço de repetição?","opcoes":["if","switch","for","return"],"resposta":"for"},
  {"categoria":"Programação","pergunta":"Qual comando SQL é usado para atualizar dados?","opcoes":["SELECT","UPDATE","INSERT","DROP"],"resposta":"UPDATE"}
];
if(QUESTOES.length !== 40) console.warn("Aviso: EXPECTED 40 perguntas, found", QUESTOES.length);

/* ---------- Config (mesmo do quiz.py) ---------- */
const CORES = {
  "Informática Geral":"#007BFF",
  "Hardware":"#00C851",
  "Redes":"#ff4444",
  "Software":"#ff8800",
  "Periféricos":"#ffeb3b",
  "Programação":"#aa66cc"
};

const TEMPO_BASE_CATEGORIA = {
  "Programação": 12,
  "Hardware": 10,
  "Redes": 8,
  "Software": 15,
  "Periféricos": 15,
  "Informática Geral": 15
};

const MULTIPLICADOR_DIFICULDADE = {
  "Fácil": 1.5,
  "Médio": 1.0,
  "Difícil": 0.65
};

/* ---------- Estado ---------- */
let perguntasAtivas = [];
let index = 0;
let pontos = 0;
let tempoAtual = 0;
let timerInterval = null;
let dificuldade = "Médio";

/* ---------- Elementos DOM ---------- */
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const banner = document.getElementById("banner");
const qNumber = document.getElementById("q-number");
const qText = document.getElementById("question-text");
const answersWrap = document.getElementById("answers");
const timeLabel = document.getElementById("time");
const progressFill = document.getElementById("progress-fill");
const selectDiff = document.getElementById("select-diff");
const btnStart = document.getElementById("btn-start");
const btnPreview = document.getElementById("btn-preview");
const btnRestart = document.getElementById("btn-restart");
const btnExit = document.getElementById("btn-exit");
const scoreText = document.getElementById("score-text");
const perfText = document.getElementById("perf-text");
const summary = document.getElementById("summary");
const themeBtn = document.getElementById("btn-theme");
const appRoot = document.getElementById("app");

// Elementos NOVOS para as Abas
const tabsMenu = document.querySelector(".tabs-menu");


/* ---------- Theme persistence ---------- */
const THEME_KEY = "quiz_theme_v1";
(function initTheme(){
  const saved = localStorage.getItem(THEME_KEY) || "system";
  setTheme(saved);
  // CORREÇÃO: Garante que a tela inicial esteja visível, removendo a classe 'hidden' se estiver lá.
  show(startScreen); 
})();

themeBtn.addEventListener("click", ()=>{
  const current = appRoot.dataset.theme || "system";
  const next = current === "system" ? "dark" : current === "dark" ? "light" : "system";
  setTheme(next);
});
function setTheme(name){
  appRoot.dataset.theme = name;
  document.body.classList.remove("theme-light","theme-dark","theme-system");
  document.body.classList.add(name === "light" ? "theme-light" : name === "dark" ? "theme-dark" : "theme-system");
  localStorage.setItem(THEME_KEY, name);
  // Atualiza o ícone do botão de tema se necessário (já que o HTML usa CSS para isso)
}

/* ---------- Sound (Web Audio simple beeps) ---------- */
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
function ensureAudio(){
  if(!audioCtx) audioCtx = new AudioCtx();
}
function beep(freq=600, duration=140, type="sine", gain=0.08){
  try{
    ensureAudio();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = gain;
    o.connect(g);
    g.connect(audioCtx.destination);
    o.start();
    setTimeout(()=>{ o.stop(); }, duration);
  }catch(e){ /* ignore */ }
}
function tocar_acerto(){ beep(1200,140,"sine",0.08); }
function tocar_erro(){ beep(360,220,"sine",0.09); }
function tocar_aviso(){ beep(800,80,"sine",0.06); }

/* ---------- Utility ---------- */
function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]] = [arr[j],arr[i]];
  }
  return arr;
}

/* ---------- UI helpers (CORRIGIDOS) ---------- */
// Apenas adiciona/remove a classe 'hidden' para respeitar o !important do CSS
function show(el){ el.classList.remove("hidden"); } 
function hide(el){ el.classList.add("hidden"); }

/* -------------------- LÓGICA DAS ABAS (TABS) -------------------- */
if(tabsMenu) {
  tabsMenu.addEventListener("click", (e) => {
    const btn = e.target.closest(".tab-btn");
    if (!btn || btn.classList.contains("active")) return;

    const tabName = btn.dataset.tab;
    
    // 1. Desativa botões e painéis
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".themes-tab-pane").forEach(p => p.classList.remove("active"));

    // 2. Ativa o botão e painel corretos
    btn.classList.add("active");
    const activePane = document.getElementById(`tab-${tabName}`);
    if (activePane) {
      activePane.classList.add("active");
    }
  });
}
/* ----------------------------------------------------------------- */

/* ---------- Start / Preview ---------- */
btnPreview.addEventListener("click", ()=>{
  // Pega checkboxes em *todos* os painéis
  const temas = Array.from(document.querySelectorAll('.themes-tabs-content input[type=checkbox]'))
    .filter(i=>i.checked).map(i=>i.value);
  if(temas.length === 0){ alert("Nenhum tema selecionado. Marque pelo menos um tema."); return; }
  alert("Serão incluídos os temas:\n\n" + temas.join("\n"));
});

btnStart.addEventListener("click", prepareAndStart);

/* ---------- Core: prepare and start ---------- */
function prepareAndStart(){
  dificuldade = selectDiff.value || "Médio";
  
  // Pega checkboxes em *todos* os painéis
  const temas = Array.from(document.querySelectorAll('.themes-tabs-content input[type=checkbox]'))
    .filter(i=>i.checked).map(i=>i.value);

  if(temas.length === 0){ alert("Selecione pelo menos um tema para iniciar."); return; }

  perguntasAtivas = QUESTOES.filter(q => temas.includes(q.categoria)).map(q => ({...q}));
  if(perguntasAtivas.length === 0){ alert("Não há perguntas para os temas selecionados."); return; }

  shuffle(perguntasAtivas);
  // Mantive a limitação de 40 perguntas, mas o quiz rodará com todas as selecionadas se forem menos.
  perguntasAtivas = perguntasAtivas.slice(0,40); 
  index = 0;
  pontos = 0;
  buildQuizScreen();
}

/* ---------- Build quiz screen ---------- */
function buildQuizScreen(){
  // stop existing timer
  if(timerInterval){ clearInterval(timerInterval); timerInterval = null; }

  // show/hide (CORREÇÃO CRÍTICA: Uso de show/hide para remover a classe 'hidden')
  hide(startScreen);
  hide(resultScreen);
  show(quizScreen); // O quizScreen agora será exibido corretamente!

  const current = perguntasAtivas[index];
  banner.style.background = CORES[current.categoria] || "#333";
  banner.textContent = current.categoria.toUpperCase();

  qNumber.textContent = `Pergunta ${index+1} / ${perguntasAtivas.length}`;
  qText.textContent = current.pergunta;

  // clear answers & create buttons
  answersWrap.innerHTML = "";
  const opcoes = current.opcoes.slice();
  // Shuffle respostas
  shuffle(opcoes);
  opcoes.forEach(op => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.textContent = op;
    btn.onclick = ()=> onChoice(op, btn);
    answersWrap.appendChild(btn);
  });

  // progress
  const pct = Math.round((index / perguntasAtivas.length) * 100);
  progressFill.style.width = `${pct}%`;

  // config tempo
  const base = TEMPO_BASE_CATEGORIA[current.categoria] || 12;
  const mult = MULTIPLICADOR_DIFICULDADE[dificuldade] || 1.0;
  tempoAtual = Math.max(3, Math.floor(base * mult));
  updateTempoLabelColor();
  timeLabel.textContent = `Tempo: ${tempoAtual}s`;

  // start countdown (per second)
  timerInterval = setInterval(()=> {
    tempoAtual -= 1;
    timeLabel.textContent = `Tempo: ${tempoAtual}s`;
    updateTempoLabelColor();
    if(tempoAtual <= 0){
      clearInterval(timerInterval); timerInterval = null;
      revelarResposta(null);
    } else if (tempoAtual <= 3){
      tocar_aviso();
    }
  }, 1000);
}

/* ---------- tempo color ---------- */
function updateTempoLabelColor(){
  if(tempoAtual > 8){ timeLabel.style.color = "#00ff99"; }
  else if (tempoAtual > 4){ timeLabel.style.color = "#ffdd00"; }
  else { timeLabel.style.color = "#ff4444"; }
}

/* ---------- when user chooses ---------- */
function onChoice(escolha, btn){
  if(timerInterval){ clearInterval(timerInterval); timerInterval = null; }
  revelarResposta(escolha);
}

/* ---------- reveal answer (LÓGICA FALTANTE) ---------- */
function revelarResposta(escolha) {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    const current = perguntasAtivas[index];
    const correta = current.resposta;
    let acertou = false;

    // 1. Desabilita todos os botões e encontra o correto
    Array.from(answersWrap.children).forEach(btn => {
        btn.classList.add("disabled");
        if (btn.textContent === correta) {
            btn.classList.add("answer-correct");
        } else if (btn.textContent === escolha) {
            btn.classList.add("answer-wrong");
        }
    });

    // 2. Verifica se acertou e atualiza pontos
    if (escolha === correta) {
        pontos++;
        acertou = true;
        tocar_acerto();
    } else {
        tocar_erro();
    }

    // 3. Adiciona o resultado para o resumo final
    current.acertou = acertou;

    // 4. Próxima pergunta após um pequeno delay
    setTimeout(nextQuestion, 1500); // 1.5 segundos de pausa para o usuário ver a resposta
}

/* ---------- next question (LÓGICA FALTANTE) ---------- */
function nextQuestion() {
    index++;
    if (index < perguntasAtivas.length) {
        buildQuizScreen();
    } else {
        showResult();
    }
}

/* ---------- show result (LÓGICA FALTANTE) ---------- */
function showResult() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    // Esconde Quiz e mostra Resultado
    hide(quizScreen);
    show(resultScreen);

    scoreText.textContent = `Você acertou ${pontos} de ${perguntasAtivas.length} perguntas`;
    const perc = Math.round((pontos / perguntasAtivas.length) * 100);
    let perf = "Precisa melhorar";
    if (perc === 100) perf = "PERFEITO! 🔥";
    else if (perc >= 80) perf = "Excelente!";
    else if (perc >= 60) perf = "Muito bom!";
    else if (perc >= 40) perf = "Regular";
    perfText.textContent = `Desempenho: ${perf} (${perc}%)`;

    // Resumo por categoria
    const resumo = {};
    perguntasAtivas.forEach(q => {
        const cat = q.categoria;
        if (!resumo[cat]) {
            resumo[cat] = { acertos: 0, total: 0 };
        }
        resumo[cat].total++;
        if (q.acertou) {
            resumo[cat].acertos++;
        }
    });

    const resumoText = "Estatísticas por Tema:\n" +
        Object.entries(resumo)
        .map(([k, v]) => `${k}: ${v.acertos} / ${v.total}`)
        .join("\n");

    summary.textContent = resumoText;
}


/* ---------- restart / exit (LÓGICA FALTANTE) ---------- */
btnRestart.addEventListener("click", () => {
    // Esconde a tela de resultado e mostra a tela inicial
    hide(resultScreen);
    show(startScreen); 
    // Resetar o estado
    index = 0;
    pontos = 0;
});

btnExit.addEventListener("click", () => {
    alert("Obrigado por jogar! Voltando ao menu.");
    // Volta para o menu principal
    hide(resultScreen);
    show(startScreen);
    index = 0;
    pontos = 0;
});
