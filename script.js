/* script.js
   VERSÃO FINAL E CORRIGIDA.
   - Corrige a inicialização dos botões e a navegação entre telas.
   - Garante que apenas uma tela está visível ao mesmo tempo (usando a classe .hidden do CSS).
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

/* ---------- Funções de Utilidade (Show/Hide) ---------- */
function show(el) {
  el.classList.remove("hidden");
  // O estilo display: block/flex é tratado pelo CSS, mas o JS pode forçar se necessário
  el.style.display = "block"; 
}

function hide(el) {
  el.classList.add("hidden");
  el.style.display = "none";
}

/* ---------- 1. Lógica de Temas e Abas ---------- */

function loadTheme() {
    const savedTheme = localStorage.getItem("theme") || "system";
    appContainer.className = savedTheme; // Define a classe principal
    appContainer.setAttribute("data-theme", savedTheme);

    // Ajusta o ícone de toggle
    const iconSpan = btnTheme.querySelector('span');
    if (iconSpan) {
        iconSpan.className = ''; // Limpa as classes de ícone
        if (savedTheme === 'theme-light') {
            iconSpan.classList.add('icon-sun');
        } else {
            iconSpan.classList.add('icon-moon');
        }
    }

    // Ativa a aba correta
    themeTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.theme === savedTheme) {
            tab.classList.add('active');
        }
    });
    themePanes.forEach(pane => {
         pane.classList.remove('active');
        if (pane.id.includes(savedTheme.replace('theme-', ''))) {
            pane.classList.add('active');
        }
    });
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
    loadTheme(); 
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
  
  // Reinicia variáveis (apesar de já estarem no btnRestart, é bom garantir)
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
      // Resposta no timeout
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

/* ---------- Event Listeners Finais e Inicialização ---------- */

// Botão Iniciar na tela inicial
btnStart.addEventListener("click", prepararETeleQuiz);

// Botão Jogar Novamente na tela de resultado
btnRestart.addEventListener("click", () => {
  // Limpa os estados, reseta variáveis e volta para a tela inicial
  questaoAtual = 0;
  pontos = 0;
  if(timerInterval) clearInterval(timerInterval);
  tempoRestante = 0;
  
  hide(resultScreen);
  show(startScreen);
  
  // Opcional: Limpar o formulário para selecionar novos temas/dificuldade
  form.reset(); 
});

// Botão Sair na tela de resultado
btnExit.addEventListener("click", () => {
  if (confirm("Tem certeza que deseja sair do quiz?")) {
    window.location.reload(); // Recarrega a página para resetar o estado do JS e voltar à inicial
  }
});

// Garante que apenas a tela inicial aparece no carregamento e o tema é carregado
window.addEventListener("DOMContentLoaded", () => {
    loadTheme();
    // Garante que só a tela inicial está visível ao carregar o app, prevenindo o erro de sobreposição
    hide(quizScreen);
    hide(resultScreen);
    show(startScreen);
});
