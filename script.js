// Esperar que o DOM seja completamente carregado
document.addEventListener('DOMContentLoaded', function() {
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
    function showQuestion(questionNumber) {
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
                showQuestion(currentQuestion);
            }
        });
    }

    // Configurar evento do botão "Próxima" do quiz
    if (quizNext) {
        quizNext.addEventListener('click', function() {
            if (currentQuestion < quizQuestions.length) {
                currentQuestion++;
                showQuestion(currentQuestion);
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
            showQuestion(currentQuestion);
        });
    }

    // Inicializar o quiz
    if (quizQuestions.length > 0) {
        showQuestion(currentQuestion);
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
    // 1. Exercício de digitação
    const typingTexts = document.querySelectorAll('.typing-text');
    const typingInputs = document.querySelectorAll('.typing-input');
    const checkBtns = document.querySelectorAll('.check-btn');
    const exerciseFeedbacks = document.querySelectorAll('.exercise-feedback');

    // Verificar texto digitado
    checkBtns.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            const closestTypingText = this.closest('.exercise-card').querySelector('.typing-text');
            const closestTypingInput = this.closest('.exercise-card').querySelector('.typing-input');
            const closestFeedback = this.closest('.exercise-card').querySelector('.exercise-feedback');
            
            if (closestTypingText && closestTypingInput && closestFeedback) {
                const expectedText = closestTypingText.textContent.trim();
                const typedText = closestTypingInput.value.trim();
                
                if (typedText === '') {
                    closestFeedback.textContent = 'Por favor, digite o texto!';
                    closestFeedback.className = 'exercise-feedback feedback-error';
                } else if (typedText === expectedText) {
                    closestFeedback.textContent = 'Parabéns! Você digitou corretamente.';
                    closestFeedback.className = 'exercise-feedback feedback-success';
                } else {
                    closestFeedback.textContent = 'O texto digitado não corresponde ao esperado. Tente novamente!';
                    closestFeedback.className = 'exercise-feedback feedback-error';
                }
            }

            // Para o quiz
            const closestQuiz = this.closest('.quiz-container');
            if (closestQuiz) {
                const selectedOption = closestQuiz.querySelector('input[name="quiz1"]:checked');
                const quizFeedback = closestQuiz.querySelector('.quiz-feedback');
                
                if (!selectedOption) {
                    quizFeedback.textContent = 'Por favor, selecione uma opção!';
                    quizFeedback.className = 'quiz-feedback feedback-error';
                } else if (selectedOption.value === 'c') { // Resposta correta é 'Teclado'
                    quizFeedback.textContent = 'Correto! O teclado é um dispositivo de entrada.';
                    quizFeedback.className = 'quiz-feedback feedback-success';
                } else {
                    quizFeedback.textContent = 'Incorreto. Tente novamente!';
                    quizFeedback.className = 'quiz-feedback feedback-error';
                }
            }
        });
    });

    // Exercício 2: Quiz de Conhecimentos (Versão expandida)
    const quizExercise = document.querySelector('.exercise-card:nth-child(2) .quiz-container');
    if (quizExercise) {
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
        
        // Função para mostrar uma pergunta específica
        function showQuestion(questionNumber) {
            // Ocultar todas as perguntas
            quizQuestions.forEach(question => {
                question.classList.remove('active');
            });
            
            // Mostrar a pergunta atual
            const questionToShow = quizExercise.querySelector(`.quiz-question[data-question="${questionNumber}"]`);
            if (questionToShow) {
                questionToShow.classList.add('active');
                currentQuestion = questionNumber;
                
                // Atualizar contador de perguntas
                currentQuestionSpan.textContent = currentQuestion;
                
                // Atualizar barra de progresso
                const progressPercent = ((currentQuestion - 1) / (totalQuestions - 1)) * 100;
                progressBar.style.setProperty('--progress', `${progressPercent}%`);
                
                // Atualizar estado dos botões de navegação
                prevBtn.disabled = currentQuestion <= 1;
                nextBtn.disabled = currentQuestion >= totalQuestions;
                
                // Restaurar estado do botão de verificar
                checkBtn.textContent = "Verificar";
                checkBtn.classList.remove('verified');
                
                // Limpar feedback
                quizFeedback.innerHTML = '';
                
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
                                quizFeedback.innerHTML = `<p class="feedback-success">Resposta correta! ${explanations[currentQuestion]}</p>`;
                            } else {
                                option.parentElement.classList.add('incorrect');
                                const correctOption = questionToShow.querySelector(`input[value="${correctAnswers[currentQuestion]}"]`);
                                correctOption.parentElement.classList.add('correct');
                                quizFeedback.innerHTML = `<p class="feedback-error">Resposta incorreta. ${explanations[currentQuestion]}</p>`;
                            }
                        }
                    });
                    
                    // Mudar o botão para "Próxima" se não for a última pergunta
                    if (currentQuestion < totalQuestions) {
                        checkBtn.textContent = "Próxima";
                        checkBtn.classList.add('verified');
                    } else {
                        checkBtn.textContent = "Ver Resultados";
                        checkBtn.classList.add('verified');
                    }
                }
            }
        }
        
        // Função para verificar a resposta da pergunta atual
        function checkAnswer() {
            const currentQuestionElement = quizExercise.querySelector(`.quiz-question.active`);
            const options = currentQuestionElement.querySelectorAll('input[type="radio"]');
            let selectedOption = null;
            
            // Verificar qual opção foi selecionada
            options.forEach(option => {
                if (option.checked) {
                    selectedOption = option.value;
                }
            });
            
            // Se nenhuma opção foi selecionada
            if (!selectedOption) {
                quizFeedback.innerHTML = '<p class="feedback-error">Por favor, selecione uma opção!</p>';
                return false;
            }
            
            // Salvar a resposta do usuário
            userAnswers[currentQuestion] = selectedOption;
            
            // Verificar se a resposta está correta
            const isCorrect = selectedOption === correctAnswers[currentQuestion];
            
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
            
            // Exibir feedback
            if (isCorrect) {
                quizFeedback.innerHTML = `<p class="feedback-success">Resposta correta! ${explanations[currentQuestion]}</p>`;
            } else {
                quizFeedback.innerHTML = `<p class="feedback-error">Resposta incorreta. ${explanations[currentQuestion]}</p>`;
            }
            
            // Verificar próximos passos
            if (currentQuestion < totalQuestions) {
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
            // Calcular pontuação
            let correctCount = 0;
            let resultsHTML = '';
            
            for (let i = 1; i <= totalQuestions; i++) {
                const userAnswer = userAnswers[i] || null;
                const isCorrect = userAnswer === correctAnswers[i];
                
                if (isCorrect) correctCount++;
                
                // Criar item para o resumo dos resultados
                resultsHTML += `
                    <div class="result-item ${isCorrect ? 'correct' : 'incorrect'}">
                        <div class="result-icon">
                            <i class="fas ${isCorrect ? 'fa-check' : 'fa-times'}"></i>
                        </div>
                        <div class="result-text">
                            <p><strong>Pergunta ${i}:</strong> ${quizExercise.querySelector(`.quiz-question[data-question="${i}"] > p`).textContent}</p>
                            ${!isCorrect ? `<p>Sua resposta estava incorreta. ${explanations[i]}</p>` : ''}
                        </div>
                    </div>
                `;
            }
            
            // Atualizar pontuação e detalhes
            quizScore.textContent = `${correctCount}/${totalQuestions}`;
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
            quizQuestions.forEach(question => {
                const options = question.querySelectorAll('input[type="radio"]');
                options.forEach(option => {
                    option.checked = false;
                    option.disabled = false;
                    option.parentElement.classList.remove('selected', 'correct', 'incorrect');
                });
            });
            
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
            if (currentQuestion < totalQuestions) {
                showQuestion(currentQuestion + 1);
            }
        });
        
        // Evento para o botão de verificar/próxima
        checkBtn.addEventListener('click', function() {
            if (this.classList.contains('verified')) {
                // Se já verificou, avance para próxima pergunta ou mostre resultados
                if (currentQuestion < totalQuestions) {
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
        
        // Inicializar o quiz
        showQuestion(1);
    }

    // Arrastar e soltar
    const dragItems = document.querySelectorAll('.drag-item');
    const dropZones = document.querySelectorAll('.drop-zone');
    const resetBtn = document.querySelector('.reset-btn');
    let draggedItem = null;

    // Configurar eventos de arrastar
    dragItems.forEach(item => {
        item.addEventListener('dragstart', function() {
            draggedItem = this;
            setTimeout(() => {
                this.style.opacity = '0.5';
            }, 0);
        });

        item.addEventListener('dragend', function() {
            setTimeout(() => {
                this.style.opacity = '1';
                draggedItem = null;
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

            if (draggedItem) {
                const itemType = draggedItem.getAttribute('data-type');
                const zoneType = this.getAttribute('data-type');

                if (itemType === zoneType) {
                    // Item correto
                    draggedItem.classList.add('drag-item-dropped');
                    this.appendChild(draggedItem);
                    
                    // Verificar se todos os itens foram colocados
                    checkAllItemsPlaced();
                } else {
                    // Item incorreto
                    alertaSimples('Item colocado na categoria errada!', 'error');
                    draggedItem.style.opacity = '1';
                }
            }
        });
    });

    // Verificar se todos os itens foram colocados corretamente
    function checkAllItemsPlaced() {
        const hardwareZone = document.querySelector('.drop-zone[data-type="hardware"]');
        const softwareZone = document.querySelector('.drop-zone[data-type="software"]');
        const exerciseFeedback = document.querySelector('.drag-container').nextElementSibling;
        
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
            const dragItems = document.querySelectorAll('.drag-item');
            const dragItemsContainer = document.querySelector('.drag-items');
            const exerciseFeedback = document.querySelector('.drag-container').nextElementSibling;
            
            dragItems.forEach(item => {
                item.classList.remove('drag-item-dropped');
                dragItemsContainer.appendChild(item);
            });
            
            if (exerciseFeedback) {
                exerciseFeedback.className = 'exercise-feedback';
                exerciseFeedback.textContent = '';
            }
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
    const adminNavBtn = document.querySelector('.nav-btn.admin-only');
    const adminLoggedIndicator = document.querySelector('.admin-logged-indicator');
    
    // Constantes de autenticação
    const ADMIN_EMAIL = 'admin@digitalx.com';
    const ADMIN_PASSWORD = 'adminx1515';
    
    // Verificar se o admin já está logado (pelo localStorage)
    function checkAdminLogin() {
        const isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
        if (isAdminLoggedIn) {
            adminNavBtn.style.display = 'inline-block';
            adminLoggedIndicator.style.display = 'block';
        }
    }
    
    // Chamar verificação ao carregar a página
    checkAdminLogin();
    
    // Detectar combinação de teclas Ctrl + \
    document.addEventListener('keydown', function(event) {
        // Verificar se Ctrl + \ foi pressionado (keyCode 220 é a barra invertida \)
        if (event.ctrlKey && event.keyCode === 220) {
            event.preventDefault();
            openAdminLoginModal();
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
            adminNavBtn.style.display = 'inline-block';
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
        adminNavBtn.style.display = 'none';
        adminLoggedIndicator.style.display = 'none';
        
        // Se estiver na seção de plano de aula, redirecionar para o início
        if (document.getElementById('plano-aula').classList.contains('active-section')) {
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
}); 
