/* script.js
   VERSÃO FINAL E CORRIGIDA.
   - Inclui 35 perguntas no total (3 temas existentes + 1 novo tema).
   - Corrige a inicialização dos botões e a navegação entre telas.
*/

/* -------------------- REGISTRO DO SERVICE WORKER (PWA) -------------------- */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Note: Usamos o caminho absoluto /sw.js, o que funciona melhor com o GitHub Pages
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registrado com sucesso para PWA:', reg.scope))
      .catch(err => console.log('Registro do Service Worker falhou:', err));
  });
}
/* -------------------------------------------------------------------- */

/* ---------- Perguntas (AGORA COM 35 QUESTÕES E 4 TEMAS) ---------- */
const QUESTOES = [
  // --- INFORMÁTICA GERAL (10 QUESTÕES) ---
  {"categoria":"Informática Geral","pergunta":"O que significa HTML?","opcoes":["HyperText Markup Language","HighText Machine Language","Hyper Transfer Markup Level","Hyperlinks Text Memory Language"],"resposta":"HyperText Markup Language"},
  {"categoria":"Informática Geral","pergunta":"Qual linguagem é executada no navegador?","opcoes":["Python","JavaScript","C#","Java"],"resposta":"JavaScript"},
  {"categoria":"Informática Geral","pergunta":"O que significa WWW?","opcoes":["Wide World Web","Wide Web Window","World Wide Web","World Web Wireless"],"resposta":"World Wide Web"},
  {"categoria":"Informática Geral","pergunta":"Qual desses é um sistema operacional?","opcoes":["Chrome","Firefox","Windows","Google Drive"],"resposta":"Windows"},
  {"categoria":"Informática Geral","pergunta":"Qual empresa criou o Windows?","opcoes":["Microsoft","Apple","IBM","Intel"],"resposta":"Microsoft"},
  {"categoria":"Informática Geral","pergunta":"O que é um arquivo PDF?","opcoes":["Programa de Design Funcional","Protocolo de Dados Fixos","Portable Document Format","Página de Documento Final"],"resposta":"Portable Document Format"},
  {"categoria":"Informática Geral","pergunta":"Qual é o principal protocolo para envio de e-mail?","opcoes":["FTP","HTTP","SMTP","POP3"],"resposta":"SMTP"},
  {"categoria":"Informática Geral","pergunta":"O que significa 'Cloud Computing'?","opcoes":["Computação na nuvem","Armazenamento local","Processamento em cache","Servidores físicos"],"resposta":"Computação na nuvem"},
  {"categoria":"Informática Geral","pergunta":"Qual extensão é comum para arquivos compactados?","opcoes":[".exe",".zip",".jpg",".mp4"],"resposta":".zip"},
  {"categoria":"Informática Geral","pergunta":"O que é um firewall?","opcoes":["Um software de edição de imagens","Um sistema de segurança de rede","Um tipo de vírus","Uma linguagem de programação"],"resposta":"Um sistema de segurança de rede"},

  // --- HARDWARE (10 QUESTÕES) ---
  {"categoria":"Hardware","pergunta":"Qual componente armazena dados permanentemente?","opcoes":["RAM","SSD/HDD","GPU","Fonte"],"resposta":"SSD/HDD"},
  {"categoria":"Hardware","pergunta":"Qual é responsável pelo processamento gráfico?","opcoes":["CPU","GPU","RAM","Fonte de alimentação"],"resposta":"GPU"},
  {"categoria":"Hardware","pergunta":"O que é RAM?","opcoes":["Memória de acesso rápido","Memória somente leitura","Memória de vídeo","Cache do processador"],"resposta":"Memória de acesso rápido"},
  {"categoria":"Hardware","pergunta":"Qual porta é usada para conectar um cabo de rede (internet)?","opcoes":["USB","HDMI","RJ45","VGA"],"resposta":"RJ45"},
  {"categoria":"Hardware","pergunta":"Qual componente é o 'cérebro' do computador?","opcoes":["Placa Mãe","Memória RAM","CPU","Placa de Vídeo"],"resposta":"CPU"},
  {"categoria":"Hardware","pergunta":"O que é o BIOS/UEFI?","opcoes":["Sistema operacional","Firmware de inicialização","Um tipo de placa de vídeo","Memória de rede"],"resposta":"Firmware de inicialização"},
  {"categoria":"Hardware","pergunta":"O que mede a velocidade de um processador?","opcoes":["Volts","Gigahertz (GHz)","Megabytes (MB)","Pixels"],"resposta":"Gigahertz (GHz)"},
  {"categoria":"Hardware","pergunta":"Qual tipo de memória é volátil?","opcoes":["ROM","SSD","RAM","HDD"],"resposta":"RAM"},
  {"categoria":"Hardware","pergunta":"Qual o nome do slot da Placa-Mãe usado para Placas de Vídeo modernas?","opcoes":["AGP","PCI","ISA","PCI Express (PCIe)"],"resposta":"PCI Express (PCIe)"},
  {"categoria":"Hardware","pergunta":"Qual componente converte energia AC para DC no PC?","opcoes":["CPU","Fonte de alimentação","Placa Mãe","Dissipador"],"resposta":"Fonte de alimentação"},

  // --- PROGRAMAÇÃO (10 QUESTÕES) ---
  {"categoria":"Programação","pergunta":"O que é um 'bug'?","opcoes":["Um erro no código","Um tipo de dado","Um comando de loop","Um atalho de teclado"],"resposta":"Um erro no código"},
  {"categoria":"Programação","pergunta":"O que faz um loop 'for'?","opcoes":["Executa um código uma única vez","Executa um código sob uma condição","Executa um código repetidamente por um número fixo de vezes","Define uma função"],"resposta":"Executa um código repetidamente por um número fixo de vezes"},
  {"categoria":"Programação","pergunta":"Qual símbolo é usado para comentários em Python?","opcoes":["//","#","/* */","--"],"resposta":"#"},
  {"categoria":"Programação","pergunta":"Em JS, qual palavra-chave declara uma variável que não pode ser reatribuída?","opcoes":["var","let","const","func"],"resposta":"const"},
  {"categoria":"Programação","pergunta":"O que é uma API?","opcoes":["Interface de programação de aplicativos","Servidor de banco de dados","Linguagem de estilos","Protocolo de internet"],"resposta":"Interface de programação de aplicativos"},
  {"categoria":"Programação","pergunta":"O que significa a sigla HTML?","opcoes":["High Text Model Language","HyperText Markup Language","Home Tool Markup Language","Hyper Transfer Markup Language"],"resposta":"HyperText Markup Language"},
  {"categoria":"Programação","pergunta":"Qual estrutura controla a execução de código baseada em uma condição (true/false)?","opcoes":["Loop For","Função","Condicional If/Else","Variável"],"resposta":"Condicional If/Else"},
  {"categoria":"Programação","pergunta":"O que é 'variável' em programação?","opcoes":["Um valor constante","Um erro de sintaxe","Um local de armazenamento de dados","Um tipo de função"],"resposta":"Um local de armazenamento de dados"},
  {"categoria":"Programação","pergunta":"Qual linguagem é tipicamente usada para estilizar páginas web?","opcoes":["JavaScript","Python","CSS","PHP"],"resposta":"CSS"},
  {"categoria":"Programação","pergunta":"O que é 'compilação'?","opcoes":["Executar o código linha por linha","Traduzir código fonte para código de máquina","Escrever código em um editor de texto","Testar o software"],"resposta":"Traduzir código fonte para código de máquina"},

  // --- REDES E SEGURANÇA (5 QUESTÕES - NOVO TEMA) ---
  {"categoria":"Redes e Segurança","pergunta":"Qual protocolo é usado para navegar na web (endereço de sites)?","opcoes":["FTP","SMTP","HTTPS","ARP"],"resposta":"HTTPS"},
  {"categoria":"Redes e Segurança","pergunta":"O que significa o 'IP' de um computador?","opcoes":["Informação de Produto","Protocolo de Internet","Ponto de Interface","Identificação Pessoal"],"resposta":"Protocolo de Internet"},
  {"categoria":"Redes e Segurança","pergunta":"Qual ataque tenta sobrecarregar um servidor para que ele pare de funcionar?","opcoes":["Phishing","SQL Injection","DDoS (Negação de Serviço Distribuída)","Malware"],"resposta":"DDoS (Negação de Serviço Distribuída)"},
  {"categoria":"Redes e Segurança","pergunta":"O que é uma VPN?","opcoes":["Rede pública e aberta","Rede virtual privada","Antivírus","Ponto de acesso Wi-Fi"],"resposta":"Rede virtual privada"},
  {"categoria":"Redes e Segurança","pergunta":"Em redes, o que é um 'Gateway'?","opcoes":["Um cabo de rede","Um dispositivo que conecta duas redes diferentes","Um tipo de protocolo de segurança","Um servidor de arquivos"],"resposta":"Um dispositivo que conecta duas redes diferentes"}
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
  el.style.display = "flex"; // Usando flex para garantir centralização vertical
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
  // 1. Tenta pegar os temas selecionados pelo usuário
  let temasSelecionados = Array.from(document.querySelectorAll('input[name="tema"]:checked')).map(cb => cb.value);
  
  const totalPerguntas = parseInt(document.getElementById("num-q").value) || 10;
  dificuldade = parseFloat(document.getElementById("dificuldade").value) || 1.0;

  // 2. CORREÇÃO CRÍTICA: Se a lista de selecionados estiver vazia, usa TODOS os temas
  if (temasSelecionados.length === 0) {
      // Pega o valor de TODOS os checkboxes, independentemente de estarem marcados
      temasSelecionados = Array.from(document.querySelectorAll('input[name="tema"]')).map(cb => cb.value);
      
      if (temasSelecionados.length === 0) {
           alert("Nenhum tema foi configurado no formulário HTML. Verifique o código.");
           return false;
      }
  }

  // 3. Filtra as perguntas com base na seleção (ou em todos os temas)
  let perguntasFiltradas = QUESTOES.filter(q => temasSelecionados.includes(q.categoria));
  
  if (perguntasFiltradas.length === 0) {
    alert("Não foi possível carregar perguntas para os temas selecionados. Tente novamente.");
    return false;
  }
  
  // Embaralha e limita as perguntas...
  perguntasFiltradas = perguntasFiltradas.sort(() => 0.5 - Math.random());
  perguntasAtivas = perguntasFiltradas.slice(0, totalPerguntas);
  
  // Reinicia variáveis
  questaoAtual = 0;
  pontos = 0;
  return true; // Retorna true para iniciar o quiz
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
  show(resultScreen); // O show usa display: flex; para centralizar
  
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

// TEMPOS ATUALIZADOS COM NOVO TEMA
const TEMPO_BASE = {
  "Informática Geral": 30,
  "Hardware": 25,
  "Programação": 20,
  "Redes e Segurança": 25 // NOVO TEMA
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
  show(startScreen); // O show usa display: flex; para centralizar
  
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
    show(startScreen); // O show usa display: flex; para centralizar
});
