// Esperar que o DOM seja completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar variáveis globais
    window.draggedItem = null;
    window.dropZonesInitialized = false;
    window.dragItemsInitialized = false;
    window.lastKnownItems = new Set(); // Armazenar os últimos itens conhecidos para detecção de duplicações
    window.isResettingExercise = false; // Flag para controlar quando o exercício está sendo resetado
    
    // Logs para diagnóstico
    console.log("[Diagnóstico] Inicialização do script principal");
    
    // Função para remover duplicações nos itens de arrastar e soltar
    function removeDuplicateItems() {
        const dragItemsContainer = document.querySelector('.drag-items');
        if (!dragItemsContainer) {
            return; // Container não encontrado
        }
        
        console.log("[Diagnóstico] Verificando duplicações nos itens de arrastar e soltar");
        
        // Mapeamento de itens vistos
        const itemsSeen = new Map();
        const duplicateItems = [];
        
        // Encontrar todos os itens e identificar duplicações
        dragItemsContainer.querySelectorAll('.drag-item').forEach(item => {
            const text = item.textContent.trim();
            const type = item.getAttribute('data-type') || '';
            const key = `${text}-${type}`;
            
            if (itemsSeen.has(key)) {
                duplicateItems.push(item);
                console.log(`[Diagnóstico] Duplicação encontrada: ${text} (${type})`);
            } else {
                itemsSeen.set(key, item);
            }
        });
        
        // Remover itens duplicados apenas se houver duplicações
        if (duplicateItems.length > 0) {
            console.log(`[Diagnóstico] Removendo ${duplicateItems.length} itens duplicados`);
            duplicateItems.forEach(item => {
                console.log(`[Diagnóstico] Removendo item duplicado: ${item.textContent.trim()}`);
                item.remove();
            });
        } else {
            console.log("[Diagnóstico] Nenhuma duplicação encontrada");
        }
        
        // Verificar se houve modificação na lista de itens conhecidos
        if (window.lastKnownItems.size > 0) {
            const currentItems = new Set([...itemsSeen.keys()]);
            
            if (currentItems.size > window.lastKnownItems.size) {
                console.log("[Diagnóstico] Novos itens foram adicionados desde a última verificação");
                const newItems = [...currentItems].filter(item => !window.lastKnownItems.has(item));
                console.log("[Diagnóstico] Novos itens:", newItems);
            } else if (currentItems.size < window.lastKnownItems.size) {
                console.log("[Diagnóstico] Itens foram removidos desde a última verificação");
                const removedItems = [...window.lastKnownItems].filter(item => !currentItems.has(item));
                console.log("[Diagnóstico] Itens removidos:", removedItems);
            }
            
            window.lastKnownItems = currentItems;
        } else {
            window.lastKnownItems = new Set([...itemsSeen.keys()]);
        }
        
        console.log(`[Diagnóstico] Itens após remoção de duplicações: ${itemsSeen.size}`);
    }
    
    // Chamar a função para remover duplicações após inicialização e ao mudar de seção
    setTimeout(removeDuplicateItems, 500); // Executa logo após a inicialização da página
    
    // Navegação entre seções
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('main section');
    const goToButtons = document.querySelectorAll('[data-goto]');

    // Função para mostrar uma seção específica
    function showSection(sectionId) {
        // Esconder todas as seções
        sections.forEach(section => {
            section.classList.remove('active-section');
        });

        // Remover classe 'active' de todos os botões de navegação
        navButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        // Mostrar a seção selecionada
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active-section');
            
            // Adicionar classe 'active' ao botão correspondente
            const activeNavBtn = document.querySelector(`.nav-btn[data-target="${sectionId}"]`);
            if (activeNavBtn) {
                activeNavBtn.classList.add('active');
            }

            // Rolar para o topo da página
            window.scrollTo(0, 0);
            
            // Se for a seção de exercícios, remover duplicações nos itens de arrastar e soltar
            if (sectionId === 'exercicios') {
                console.log("[Diagnóstico] Entrando na seção de exercícios");
                setTimeout(removeDuplicateItems, 100); // Pequeno atraso para garantir que o DOM foi atualizado
            }
        }
    }

    // Adicionar evento de clique aos botões de navegação
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-target');
            showSection(targetSection);
        });
    });

    // Adicionar evento de clique aos botões "Começar"
    goToButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-goto');
            showSection(targetSection);
        });
    });

    // Controlador de Slides/Carrossel
    const slideshows = document.querySelectorAll('.slideshow-container');

    slideshows.forEach((slideshow, slideshowIndex) => {
        const slides = slideshow.querySelectorAll('.slide');
        const prev = slideshow.querySelector('.prev');
        const next = slideshow.querySelector('.next');
        const dots = document.querySelectorAll(`.dot-container:nth-of-type(${slideshowIndex + 1}) .dot`);
        let currentSlide = 0;

        // Função para mostrar um slide específico
        function showSlide(n) {
            // Ajustar o índice se estiver fora do limite
            if (n >= slides.length) {
                currentSlide = 0;
            } else if (n < 0) {
                currentSlide = slides.length - 1;
            } else {
                currentSlide = n;
            }

            // Esconder todos os slides
            slides.forEach(slide => {
                slide.classList.remove('active');
                slide.style.display = 'none';
            });

            // Mostrar o slide atual
            slides[currentSlide].classList.add('active');
            slides[currentSlide].style.display = 'block';

            // Atualizar os pontos de navegação
            if (dots.length > 0) {
                dots.forEach((dot, index) => {
                    dot.classList.remove('active-dot');
                    if (index === currentSlide) {
                        dot.classList.add('active-dot');
                    }
                });
            }
        }

        // Eventos para os botões anterior e próximo
        if (prev) {
            prev.addEventListener('click', () => {
                showSlide(currentSlide - 1);
            });
        }

        if (next) {
            next.addEventListener('click', () => {
                showSlide(currentSlide + 1);
            });
        }

        // Eventos para os pontos de navegação
        if (dots.length > 0) {
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    showSlide(index);
                });
            });
        }

        // Inicializar o slide
        showSlide(currentSlide);

        // Alternar slides automaticamente a cada 5 segundos
        setInterval(() => {
            if (!slideshow.querySelector('.slide:hover')) {
                showSlide(currentSlide + 1);
            }
        }, 5000);
    });

    // Tutorial passo a passo
    const tutorialSteps = document.querySelectorAll('.tutorial-step');
    const stepPrev = document.querySelector('.step-prev');
    const stepNext = document.querySelector('.step-next');
    const tutorialPages = document.querySelectorAll('.tutorial-page');
    const pageNumbers = document.querySelectorAll('.page-number');
    let currentStep = 1;
    let currentPage = 1;

    // Função para mostrar uma página específica
    function showPage(pageNumber) {
        // Esconder todas as páginas
        tutorialPages.forEach(page => {
            page.classList.remove('active-page');
        });

        // Mostrar a página selecionada
        const targetPage = document.querySelector(`.tutorial-page[data-page="${pageNumber}"]`);
        if (targetPage) {
            targetPage.classList.add('active-page');
            
            // Atualizar os indicadores de página
            pageNumbers.forEach(num => {
                num.classList.remove('active-page-number');
                if (parseInt(num.getAttribute('data-page')) === pageNumber) {
                    num.classList.add('active-page-number');
                }
            });
            
            // Atualizar estado dos botões de navegação
            if (stepPrev) {
                stepPrev.disabled = pageNumber <= 1;
            }
            
            if (stepNext) {
                stepNext.disabled = pageNumber >= tutorialPages.length;
            }
            
            // Atualizar a página atual
            currentPage = pageNumber;
            
            // Atualizar também o passo ativo (primeiro passo da página)
            const firstStepInPage = (pageNumber - 1) * 4 + 1;
            showStep(firstStepInPage);
        }
    }

    // Função para mostrar um passo específico
    function showStep(stepNumber) {
        // Determinar a qual página pertence o passo
        const pageForStep = Math.ceil(stepNumber / 4);
        
        // Se o passo pertence a outra página, mostrar a página correta primeiro
        if (pageForStep !== currentPage) {
            showPage(pageForStep);
            return;
        }
        
        // Esconder todos os passos da página atual
        const currentPageSteps = document.querySelectorAll(`.tutorial-page[data-page="${currentPage}"] .tutorial-step`);
        currentPageSteps.forEach(step => {
            step.classList.remove('active-step');
        });

        // Mostrar o passo selecionado
        const targetStep = document.querySelector(`.tutorial-step[data-step="${stepNumber}"]`);
        if (targetStep) {
            targetStep.classList.add('active-step');
            currentStep = stepNumber;
        }
    }

    // Configurar eventos dos botões de navegação do tutorial
    if (stepPrev) {
        stepPrev.addEventListener('click', function() {
            if (currentPage > 1) {
                showPage(currentPage - 1);
            }
        });
    }

    if (stepNext) {
        stepNext.addEventListener('click', function() {
            if (currentPage < tutorialPages.length) {
                showPage(currentPage + 1);
            }
        });
    }

    // Configurar eventos dos indicadores de página
    pageNumbers.forEach(num => {
        num.addEventListener('click', function() {
            const pageNum = parseInt(this.getAttribute('data-page'));
            showPage(pageNum);
        });
    });

    // Inicializar o tutorial na primeira página
    showPage(1);

    // Quiz avançado
    const quizQuestions = document.querySelectorAll('.quiz-question');
    const quizPrev = document.querySelector('.quiz-prev');
    const quizNext = document.querySelector('.quiz-next');
    const quizResult = document.querySelector('.quiz-result');
    const quizRestart = document.querySelector('.quiz-restart');
    const progressBar = document.querySelector('.progress-bar');
    let currentQuestion = 1;
    let correctAnswers = 0;
    let selectedAnswers = {};

    // Função para mostrar uma pergunta específica
    function showQuizQuestion(questionNumber) {
        // Ocultar todas as perguntas
        quizQuestions.forEach(question => {
            question.style.display = 'none';
        });
        
        const targetQuestion = document.querySelector(`.quiz-question[data-question="${questionNumber}"]`);
        if (targetQuestion) {
            targetQuestion.style.display = 'block';
            
            // Atualizar estado dos botões de navegação
            if (quizPrev) {
                quizPrev.disabled = questionNumber <= 1;
            }
            
            // Modificar texto do botão "Próxima" na última pergunta
            if (quizNext) {
                if (questionNumber >= quizQuestions.length) {
                    quizNext.textContent = 'Ver Resultado';
                } else {
                    quizNext.textContent = 'Próxima';
                }
            }
            
            // Atualizar barra de progresso
            if (progressBar) {
                const progressPercentage = ((questionNumber - 1) / quizQuestions.length) * 100;
                progressBar.style.width = `${progressPercentage}%`;
            }
        }
    }

    // Configurar eventos para as respostas do quiz
    document.querySelectorAll('.quiz-answer').forEach(answer => {
        answer.addEventListener('click', function() {
            // Remover seleção anterior na mesma pergunta
            const questionElement = this.closest('.quiz-question');
            questionElement.querySelectorAll('.quiz-answer').forEach(a => {
                a.classList.remove('selected');
            });
            
            // Selecionar esta resposta
            this.classList.add('selected');
            
            // Armazenar a resposta selecionada
            const questionNumber = parseInt(questionElement.getAttribute('data-question'));
            selectedAnswers[questionNumber] = this;
        });
    });

    // Configurar evento do botão "Anterior" do quiz
    if (quizPrev) {
        quizPrev.addEventListener('click', function() {
            if (currentQuestion > 1) {
                currentQuestion--;
                showQuizQuestion(currentQuestion);
            }
        });
    }

    // Configurar evento do botão "Próxima" do quiz
    if (quizNext) {
        quizNext.addEventListener('click', function() {
            if (currentQuestion < quizQuestions.length) {
                currentQuestion++;
                showQuizQuestion(currentQuestion);
            } else {
                // Mostrar o resultado
                calculateQuizResult();
            }
        });
    }

    // Calcular e mostrar o resultado do quiz
    function calculateQuizResult() {
        correctAnswers = 0;
        
        // Verificar respostas
        for (let i = 1; i <= quizQuestions.length; i++) {
            if (selectedAnswers[i]) {
                const answer = selectedAnswers[i];
                if (answer.hasAttribute('data-correct')) {
                    correctAnswers++;
                    answer.classList.add('correct');
                } else {
                    answer.classList.add('incorrect');
                    // Destacar a resposta correta
                    const correctAnswer = document.querySelector(`.quiz-question[data-question="${i}"] .quiz-answer[data-correct="true"]`);
                    if (correctAnswer) {
                        correctAnswer.classList.add('correct');
                    }
                }
            }
        }
        
        // Atualizar barra de progresso para 100%
        if (progressBar) {
            progressBar.style.width = '100%';
        }
        
        // Esconder perguntas e mostrar resultado
        quizQuestions.forEach(question => {
            question.style.display = 'none';
        });
        
        if (quizPrev) quizPrev.style.display = 'none';
        if (quizNext) quizNext.style.display = 'none';
        
        if (quizResult) {
            quizResult.style.display = 'block';
            quizResult.querySelector('.result-score').textContent = `${correctAnswers}/${quizQuestions.length}`;
        }
    }

    // Reiniciar o quiz
    if (quizRestart) {
        quizRestart.addEventListener('click', function() {
            // Resetar variáveis
            currentQuestion = 1;
            correctAnswers = 0;
            selectedAnswers = {};
            
            // Limpar marcações nas respostas
            document.querySelectorAll('.quiz-answer').forEach(answer => {
                answer.classList.remove('selected', 'correct', 'incorrect');
            });
            
            // Resetar barra de progresso
            if (progressBar) {
                progressBar.style.width = '0%';
            }
            
            // Esconder resultado
            if (quizResult) {
                quizResult.style.display = 'none';
            }
            
            // Mostrar botões de navegação
            if (quizPrev) {
                quizPrev.style.display = 'block';
                quizPrev.disabled = true;
            }
            
            if (quizNext) {
                quizNext.style.display = 'block';
                quizNext.textContent = 'Próxima';
            }
            
            // Mostrar primeira pergunta
            showQuizQuestion(currentQuestion);
        });
    }

    // Inicializar o quiz
    if (quizQuestions.length > 0) {
        showQuizQuestion(currentQuestion);
    }

    // Simulação do computador
    const powerBtn = document.getElementById('powerBtn');
    const helpBtn = document.getElementById('helpBtn');
    const computerScreen = document.querySelector('.computer-screen');
    const desktopIcons = document.querySelectorAll('.desktop-icon');
    let computerOn = false;

    // Ligar/desligar o computador
    if (powerBtn) {
        powerBtn.addEventListener('click', function() {
            computerOn = !computerOn;
            
            if (computerOn) {
                computerScreen.style.backgroundColor = '#f5f6fa';
                computerScreen.style.backgroundImage = 'url("https://img.freepik.com/free-vector/abstract-blue-light-pipe-speed-zoom-black-background-technology_1142-9980.jpg?w=996&t=st=1693333863~exp=1693334463~hmac=bc9b5ed38b1f150a6cf1add70913c3e14e3f92de3ab38c6e932a2a1df3527fb5")';
                computerScreen.style.backgroundSize = 'cover';
                desktopIcons.forEach(icon => {
                    icon.style.opacity = '1';
                });
                alertaSimples('Computador ligado com sucesso!', 'success');
                
                // Se estivermos no primeiro passo do tutorial, passar para o próximo
                if (currentStep === 1 && tutorialSteps.length > 0) {
                    setTimeout(() => {
                        currentStep = 2;
                        showStep(currentStep);
                    }, 1000);
                }
            } else {
                computerScreen.style.backgroundColor = '#2f3640';
                computerScreen.style.backgroundImage = 'none';
                desktopIcons.forEach(icon => {
                    icon.style.opacity = '0';
                });
                alertaSimples('Computador desligado!', 'info');
                
                // Se estivermos no último passo do tutorial, finalizar
                if (currentStep === 4 && tutorialSteps.length > 0) {
                    setTimeout(() => {
                        alertaSimples('Parabéns! Você completou o tutorial básico de uso do computador.', 'success', 5000);
                    }, 1000);
                }
            }
        });
    }

    // Ajuda do computador
    if (helpBtn) {
        helpBtn.addEventListener('click', function() {
            if (computerOn) {
                alertaSimples('Para interagir com o computador:<br>1. Clique nos ícones para abrir programas<br>2. Use o botão "Ligar/Desligar" para ligar ou desligar o computador', 'info', 10000);
            } else {
                alertaSimples('O computador está desligado. Ligue-o primeiro clicando no botão "Ligar/Desligar".', 'warning');
            }
        });
    }

    // Interação com os ícones do desktop
    desktopIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            if (!computerOn) {
                alertaSimples('O computador está desligado. Ligue-o primeiro!', 'warning');
                return;
            }

            const app = this.getAttribute('data-app');
            
            switch (app) {
                case 'explorer':
                    alertaSimples('Gerenciador de Arquivos aberto! Aqui você pode acessar seus documentos, fotos e outros arquivos.', 'success');
                    
                    // Se estivermos no segundo passo do tutorial, passar para o próximo
                    if (currentStep === 2 && tutorialSteps.length > 0) {
                        setTimeout(() => {
                            currentStep = 3;
                            showStep(currentStep);
                        }, 1000);
                    }
                    break;
                case 'browser':
                    alertaSimples('Navegador de Internet aberto! Use este programa para acessar sites e pesquisar na web.', 'success');
                    break;
                case 'notepad':
                    alertaSimples('Bloco de Notas aberto! Use este programa para escrever e salvar textos.', 'success');
                    break;
                default:
                    alertaSimples('Aplicativo desconhecido', 'warning');
            }
        });
    });

    // Simulação de navegador web
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-container input');
    const goBtn = document.querySelector('.go-btn');
    const addressInput = document.querySelector('.address-bar input');
    const browserBackBtn = document.querySelector('.browser-btn.back');
    const browserForwardBtn = document.querySelector('.browser-btn.forward');
    const browserRefreshBtn = document.querySelector('.browser-btn.refresh');
    const browserContent = document.querySelector('.browser-content');

    // Pesquisa no navegador
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function() {
            if (searchInput.value.trim() !== '') {
                alertaSimples(`Pesquisando por: "${searchInput.value}"`, 'info');
                // Simulação de resultados de pesquisa
                browserContent.innerHTML = `
                    <h3>Resultados da pesquisa para: ${searchInput.value}</h3>
                    <div style="text-align: left; width: 100%; max-width: 600px; margin-top: 20px;">
                        <div style="padding: 10px; margin-bottom: 15px; border-bottom: 1px solid #dcdde1;">
                            <h4 style="color: #2e86de;">Introducão à Informática - UniAteneu</h4>
                            <p style="color: green; font-size: 0.8rem;">www.uniateneu.edu.br/cursos/informatica</p>
                            <p>Aprenda informática básica com nossos cursos para todas as idades...</p>
                        </div>
                        <div style="padding: 10px; margin-bottom: 15px; border-bottom: 1px solid #dcdde1;">
                            <h4 style="color: #2e86de;">O que é ${searchInput.value}? - Wikipedia</h4>
                            <p style="color: green; font-size: 0.8rem;">www.wikipedia.org/wiki/${searchInput.value}</p>
                            <p>Definição, história e conceitos básicos sobre ${searchInput.value}...</p>
                        </div>
                        <div style="padding: 10px; margin-bottom: 15px; border-bottom: 1px solid #dcdde1;">
                            <h4 style="color: #2e86de;">Aprenda ${searchInput.value} - Curso Online</h4>
                            <p style="color: green; font-size: 0.8rem;">www.cursoonline.com/${searchInput.value}</p>
                            <p>Cursos completos para iniciantes e avançados sobre ${searchInput.value}...</p>
                        </div>
                    </div>
                `;
            } else {
                alertaSimples('Digite algo para pesquisar!', 'warning');
            }
        });

        searchInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                searchBtn.click();
            }
        });
    }

    // Navegação no navegador (botões voltar, avançar, atualizar)
    if (browserBackBtn) {
        browserBackBtn.addEventListener('click', function() {
            alertaSimples('Voltando para a página anterior...', 'info');
        });
    }

    if (browserForwardBtn) {
        browserForwardBtn.addEventListener('click', function() {
            alertaSimples('Avançando para a próxima página...', 'info');
        });
    }

    if (browserRefreshBtn) {
        browserRefreshBtn.addEventListener('click', function() {
            alertaSimples('Atualizando a página...', 'info');
            setTimeout(() => {
                // Recarrega o conteúdo original
                browserContent.innerHTML = `
                    <img src="https://www.uniateneu.edu.br/wp-content/uploads/2022/09/cropped-logo.png" alt="UniAteneu" class="browser-logo">
                    <h3>Bem-vindo à Internet!</h3>
                    <p>A internet é uma rede global de computadores conectados.</p>
                    <div class="search-container">
                        <input type="text" placeholder="Pesquise algo...">
                        <button class="search-btn"><i class="fas fa-search"></i></button>
                    </div>
                `;
                // Atualiza os listeners
                const newSearchBtn = document.querySelector('.search-btn');
                const newSearchInput = document.querySelector('.search-container input');
                if (newSearchBtn && newSearchInput) {
                    newSearchBtn.addEventListener('click', function() {
                        if (newSearchInput.value.trim() !== '') {
                            alertaSimples(`Pesquisando por: "${newSearchInput.value}"`, 'info');
                        } else {
                            alertaSimples('Digite algo para pesquisar!', 'warning');
                        }
                    });
                }
            }, 500);
        });
    }

    // Barra de endereço
    if (goBtn && addressInput) {
        goBtn.addEventListener('click', function() {
            if (addressInput.value.trim() !== '') {
                alertaSimples(`Navegando para: ${addressInput.value}`, 'info');
            } else {
                alertaSimples('Digite um endereço válido!', 'warning');
            }
        });

        addressInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                goBtn.click();
            }
        });
    }

    // Simulador de código
    const codeArea = document.getElementById('codeArea');
    const outputArea = document.getElementById('outputArea');
    const runCodeBtn = document.getElementById('runCodeBtn');
    const clearCodeBtn = document.getElementById('clearCodeBtn');
    const exampleBtns = document.querySelectorAll('.example-btn');

    // Console.log personalizado
    const customConsoleLog = function() {
        const args = Array.from(arguments);
        const output = args.map(arg => {
            if (typeof arg === 'object') {
                return JSON.stringify(arg, null, 2);
            }
            return arg;
        }).join(' ');
        
        if (outputArea) {
            outputArea.innerHTML += output + '<br>';
        }
    };

    // Função para executar código JavaScript
    function runJavaScript(code) {
        if (!code.trim()) {
            alertaSimples('Digite algum código para executar!', 'warning');
            return;
        }

        if (outputArea) {
            outputArea.innerHTML = ''; // Limpa a área de saída
        }

        try {
            // Substitui console.log pelo customConsoleLog
            const modifiedCode = code.replace(/console\.log\(/g, 'customConsoleLog(');
            
            // Executa o código
            eval(modifiedCode);
        } catch (error) {
            if (outputArea) {
                outputArea.innerHTML += `<span style="color: red;">Erro: ${error.message}</span>`;
            }
        }
    }

    // Botão executar código
    if (runCodeBtn && codeArea) {
        runCodeBtn.addEventListener('click', function() {
            runJavaScript(codeArea.value);
        });
    }

    // Botão limpar código
    if (clearCodeBtn && codeArea && outputArea) {
        clearCodeBtn.addEventListener('click', function() {
            codeArea.value = '// Digite seu código aqui';
            outputArea.innerHTML = '';
        });
    }

    // Exemplos de código
    exampleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const code = this.getAttribute('data-code');
            if (codeArea) {
                codeArea.value = code;
            }
        });
    });

    // Exercícios
    // 1. Exercício de digitação - Desafio Gamificado
    const typingStartBtn = document.querySelector('.typing-start-btn');
    const typingInputs = document.querySelectorAll('.typing-input');
    const typingTexts = document.querySelectorAll('.typing-text');
    const checkBtns = document.querySelectorAll('.check-btn');
    const exerciseFeedbacks = document.querySelectorAll('.exercise-feedback');
    const timerDisplay = document.getElementById('typing-timer-display');
    const xpProgressBar = document.querySelector('.xp-progress-bar');
    
    // Variáveis para controle do desafio
    let typingTimer;
    let startTime;
    let typingInProgress = false;
    let typingTimeout;
    let currentUserTime = 0;
    
    // Função para formatar o tempo (ms para MM:SS.mmm)
    function formatTime(timeInMs) {
        const minutes = Math.floor(timeInMs / 60000);
        const seconds = Math.floor((timeInMs % 60000) / 1000);
        const ms = timeInMs % 1000;
        
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
    }
    
    // Iniciar o desafio de digitação
    if (typingStartBtn) {
        typingStartBtn.addEventListener('click', function() {
            // Ocultar informações iniciais e mostrar o texto e campo de digitação
            const startInfo = document.querySelector('.typing-start-info');
            const typingText = document.querySelector('.typing-text');
            const typingInput = document.querySelector('.typing-input');
            const checkBtn = document.querySelector('.check-btn');
            
            if (startInfo && typingText && typingInput) {
                // Esconder informações iniciais
                startInfo.classList.add('hidden');
                
                // Mostrar texto para digitar e campo de digitação
                typingText.classList.remove('hidden');
                typingInput.classList.remove('hidden');
                typingInput.disabled = false;
                checkBtn.disabled = false;
                
                // Limpar o campo de digitação
                typingInput.value = '';
                
                // Iniciar o cronômetro
                startTime = Date.now();
                typingInProgress = true;
                
                // Atualizar o timer a cada 10ms
                typingTimer = setInterval(function() {
                    if (typingInProgress) {
                        const elapsedTime = Date.now() - startTime;
                        currentUserTime = elapsedTime;
                        timerDisplay.textContent = formatTime(elapsedTime);
                        
                        // Atualizar a barra de progresso
                        updateProgressBar(typingInput, typingText);
                    }
                }, 10);
                
                // Focar no campo de digitação
                typingInput.focus();
                
                console.log('Desafio de digitação iniciado');
                showNotification('Desafio iniciado!', 'Comece a digitar o texto agora. O tempo está correndo!', 'info');
            }
        });
    }
    
    // Atualizar a barra de progresso com base no texto digitado
    function updateProgressBar(input, textElement) {
        if (!input || !textElement) return;
        
        const expectedText = textElement.textContent.trim();
        const typedText = input.value;
        
        // Calcular a porcentagem de progresso
        let progress = 0;
        if (expectedText.length > 0) {
            progress = (typedText.length / expectedText.length) * 100;
        }
        
        // Limitar a 100%
        progress = Math.min(progress, 100);
        
        // Atualizar a barra de progresso
        if (xpProgressBar) {
            xpProgressBar.style.width = `${progress}%`;
        }
    }

    // Impedir cópia e cola no exercício de digitação
    typingTexts.forEach(text => {
        // Impedir cópia do texto original
        text.addEventListener('copy', e => {
            e.preventDefault();
            showNotification('Atenção', 'Não é permitido copiar o texto. Digite-o manualmente para praticar.', 'warning');
        });
        
        // Impedir o menu de contexto (clique com botão direito)
        text.addEventListener('contextmenu', e => {
            e.preventDefault();
            return false;
        });
        
        // Impedir seleção do texto (dificulta ainda mais a cópia)
        // Aplica todos os prefixos de navegador para máximo suporte
        text.style.userSelect = 'none';
        text.style.webkitUserSelect = 'none';
        text.style.mozUserSelect = 'none';
        text.style.msUserSelect = 'none';
        text.style.oUserSelect = 'none';
        
        // Fallback para navegadores antigos usando atributo unselectable
        text.setAttribute('unselectable', 'on');
        
        // Fallback adicional para Internet Explorer
        text.setAttribute('onselectstart', 'return false;');
        
        // Aplicar CSS inline como último recurso
        text.style.cssText += '-webkit-touch-callout: none;';
    });
    
    typingInputs.forEach(input => {
        // Impedir a ação de colar no campo de entrada
        input.addEventListener('paste', e => {
            e.preventDefault();
            showNotification('Atenção', 'Não é permitido colar texto. Pratique digitando!', 'warning');
        });
        
        // Impedir o menu de contexto (clique com botão direito)
        input.addEventListener('contextmenu', e => {
            e.preventDefault();
            return false;
        });
        
        // Inicializar detector de atividade de digitação
        // Cada campo de digitação mantém seu próprio estado de verificação
        const inputId = 'typing-input-' + Math.random().toString(36).substr(2, 9);
        input.setAttribute('data-typing-id', inputId);
        
        // Inicializar estado de digitação para este campo específico
        if (!window.typingActivity) {
            window.typingActivity = {};
        }
        
        window.typingActivity[inputId] = {
            detected: false,
            keyPressCount: 0,
            lastKeyTimes: [], // Armazenar os últimos 10 tempos entre teclas para média móvel
            suspectCount: 0
        };
        
        // Monitora pressionamentos de tecla para confirmar que o usuário está digitando naturalmente
        input.addEventListener('keypress', function(e) {
            const activityState = window.typingActivity[inputId];
            activityState.keyPressCount++;
            
            // Se o usuário pressionar mais de 5 teclas, consideramos que houve atividade de digitação
            if (activityState.keyPressCount > 5) {
                activityState.detected = true;
            }
        });
        
        // Mostrar dica na primeira vez que o usuário tentar colar
        let pasteAttempted = false;
        input.addEventListener('keydown', e => {
            // Detectar Ctrl+V ou Command+V (Mac)
            if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
                e.preventDefault();
                if (!pasteAttempted) {
                    pasteAttempted = true;
                    showNotification('Dica', 'Este exercício exige que você digite o texto manualmente para praticar suas habilidades.', 'info', 5000);
                } else {
                    showNotification('Atenção', 'Por favor, digite o texto manualmente.', 'warning');
                }
            }
        });
        
        // Atualizar progresso enquanto o usuário digita
        input.addEventListener('input', function(e) {
            const closestTypingText = this.closest('.typing-challenge-container').querySelector('.typing-text');
            updateProgressBar(this, closestTypingText);
        });
        
        // Detecção de velocidade de digitação suspeita usando média móvel
        // Para melhor detecção de padrões não-humanos de digitação
        let lastKeyTime = 0;
        
        input.addEventListener('input', function(e) {
            const now = Date.now();
            const activityState = window.typingActivity[inputId];
            
            // Verifica se esta é a primeira tecla pressionada
            if (lastKeyTime === 0) {
                lastKeyTime = now;
                return;
            }
            
            // Calcula o tempo entre teclas
            const timeDiff = now - lastKeyTime;
            
            // Armazena os tempos para cálculo da média móvel (últimos 10 pressionamentos)
            activityState.lastKeyTimes.push(timeDiff);
            if (activityState.lastKeyTimes.length > 10) {
                activityState.lastKeyTimes.shift(); // Mantém apenas os 10 últimos
            }
            
            // Calcula a média dos tempos entre teclas (média móvel)
            const avgTimeDiff = activityState.lastKeyTimes.reduce((sum, time) => sum + time, 0) / 
                               activityState.lastKeyTimes.length;
            
            // Se o tempo médio entre teclas for muito curto (menos de 50ms), pode ser suspeito
            // Usuários reais raramente digitam consistentemente mais rápido que isso
            if (timeDiff < 50 && avgTimeDiff < 70) {
                activityState.suspectCount++;
                
                // Se detectar um padrão suspeito (mais de 8 digitações rápidas consecutivas)
                // Isso reduz falsos positivos para digitadores normalmente rápidos
                if (activityState.suspectCount > 8) {
                    const closestTypingText = this.closest('.exercise-card').querySelector('.typing-text');
                    if (closestTypingText) {
                        // Mudar ligeiramente o texto original para evitar que scripts automatizados funcionem
                        const originalText = closestTypingText.textContent;
                        const modifiedText = originalText.replace(/\s+/g, ' ').trim(); // Normaliza os espaços
                        closestTypingText.textContent = modifiedText;
                        
                        showNotification('Aviso', 'Por favor, digite em um ritmo natural. Digitação muito rápida foi detectada.', 'warning');
                        activityState.suspectCount = 0; // Reset contador
                    }
                }
            } else {
                // Reduz o contador gradualmente se a digitação for num ritmo normal
                // Isso permite que haja algumas teclas rápidas ocasionais sem trigger falsos positivos
                activityState.suspectCount = Math.max(0, activityState.suspectCount - 1);
            }
            
            lastKeyTime = now;
        });
    });
    
    // Exibir modal de registro de pontuação
    function showScoreModal(timeInMs) {
        // Parar o cronômetro
        clearInterval(typingTimer);
        typingInProgress = false;
        
        // Mostrar o tempo final
        const finalTimeElement = document.querySelector('.final-time');
        if (finalTimeElement) {
            finalTimeElement.textContent = formatTime(timeInMs);
        }
        
        // Exibir o modal
        const scoreModal = document.querySelector('.typing-score-modal');
        if (scoreModal) {
            scoreModal.classList.remove('hidden');
        }
    }
    
    // Gerar ID único para o usuário
    function generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
    
    // Salvar pontuação no ranking
    function saveScoreToRanking() {
        const nameInput = document.getElementById('score-name');
        const birthdayInput = document.getElementById('score-birthday');
        const emailInput = document.getElementById('score-email');
        
        if (!nameInput || !birthdayInput || !emailInput) {
            showNotification('Erro', 'Ocorreu um erro ao salvar a pontuação. Tente novamente.', 'error');
            return false;
        }
        
        const name = nameInput.value.trim();
        const birthday = birthdayInput.value;
        const email = emailInput.value.trim();
        
        // Validação básica
        if (!name || !birthday || !email) {
            showNotification('Atenção', 'Por favor, preencha todos os campos.', 'warning');
            return false;
        }
        
        // Validação de e-mail simples
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Atenção', 'Por favor, informe um email válido.', 'warning');
            return false;
        }
        
        // Verificar se o email já existe no ranking
        const existingRecords = JSON.parse(localStorage.getItem('typing_ranking') || '[]');
        const emailExists = existingRecords.some(record => record.email.toLowerCase() === email.toLowerCase());
        
        if (emailExists) {
            showNotification('Atenção', 'Este email já está registrado no ranking. Cada usuário pode ter apenas um registro.', 'warning');
            return false;
        }
        
        // Criar registro
        const newRecord = {
            id: generateUniqueId(),
            name: name,
            email: email,
            birthday: birthday,
            time: currentUserTime,
            timeFormatted: formatTime(currentUserTime),
            date: new Date().toISOString()
        };
        
        // Adicionar ao ranking
        existingRecords.push(newRecord);
        
        // Ordenar por tempo (menor para maior)
        existingRecords.sort((a, b) => a.time - b.time);
        
        // Salvar no localStorage
        localStorage.setItem('typing_ranking', JSON.stringify(existingRecords));
        
        showNotification('Sucesso', 'Seu tempo foi registrado no ranking!', 'success');
        return true;
    }
    
    // Configurar eventos para o modal de registro de pontuação
    const saveScoreBtn = document.getElementById('save-score-btn');
    const cancelScoreBtn = document.getElementById('cancel-score-btn');
    
    if (saveScoreBtn) {
        saveScoreBtn.addEventListener('click', function() {
            if (saveScoreToRanking()) {
                // Fechar modal
                const scoreModal = document.querySelector('.typing-score-modal');
                if (scoreModal) {
                    scoreModal.classList.add('hidden');
                }
                
                // Resetar o desafio
                resetTypingChallenge();
            }
        });
    }
    
    if (cancelScoreBtn) {
        cancelScoreBtn.addEventListener('click', function() {
            // Fechar modal sem salvar
            const scoreModal = document.querySelector('.typing-score-modal');
            if (scoreModal) {
                scoreModal.classList.add('hidden');
            }
            
            // Resetar o desafio
            resetTypingChallenge();
        });
    }
    
    // Função para resetar o desafio
    function resetTypingChallenge() {
        // Parar o cronômetro
        clearInterval(typingTimer);
        typingInProgress = false;
        
        // Resetar display do timer
        if (timerDisplay) {
            timerDisplay.textContent = '00:00.000';
        }
        
        // Resetar barra de progresso
        if (xpProgressBar) {
            xpProgressBar.style.width = '0%';
        }
        
        // Ocultar texto e campo de digitação
        const typingText = document.querySelector('.typing-text');
        const typingInput = document.querySelector('.typing-input');
        const checkBtn = document.querySelector('.check-btn');
        
        if (typingText && typingInput) {
            typingText.classList.add('hidden');
            typingInput.classList.add('hidden');
            typingInput.value = '';
            typingInput.disabled = true;
            checkBtn.disabled = true;
        }
        
        // Mostrar informações iniciais
        const startInfo = document.querySelector('.typing-start-info');
        if (startInfo) {
            startInfo.classList.remove('hidden');
        }
        
        // Limpar feedback
        const feedback = document.querySelector('.exercise-feedback');
        if (feedback) {
            feedback.textContent = '';
            feedback.className = 'exercise-feedback';
        }
    }
    
    // Verificar texto digitado
    checkBtns.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            const container = this.closest('.typing-challenge-container') || this.closest('.exercise-card');
            if (!container) return;
            
            const closestTypingText = container.querySelector('.typing-text');
            const closestTypingInput = container.querySelector('.typing-input');
            const closestFeedback = container.querySelector('.exercise-feedback');
            
            if (closestTypingText && closestTypingInput && closestFeedback) {
                const expectedText = closestTypingText.textContent.trim();
                const typedText = closestTypingInput.value.trim();
                
                // Parar o timer quando verificar
                clearInterval(typingTimer);
                typingInProgress = false;
                
                // Verificação de trapaça: Checa se o texto foi digitado naturalmente
                const inputId = closestTypingInput.getAttribute('data-typing-id');
                const activityState = window.typingActivity && window.typingActivity[inputId];
                
                if (activityState && !activityState.detected && typedText.length > 10) {
                    closestFeedback.textContent = 'Parece que este texto não foi digitado naturalmente. Por favor, pratique digitando manualmente.';
                    closestFeedback.className = 'exercise-feedback feedback-error';
                    return;
                }
                
                if (typedText === '') {
                    closestFeedback.textContent = 'Por favor, digite o texto!';
                    closestFeedback.className = 'exercise-feedback feedback-error';
                    
                    // Reiniciar o timer
                    startTime = Date.now() - currentUserTime;
                    typingInProgress = true;
                    typingTimer = setInterval(function() {
                        if (typingInProgress) {
                            const elapsedTime = Date.now() - startTime;
                            currentUserTime = elapsedTime;
                            timerDisplay.textContent = formatTime(elapsedTime);
                        }
                    }, 10);
                    
                } else if (typedText === expectedText) {
                    closestFeedback.textContent = 'Parabéns! Você digitou corretamente.';
                    closestFeedback.className = 'exercise-feedback feedback-success';
                    
                    // Mostrar o tempo final
                    const finalTime = currentUserTime;
                    closestFeedback.textContent += ` Seu tempo: ${formatTime(finalTime)}`;
                    
                    // Feedback adicional com emoji
                    showNotification('Muito bem! 👏', `Você completou o desafio em ${formatTime(finalTime)}`, 'success');
                    
                    // Mostrar modal para registrar pontuação
                    setTimeout(() => {
                        showScoreModal(finalTime);
                    }, 1500);
                    
                } else {
                    closestFeedback.textContent = 'O texto digitado não corresponde ao esperado. Tente novamente!';
                    closestFeedback.className = 'exercise-feedback feedback-error';
                    
                    // Dicas construtivas para erros comuns
                    const similarityPercent = calculateTextSimilarity(typedText, expectedText);
                    if (similarityPercent > 80) {
                        closestFeedback.textContent += ' Você está quase lá! Verifique a pontuação e ortografia.';
                    }
                    
                    // Reiniciar o timer (continuar contando)
                    startTime = Date.now() - currentUserTime;
                    typingInProgress = true;
                    typingTimer = setInterval(function() {
                        if (typingInProgress) {
                            const elapsedTime = Date.now() - startTime;
                            currentUserTime = elapsedTime;
                            timerDisplay.textContent = formatTime(elapsedTime);
                        }
                    }, 10);
                }
            }
        });
    });

    // Exercício 2: Quiz de Conhecimentos (Versão expandida)
    const quizExercise = document.querySelector('.exercise-card:nth-child(2) .quiz-container');
    if (quizExercise) {
        // Função para verificar e corrigir a estrutura do quiz
        function verificarEstruturarQuiz() {
            console.log("[Diagnóstico] Verificando estrutura do quiz...");
            
            // Verificar se as perguntas existem
            const quizQuestionsContainer = quizExercise.querySelector('.quiz-questions');
            if (!quizQuestionsContainer) {
                console.error("[Diagnóstico] Container de perguntas não encontrado!");
                return;
            }
            
            const questoes = quizQuestionsContainer.querySelectorAll('.quiz-question');
            console.log(`[Diagnóstico] Encontradas ${questoes.length} perguntas no quiz`);
            
            if (questoes.length === 0) {
                console.error("[Diagnóstico] Nenhuma pergunta encontrada no quiz!");
                
                // Adicionar perguntas originais se não existirem
                const perguntasOriginais = [
                    {
                        numero: 1,
                        texto: "Qual destes é um dispositivo de entrada?",
                        opcoes: [
                            { valor: "a", texto: "Monitor" },
                            { valor: "b", texto: "Impressora" },
                            { valor: "c", texto: "Teclado" },
                            { valor: "d", texto: "Caixas de Som" }
                        ],
                        respostaCorreta: "c"
                    },
                    {
                        numero: 2,
                        texto: "Qual dos seguintes é um sistema operacional?",
                        opcoes: [
                            { valor: "a", texto: "Microsoft Word" },
                            { valor: "b", texto: "Windows" },
                            { valor: "c", texto: "Adobe Photoshop" },
                            { valor: "d", texto: "Google Chrome" }
                        ],
                        respostaCorreta: "b"
                    },
                    {
                        numero: 3,
                        texto: "Para que serve o botão \"X\" no canto superior direito de uma janela?",
                        opcoes: [
                            { valor: "a", texto: "Minimizar a janela" },
                            { valor: "b", texto: "Maximizar a janela" },
                            { valor: "c", texto: "Fechar a janela" },
                            { valor: "d", texto: "Mover a janela" }
                        ],
                        respostaCorreta: "c"
                    },
                    {
                        numero: 4,
                        texto: "O que é Wi-Fi?",
                        opcoes: [
                            { valor: "a", texto: "Um tipo de arquivo de texto" },
                            { valor: "b", texto: "Uma marca de computador" },
                            { valor: "c", texto: "Um programa antivírus" },
                            { valor: "d", texto: "Tecnologia de conexão sem fio" }
                        ],
                        respostaCorreta: "d"
                    }
                ];
                
                // Adicionar as perguntas originais ao DOM
                perguntasOriginais.forEach(pergunta => {
                    const questionElement = document.createElement('div');
                    questionElement.className = 'quiz-question';
                    questionElement.setAttribute('data-question', pergunta.numero.toString());
                    
                    // Adicionar texto da pergunta
                    const questionText = document.createElement('p');
                    questionText.textContent = pergunta.texto;
                    questionElement.appendChild(questionText);
                    
                    // Adicionar opções
                    const optionsContainer = document.createElement('div');
                    optionsContainer.className = 'quiz-options';
                    
                    pergunta.opcoes.forEach(opcao => {
                        const optionDiv = document.createElement('div');
                        optionDiv.className = 'quiz-option';
                        
                        const input = document.createElement('input');
                        input.type = 'radio';
                        input.name = `quiz${pergunta.numero}`;
                        input.id = `q${pergunta.numero}${opcao.valor}`;
                        input.value = opcao.valor;
                        
                        const label = document.createElement('label');
                        label.setAttribute('for', input.id);
                        label.textContent = opcao.texto;
                        
                        optionDiv.appendChild(input);
                        optionDiv.appendChild(label);
                        optionsContainer.appendChild(optionDiv);
                    });
                    
                    questionElement.appendChild(optionsContainer);
                    quizQuestionsContainer.appendChild(questionElement);
                });
                
                console.log("[Diagnóstico] Perguntas originais adicionadas ao quiz");
            } else {
                // Verificar se os atributos data-question estão corretos
                questoes.forEach((questao, index) => {
                    const numeroQuestao = index + 1;
                    const dataQuestion = questao.getAttribute('data-question');
                    
                    if (dataQuestion !== numeroQuestao.toString()) {
                        console.log(`[Diagnóstico] Corrigindo atributo data-question da pergunta ${index + 1}: ${dataQuestion} -> ${numeroQuestao}`);
                        questao.setAttribute('data-question', numeroQuestao.toString());
                    }
                    
                    // Verificar se a pergunta tem opções
                    const opcoes = questao.querySelectorAll('.quiz-option');
                    if (opcoes.length === 0) {
                        console.error(`[Diagnóstico] Pergunta ${numeroQuestao} não tem opções!`);
                    }
                });
            }
            
            // Atualizar o contador total de perguntas
            const totalQuestionsSpan = quizExercise.querySelector('.total-questions');
            if (totalQuestionsSpan) {
                const novoTotal = quizQuestionsContainer.querySelectorAll('.quiz-question').length;
                totalQuestionsSpan.textContent = novoTotal.toString();
                console.log(`[Diagnóstico] Total de perguntas atualizado para ${novoTotal}`);
            }
        }
        
        // Verificar e corrigir a estrutura do quiz antes de inicializar
        verificarEstruturarQuiz();
        
        const quizQuestions = quizExercise.querySelectorAll('.quiz-question');
        const quizFeedback = quizExercise.querySelector('.quiz-feedback');
        const checkBtn = quizExercise.querySelector('.check-btn');
        const prevBtn = quizExercise.querySelector('.quiz-prev-btn');
        const nextBtn = quizExercise.querySelector('.quiz-next-btn');
        const progressBar = quizExercise.querySelector('.progress-bar');
        const currentQuestionSpan = quizExercise.querySelector('.current-question');
        const quizResults = quizExercise.querySelector('.quiz-results');
        const quizScore = quizExercise.querySelector('.quiz-score');
        const resultDetails = quizExercise.querySelector('.result-details');
        const restartBtn = quizExercise.querySelector('.restart-quiz-btn');
        
        // Garantir que os event listeners estejam configurados para as opções do quiz
        function inicializarOpcoesQuiz() {
            console.log("[Diagnóstico] Inicializando event listeners para opções do quiz");
            // Selecionar todas as opções do quiz em todas as perguntas
            const todasOpcoes = quizExercise.querySelectorAll('.quiz-option input[type="radio"]');
            console.log(`[Diagnóstico] Total de opções encontradas: ${todasOpcoes.length}`);
            
            todasOpcoes.forEach(opcao => {
                // Remover event listeners existentes
                const novaOpcao = opcao.cloneNode(true);
                opcao.parentNode.replaceChild(novaOpcao, opcao);
                
                // Adicionar novo event listener
                novaOpcao.addEventListener('change', function() {
                    // Obter o container da pergunta atual
                    const perguntaContainer = this.closest('.quiz-question');
                    
                    // Remover classe 'selected' de todas as opções desta pergunta
                    const opcoesGrupo = perguntaContainer.querySelectorAll('.quiz-option');
                    opcoesGrupo.forEach(opt => {
                        opt.classList.remove('selected');
                    });
                    
                    // Adicionar classe 'selected' à opção escolhida
                    if (this.checked) {
                        this.parentElement.classList.add('selected');
                    }
                    
                    // Habilitar o botão de verificar
                    checkBtn.disabled = false;
                });
            });
        }
        
        // Inicializar event listeners para opções do quiz
        inicializarOpcoesQuiz();
        
        let currentQuestion = 1;
        const totalQuestions = quizQuestions.length;
        const userAnswers = {};
        
        // Definir as respostas corretas para cada pergunta
        const correctAnswers = {
            "1": "c", // Teclado
            "2": "b", // Windows
            "3": "c", // Fechar a janela
            "4": "d"  // Tecnologia de conexão sem fio
        };
        
        // Texto explicativo para cada resposta
        const explanations = {
            "1": "O teclado é um dispositivo de entrada que permite inserir dados no computador.",
            "2": "Windows é um sistema operacional desenvolvido pela Microsoft.",
            "3": "O botão X no canto superior direito de uma janela serve para fechá-la.",
            "4": "Wi-Fi é uma tecnologia que permite a conexão sem fio de dispositivos à internet."
        };
        
        // Criar cópias globais para acesso de outras funções
        window.quizCorrectAnswers = Object.assign({}, correctAnswers);
        window.quizExplanations = Object.assign({}, explanations);
        
        // Verificar se temos respostas e explicações salvas nas variáveis globais
        if (window.quizCorrectAnswers && Object.keys(window.quizCorrectAnswers).length > 0) {
            // Sincronizar as respostas globais com as locais
            Object.keys(window.quizCorrectAnswers).forEach(key => {
                correctAnswers[key] = window.quizCorrectAnswers[key];
            });
            console.log("[Diagnóstico] Respostas corretas sincronizadas da variável global");
        }
        
        if (window.quizExplanations && Object.keys(window.quizExplanations).length > 0) {
            // Sincronizar as explicações globais com as locais
            Object.keys(window.quizExplanations).forEach(key => {
                explanations[key] = window.quizExplanations[key];
            });
            console.log("[Diagnóstico] Explicações sincronizadas da variável global");
        }
        
        // Função para mostrar uma pergunta específica
        function showQuestion(questionNumber) {
            console.log(`[Diagnóstico] Tentando mostrar pergunta ${questionNumber}`);
            
            // Verificar se o container de questões existe
            const quizQuestionsContainer = quizExercise.querySelector('.quiz-questions');
            if (!quizQuestionsContainer) {
                console.error("[Diagnóstico] Container de perguntas não encontrado!");
                return;
            }
            
            // Obter todas as perguntas novamente para garantir que temos a lista mais atualizada
            const allQuestions = quizQuestionsContainer.querySelectorAll('.quiz-question');
            console.log(`[Diagnóstico] Total de perguntas encontradas: ${allQuestions.length}`);
            
            if (allQuestions.length === 0) {
                console.error("[Diagnóstico] Nenhuma pergunta encontrada no quiz!");
                // Verificar a estrutura e adicionar perguntas se necessário
                verificarEstruturarQuiz();
                return;
            }
            
            // Ocultar todas as perguntas
            allQuestions.forEach(question => {
                question.classList.remove('active');
                question.style.display = 'none';
            });
            
            // Converter o número da pergunta para string para comparação segura
            const questionNumberStr = String(questionNumber);
            
            // Mostrar a pergunta atual
            const questionToShow = quizQuestionsContainer.querySelector(`.quiz-question[data-question="${questionNumberStr}"]`);
            if (questionToShow) {
                console.log(`[Diagnóstico] Pergunta ${questionNumber} encontrada`);
                questionToShow.classList.add('active');
                questionToShow.style.display = 'block';
                currentQuestion = questionNumber;
                
                // Atualizar contador de perguntas
                if (currentQuestionSpan) {
                    currentQuestionSpan.textContent = currentQuestion;
                }
                
                // Atualizar barra de progresso
                if (progressBar) {
                    const totalQuestionsVisible = allQuestions.length;
                    const progressPercent = ((currentQuestion - 1) / (totalQuestionsVisible - 1)) * 100;
                    progressBar.style.setProperty('--progress', `${progressPercent}%`);
                }
                
                // Atualizar estado dos botões de navegação
                if (prevBtn) {
                    prevBtn.disabled = currentQuestion <= 1;
                }
                
                if (nextBtn) {
                    const totalQuestionsVisible = allQuestions.length;
                    nextBtn.disabled = currentQuestion >= totalQuestionsVisible;
                }
                
                // Restaurar estado do botão de verificar
                if (checkBtn) {
                    checkBtn.textContent = "Verificar";
                    checkBtn.classList.remove('verified');
                    
                    // Verificar se há uma opção selecionada
                    const selectedOption = questionToShow.querySelector('input[type="radio"]:checked');
                    checkBtn.disabled = !selectedOption;
                }
                
                // Limpar feedback - Sempre limpar o feedback ao mudar de questão
                if (quizFeedback) {
                    quizFeedback.innerHTML = '';
                    quizFeedback.style.display = 'none'; // Garantir que o feedback esteja oculto
                }
                
                // Verificar se a pergunta já foi respondida
                if (userAnswers[currentQuestion]) {
                    // Desabilitar as opções se já respondida
                    const options = questionToShow.querySelectorAll('input[type="radio"]');
                    options.forEach(option => {
                        option.disabled = true;
                        if (option.value === userAnswers[currentQuestion]) {
                            option.checked = true;
                            option.parentElement.classList.add('selected');
                            
                            // Destacar como correta/incorreta
                            if (option.value === correctAnswers[currentQuestion]) {
                                option.parentElement.classList.add('correct');
                                if (quizFeedback) {
                                    quizFeedback.innerHTML = `<p class="feedback-success">Resposta correta! ${explanations[currentQuestion]}</p>`;
                                    quizFeedback.style.display = 'block';
                                }
                            } else {
                                option.parentElement.classList.add('incorrect');
                                const correctOption = questionToShow.querySelector(`input[value="${correctAnswers[currentQuestion]}"]`);
                                if (correctOption) {
                                    correctOption.parentElement.classList.add('correct');
                                }
                                if (quizFeedback) {
                                    quizFeedback.innerHTML = `<p class="feedback-error">Resposta incorreta. ${explanations[currentQuestion]}</p>`;
                                    quizFeedback.style.display = 'block';
                                }
                            }
                        }
                    });
                    
                    // Mudar o botão para "Próxima" se não for a última pergunta
                    if (checkBtn) {
                        const totalQuestionsVisible = allQuestions.length;
                        if (currentQuestion < totalQuestionsVisible) {
                            checkBtn.textContent = "Próxima";
                            checkBtn.classList.add('verified');
                        } else {
                            checkBtn.textContent = "Ver Resultados";
                            checkBtn.classList.add('verified');
                        }
                    }
                }
            } else {
                console.error(`[Diagnóstico] Pergunta ${questionNumber} não encontrada!`);
                
                // Listar todas as perguntas disponíveis para depuração
                console.log(`[Diagnóstico] Total de perguntas disponíveis: ${allQuestions.length}`);
                allQuestions.forEach((q, i) => {
                    console.log(`[Diagnóstico] Pergunta ${i+1} - data-question="${q.getAttribute('data-question')}"`);
                });
                
                // Se não encontrou a pergunta solicitada, tentar mostrar a primeira pergunta
                if (questionNumber !== 1) {
                    console.log("[Diagnóstico] Tentando mostrar a primeira pergunta...");
                    showQuestion(1);
                }
            }
        }
        
        // Função para verificar a resposta da pergunta atual
        function checkAnswer() {
            console.log(`[Diagnóstico] Verificando resposta da pergunta ${currentQuestion}`);
            
            const currentQuestionElement = quizExercise.querySelector(`.quiz-question.active`);
            if (!currentQuestionElement) {
                console.error(`[Diagnóstico] Pergunta ativa #${currentQuestion} não encontrada!`);
                return false;
            }
            
            const options = currentQuestionElement.querySelectorAll('input[type="radio"]');
            if (options.length === 0) {
                console.error(`[Diagnóstico] Nenhuma opção encontrada para a pergunta ${currentQuestion}`);
                return false;
            }
            
            let selectedOption = null;
            
            // Verificar qual opção foi selecionada
            options.forEach(option => {
                if (option.checked) {
                    selectedOption = option.value;
                }
            });
            
            // Se nenhuma opção foi selecionada
            if (!selectedOption) {
                if (quizFeedback) {
                    quizFeedback.innerHTML = '<p class="feedback-error">Por favor, selecione uma opção!</p>';
                    quizFeedback.style.display = 'block'; // Garantir que o feedback esteja visível
                }
                return false;
            }
            
            console.log(`[Diagnóstico] Opção selecionada: ${selectedOption}`);
            
            // Verificar se temos a resposta correta para esta pergunta
            if (!correctAnswers[currentQuestion]) {
                console.error(`[Diagnóstico] Resposta correta para pergunta ${currentQuestion} não encontrada!`);
                // Verificar se temos na variável global
                if (window.quizCorrectAnswers && window.quizCorrectAnswers[currentQuestion]) {
                    correctAnswers[currentQuestion] = window.quizCorrectAnswers[currentQuestion];
                    console.log(`[Diagnóstico] Resposta correta encontrada na variável global: ${correctAnswers[currentQuestion]}`);
                } else {
                    // Assumir primeira opção como correta se não tivermos a resposta
                    correctAnswers[currentQuestion] = "a";
                    console.log(`[Diagnóstico] Definindo primeira opção como correta por padrão`);
                }
            }
            
            // Salvar a resposta do usuário
            userAnswers[currentQuestion] = selectedOption;
            
            // Verificar se a resposta está correta
            const isCorrect = selectedOption === correctAnswers[currentQuestion];
            console.log(`[Diagnóstico] Resposta ${isCorrect ? 'correta' : 'incorreta'}`);
            
            // Destacar opções e mostrar feedback
            options.forEach(option => {
                const optionElement = option.parentElement;
                option.disabled = true; // Desabilitar todas as opções
                
                if (option.value === selectedOption) {
                    optionElement.classList.add(isCorrect ? 'correct' : 'incorrect');
                } else if (option.value === correctAnswers[currentQuestion] && !isCorrect) {
                    optionElement.classList.add('correct');
                }
            });
            
            // Verificar se temos a explicação para esta pergunta
            if (!explanations[currentQuestion]) {
                // Verificar se temos na variável global
                if (window.quizExplanations && window.quizExplanations[currentQuestion]) {
                    explanations[currentQuestion] = window.quizExplanations[currentQuestion];
                } else {
                    // Criar uma explicação genérica
                    const respostaCorretaTexto = currentQuestionElement.querySelector(`input[value="${correctAnswers[currentQuestion]}"] + label`);
                    let textoResposta = correctAnswers[currentQuestion];
                    
                    if (respostaCorretaTexto) {
                        textoResposta = respostaCorretaTexto.textContent.trim();
                    }
                    
                    explanations[currentQuestion] = `A resposta correta é "${textoResposta}".`;
                }
            }
            
            // Exibir feedback com cores específicas
            if (quizFeedback) {
                if (isCorrect) {
                    quizFeedback.innerHTML = `<p class="feedback-success">Resposta correta! ${explanations[currentQuestion]}</p>`;
                } else {
                    quizFeedback.innerHTML = `<p class="feedback-error">Resposta incorreta. ${explanations[currentQuestion]}</p>`;
                }
                quizFeedback.style.display = 'block'; // Garantir que o feedback esteja visível
                
                // Rolar até o feedback para garantir que o usuário veja
                quizFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            
            // Verificar próximos passos - usar o número atual de perguntas visíveis
            const totalQuestionsVisiveis = quizExercise.querySelectorAll('.quiz-question').length;
            console.log(`[Diagnóstico] Total de perguntas visíveis: ${totalQuestionsVisiveis}, pergunta atual: ${currentQuestion}`);
            
            if (currentQuestion < totalQuestionsVisiveis) {
                checkBtn.textContent = "Próxima";
                checkBtn.classList.add('verified');
                nextBtn.disabled = false;
            } else {
                checkBtn.textContent = "Ver Resultados";
                checkBtn.classList.add('verified');
            }
            
            return true;
        }
        
        // Função para calcular e exibir resultados do quiz
        function showResults() {
            console.log('[Diagnóstico] Exibindo resultados do quiz');
            
            // Calcular pontuação
            let correctCount = 0;
            let resultsHTML = '';
            
            // Obter o número total de perguntas atual
            const totalQuestionsVisiveis = quizExercise.querySelectorAll('.quiz-question').length;
            console.log(`[Diagnóstico] Total de perguntas para resultados: ${totalQuestionsVisiveis}`);
            
            for (let i = 1; i <= totalQuestionsVisiveis; i++) {
                const userAnswer = userAnswers[i] || null;
                
                // Verificar se temos a resposta para esta pergunta
                if (!correctAnswers[i] && window.quizCorrectAnswers && window.quizCorrectAnswers[i]) {
                    correctAnswers[i] = window.quizCorrectAnswers[i];
                }
                
                const isCorrect = userAnswer === correctAnswers[i];
                
                if (isCorrect) correctCount++;
                
                // Obter o texto da pergunta
                const perguntaElement = quizExercise.querySelector(`.quiz-question[data-question="${i}"]`);
                let textoPergunta = '';
                
                if (perguntaElement) {
                    const textElement = perguntaElement.querySelector('p');
                    if (textElement) {
                        textoPergunta = textElement.textContent;
                    } else {
                        textoPergunta = `Pergunta ${i}`;
                    }
                } else {
                    textoPergunta = `Pergunta ${i}`;
                }
                
                // Verificar se temos explicação para esta pergunta
                if (!explanations[i] && window.quizExplanations && window.quizExplanations[i]) {
                    explanations[i] = window.quizExplanations[i];
                } else if (!explanations[i]) {
                    explanations[i] = `A resposta correta é a opção "${correctAnswers[i]}".`;
                }
                
                // Criar item para o resumo dos resultados
                resultsHTML += `
                    <div class="result-item ${isCorrect ? 'correct' : 'incorrect'}">
                        <div class="result-icon">
                            <i class="fas ${isCorrect ? 'fa-check' : 'fa-times'}"></i>
                        </div>
                        <div class="result-text">
                            <p><strong>Pergunta ${i}:</strong> ${textoPergunta}</p>
                            ${!isCorrect ? `<p>Sua resposta estava incorreta. ${explanations[i]}</p>` : ''}
                        </div>
                    </div>
                `;
            }
            
            // Atualizar pontuação e detalhes
            quizScore.textContent = `${correctCount}/${totalQuestionsVisiveis}`;
            resultDetails.innerHTML = resultsHTML;
            
            // Esconder as perguntas e mostrar os resultados
            quizExercise.querySelector('.quiz-questions').style.display = 'none';
            quizExercise.querySelector('.quiz-navigation').style.display = 'none';
            quizExercise.querySelector('.quiz-feedback').style.display = 'none';
            quizExercise.querySelector('.quiz-progress-indicator').style.display = 'none';
            quizResults.style.display = 'block';
        }
        
        // Função para reiniciar o quiz
        function resetQuiz() {
            // Limpar respostas do usuário
            for (let key in userAnswers) {
                delete userAnswers[key];
            }
            
            // Resetar todas as questões
            const allQuestions = quizExercise.querySelectorAll('.quiz-question');
            allQuestions.forEach(question => {
                const options = question.querySelectorAll('input[type="radio"]');
                options.forEach(option => {
                    option.checked = false;
                    option.disabled = false;
                    option.parentElement.classList.remove('selected', 'correct', 'incorrect');
                });
            });
            
            // Atualizar contador total de perguntas
            const totalQuestionsSpan = quizExercise.querySelector('.total-questions');
            if (totalQuestionsSpan) {
                totalQuestionsSpan.textContent = allQuestions.length.toString();
            }
            
            // Resetar elementos UI
            quizFeedback.innerHTML = '';
            checkBtn.textContent = "Verificar";
            checkBtn.classList.remove('verified');
            prevBtn.disabled = true;
            nextBtn.disabled = false;
            
            // Esconder resultados e mostrar perguntas
            quizResults.style.display = 'none';
            quizExercise.querySelector('.quiz-questions').style.display = 'block';
            quizExercise.querySelector('.quiz-navigation').style.display = 'flex';
            quizExercise.querySelector('.quiz-feedback').style.display = 'block';
            quizExercise.querySelector('.quiz-progress-indicator').style.display = 'block';
            
            // Voltar para a primeira pergunta
            currentQuestion = 1;
            showQuestion(currentQuestion);
        }
        
        // Adicionar efeito visual nas opções ao serem selecionadas
        quizQuestions.forEach(question => {
            const options = question.querySelectorAll('input[type="radio"]');
            options.forEach(option => {
                option.addEventListener('change', function() {
                    // Remover classe 'selected' de todas as opções deste grupo
                    const groupOptions = question.querySelectorAll('.quiz-option');
                    groupOptions.forEach(opt => {
                        opt.classList.remove('selected');
                    });
                    
                    // Adicionar classe 'selected' à opção escolhida
                    if (this.checked) {
                        this.parentElement.classList.add('selected');
                    }
                });
            });
        });
        
        // Eventos para os botões de navegação
        prevBtn.addEventListener('click', function() {
            if (currentQuestion > 1) {
                showQuestion(currentQuestion - 1);
            }
        });
        
        nextBtn.addEventListener('click', function() {
            // Calcular o número total de perguntas visíveis no momento
            const totalQuestionsVisiveis = quizExercise.querySelectorAll('.quiz-question').length;
            console.log(`[Diagnóstico] Total de perguntas visíveis (próxima): ${totalQuestionsVisiveis}`);
            
            if (currentQuestion < totalQuestionsVisiveis) {
                showQuestion(currentQuestion + 1);
            }
        });
        
        // Evento para o botão de verificar/próxima
        checkBtn.addEventListener('click', function() {
            // Calcular o número total de perguntas visíveis no momento
            const totalQuestionsVisiveis = quizExercise.querySelectorAll('.quiz-question').length;
            console.log(`[Diagnóstico] Total de perguntas visíveis (clique no botão): ${totalQuestionsVisiveis}`);
            
            if (this.classList.contains('verified')) {
                // Se já verificou, avance para próxima pergunta ou mostre resultados
                if (currentQuestion < totalQuestionsVisiveis) {
                    showQuestion(currentQuestion + 1);
                } else {
                    showResults();
                }
            } else {
                // Verificar resposta
                checkAnswer();
            }
        });
        
        // Evento para o botão de reiniciar quiz
        restartBtn.addEventListener('click', resetQuiz);
        
        // Carregar CSS específicos para alterar o progresso
        const style = document.createElement('style');
        style.textContent = `
            .quiz-progress-indicator .progress-bar::before {
                width: var(--progress, 0%);
            }
        `;
        document.head.appendChild(style);
        
        // Inicializar o quiz com a primeira pergunta
        console.log("[Diagnóstico] Inicializando o quiz...");
        
        // Garantir que a estrutura do quiz está correta
        verificarEstruturarQuiz();
        
        // Reinicializar os event listeners das opções
        inicializarOpcoesQuiz();
        
        // Exibir a primeira pergunta
        setTimeout(() => {
            showQuestion(1);
        }, 100);
    }

    // Arrastar e soltar
    const dragItems = document.querySelectorAll('.drag-item');
    const dropZones = document.querySelectorAll('.drop-zone');
    const resetBtn = document.querySelector('.reset-btn');

    // Configurar eventos de arrastar
    dragItems.forEach(item => {
        item.addEventListener('dragstart', function() {
            window.draggedItem = this;
            setTimeout(() => {
                this.style.opacity = '0.5';
            }, 0);
        });

        item.addEventListener('dragend', function() {
            setTimeout(() => {
                this.style.opacity = '1';
                window.draggedItem = null;
            }, 0);
        });
    });

    // Configurar zonas de soltar
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('drop-zone-highlight');
        });

        zone.addEventListener('dragleave', function() {
            this.classList.remove('drop-zone-highlight');
        });

        zone.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drop-zone-highlight');
            
            if (window.draggedItem) {
                const itemType = window.draggedItem.getAttribute('data-type');
                const zoneType = this.getAttribute('data-type');
                
                // Remover classes anteriores apenas se o item for colocado no local correto
                // ou se estiver sendo movido para um novo local
                if (itemType === zoneType) {
                    window.draggedItem.classList.remove('correct', 'incorrect');
                }
                
                // Permitir que qualquer item seja colocado em qualquer zona
                window.draggedItem.classList.add('drag-item-dropped');
                
                // Adicionar feedback visual
                if (itemType === zoneType) {
                    // Feedback de correto
                    window.draggedItem.classList.remove('incorrect'); // Remover classe de incorreto se houver
                    window.draggedItem.classList.add('correct');
                    showNotification('Correto!', `${window.draggedItem.textContent} é realmente um ${zoneType === 'hardware' ? 'hardware' : 'software'}!`, 'success');
                    
                    // Para itens corretos, remover o feedback após 2 segundos
                    const currentItem = window.draggedItem;
                    setTimeout(() => {
                        if (currentItem && currentItem.classList) {
                            currentItem.classList.remove('correct');
                        }
                    }, 2000);
                } else {
                    // Feedback de incorreto - permanece até ser colocado no local correto
                    window.draggedItem.classList.remove('correct'); // Remover classe de correto se houver
                    window.draggedItem.classList.add('incorrect');
                    // Adicionar classe de animação temporária
                    window.draggedItem.classList.add('pulse-error');
                    // Remover a classe de animação após a animação terminar
                    setTimeout(() => {
                        if (window.draggedItem && window.draggedItem.classList) {
                            window.draggedItem.classList.remove('pulse-error');
                        }
                    }, 1000); // Duração da animação
                    showNotification('Incorreto!', `${window.draggedItem.textContent} não é um ${zoneType === 'hardware' ? 'hardware' : 'software'}!`, 'error');
                    // Não removemos a classe 'incorrect' com timeout, ela permanece até o item ser colocado no local correto
                }
                
                this.appendChild(window.draggedItem);
                
                // Verificar se todos os itens foram colocados
                checkAllItemsPlaced();
            }
        });
    });

    // Verificar se todos os itens foram colocados corretamente
    function checkAllItemsPlaced() {
        const hardwareZone = document.querySelector('.drop-zone[data-type="hardware"]');
        const softwareZone = document.querySelector('.drop-zone[data-type="software"]');
        const dragContainer = document.querySelector('.drag-container');
        
        // Verificar se o drag-container existe antes de acessar nextElementSibling
        if (!dragContainer) {
            return; // Sair da função se o container não existir
        }
        
        const exerciseFeedback = dragContainer.nextElementSibling;
        
        if (hardwareZone && softwareZone && exerciseFeedback) {
            const hardwareItems = hardwareZone.querySelectorAll('.drag-item[data-type="hardware"]');
            const softwareItems = softwareZone.querySelectorAll('.drag-item[data-type="software"]');
            
            const totalHardwareItems = document.querySelectorAll('.drag-item[data-type="hardware"]').length;
            const totalSoftwareItems = document.querySelectorAll('.drag-item[data-type="software"]').length;
            
            if (hardwareItems.length === totalHardwareItems && softwareItems.length === totalSoftwareItems) {
                exerciseFeedback.textContent = 'Parabéns! Você classificou todos os itens corretamente.';
                exerciseFeedback.className = 'exercise-feedback feedback-success';
            }
        }
    }

    // Resetar exercício de arrastar e soltar
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            console.log("[Diagnóstico] Botão de reset clicado");
            
            // Sinalizar que estamos em processo de reset para evitar que o MutationObserver interfira
            window.isResettingExercise = true;
            
            // Obter referência ao container de itens
            const dragItemsContainer = document.querySelector('.drag-items');
            const dragContainer = document.querySelector('.drag-container');
            
            // Verificar se os elementos necessários existem
            if (!dragItemsContainer) {
                console.warn('[Diagnóstico] Container de itens não encontrado');
                window.isResettingExercise = false;
                return;
            }
            
            // CORREÇÃO: Remover TODOS os itens existentes
            console.log(`[Diagnóstico] Quantidade de itens antes do reset: ${dragItemsContainer.querySelectorAll('.drag-item').length}`);

            // Primeiro, limpar as classes de todos os itens nas dropzones
            const dropZones = document.querySelectorAll('.drop-zone');
            dropZones.forEach(zone => {
                const items = zone.querySelectorAll('.drag-item');
                items.forEach(item => {
                    item.classList.remove('correct', 'incorrect', 'pulse-error', 'drag-item-dropped');
                });
            });

            dragItemsContainer.innerHTML = '';
            console.log('[Diagnóstico] Todos os itens foram removidos');
            
            // CORREÇÃO: Recriar apenas os itens originais
            const itensOriginais = [
                { nome: 'Mouse', tipo: 'hardware' },
                { nome: 'Teclado', tipo: 'hardware' },
                { nome: 'Monitor', tipo: 'hardware' },
                { nome: 'Word', tipo: 'software' },
                { nome: 'Chrome', tipo: 'software' },
                { nome: 'Excel', tipo: 'software' }
            ];
            
            console.log('[Diagnóstico] Recriando os itens originais');
            itensOriginais.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'drag-item';
                itemEl.setAttribute('draggable', 'true');
                itemEl.setAttribute('data-type', item.tipo);
                itemEl.textContent = item.nome;
                
                // Configurar eventos de arrastar
                itemEl.addEventListener('dragstart', function() {
                    window.draggedItem = this;
                    setTimeout(() => {
                        this.style.opacity = '0.5';
                    }, 0);
                });
                
                itemEl.addEventListener('dragend', function() {
                    setTimeout(() => {
                        this.style.opacity = '1';
                        window.draggedItem = null;
                    }, 0);
                });
                
                dragItemsContainer.appendChild(itemEl);
            });
            
            // Limpar o feedback
            if (dragContainer) {
                const exerciseFeedback = dragContainer.nextElementSibling;
                if (exerciseFeedback) {
                    exerciseFeedback.className = 'exercise-feedback';
                    exerciseFeedback.textContent = '';
                }
            }

            // Resetar as flags de inicialização
            window.dropZonesInitialized = false;
            window.dragItemsInitialized = true; // CORREÇÃO: Marcar como já inicializado para evitar duplicação
            
            console.log(`[Diagnóstico] Quantidade de itens após reset: ${dragItemsContainer.querySelectorAll('.drag-item').length}`);
            
            // Verificar se há duplicações após o reset
            setTimeout(() => {
                removeDuplicateItems();
                // Remover a flag de reset após completar a operação
                window.isResettingExercise = false;
            }, 200);
        });
    }

    // Alerta de cookies
    const cookieAlert = document.querySelector('.cookie-alert');
    const acceptCookies = document.getElementById('acceptCookies');
    const rejectCookies = document.getElementById('rejectCookies');
    
    // Verificar se já aceitou cookies
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    
    if (!cookiesAccepted && cookieAlert) {
        // Mostrar alerta de cookies após 2 segundos
        setTimeout(() => {
            cookieAlert.style.display = 'block';
        }, 2000);
        
        // Botão aceitar cookies
        if (acceptCookies) {
            acceptCookies.addEventListener('click', function() {
                localStorage.setItem('cookiesAccepted', 'true');
                cookieAlert.style.display = 'none';
                alertaSimples('Cookies aceitos. Obrigado!', 'success');
            });
        }
        
        // Botão rejeitar cookies
        if (rejectCookies) {
            rejectCookies.addEventListener('click', function() {
                cookieAlert.style.display = 'none';
                alertaSimples('Cookies rejeitados. Algumas funcionalidades podem não estar disponíveis.', 'info');
            });
        }
    }

    // Função utilitária para mostrar alertas
    function alertaSimples(mensagem, tipo, tempo = 3000) {
        // Remover alertas existentes
        const alertasAntigos = document.querySelectorAll('.alerta-simples');
        alertasAntigos.forEach(alerta => {
            alerta.remove();
        });
        
        // Criar novo alerta
        const alerta = document.createElement('div');
        alerta.className = `alerta-simples ${tipo}`;
        alerta.textContent = mensagem;
        
        // Adicionar ao corpo do documento
        document.body.appendChild(alerta);
        
        // Mostrar o alerta
        setTimeout(() => {
            alerta.classList.add('mostrar');
        }, 10);
        
        // Remover o alerta após o tempo especificado
        setTimeout(() => {
            alerta.classList.remove('mostrar');
            setTimeout(() => {
                alerta.remove();
            }, 300);
        }, tempo);
    }

    // Funcionalidades da seção de Vídeos Tutoriais
    const saveNotesBtn = document.getElementById('saveNotes');
    const clearNotesBtn = document.getElementById('clearNotes');
    const notesArea = document.querySelector('.notes-area');

    // Carregar notas salvas anteriormente
    if (notesArea) {
        const savedNotes = localStorage.getItem('videoNotes');
        if (savedNotes) {
            notesArea.value = savedNotes;
        }
    }

    // Salvar notas
    if (saveNotesBtn) {
        saveNotesBtn.addEventListener('click', function() {
            if (notesArea && notesArea.value.trim() !== '') {
                localStorage.setItem('videoNotes', notesArea.value);
                alertaSimples('Suas anotações foram salvas com sucesso!', 'success');
            } else {
                alertaSimples('Por favor, escreva algo antes de salvar.', 'warning');
            }
        });
    }

    // Limpar notas
    if (clearNotesBtn) {
        clearNotesBtn.addEventListener('click', function() {
            if (notesArea) {
                notesArea.value = '';
                localStorage.removeItem('videoNotes');
                alertaSimples('Suas anotações foram apagadas.', 'info');
            }
        });
    }

    // Funcionalidades do Glossário
    const glossaryItems = document.querySelectorAll('.glossary-item');
    const glossarySearch = document.getElementById('glossary-search');
    const searchGlossaryBtn = document.getElementById('search-glossary-btn');
    const printGlossaryBtn = document.getElementById('print-glossary');

    // Toggle para exibir/ocultar definições no glossário
    glossaryItems.forEach(item => {
        const term = item.querySelector('.glossary-term');
        const definition = item.querySelector('.glossary-definition');
        
        if (term && definition) {
            // Iniciar com definições ocultas, exceto a primeira
            if (item !== glossaryItems[0]) {
                definition.style.display = 'none';
            } else {
                item.classList.add('active');
            }
            
            term.addEventListener('click', function() {
                const isVisible = definition.style.display !== 'none';
                
                if (isVisible) {
                    definition.style.display = 'none';
                    item.classList.remove('active');
                } else {
                    definition.style.display = 'block';
                    item.classList.add('active');
                }
            });
        }
    });

    // Funcionalidade de busca no glossário
    if (searchGlossaryBtn && glossarySearch) {
        searchGlossaryBtn.addEventListener('click', searchGlossary);
        glossarySearch.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                searchGlossary();
            }
        });
    }

    function searchGlossary() {
        const searchTerm = glossarySearch.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            // Resetar busca se o campo estiver vazio
            glossaryItems.forEach(item => {
                item.style.display = 'block';
                const definition = item.querySelector('.glossary-definition');
                if (item !== glossaryItems[0]) {
                    definition.style.display = 'none';
                    item.classList.remove('active');
                }
            });
            return;
        }
        
        let found = false;
        
        glossaryItems.forEach(item => {
            const term = item.querySelector('.glossary-term').textContent.toLowerCase();
            const definition = item.querySelector('.glossary-definition').textContent.toLowerCase();
            
            if (term.includes(searchTerm) || definition.includes(searchTerm)) {
                item.style.display = 'block';
                item.querySelector('.glossary-definition').style.display = 'block';
                item.classList.add('active');
                found = true;
                
                // Destacar o termo buscado
                const regex = new RegExp(searchTerm, 'gi');
                const highlightTerm = item.querySelector('.glossary-term').innerHTML.replace(
                    regex, 
                    '<span style="background-color: yellow;">$&</span>'
                );
                item.querySelector('.glossary-term').innerHTML = highlightTerm;
            } else {
                item.style.display = 'none';
            }
        });
        
        if (!found) {
            alertaSimples('Nenhum termo encontrado para: ' + searchTerm, 'info');
        }
    }

    // Imprimir glossário
    if (printGlossaryBtn) {
        printGlossaryBtn.addEventListener('click', function() {
            // Abrir todas as definições para impressão
            glossaryItems.forEach(item => {
                const definition = item.querySelector('.glossary-definition');
                if (definition) {
                    definition.style.display = 'block';
                }
                item.classList.add('active');
            });
            
            // Preparar para impressão
            const originalContent = document.body.innerHTML;
            const printContent = document.querySelector('#glossario').innerHTML;
            
            document.body.innerHTML = `
                <div style="padding: 20px;">
                    <h1 style="text-align: center; margin-bottom: 30px;">Glossário de Termos Técnicos - UniAteneu</h1>
                    ${printContent}
                </div>
            `;
            
            window.print();
            
            // Restaurar conteúdo original
            document.body.innerHTML = originalContent;
            
            // Recarregar a página para restaurar eventos
            location.reload();
        });
    }

    // Plano de aula temporizado
    const startLessonBtn = document.querySelector('.start-lesson-btn');
    const lessonTimer = document.querySelector('.lesson-timer');
    let lessonInterval;
    let remainingTime = 60 * 60; // 1 hora em segundos

    if (startLessonBtn && lessonTimer) {
        startLessonBtn.addEventListener('click', function() {
            if (this.textContent === 'Iniciar Aula') {
                // Iniciar o timer
                lessonInterval = setInterval(updateLessonTimer, 1000);
                this.textContent = 'Pausar Aula';
                this.style.backgroundColor = '#e84118';
                alertaSimples('Aula iniciada! O cronômetro começou a contar.', 'success');
            } else {
                // Pausar o timer
                clearInterval(lessonInterval);
                this.textContent = 'Iniciar Aula';
                this.style.backgroundColor = '#2e86de';
                alertaSimples('Aula pausada! O cronômetro foi pausado.', 'info');
            }
        });

        function updateLessonTimer() {
            if (remainingTime <= 0) {
                clearInterval(lessonInterval);
                lessonTimer.textContent = '00:00:00';
                startLessonBtn.textContent = 'Aula Concluída';
                startLessonBtn.disabled = true;
                alertaSimples('O tempo da aula acabou!', 'warning');
                return;
            }

            remainingTime--;
            
            const hours = Math.floor(remainingTime / 3600);
            const minutes = Math.floor((remainingTime % 3600) / 60);
            const seconds = remainingTime % 60;
            
            lessonTimer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Alertas para diferentes marcos de tempo
            if (remainingTime === 1800) { // 30 minutos
                alertaSimples('Faltam 30 minutos para o fim da aula.', 'info');
            } else if (remainingTime === 600) { // 10 minutos
                alertaSimples('Faltam apenas 10 minutos para o fim da aula!', 'warning');
            } else if (remainingTime === 60) { // 1 minuto
                alertaSimples('Último minuto de aula!', 'error');
            }
        }
    }

    // Funcionalidades para o acordeão na seção de plano de aula
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    // Adicionar classe 'active' ao primeiro item do acordeão
    if (accordionItems.length > 0) {
        accordionItems[0].classList.add('active');
    }
    
    // Adicionar evento de clique aos cabeçalhos do acordeão
    accordionHeaders.forEach((header, index) => {
        header.addEventListener('click', function() {
            const parentItem = this.parentElement;
            const content = this.nextElementSibling;
            
            // Verificar se este item já está ativo
            const isActive = parentItem.classList.contains('active');
            
            // Fechar todos os itens
            accordionItems.forEach(item => {
                item.classList.remove('active');
                item.querySelector('.accordion-content').style.display = 'none';
            });
            
            // Se o item clicado não estava ativo, abri-lo
            if (!isActive) {
                parentItem.classList.add('active');
                content.style.display = 'block';
            }
        });
    });
    
    // Funcionalidades para as anotações do instrutor
    const saveInstructorNotesBtn = document.getElementById('saveInstructorNotes');
    const clearInstructorNotesBtn = document.getElementById('clearInstructorNotes');
    const instructorNotesArea = document.querySelector('.instructor-notes-area');
    
    // Carregar anotações salvas anteriormente
    if (instructorNotesArea) {
        const savedNotes = localStorage.getItem('instructorNotes');
        if (savedNotes) {
            instructorNotesArea.value = savedNotes;
        }
    }
    
    // Salvar anotações
    if (saveInstructorNotesBtn) {
        saveInstructorNotesBtn.addEventListener('click', function() {
            if (instructorNotesArea && instructorNotesArea.value.trim() !== '') {
                localStorage.setItem('instructorNotes', instructorNotesArea.value);
                alertaSimples('Anotações do instrutor salvas com sucesso!', 'success');
            } else {
                alertaSimples('Por favor, escreva algo antes de salvar.', 'warning');
            }
        });
    }
    
    // Limpar anotações
    if (clearInstructorNotesBtn) {
        clearInstructorNotesBtn.addEventListener('click', function() {
            if (instructorNotesArea) {
                instructorNotesArea.value = '';
                localStorage.removeItem('instructorNotes');
                alertaSimples('Anotações do instrutor apagadas.', 'info');
            }
        });
    }
    
    // Download de recursos
    const resourceDownloadLinks = document.querySelectorAll('.resource-card .btn');
    
    resourceDownloadLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const resourceName = this.parentElement.querySelector('h4').textContent;
            alertaSimples(`O download de "${resourceName}" começará em breve...`, 'info', 5000);
            
            // Simular download após 2 segundos
            setTimeout(() => {
                alertaSimples(`O recurso "${resourceName}" foi baixado com sucesso!`, 'success');
            }, 2000);
        });
    });

    // Funcionalidade de login administrativo
    const adminLoginModal = document.getElementById('admin-login-modal');
    const adminPasswordInput = document.getElementById('admin-password');
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const adminLoginError = document.getElementById('admin-login-error');
    const adminCloseBtn = document.querySelector('.admin-close');
    const adminNavBtns = document.querySelectorAll('.nav-btn.admin-only');
    const adminLoggedIndicator = document.querySelector('.admin-logged-indicator');
    
    // Constantes de autenticação
    const ADMIN_EMAIL = 'admin@digitalx.com';
    const ADMIN_PASSWORD = 'adminproj';
    
    // Verificar se o admin já está logado (pelo localStorage)
    function checkAdminLogin() {
        const isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
        if (isAdminLoggedIn) {
            adminNavBtns.forEach(btn => {
                btn.style.display = 'inline-block';
            });
            adminLoggedIndicator.style.display = 'block';
        }
    }
    
    // Chamar verificação ao carregar a página
    checkAdminLogin();
    
    // Detectar atalho Ctrl + \
    document.addEventListener('keydown', function(event) {
        // Métodos múltiplos para detectar a barra invertida (\)
        const isBackslash = 
            event.keyCode === 220 || 
            event.code === 'Backslash' || 
            event.key === '\\' ||
            event.key === '|' ||  // Em alguns teclados ABNT e outros layouts
            event.which === 220;

        if (event.ctrlKey && isBackslash) {
            event.preventDefault();
            openAdminLoginModal();
            return;
        }
    });
    
    // Abrir modal de login administrativo
    function openAdminLoginModal() {
        adminLoginModal.style.display = 'block';
        adminPasswordInput.value = '';
        adminLoginError.textContent = '';
        adminPasswordInput.focus();
    }
    
    // Fechar modal de login administrativo
    function closeAdminLoginModal() {
        adminLoginModal.style.display = 'none';
    }
    
    // Processar login administrativo
    function processAdminLogin() {
        const password = adminPasswordInput.value;
        
        if (password === ADMIN_PASSWORD) {
            // Login bem-sucedido
            localStorage.setItem('adminLoggedIn', 'true');
            adminNavBtns.forEach(btn => {
                btn.style.display = 'inline-block';
            });
            adminLoggedIndicator.style.display = 'block';
            closeAdminLoginModal();
            
            // Exibir mensagem de boas-vindas
            alertaSimples('Login administrativo realizado com sucesso!', 'sucesso');
        } else {
            // Login falhou
            adminLoginError.textContent = 'Senha incorreta. Por favor, tente novamente.';
            adminPasswordInput.value = '';
            adminPasswordInput.focus();
        }
    }
    
    // Logout administrativo (ao clicar no indicador)
    adminLoggedIndicator.addEventListener('click', function() {
        localStorage.removeItem('adminLoggedIn');
        adminNavBtns.forEach(btn => {
            btn.style.display = 'none';
        });
        adminLoggedIndicator.style.display = 'none';
        
        // Se estiver na seção de plano de aula ou admin-exercicios, redirecionar para o início
        if (document.getElementById('plano-aula').classList.contains('active-section') || 
            document.getElementById('admin-exercicios').classList.contains('active-section')) {
            showSection('inicio');
        }
        
        alertaSimples('Logout administrativo realizado com sucesso!', 'sucesso');
    });
    
    // Event Listeners para o modal de login
    adminLoginBtn.addEventListener('click', processAdminLogin);
    adminCloseBtn.addEventListener('click', closeAdminLoginModal);
    adminPasswordInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            processAdminLogin();
        }
    });
    
    // Fechar o modal se clicar fora dele
    window.addEventListener('click', function(event) {
        if (event.target === adminLoginModal) {
            closeAdminLoginModal();
        }
    });
    
    // Adicionar evento de clique para o ícone de acesso administrativo no rodapé
    const adminAccessIcon = document.getElementById('adminAccessIcon');
    if (adminAccessIcon) {
        adminAccessIcon.addEventListener('click', function(event) {
            event.preventDefault();
            openAdminLoginModal();
        });
    }
    
    // Funcionalidade para o botão de ajuda de acesso administrativo
    const adminHelpButton = document.getElementById('adminHelpButton');
    const adminHelpModal = document.getElementById('admin-help-modal');
    const adminHelpCloseBtn = adminHelpModal.querySelector('.admin-close');
    
    function openAdminHelpModal() {
        adminHelpModal.style.display = 'block';
    }
    
    function closeAdminHelpModal() {
        adminHelpModal.style.display = 'none';
    }
    
    adminHelpButton.addEventListener('click', openAdminHelpModal);
    adminHelpCloseBtn.addEventListener('click', closeAdminHelpModal);
    
    // Fechar o modal de ajuda se clicar fora dele
    window.addEventListener('click', function(event) {
        if (event.target === adminHelpModal) {
            closeAdminHelpModal();
        }
    });
    
    // ===== FUNCIONALIDADES DE ADMINISTRAÇÃO DE EXERCÍCIOS =====
    // Inicializar exercícios 
    initExerciseAdmin();
    
    function initExerciseAdmin() {
        // Detectar se estamos na página de admin
        if (!document.querySelector('.admin-tabs')) return;
        
        // Navegação entre abas
        const tabButtons = document.querySelectorAll('.admin-tab-btn');
        const tabContents = document.querySelectorAll('.admin-tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remover classe 'active' de todos os botões e conteúdos
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Adicionar classe 'active' ao botão clicado e ao conteúdo correspondente
                this.classList.add('active');
                const tabId = this.getAttribute('data-tab');
                const targetTab = document.getElementById(tabId + '-tab');
                if (targetTab) {
                    targetTab.classList.add('active');
                    
                    // Se for a tab de ranking, recarregar os dados
                    if (tabId === 'ranking') {
                        initRankingAdmin();
                    }
                }
            });
        });
        
        // Inicializar os diferentes gerenciadores de exercícios
        initDigitacaoAdmin();
        initQuizAdmin();
        initDragDropAdmin();
        initRankingAdmin(); // Novo gerenciador de ranking
        
        // Melhorar o sistema de notificações
        setupNotificationSystem();
    }
    
    // Sistema de Notificações Aprimorado
    function setupNotificationSystem() {
        // Criar elementos de notificação
        const notifContainer = document.createElement('div');
        notifContainer.id = 'notification-container';
        document.body.appendChild(notifContainer);
    }
    
    function showNotification(title, message, type = 'info', duration = 3000) {
        // Verificar se o documento está disponível
        if (!document || !document.body) {
            console.warn('Documento não disponível para mostrar notificação');
            return null;
        }
        
        // Obter ou criar o container
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            document.body.appendChild(container);
        }
        
        // Sanitizar valores
        title = title || 'Notificação';
        message = message || '';
        
        // Criar elementos da notificação
        const notif = document.createElement('div');
        notif.className = `notification notification-${type}`;
        
        const iconDiv = document.createElement('div');
        iconDiv.className = 'notification-icon';
        
        let iconClass = 'fas fa-info-circle';
        if (type === 'success') iconClass = 'fas fa-check-circle';
        if (type === 'error') iconClass = 'fas fa-exclamation-circle';
        if (type === 'warning') iconClass = 'fas fa-exclamation-triangle';
        
        const icon = document.createElement('i');
        icon.className = iconClass;
        iconDiv.appendChild(icon);
        
        const content = document.createElement('div');
        content.className = 'notification-content';
        
        const titleEl = document.createElement('div');
        titleEl.className = 'notification-title';
        titleEl.textContent = title;
        
        const messageEl = document.createElement('div');
        messageEl.className = 'notification-message';
        messageEl.textContent = message;
        
        content.appendChild(titleEl);
        content.appendChild(messageEl);
        
        const closeBtn = document.createElement('div');
        closeBtn.className = 'notification-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', () => {
            if (notif && notif.classList) {
                notif.classList.remove('show');
                setTimeout(() => {
                    if (notif && notif.parentNode) {
                        notif.remove();
                    }
                }, 300);
            }
        });
        
        notif.appendChild(iconDiv);
        notif.appendChild(content);
        notif.appendChild(closeBtn);
        
        container.appendChild(notif);
        
        // Mostrar a notificação após ser adicionada ao DOM
        setTimeout(() => {
            if (notif && notif.classList) {
                notif.classList.add('show');
            }
        }, 10);
        
        // Fechar automaticamente após a duração especificada
        if (duration > 0) {
            setTimeout(() => {
                if (notif && notif.parentNode && notif.classList) {
                    notif.classList.remove('show');
                    setTimeout(() => {
                        if (notif && notif.parentNode) {
                            notif.remove();
                        }
                    }, 300);
                }
            }, duration);
        }
        
        return notif;
    }
    
    // Gerenciador de Exercício de Digitação
    function initDigitacaoAdmin() {
        const fraseTextarea = document.getElementById('digitacao-frase');
        const salvarBtn = document.getElementById('salvar-digitacao');
        const restaurarBtn = document.getElementById('restaurar-digitacao');
        const feedback = document.getElementById('digitacao-feedback');
        
        // Frase original
        const fraseOriginal = 'O aprendizado digital é importante para todas as idades.';
        
        // Carregar frase salva (se existir)
        const fraseSalva = localStorage.getItem('admin_digitacao_frase');
        if (fraseSalva) {
            fraseTextarea.value = fraseSalva;
            
            // Também atualizar no exercício real
            const typingText = document.querySelector('.typing-text');
            if (typingText) {
                typingText.textContent = fraseSalva;
            }
        }
        
        // Salvar alterações
        if (salvarBtn) {
            salvarBtn.addEventListener('click', function() {
                const novaFrase = fraseTextarea.value.trim();
                
                if (novaFrase === '') {
                    feedback.textContent = 'A frase não pode estar vazia.';
                    feedback.className = 'admin-feedback error';
                    return;
                }
                
                // Salvar no localStorage
                localStorage.setItem('admin_digitacao_frase', novaFrase);
                
                // Atualizar no exercício real
                const typingText = document.querySelector('.typing-text');
                if (typingText) {
                    typingText.textContent = novaFrase;
                }
                
                feedback.textContent = 'Frase atualizada com sucesso!';
                feedback.className = 'admin-feedback success';
                
                showNotification('Sucesso', 'Frase de digitação atualizada com sucesso!', 'success');
            });
        }
        
        // Restaurar frase original
        if (restaurarBtn) {
            restaurarBtn.addEventListener('click', function() {
                fraseTextarea.value = fraseOriginal;
                
                // Remover do localStorage
                localStorage.removeItem('admin_digitacao_frase');
                
                // Atualizar no exercício real
                const typingText = document.querySelector('.typing-text');
                if (typingText) {
                    typingText.textContent = fraseOriginal;
                }
                
                feedback.textContent = 'Frase restaurada para o valor original.';
                feedback.className = 'admin-feedback success';
                
                showNotification('Restaurado', 'Frase de digitação restaurada para o valor original', 'info');
            });
        }
    }
    
    // Gerenciador de Quiz
    function initQuizAdmin() {
        const perguntaInput = document.getElementById('quiz-pergunta');
        const opcaoInputs = document.querySelectorAll('.quiz-opcao');
        const salvarBtn = document.getElementById('salvar-quiz');
        const limparBtn = document.getElementById('limpar-quiz');
        const visivelCheckbox = document.getElementById('quiz-visivel');
        const feedback = document.getElementById('quiz-feedback');
        const quizList = document.querySelector('.admin-list-group');
        
        // Aplicar melhorias de CSS
        if (perguntaInput) {
            perguntaInput.style.padding = '12px';
            perguntaInput.style.borderRadius = '6px';
            perguntaInput.style.border = '1px solid #dcdde1';
            perguntaInput.style.width = '100%';
            perguntaInput.style.fontSize = '16px';
            perguntaInput.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
            perguntaInput.style.transition = 'all 0.3s ease';
        }
        
        // Definir visibilidade como desativada por padrão
        if (visivelCheckbox) {
            visivelCheckbox.checked = false;
        }
        
        // Carregar perguntas personalizadas salvas
        carregarPerguntasPersonalizadas();
        
        // Salvar nova pergunta
        if (salvarBtn) {
            salvarBtn.addEventListener('click', function() {
                const pergunta = perguntaInput.value.trim();
                const opcoes = [];
                let respostaCorreta = -1;
                let respostaSelecionada = false;
                
                // Verificar opções e resposta correta
                opcaoInputs.forEach((input, index) => {
                    const texto = input.value.trim();
                    if (texto !== '') {
                        opcoes.push(texto);
                    }
                    
                    // Verificar se esta opção foi marcada como correta
                    const radio = document.querySelector(`input[name="resposta-correta"][value="${index}"]`);
                    if (radio && radio.checked) {
                        respostaCorreta = opcoes.length - 1;
                        respostaSelecionada = true;
                    }
                });
                
                // Validações
                if (pergunta === '') {
                    feedback.textContent = 'Por favor, digite uma pergunta.';
                    feedback.className = 'admin-feedback error';
                    return;
                }
                
                if (opcoes.length < 2) {
                    feedback.textContent = 'Por favor, forneça pelo menos duas opções.';
                    feedback.className = 'admin-feedback error';
                    return;
                }
                
                if (!respostaSelecionada) {
                    feedback.textContent = 'Por favor, selecione uma resposta correta.';
                    feedback.className = 'admin-feedback error';
                    return;
                }
                
                // Criar nova pergunta
                const novaPergunta = {
                    id: Date.now(),
                    pergunta: pergunta,
                    opcoes: opcoes,
                    respostaCorreta: respostaCorreta,
                    visivel: visivelCheckbox.checked
                };
                
                // Salvar pergunta
                salvarNovaPergunta(novaPergunta);
                
                // Limpar formulário
                limparFormularioQuiz();
                
                feedback.textContent = 'Pergunta adicionada com sucesso!';
                feedback.className = 'admin-feedback success';
                
                showNotification('Sucesso', 'Nova pergunta adicionada ao quiz!', 'success');
            });
        }
        
        // Limpar formulário
        if (limparBtn) {
            limparBtn.addEventListener('click', limparFormularioQuiz);
        }
        
        function limparFormularioQuiz() {
            perguntaInput.value = '';
            opcaoInputs.forEach(input => {
                input.value = '';
            });
            document.querySelector('input[name="resposta-correta"][value="0"]').checked = true;
            // Garantir que o checkbox de visibilidade inicie desmarcado
            visivelCheckbox.checked = false;
        }
        
        function salvarNovaPergunta(pergunta) {
            // Carregar perguntas existentes
            let perguntas = JSON.parse(localStorage.getItem('admin_quiz_perguntas') || '[]');
            
            // Adicionar nova pergunta
            perguntas.push(pergunta);
            
            // Salvar de volta ao localStorage
            localStorage.setItem('admin_quiz_perguntas', JSON.stringify(perguntas));
            
            // Atualizar lista de perguntas na interface
            atualizarListaPerguntas();
            
            // Atualizar quiz no exercício real
            atualizarExercicioQuiz();
        }
        
        function atualizarListaPerguntas() {
            // Carregar perguntas personalizadas
            const perguntas = JSON.parse(localStorage.getItem('admin_quiz_perguntas') || '[]');
            
            // Obter elementos originais de apenas leitura
            const originalItems = Array.from(quizList.querySelectorAll('.admin-readonly'));
            
            // Remover itens personalizados antigos
            const customItems = Array.from(quizList.querySelectorAll('.admin-custom'));
            customItems.forEach(item => item.remove());
            
            // Adicionar perguntas personalizadas
            perguntas.forEach(pergunta => {
                const item = document.createElement('div');
                item.className = 'admin-list-item admin-custom';
                item.dataset.id = pergunta.id;
                
                const header = document.createElement('div');
                header.className = 'admin-item-header';
                
                const title = document.createElement('span');
                title.textContent = pergunta.pergunta;
                
                const actions = document.createElement('div');
                actions.className = 'admin-item-actions';
                
                const badge = document.createElement('span');
                badge.className = `admin-badge ${pergunta.visivel ? 'visible' : 'hidden'}`;
                badge.textContent = pergunta.visivel ? 'Visível' : 'Oculta';
                
                const viewBtn = document.createElement('button');
                viewBtn.className = 'admin-action-btn view-btn';
                viewBtn.title = 'Visualizar';
                viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
                viewBtn.addEventListener('click', () => visualizarPergunta(pergunta));
                
                const visibilityBtn = document.createElement('button');
                visibilityBtn.className = 'admin-action-btn visibility-btn';
                visibilityBtn.title = pergunta.visivel ? 'Ocultar' : 'Mostrar';
                visibilityBtn.innerHTML = pergunta.visivel ? 
                    '<i class="fas fa-eye"></i>' : 
                    '<i class="fas fa-eye-slash"></i>';
                visibilityBtn.addEventListener('click', () => alternarVisibilidade(pergunta.id));
                
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'admin-action-btn delete-btn';
                deleteBtn.title = 'Excluir';
                deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
                deleteBtn.addEventListener('click', () => excluirPergunta(pergunta.id));
                
                actions.appendChild(badge);
                actions.appendChild(viewBtn);
                actions.appendChild(visibilityBtn);
                actions.appendChild(deleteBtn);
                
                header.appendChild(title);
                header.appendChild(actions);
                
                item.appendChild(header);
                quizList.appendChild(item);
            });
        }
        
        function carregarPerguntasPersonalizadas() {
            atualizarListaPerguntas();
        }
        
        function visualizarPergunta(pergunta) {
            let message = `Pergunta: ${pergunta.pergunta}\n\nOpções:\n`;
            
            pergunta.opcoes.forEach((opcao, index) => {
                message += `${index + 1}. ${opcao}${index === pergunta.respostaCorreta ? ' (Correta)' : ''}\n`;
            });
            
            alert(message);
        }
        
        function alternarVisibilidade(id) {
            // Carregar perguntas existentes
            let perguntas = JSON.parse(localStorage.getItem('admin_quiz_perguntas') || '[]');
            
            // Encontrar a pergunta pelo ID
            const index = perguntas.findIndex(p => p.id === id);
            if (index !== -1) {
                // Alternar visibilidade
                perguntas[index].visivel = !perguntas[index].visivel;
                
                // Salvar de volta ao localStorage
                localStorage.setItem('admin_quiz_perguntas', JSON.stringify(perguntas));
                
                // Atualizar lista na interface
                atualizarListaPerguntas();
                
                // Atualizar quiz no exercício real
                atualizarExercicioQuiz();
                
                showNotification(
                    'Visibilidade alterada', 
                    `Pergunta agora está ${perguntas[index].visivel ? 'visível' : 'oculta'}`, 
                    'info'
                );
            }
        }
        
        function excluirPergunta(id) {
            if (!confirm('Tem certeza que deseja excluir esta pergunta?')) return;
            
            // Carregar perguntas existentes
            let perguntas = JSON.parse(localStorage.getItem('admin_quiz_perguntas') || '[]');
            
            // Filtrar a pergunta pelo ID
            perguntas = perguntas.filter(p => p.id !== id);
            
            // Salvar de volta ao localStorage
            localStorage.setItem('admin_quiz_perguntas', JSON.stringify(perguntas));
            
            // Atualizar lista na interface
            atualizarListaPerguntas();
            
            // Atualizar quiz no exercício real
            atualizarExercicioQuiz();
            
            showNotification('Removido', 'Pergunta removida com sucesso', 'warning');
        }
        
        function atualizarExercicioQuiz() {
            // Esta função adiciona as perguntas personalizadas ao quiz real
            console.log("[Diagnóstico] Executando atualizarExercicioQuiz");
            
            // Verificar e corrigir a estrutura do quiz antes de adicionar perguntas personalizadas
            verificarEstruturarQuiz();
            
            // Carregar perguntas personalizadas
            const perguntasString = localStorage.getItem('admin_quiz_perguntas');
            if (!perguntasString) {
                console.log("[Diagnóstico] Não há perguntas personalizadas para adicionar");
                return;
            }
            
            try {
                const perguntas = JSON.parse(perguntasString);
                
                // Verificar se perguntas é um array
                if (!Array.isArray(perguntas)) {
                    console.warn('[Diagnóstico] Formato inválido de perguntas salvas');
                    return;
                }
                
                console.log(`[Diagnóstico] ${perguntas.length} perguntas encontradas no localStorage`);
                
                // Filtrar apenas as perguntas visíveis
                const perguntasVisiveis = perguntas.filter(pergunta => pergunta.visivel);
                console.log(`[Diagnóstico] ${perguntasVisiveis.length} perguntas visíveis para adicionar ao quiz`);
                
                if (perguntasVisiveis.length === 0) {
                    return; // Não há perguntas visíveis para adicionar
                }
                
                // Obter o container de perguntas do quiz
                const quizExercise = document.querySelector('.exercise-card:nth-child(2) .quiz-container');
                if (!quizExercise) {
                    console.warn('[Diagnóstico] Container do quiz não encontrado');
                    return;
                }
                
                const quizQuestionsContainer = quizExercise.querySelector('.quiz-questions');
                if (!quizQuestionsContainer) {
                    console.warn('[Diagnóstico] Container de perguntas do quiz não encontrado');
                    return;
                }
                
                // Remover perguntas personalizadas antigas
                const oldCustomQuestions = quizQuestionsContainer.querySelectorAll('.quiz-question.custom-question');
                console.log(`[Diagnóstico] Removendo ${oldCustomQuestions.length} perguntas personalizadas antigas`);
                oldCustomQuestions.forEach(question => question.remove());
                
                // Obter o número da última pergunta existente
                const existingQuestions = quizQuestionsContainer.querySelectorAll('.quiz-question');
                let lastQuestionNumber = existingQuestions.length;
                console.log(`[Diagnóstico] Número de perguntas existentes: ${lastQuestionNumber}`);
                
                // Adicionar perguntas personalizadas
                perguntasVisiveis.forEach((pergunta, index) => {
                    const questionNumber = lastQuestionNumber + index + 1;
                    console.log(`[Diagnóstico] Adicionando pergunta personalizada #${questionNumber}: ${pergunta.pergunta}`);
                    
                    // Criar elemento da nova pergunta
                    const questionElement = document.createElement('div');
                    questionElement.className = 'quiz-question custom-question';
                    questionElement.setAttribute('data-question', questionNumber.toString());
                    
                    // Adicionar texto da pergunta
                    const questionText = document.createElement('p');
                    questionText.textContent = pergunta.pergunta;
                    questionElement.appendChild(questionText);
                    
                    // Adicionar opções
                    const optionsContainer = document.createElement('div');
                    optionsContainer.className = 'quiz-options';
                    
                    pergunta.opcoes.forEach((opcao, optIndex) => {
                        const optionDiv = document.createElement('div');
                        optionDiv.className = 'quiz-option';
                        
                        const input = document.createElement('input');
                        input.type = 'radio';
                        input.name = `quiz${questionNumber}`;
                        input.id = `q${questionNumber}${String.fromCharCode(97 + optIndex)}`; // q5a, q5b, etc.
                        input.value = String.fromCharCode(97 + optIndex); // a, b, c, etc.
                        
                        const label = document.createElement('label');
                        label.setAttribute('for', input.id);
                        label.textContent = opcao;
                        
                        // Adicionar evento de change nos radios
                        input.addEventListener('change', function() {
                            // Remover classe 'selected' de todas as opções deste grupo
                            const groupOptions = questionElement.querySelectorAll('.quiz-option');
                            groupOptions.forEach(opt => {
                                opt.classList.remove('selected');
                            });
                            
                            // Adicionar classe 'selected' à opção escolhida
                            if (this.checked) {
                                this.parentElement.classList.add('selected');
                            }
                            
                            // Habilitar o botão de verificar
                            const checkBtn = quizExercise.querySelector('.check-btn');
                            if (checkBtn) {
                                checkBtn.disabled = false;
                            }
                        });
                        
                        optionDiv.appendChild(input);
                        optionDiv.appendChild(label);
                        optionsContainer.appendChild(optionDiv);
                    });
                    
                    questionElement.appendChild(optionsContainer);
                    quizQuestionsContainer.appendChild(questionElement);
                    
                    // Verificar se a pergunta tem a resposta correta definida
                    if (pergunta.respostaCorreta !== undefined) {
                        // Definir resposta correta para esta pergunta (convertendo índice para letra)
                        if (window.quizCorrectAnswers) {
                            window.quizCorrectAnswers[questionNumber.toString()] = String.fromCharCode(97 + pergunta.respostaCorreta);
                            console.log(`[Diagnóstico] Resposta correta definida para pergunta ${questionNumber}: ${window.quizCorrectAnswers[questionNumber.toString()]}`);
                        }
                        
                        // Definir explicação
                        if (window.quizExplanations) {
                            window.quizExplanations[questionNumber.toString()] = `A resposta correta é ${pergunta.opcoes[pergunta.respostaCorreta]}.`;
                        }
                    } else {
                        console.warn(`[Diagnóstico] Pergunta ${questionNumber} não tem resposta correta definida`);
                    }
                });
                
                // Atualizar o total de perguntas
                const newTotalQuestions = lastQuestionNumber + perguntasVisiveis.length;
                console.log(`[Diagnóstico] Novo total de perguntas: ${newTotalQuestions}`);
                
                // Atualizar contador de perguntas total
                const totalQuestionsSpan = quizExercise.querySelector('.total-questions');
                if (totalQuestionsSpan) {
                    totalQuestionsSpan.textContent = newTotalQuestions.toString();
                }
                
                // Sincronizar variáveis globais com as variáveis locais do quiz
                const quizContainer = document.querySelector('.exercise-card:nth-child(2) .quiz-container');
                if (quizContainer) {
                    const quizScript = document.createElement('script');
                    quizScript.textContent = `
                        // Atualizar as respostas corretas
                        if (typeof correctAnswers !== 'undefined' && window.quizCorrectAnswers) {
                            Object.keys(window.quizCorrectAnswers).forEach(key => {
                                correctAnswers[key] = window.quizCorrectAnswers[key];
                            });
                        }
                        
                        // Atualizar as explicações
                        if (typeof explanations !== 'undefined' && window.quizExplanations) {
                            Object.keys(window.quizExplanations).forEach(key => {
                                explanations[key] = window.quizExplanations[key];
                            });
                        }

                        // Forçar recalculação do total de perguntas
                        if (typeof totalQuestions !== 'undefined') {
                            totalQuestions = document.querySelectorAll('.quiz-question').length;
                        }
                    `;
                    quizContainer.appendChild(quizScript);
                    
                    // Forçar o quiz a reconhecer o novo total de perguntas
                    setTimeout(() => {
                        const totalQuestionsElement = quizContainer.querySelector('.total-questions');
                        if (totalQuestionsElement) {
                            totalQuestionsElement.textContent = newTotalQuestions.toString();
                        }
                    }, 100);
                }
                
                console.log('[Diagnóstico] Quiz atualizado com sucesso');
                
            } catch (error) {
                console.error('[Diagnóstico] Erro ao processar perguntas personalizadas:', error);
            }
        }
    }
    
    // Gerenciador de Arrastar e Soltar
    function initDragDropAdmin() {
        const nomeInput = document.getElementById('drag-nome');
        const tipoRadios = document.querySelectorAll('input[name="drag-tipo"]');
        const visivelCheckbox = document.getElementById('drag-visivel');
        const salvarBtn = document.getElementById('salvar-drag');
        const limparBtn = document.getElementById('limpar-drag');
        const feedback = document.getElementById('drag-feedback');
        const itemsList = document.getElementById('admin-drag-items-list');
        
        // Aplicar melhorias de CSS
        if (nomeInput) {
            nomeInput.style.padding = '12px';
            nomeInput.style.borderRadius = '6px';
            nomeInput.style.border = '1px solid #dcdde1';
            nomeInput.style.width = '100%';
            nomeInput.style.fontSize = '16px';
            nomeInput.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
            nomeInput.style.transition = 'all 0.3s ease';
        }
        
        // Definir visibilidade como desativada por padrão
        if (visivelCheckbox) {
            visivelCheckbox.checked = false;
        }
        
        // Containers para preview
        const hardwarePreview = document.querySelector('.hardware-items');
        const softwarePreview = document.querySelector('.software-items');
        
        // Carregar itens personalizados salvos
        carregarItensPersonalizados();
        
        // Salvar novo item
        if (salvarBtn) {
            salvarBtn.addEventListener('click', function() {
                const nome = nomeInput.value.trim();
                let tipo = '';
                
                // Obter tipo selecionado
                tipoRadios.forEach(radio => {
                    if (radio.checked) {
                        tipo = radio.value;
                    }
                });
                
                // Validar nome
                if (nome === '') {
                    feedback.textContent = 'Por favor, digite um nome para o item.';
                    feedback.className = 'admin-feedback error';
                    return;
                }
                
                // Verificar se item já existe
                const itens = JSON.parse(localStorage.getItem('admin_drag_itens') || '[]');
                const itensOriginais = ['Mouse', 'Teclado', 'Monitor', 'Word', 'Chrome', 'Excel'];
                
                if (itensOriginais.includes(nome) || itens.some(i => i.nome.toLowerCase() === nome.toLowerCase())) {
                    feedback.textContent = 'Este item já existe. Por favor, escolha outro nome.';
                    feedback.className = 'admin-feedback error';
                    return;
                }
                
                // Criar novo item
                const novoItem = {
                    id: Date.now(),
                    nome: nome,
                    tipo: tipo,
                    visivel: visivelCheckbox.checked
                };
                
                // Salvar item
                salvarNovoItem(novoItem);
                
                // Limpar formulário
                limparFormularioDrag();
                
                feedback.textContent = 'Item adicionado com sucesso!';
                feedback.className = 'admin-feedback success';
                
                showNotification('Sucesso', 'Novo item adicionado ao exercício!', 'success');
            });
        }
        
        // Limpar formulário
        if (limparBtn) {
            limparBtn.addEventListener('click', limparFormularioDrag);
        }
        
        function limparFormularioDrag() {
            nomeInput.value = '';
            document.querySelector('input[name="drag-tipo"][value="hardware"]').checked = true;
            // Garantir que o checkbox de visibilidade inicie desmarcado
            visivelCheckbox.checked = false;
        }
        
        function salvarNovoItem(item) {
            // Carregar itens existentes
            let itens = JSON.parse(localStorage.getItem('admin_drag_itens') || '[]');
            
            // Adicionar novo item
            itens.push(item);
            
            // Salvar de volta ao localStorage
            localStorage.setItem('admin_drag_itens', JSON.stringify(itens));
            
            // Atualizar lista de itens na interface
            atualizarListaItens();
            
            // Atualizar preview
            atualizarPreview();
            
            // Atualizar exercício real
            atualizarExercicioDragDrop();
        }
        
        function atualizarListaItens() {
            // Obter a lista de itens
            const itens = JSON.parse(localStorage.getItem('admin_drag_itens') || '[]');
            
            // Limpar lista atual
            if (itemsList) {
                itemsList.innerHTML = '';
                
                // Adicionar itens à lista
                itens.forEach(item => {
                    const itemEl = document.createElement('div');
                    itemEl.className = 'admin-list-item admin-custom';
                    itemEl.dataset.id = item.id;
                    
                    const header = document.createElement('div');
                    header.className = 'admin-item-header';
                    
                    const title = document.createElement('span');
                    title.textContent = `${item.nome} (${item.tipo === 'hardware' ? 'Hardware' : 'Software'})`;
                    
                    const actions = document.createElement('div');
                    actions.className = 'admin-item-actions';
                    
                    const badge = document.createElement('span');
                    badge.className = `admin-badge ${item.visivel ? 'visible' : 'hidden'}`;
                    badge.textContent = item.visivel ? 'Visível' : 'Oculto';
                    
                    const visibilityBtn = document.createElement('button');
                    visibilityBtn.className = 'admin-action-btn visibility-btn';
                    visibilityBtn.title = item.visivel ? 'Ocultar' : 'Mostrar';
                    visibilityBtn.innerHTML = item.visivel ? 
                        '<i class="fas fa-eye"></i>' : 
                        '<i class="fas fa-eye-slash"></i>';
                    visibilityBtn.addEventListener('click', () => alternarVisibilidadeItem(item.id));
                    
                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'admin-action-btn delete-btn';
                    deleteBtn.title = 'Excluir';
                    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
                    deleteBtn.addEventListener('click', () => excluirItem(item.id));
                    
                    actions.appendChild(badge);
                    actions.appendChild(visibilityBtn);
                    actions.appendChild(deleteBtn);
                    
                    header.appendChild(title);
                    header.appendChild(actions);
                    
                    itemEl.appendChild(header);
                    itemsList.appendChild(itemEl);
                });
            }
        }
        
        function atualizarPreview() {
            // Limpar previews atuais de itens personalizados
            if (hardwarePreview) {
                const customHardware = hardwarePreview.querySelectorAll('.custom-item');
                customHardware.forEach(item => item.remove());
            }
            
            if (softwarePreview) {
                const customSoftware = softwarePreview.querySelectorAll('.custom-item');
                customSoftware.forEach(item => item.remove());
            }
            
            // Obter itens personalizados
            const itens = JSON.parse(localStorage.getItem('admin_drag_itens') || '[]');
            
            // Adicionar itens visíveis aos previews
            itens.forEach(item => {
                if (item.visivel) {
                    const itemEl = document.createElement('div');
                    itemEl.className = 'drag-item preview-item custom-item';
                    itemEl.textContent = item.nome;
                    
                    if (item.tipo === 'hardware' && hardwarePreview) {
                        hardwarePreview.appendChild(itemEl);
                    } else if (item.tipo === 'software' && softwarePreview) {
                        softwarePreview.appendChild(itemEl);
                    }
                }
            });
        }
        
        function carregarItensPersonalizados() {
            // Atualizar lista e preview na inicialização
            atualizarListaItens();
            atualizarPreview();
        }
        
        function alternarVisibilidadeItem(id) {
            // Carregar itens existentes
            let itens = JSON.parse(localStorage.getItem('admin_drag_itens') || '[]');
            
            // Encontrar o item pelo ID
            const index = itens.findIndex(i => i.id === id);
            if (index !== -1) {
                // Alternar visibilidade
                itens[index].visivel = !itens[index].visivel;
                
                // Salvar de volta ao localStorage
                localStorage.setItem('admin_drag_itens', JSON.stringify(itens));
                
                // Atualizar lista e preview
                atualizarListaItens();
                atualizarPreview();
                
                // Atualizar exercício real
                atualizarExercicioDragDrop();
                
                showNotification(
                    'Visibilidade alterada', 
                    `Item agora está ${itens[index].visivel ? 'visível' : 'oculto'}`, 
                    'info'
                );
            }
        }
        
        function excluirItem(id) {
            if (!confirm('Tem certeza que deseja excluir este item?')) return;
            
            // Carregar itens existentes
            let itens = JSON.parse(localStorage.getItem('admin_drag_itens') || '[]');
            
            // Filtrar o item pelo ID
            itens = itens.filter(i => i.id !== id);
            
            // Salvar de volta ao localStorage
            localStorage.setItem('admin_drag_itens', JSON.stringify(itens));
            
            // Atualizar lista e preview
            atualizarListaItens();
            atualizarPreview();
            
            // Atualizar exercício real
            atualizarExercicioDragDrop();
            
            showNotification('Removido', 'Item removido com sucesso', 'warning');
        }
        
        function atualizarExercicioDragDrop() {
            // Esta função adiciona os itens personalizados ao exercício real
            console.log("[Diagnóstico] Executando atualizarExercicioDragDrop");
            
            // Obter o container de itens do exercício
            const dragItemsContainer = document.querySelector('.exercise-card .drag-items');
            if (!dragItemsContainer) {
                console.warn('[Diagnóstico] Container de itens para arrastar e soltar não encontrado');
                return;
            }
            
            console.log(`[Diagnóstico] Quantidade de itens antes da atualização: ${dragItemsContainer.querySelectorAll('.drag-item').length}`);
            
            // Remover itens personalizados antigos
            const oldCustomItems = dragItemsContainer.querySelectorAll('.custom-item');
            console.log(`[Diagnóstico] Removendo ${oldCustomItems.length} itens personalizados antigos`);
            oldCustomItems.forEach(item => item.remove());
            
            // Adicionar itens personalizados visíveis
            const itensString = localStorage.getItem('admin_drag_itens');
            if (!itensString) {
                console.log("[Diagnóstico] Não há itens personalizados para adicionar");
                // Garantir que não haja duplicações mesmo assim
                setTimeout(removeDuplicateItems, 100);
                return; // Não há itens personalizados
            }
            
            try {
                const itens = JSON.parse(itensString);
                
                // Verificar se itens é um array
                if (!Array.isArray(itens)) {
                    console.warn('[Diagnóstico] Formato inválido de itens salvos');
                    // Garantir que não haja duplicações mesmo assim
                    setTimeout(removeDuplicateItems, 100);
                    return;
                }
                
                console.log(`[Diagnóstico] ${itens.length} itens encontrados no localStorage`);
                
                // Verificar quais itens já existem
                const itemsExistentes = new Set();
                dragItemsContainer.querySelectorAll('.drag-item').forEach(item => {
                    const text = item.textContent.trim();
                    itemsExistentes.add(text);
                    console.log(`[Diagnóstico] Item existente: ${text}`);
                });
                
                // Lista de itens padrão que não devem ser duplicados
                const itensPadrao = ['Mouse', 'Teclado', 'Monitor', 'Word', 'Chrome', 'Excel'];
                
                let itensAdicionados = 0;
                
                itens.forEach(item => {
                    if (item && item.visivel) {
                        // Verificar se o item já existe (padrão ou personalizado)
                        if (!itemsExistentes.has(item.nome) && !itensPadrao.includes(item.nome)) {
                            console.log(`[Diagnóstico] Adicionando item personalizado: ${item.nome}`);
                            
                            const itemEl = document.createElement('div');
                            itemEl.className = 'drag-item custom-item';
                            itemEl.setAttribute('draggable', 'true');
                            itemEl.setAttribute('data-type', item.tipo || 'hardware'); // Valor padrão se tipo não existir
                            itemEl.textContent = item.nome || 'Item';
                            
                            // Configurar eventos de arrastar
                            itemEl.addEventListener('dragstart', function() {
                                window.draggedItem = this;
                                setTimeout(() => {
                                    this.style.opacity = '0.5';
                                }, 0);
                            });
                            
                            itemEl.addEventListener('dragend', function() {
                                setTimeout(() => {
                                    this.style.opacity = '1';
                                    window.draggedItem = null;
                                }, 0);
                            });
                            
                            dragItemsContainer.appendChild(itemEl);
                            itemsExistentes.add(item.nome);
                            itensAdicionados++;
                        } else {
                            console.log(`[Diagnóstico] Item personalizado ${item.nome} não adicionado pois já existe`);
                        }
                    }
                });
                
                console.log(`[Diagnóstico] ${itensAdicionados} novos itens adicionados`);
                console.log(`[Diagnóstico] Quantidade de itens após atualização: ${dragItemsContainer.querySelectorAll('.drag-item').length}`);
                
                
                // Resetar as flags de inicialização
                window.dragItemsInitialized = false;
                window.dropZonesInitialized = false;
                
                // Garantir que não haja duplicações após a atualização
                setTimeout(removeDuplicateItems, 100);
                
            } catch (error) {
                console.error('[Diagnóstico] Erro ao processar itens personalizados:', error);
                // Garantir que não haja duplicações mesmo em caso de erro
                setTimeout(removeDuplicateItems, 100);
            }
        }
    }
    
    // Melhorias no feedback para o exercício de arrastar e soltar
    // Verificar se os event listeners já estão configurados para evitar duplicação
    if (!window.dropZonesInitialized) {
        const exerciseDropZones = document.querySelectorAll('.drop-zone');
        if (exerciseDropZones.length > 0) {
            exerciseDropZones.forEach(zone => {
                // Remover handlers antigos
                const newZone = zone.cloneNode(true);
                zone.parentNode.replaceChild(newZone, zone);
                
                newZone.addEventListener('dragover', function(e) {
                    e.preventDefault();
                    this.classList.add('drop-zone-highlight');
                });
                
                newZone.addEventListener('dragleave', function() {
                    this.classList.remove('drop-zone-highlight');
                });
                
                newZone.addEventListener('drop', function(e) {
                    e.preventDefault();
                    this.classList.remove('drop-zone-highlight');
                    
                    if (window.draggedItem) {
                        const itemType = window.draggedItem.getAttribute('data-type');
                        const zoneType = this.getAttribute('data-type');
                        
                        // Remover classes anteriores apenas se o item for colocado no local correto
                        // ou se estiver sendo movido para um novo local
                        if (itemType === zoneType) {
                            window.draggedItem.classList.remove('correct', 'incorrect');
                        }
                        
                        // Permitir que qualquer item seja colocado em qualquer zona
                        window.draggedItem.classList.add('drag-item-dropped');
                        
                        // Adicionar feedback visual
                        if (itemType === zoneType) {
                            // Feedback de correto
                            window.draggedItem.classList.remove('incorrect'); // Remover classe de incorreto se houver
                            window.draggedItem.classList.add('correct');
                            showNotification('Correto!', `${window.draggedItem.textContent} é realmente um ${zoneType === 'hardware' ? 'hardware' : 'software'}!`, 'success');
                            
                            // Para itens corretos, remover o feedback após 2 segundos
                            const currentItem = window.draggedItem;
                            setTimeout(() => {
                                if (currentItem && currentItem.classList) {
                                    currentItem.classList.remove('correct');
                                }
                            }, 2000);
                        } else {
                            // Feedback de incorreto - permanece até ser colocado no local correto
                            window.draggedItem.classList.remove('correct'); // Remover classe de correto se houver
                            window.draggedItem.classList.add('incorrect');
                            // Adicionar classe de animação temporária
                            window.draggedItem.classList.add('pulse-error');
                            // Remover a classe de animação após a animação terminar
                            setTimeout(() => {
                                if (window.draggedItem && window.draggedItem.classList) {
                                    window.draggedItem.classList.remove('pulse-error');
                                }
                            }, 1000); // Duração da animação
                            showNotification('Incorreto!', `${window.draggedItem.textContent} não é um ${zoneType === 'hardware' ? 'hardware' : 'software'}!`, 'error');
                            // Não removemos a classe 'incorrect' com timeout, ela permanece até o item ser colocado no local correto
                        }
                        
                        this.appendChild(window.draggedItem);
                        
                        // Verificar se todos os itens foram colocados
                        checkAllItemsPlaced();
                    }
                });
            });
            // Marcar que os dropZones já foram inicializados
            window.dropZonesInitialized = true;
        }
    }
    
    // Inicializar exercícios do admin na página real
    function initUserExercisesFromAdmin() {
        try {
            console.log("[Diagnóstico] Iniciando função initUserExercisesFromAdmin");
            
            // Marcar que estamos em processo de inicialização
            window.isResettingExercise = true;
            
            // Atualizar exercício de digitação
            const fraseSalva = localStorage.getItem('admin_digitacao_frase');
            if (fraseSalva) {
                const typingText = document.querySelector('.typing-text');
                if (typingText) {
                    typingText.textContent = fraseSalva;
                }
            }
            
            // Atualizar exercício de quiz
            const quizPerguntasString = localStorage.getItem('admin_quiz_perguntas');
            if (quizPerguntasString) {
                try {
                    const perguntasQuiz = JSON.parse(quizPerguntasString);
                    if (Array.isArray(perguntasQuiz) && perguntasQuiz.length > 0) {
                        console.log(`[Diagnóstico] ${perguntasQuiz.length} perguntas de quiz encontradas, atualizando quiz`);
                        
                        // Criar um evento sintético para chamar a função atualizarExercicioQuiz
                        const quizExercise = document.querySelector('.exercise-card:nth-child(2) .quiz-container');
                        if (quizExercise) {
                            const syntheticEvent = {
                                target: {
                                    dataset: {
                                        id: 'exercicios-quiz'  // ID do container do exercício
                                    }
                                }
                            };
                            
                            // Atualizar o exercício de quiz usando o evento sintético
                            atualizarExercicioQuiz(syntheticEvent);
                            
                            // Atualizar também o contador de perguntas visíveis na interface
                            const quizContainer = quizExercise.closest('.exercise-card');
                            if (quizContainer) {
                                // Buscar todos os possíveis elementos de contagem na interface
                                const counterElement = quizContainer.querySelector('.question-counter span.total-questions') || 
                                                      quizContainer.querySelector('.total-questions');
                                
                                // Buscar o contador no título da pergunta (pode ter várias estruturas diferentes)
                                const titleCounterElement = quizContainer.querySelector('.pergunta-counter') || 
                                                            quizExercise.querySelector('.question-counter') ||
                                                            quizContainer.querySelector('.quiz-question-counter');
                                
                                // Buscar também o elemento que mostra o formato "Pergunta X de Y" no canto da tela
                                const questionHeaderElement = document.querySelector('.pergunta-info') || 
                                                             document.querySelector('.quiz-header-counter') ||
                                                             quizContainer.querySelector('.quiz-header span');
                                
                                // Calcular o número real de perguntas visíveis
                                const questoesVisiveis = perguntasQuiz.filter(q => q.visivel === true);
                                // Adicionar as perguntas padrão
                                const totalQuestionsVisible = questoesVisiveis.length || 0;
                                const totalQuestionsAll = totalQuestionsVisible + 4; // 4 é o número de perguntas padrão
                                
                                console.log(`[Diagnóstico] Total de perguntas: ${totalQuestionsAll} (${totalQuestionsVisible} personalizadas + 4 padrão)`);
                                
                                // Atualizar os contadores na interface
                                if (counterElement) {
                                    counterElement.textContent = totalQuestionsAll;
                                    console.log(`[Diagnóstico] Contador de perguntas atualizado para: ${totalQuestionsAll}`);
                                }
                                
                                if (titleCounterElement) {
                                    // Verificar qual formato o contador usa
                                    const currentNum = 1; // Sempre começamos na primeira pergunta
                                    if (titleCounterElement.textContent.includes('de')) {
                                        titleCounterElement.textContent = `Pergunta ${currentNum} de ${totalQuestionsAll}`;
                                    }
                                    console.log(`[Diagnóstico] Contador de título atualizado: Pergunta ${currentNum} de ${totalQuestionsAll}`);
                                }
                                
                                // Atualizar também o possível contador no cabeçalho
                                if (questionHeaderElement) {
                                    questionHeaderElement.textContent = `Pergunta ${1} de ${totalQuestionsAll}`;
                                    console.log(`[Diagnóstico] Contador de cabeçalho atualizado: Pergunta 1 de ${totalQuestionsAll}`);
                                }
                                
                                // Atualizar também a variável global totalQuestions
                                window.totalQuestions = totalQuestionsAll;
                                console.log(`[Diagnóstico] Variável global totalQuestions atualizada para: ${totalQuestionsAll}`);
                                
                                // Força a atualização em todos os elementos que podem mostrar o contador
                                document.querySelectorAll('.total-questions').forEach(el => {
                                    el.textContent = totalQuestionsAll;
                                });
                                
                                // Forçar uma atualização da interface após um pequeno atraso
                                setTimeout(() => {
                                    // Verificar e corrigir a estrutura do quiz
                                    if (typeof verificarEstruturarQuiz === 'function') {
                                        verificarEstruturarQuiz();
                                    }
                                    
                                    // Mostrar a primeira pergunta novamente para atualizar todos os elementos da interface
                                    if (typeof showQuestion === 'function') {
                                        showQuestion(1);
                                    }
                                }, 100);
                            }
                        }
                    }
                } catch (quizError) {
                    console.error('[Diagnóstico] Erro ao processar perguntas do quiz:', quizError);
                }
            }
            
            // Atualizar exercício de arrastar e soltar
            const dragItemsContainer = document.querySelector('.exercise-card .drag-items');
            if (dragItemsContainer) {
                console.log("[Diagnóstico] Container de itens encontrado");
                console.log(`[Diagnóstico] Quantidade de itens antes da inicialização: ${dragItemsContainer.querySelectorAll('.drag-item').length}`);
                
                // Primeiro, verificar se já estamos em um estado de inicialização
                if (window.dragItemsInitialized) {
                    console.log("[Diagnóstico] Itens já foram inicializados, apenas removendo duplicações");
                    removeDuplicateItems();
                    window.isResettingExercise = false;
                    return;
                }
                
                // Verificar se os itens originais estão presentes
                const itemsExistentes = new Set();
                dragItemsContainer.querySelectorAll('.drag-item').forEach(item => {
                    const text = item.textContent.trim();
                    itemsExistentes.add(text);
                    console.log(`[Diagnóstico] Item existente: ${text}`);
                });
                
                // Lista de itens padrão que não devem ser duplicados
                const itensPadrao = ['Mouse', 'Teclado', 'Monitor', 'Word', 'Chrome', 'Excel'];
                
                // Verificar se já existem itens duplicados antes da remoção
                const itemsAntesDuplicacao = new Map();
                const itemsDuplicados = [];
                dragItemsContainer.querySelectorAll('.drag-item').forEach(item => {
                    const text = item.textContent.trim();
                    if (itemsAntesDuplicacao.has(text)) {
                        itemsDuplicados.push(item);
                        console.log(`[Diagnóstico] Duplicação detectada antes da remoção: ${text}`);
                    } else {
                        itemsAntesDuplicacao.set(text, item);
                    }
                });
                
                // Remover apenas itens personalizados antigos, não os originais
                const oldCustomItems = dragItemsContainer.querySelectorAll('.custom-item');
                console.log(`[Diagnóstico] Removendo ${oldCustomItems.length} itens personalizados antigos`);
                oldCustomItems.forEach(item => item.remove());
                
                // Adicionar itens personalizados visíveis
                const itensString = localStorage.getItem('admin_drag_itens');
                if (itensString) {
                    try {
                        const itens = JSON.parse(itensString);
                        
                        if (Array.isArray(itens)) {
                            console.log(`[Diagnóstico] ${itens.length} itens personalizados encontrados no localStorage`);
                            
                            itens.forEach(item => {
                                if (item && item.visivel) {
                                    // Verificar se o item já existe (padrão ou personalizado)
                                    if (!itemsExistentes.has(item.nome) && !itensPadrao.includes(item.nome)) {
                                        console.log(`[Diagnóstico] Adicionando item personalizado: ${item.nome}`);
                                        
                                        const itemEl = document.createElement('div');
                                        itemEl.className = 'drag-item custom-item';
                                        itemEl.setAttribute('draggable', 'true');
                                        itemEl.setAttribute('data-type', item.tipo || 'hardware');
                                        itemEl.textContent = item.nome || 'Item';
                                        
                                        // Configurar eventos de arrastar
                                        itemEl.addEventListener('dragstart', function() {
                                            window.draggedItem = this;
                                            setTimeout(() => {
                                                this.style.opacity = '0.5';
                                            }, 0);
                                        });
                                        
                                        itemEl.addEventListener('dragend', function() {
                                            setTimeout(() => {
                                                this.style.opacity = '1';
                                                window.draggedItem = null;
                                            }, 0);
                                        });
                                        
                                        dragItemsContainer.appendChild(itemEl);
                                        itemsExistentes.add(item.nome);
                                    } else {
                                        console.log(`[Diagnóstico] Item personalizado ${item.nome} não adicionado pois já existe`);
                                    }
                                }
                            });
                        }
                    } catch (parseError) {
                        console.error("[Diagnóstico] Erro ao parsear itens personalizados:", parseError);
                    }
                }
                
                // Marcar que a inicialização foi concluída para evitar duplicações
                window.dragItemsInitialized = true;
                
                // Após adicionar novos itens, resetar a flag de inicialização para permitir 
                // que os event listeners dos dropZones sejam configurados novamente
                window.dropZonesInitialized = false;
                
                console.log(`[Diagnóstico] Quantidade de itens após inicialização: ${dragItemsContainer.querySelectorAll('.drag-item').length}`);
                
                // Garantir que não haja duplicações após a inicialização
                setTimeout(() => {
                    removeDuplicateItems();
                    window.isResettingExercise = false; // Finalizar o estado de inicialização
                }, 200);
            } else {
                console.log("[Diagnóstico] Container de itens não encontrado");
                window.isResettingExercise = false;
            }
        } catch (error) {
            console.error('[Diagnóstico] Erro ao inicializar exercícios do admin:', error);
            window.isResettingExercise = false;
        }
    }

    // Inicializar exercícios personalizados ao carregar a página
    initUserExercisesFromAdmin();

    // Monitorar mudanças na DOM especificamente para a seção de exercícios
    function setupExerciseMonitoring() {
        console.log("[Diagnóstico] Configurando monitoramento dos exercícios");
        const exerciciosSection = document.getElementById('exercicios');
        
        if (!exerciciosSection) {
            console.log("[Diagnóstico] Seção de exercícios não encontrada");
            return;
        }
        
        let isProcessingMutation = false; // Evitar processamento simultâneo de mutações
        
        // Criar um MutationObserver para detectar mudanças na seção de exercícios
        const observer = new MutationObserver((mutations) => {
            // Evitar processamento simultâneo
            if (isProcessingMutation) return;
            isProcessingMutation = true;
            
            // Aguardar um pouco antes de processar para permitir que várias mutações sejam agrupadas
            setTimeout(() => {
                let shouldCheckDuplicates = false;
                
                // Ver se há adições relevantes
                for (const mutation of mutations) {
                    // Verificar se novos nós foram adicionados
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        // Verificar se algum dos nós adicionados é relevante para o exercício de arrastar e soltar
                        for (const node of mutation.addedNodes) {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                if (node.classList && (
                                    node.classList.contains('drag-item') || 
                                    node.classList.contains('drag-items') ||
                                    node.querySelector('.drag-item')
                                )) {
                                    shouldCheckDuplicates = true;
                                    console.log("[Diagnóstico] Detectada adição de elemento relevante para o exercício de arrastar e soltar");
                                    
                                    // Se tivermos muitas mudanças consecutivas, é melhor não processar cada uma individualmente
                                    if (mutations.length > 5) {
                                        console.log(`[Diagnóstico] Detectadas ${mutations.length} mutações, aguardando estabilização`);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                
                if (shouldCheckDuplicates) {
                    // Verificar se não estamos em um processo de reset ou inicialização
                    if (!window.isResettingExercise) {
                        console.log("[Diagnóstico] Executando verificação após detecção de mudanças");
                        
                        // Verificar se há duplicatas, mas não remover itens individuais automaticamente
                        // durante a interação do usuário
                        const dragItemsContainer = document.querySelector('.drag-items');
                        if (dragItemsContainer) {
                            const itemCount = dragItemsContainer.querySelectorAll('.drag-item').length;
                            // Apenas se o número de itens for maior que o esperado (6 itens originais + eventuais personalizados)
                            if (itemCount > 6) {
                                console.log(`[Diagnóstico] Número de itens (${itemCount}) maior que o esperado, removendo duplicações`);
                                setTimeout(removeDuplicateItems, 100);
                            } else {
                                console.log(`[Diagnóstico] Número de itens (${itemCount}) dentro do esperado, ignorando alteração`);
                            }
                        }
                    } else {
                        console.log("[Diagnóstico] Ignorando mutações durante reset/inicialização");
                    }
                }
                
                isProcessingMutation = false;
            }, 200); // Atraso para permitir agrupamento de mutações
        });
        
        // Iniciar observação da seção de exercícios com configurações menos sensíveis
        observer.observe(exerciciosSection, {
            childList: true,
            subtree: true,
            attributes: false, // Não observar mudanças de atributos para reduzir ruído
        });
        
        console.log("[Diagnóstico] Monitoramento configurado com sucesso");
        
        // Verificar imediatamente se há duplicações
        setTimeout(removeDuplicateItems, 500);
    }
    
    // Configurar monitoramento depois que a página estiver completamente carregada
    setTimeout(setupExerciseMonitoring, 1000);

    // Função para calcular a similaridade entre dois textos (0-100%)
    function calculateTextSimilarity(text1, text2) {
        // Se os textos forem idênticos, retorna 100%
        if (text1 === text2) return 100;
        
        // Se algum dos textos estiver vazio, retorna 0%
        if (!text1 || !text2) return 0;
        
        // Algoritmo de distância de Levenshtein para calcular a similaridade
        const len1 = text1.length;
        const len2 = text2.length;
        
        // Criar matriz para armazenar as distâncias
        const matrix = [];
        
        // Inicializar a primeira linha e coluna da matriz
        for (let i = 0; i <= len1; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= len2; j++) {
            matrix[0][j] = j;
        }
        
        // Preencher a matriz de distâncias
        for (let i = 1; i <= len1; i++) {
            for (let j = 1; j <= len2; j++) {
                if (text1[i - 1] === text2[j - 1]) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // substituição
                        matrix[i][j - 1] + 1,     // inserção
                        matrix[i - 1][j] + 1      // remoção
                    );
                }
            }
        }
        
        // Calcular a distância de Levenshtein entre os dois textos
        const distance = matrix[len1][len2];
        
        // Calcular a similaridade (em porcentagem)
        // Quanto menor a distância em relação ao comprimento máximo, maior a similaridade
        const maxLength = Math.max(len1, len2);
        const similarity = Math.round((1 - distance / maxLength) * 100);
        
        return similarity;
    }
    
    // Alerta simples personalizado
    function atualizarExercicioQuiz(event) {
        console.log("[Diagnóstico] Atualizando exercício de quiz");
        const exercicioId = event.target.dataset.id;
        const exercicioDiv = document.getElementById(exercicioId);
        
        if (!exercicioDiv) {
            console.error(`[Diagnóstico] Div do exercício ${exercicioId} não encontrada!`);
            return;
        }

        // Obter questões personalizadas do LocalStorage
        let questoesPersonalizadas = [];
        try {
            const questoesJson = localStorage.getItem('questoes_personalizadas');
            if (questoesJson) {
                questoesPersonalizadas = JSON.parse(questoesJson);
                console.log(`[Diagnóstico] Encontradas ${questoesPersonalizadas.length} questões personalizadas`);
            }
        } catch (error) {
            console.error("[Diagnóstico] Erro ao carregar questões personalizadas:", error);
            questoesPersonalizadas = [];
        }

        // Filtrar apenas questões visíveis
        const questoesVisiveis = questoesPersonalizadas.filter(q => q.visivel === true);
        console.log(`[Diagnóstico] Questões visíveis: ${questoesVisiveis.length}`);
        
        // Atualizar exercício de quiz
        const quizExercise = exercicioDiv.querySelector('.quiz-exercise');
        
        if (!quizExercise) {
            console.error(`[Diagnóstico] Quiz não encontrado em ${exercicioId}!`);
            return;
        }

        const quizContainer = quizExercise.querySelector('.quiz-container');
        if (!quizContainer) {
            console.error(`[Diagnóstico] Container do quiz não encontrado!`);
            return;
        }

        const questionsContainer = quizContainer.querySelector('.quiz-questions');
        if (!questionsContainer) {
            console.error(`[Diagnóstico] Container de questões não encontrado!`);
            return;
        }

        // Limpar container de questões padrão
        questionsContainer.innerHTML = '';
        
        // Inicializar arrays para respostas corretas e explicações
        window.quizCorrectAnswers = {};
        window.quizExplanations = {};
        
        // Adicionar questões personalizadas visíveis
        questoesVisiveis.forEach((questao, index) => {
            const questionNumber = index + 1;
            
            // Criar div para questão
            const questionDiv = document.createElement('div');
            questionDiv.className = 'quiz-question';
            questionDiv.id = `question-${questionNumber}`;
            // Importante: atribuir o atributo data-question para navegação correta
            questionDiv.setAttribute('data-question', questionNumber.toString());
            
            // Adicionar título e pergunta
            questionDiv.innerHTML = `
                <h3>Questão ${questionNumber}</h3>
                <p class="question-text">${questao.pergunta}</p>
                <div class="options">
                    <div class="option quiz-option">
                        <input type="radio" id="q${questionNumber}-a" name="q${questionNumber}" value="a">
                        <label for="q${questionNumber}-a">${questao.alternativaA}</label>
                    </div>
                    <div class="option quiz-option">
                        <input type="radio" id="q${questionNumber}-b" name="q${questionNumber}" value="b">
                        <label for="q${questionNumber}-b">${questao.alternativaB}</label>
                    </div>
                    <div class="option quiz-option">
                        <input type="radio" id="q${questionNumber}-c" name="q${questionNumber}" value="c">
                        <label for="q${questionNumber}-c">${questao.alternativaC}</label>
                    </div>
                    <div class="option quiz-option">
                        <input type="radio" id="q${questionNumber}-d" name="q${questionNumber}" value="d">
                        <label for="q${questionNumber}-d">${questao.alternativaD}</label>
                    </div>
                </div>
            `;
            
            // Adicionar questão ao container
            questionsContainer.appendChild(questionDiv);
            
            // Armazenar resposta correta e explicação
            window.quizCorrectAnswers[questionNumber] = questao.alternativaCorreta;
            window.quizExplanations[questionNumber] = questao.explicacao || `A resposta correta é a opção "${questao.alternativaCorreta}".`;
            
            console.log(`[Diagnóstico] Adicionada questão ${questionNumber}: "${questao.pergunta.substring(0, 30)}..."`);
            console.log(`[Diagnóstico] Resposta correta para questão ${questionNumber}: ${questao.alternativaCorreta}`);
        });
        
        // Atualizar total de questões
        const totalQuestions = questoesVisiveis.length;
        console.log(`[Diagnóstico] Total de questões no quiz: ${totalQuestions}`);
        
        // Atualizar a variável global do total de questões se existir
        if (typeof window.totalQuestions !== 'undefined') {
            window.totalQuestions = totalQuestions;
            console.log(`[Diagnóstico] Variável global totalQuestions atualizada para: ${totalQuestions}`);
        }
        
        // Verificar se há questões
        if (totalQuestions === 0) {
            questionsContainer.innerHTML = '<div class="no-questions"><p>Nenhuma questão personalizada disponível. Configure o quiz no painel de administração.</p></div>';
            console.log("[Diagnóstico] Nenhuma questão visível para mostrar");
        } else {
            // Mostrar primeira questão
            const firstQuestion = questionsContainer.querySelector('.quiz-question');
            if (firstQuestion) {
                firstQuestion.classList.add('active');
                console.log("[Diagnóstico] Primeira questão ativada");
            }
        }
        
        // Atualizar progresso
        const progressBar = quizContainer.querySelector('.progress-bar');
        const progressText = quizContainer.querySelector('.progress-text');
        
        if (progressBar && progressText) {
            if (totalQuestions > 0) {
                progressBar.style.width = '0%';
                progressText.textContent = `0/${totalQuestions}`;
            } else {
                progressBar.style.width = '0%';
                progressText.textContent = '0/0';
            }
            console.log("[Diagnóstico] Progresso reiniciado");
        }
        
        // Reiniciar variáveis do quiz
        if (typeof resetQuiz === 'function') {
            resetQuiz();
            console.log("[Diagnóstico] Quiz reiniciado");
        } else {
            console.error("[Diagnóstico] Função resetQuiz não encontrada");
        }
        
        // Esconder resultados se estiverem visíveis
        const results = quizContainer.querySelector('.quiz-results');
        if (results) {
            results.style.display = 'none';
            console.log("[Diagnóstico] Resultados ocultados");
        }
        
        // Adicionar event listeners nas opções das perguntas recém-criadas
        const quizOptions = quizContainer.querySelectorAll('.quiz-option input[type="radio"]');
        quizOptions.forEach(option => {
            option.addEventListener('change', function() {
                // Habilitar botão de verificar quando uma opção é selecionada
                const checkButton = quizContainer.querySelector('.check-btn');
                if (checkButton) {
                    checkButton.disabled = false;
                }
            });
        });
    }

    // Eventos para tabs do administrador
    document.addEventListener('DOMContentLoaded', function() {
        // Inicializar todas as tabs do administrador
        if (document.querySelector('#admin-exercicios')) {
            // Inicializar gerenciadores de exercícios
            initDigitacaoAdmin();
            initQuizAdmin();
            initDragDropAdmin();
            initRankingAdmin(); // Novo gerenciador de ranking
        }
        
        // Configurar troca de tabs
        const tabButtons = document.querySelectorAll('.admin-tab-btn');
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remover classe active de todas as tabs e conteúdos
                tabButtons.forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.admin-tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                // Adicionar classe active à tab clicada
                this.classList.add('active');
                
                // Mostrar conteúdo correspondente
                const tabId = this.getAttribute('data-tab');
                const tabContent = document.getElementById(tabId + '-tab');
                if (tabContent) {
                    tabContent.classList.add('active');
                    
                    // Se a tab for de ranking, recarregar a tabela
                    if (tabId === 'ranking') {
                        initRankingAdmin();
                    }
                }
            });
        });
    });
    
    // Gerenciador de Ranking de Digitação
    function initRankingAdmin() {
        const searchInput = document.getElementById('ranking-search');
        const searchBtn = document.getElementById('search-ranking-btn');
        const exportBtn = document.getElementById('export-ranking-btn');
        const clearBtn = document.getElementById('clear-ranking-btn');
        const tableBody = document.getElementById('ranking-table-body');
        const rankingFeedback = document.getElementById('ranking-feedback');
        
        // Carregar e exibir o ranking ao abrir a tab
        function loadRanking(filterText = '') {
            // Obter registros do localStorage
            const rankingRecords = JSON.parse(localStorage.getItem('typing_ranking') || '[]');
            
            // Limpar tabela atual
            if (tableBody) {
                tableBody.innerHTML = '';
            } else {
                return;
            }
            
            // Filtrar registros se necessário
            let filteredRecords = rankingRecords;
            if (filterText) {
                const lowerFilter = filterText.toLowerCase();
                filteredRecords = rankingRecords.filter(record => 
                    record.name.toLowerCase().includes(lowerFilter) || 
                    record.email.toLowerCase().includes(lowerFilter)
                );
            }
            
            // Se não houver registros após filtro
            if (filteredRecords.length === 0) {
                const noRecordsRow = document.createElement('tr');
                noRecordsRow.className = 'no-records';
                noRecordsRow.innerHTML = `<td colspan="7">Nenhum registro encontrado${filterText ? ' com o filtro aplicado' : ''}.</td>`;
                tableBody.appendChild(noRecordsRow);
                return;
            }
            
            // Adicionar registros à tabela
            filteredRecords.forEach((record, index) => {
                const row = document.createElement('tr');
                
                // Adicionar classe para destacar os 3 primeiros lugares
                if (index < 3) {
                    row.className = `position-${index + 1}`;
                }
                
                // Formatar data do registro
                const recordDate = new Date(record.date);
                const formattedDate = recordDate.toLocaleDateString('pt-BR') + ' ' + 
                                     recordDate.toLocaleTimeString('pt-BR');
                
                // Formatar data de aniversário
                const birthday = new Date(record.birthday);
                const formattedBirthday = birthday.toLocaleDateString('pt-BR');
                
                row.innerHTML = `
                    <td class="position-cell">${index + 1}º</td>
                    <td>${record.name}</td>
                    <td>${record.email}</td>
                    <td>${formattedBirthday}</td>
                    <td class="time-cell">${record.timeFormatted}</td>
                    <td>${formattedDate}</td>
                    <td class="action-cell">
                        <button class="delete-record" data-id="${record.id}" title="Excluir registro">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                `;
                
                tableBody.appendChild(row);
            });
            
            // Adicionar eventos aos botões de excluir
            const deleteButtons = tableBody.querySelectorAll('.delete-record');
            deleteButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const recordId = this.getAttribute('data-id');
                    if (recordId && confirm('Tem certeza que deseja excluir este registro?')) {
                        deleteRankingRecord(recordId);
                    }
                });
            });
        }
        
        // Excluir um registro específico
        function deleteRankingRecord(recordId) {
            // Obter registros atuais
            const rankingRecords = JSON.parse(localStorage.getItem('typing_ranking') || '[]');
            
            // Filtrar para remover o registro com o ID fornecido
            const updatedRecords = rankingRecords.filter(record => record.id !== recordId);
            
            // Salvar de volta ao localStorage
            localStorage.setItem('typing_ranking', JSON.stringify(updatedRecords));
            
            // Recarregar tabela
            loadRanking(searchInput ? searchInput.value.trim() : '');
            
            // Feedback
            if (rankingFeedback) {
                rankingFeedback.textContent = 'Registro excluído com sucesso.';
                rankingFeedback.className = 'admin-feedback success';
                
                // Limpar feedback após 3 segundos
                setTimeout(() => {
                    rankingFeedback.textContent = '';
                    rankingFeedback.className = 'admin-feedback';
                }, 3000);
            }
            
            showNotification('Sucesso', 'Registro excluído do ranking.', 'success');
        }
        
        // Limpar todo o ranking
        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                if (confirm('ATENÇÃO: Tem certeza que deseja excluir TODOS os registros do ranking? Esta ação não pode ser desfeita.')) {
                    // Limpar o localStorage
                    localStorage.removeItem('typing_ranking');
                    
                    // Recarregar tabela
                    loadRanking();
                    
                    // Feedback
                    if (rankingFeedback) {
                        rankingFeedback.textContent = 'Todos os registros foram excluídos.';
                        rankingFeedback.className = 'admin-feedback success';
                    }
                    
                    showNotification('Sucesso', 'Ranking de digitação limpo completamente.', 'success');
                }
            });
        }
        
        // Pesquisar registros
        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', function() {
                const searchTerm = searchInput.value.trim();
                loadRanking(searchTerm);
            });
            
            // Pesquisar também ao pressionar Enter
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    const searchTerm = searchInput.value.trim();
                    loadRanking(searchTerm);
                }
            });
        }
        
        // Exportar ranking para CSV
        if (exportBtn) {
            exportBtn.addEventListener('click', function() {
                // Obter registros
                const rankingRecords = JSON.parse(localStorage.getItem('typing_ranking') || '[]');
                
                if (rankingRecords.length === 0) {
                    showNotification('Atenção', 'Não há registros para exportar.', 'warning');
                    return;
                }
                
                // Criar conteúdo CSV
                let csvContent = 'Posição,Nome,Email,Data de Aniversário,Tempo,Data do Registro\n';
                
                rankingRecords.forEach((record, index) => {
                    // Formatar data do registro
                    const recordDate = new Date(record.date);
                    const formattedDate = recordDate.toLocaleDateString('pt-BR') + ' ' + 
                                         recordDate.toLocaleTimeString('pt-BR');
                    
                    // Formatar data de aniversário
                    const birthday = new Date(record.birthday);
                    const formattedBirthday = birthday.toLocaleDateString('pt-BR');
                    
                    // Adicionar linha ao CSV
                    csvContent += `${index + 1},"${record.name}","${record.email}","${formattedBirthday}","${record.timeFormatted}","${formattedDate}"\n`;
                });
                
                // Criar link de download
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const downloadLink = document.createElement('a');
                
                // Configurar link
                downloadLink.href = url;
                downloadLink.setAttribute('download', `ranking_digitacao_${new Date().toISOString().slice(0, 10)}.csv`);
                downloadLink.style.display = 'none';
                
                // Adicionar à página, clicar e remover
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                URL.revokeObjectURL(url);
                
                showNotification('Download iniciado', 'O ranking está sendo exportado para CSV.', 'success');
            });
        }
        
        // Carregar ranking inicialmente
        loadRanking();
    }
}); 
