// =====================
// Módulo da Interface do Usuário do Jogo
// =====================

(function(global) {
    /**
     * Classe GameUI
     * Interface do usuário e controle do jogo
     */
    class GameUI {
        constructor() {
            console.log('Inicializando GameUI...');
            try {
                this.elements = this.getElements();
                this.game = new RepairGame();
                this.setupEventListeners();
                this.updateDisplay();
            } catch (error) {
                console.error('Erro ao inicializar GameUI:', error);
            }
        }

        getElements() {
            const elements = {
                // Controles
                startButton: document.getElementById('startButton'),
                pauseButton: document.getElementById('pauseButton'),
                resetButton: document.getElementById('resetButton'),
                backToMenuButton: document.getElementById('backToMenuButton'),
                
                // Estatísticas
                timer: document.getElementById('timer'),
                robotCount: document.getElementById('robotCount'),
                repairedCount: document.getElementById('repairedCount'),
                componentsCount: document.getElementById('componentsCount'),
                
                // Área de jogo
                robotList: document.getElementById('robotList'),
                currentRobot: document.getElementById('currentRobot'),
                componentStack: document.getElementById('componentStack'),
                codeInput: document.getElementById('codeInput'),
                repairButton: document.getElementById('repairButton'),
                
                // Modal de Game Over
                gameOverModal: document.getElementById('gameOverModal'),
                finalStats: document.getElementById('finalStats'),
                playerName: document.getElementById('playerName'),
                saveScore: document.getElementById('saveScore'),
                ranking: document.getElementById('ranking'),
                closeModal: document.getElementById('closeModal')
            };

            // Verificar se todos os elementos foram encontrados
            for (const [key, element] of Object.entries(elements)) {
                if (!element) {
                    console.error(`Elemento não encontrado: ${key}`);
                    throw new Error(`Elemento DOM não encontrado: ${key}`);
                }
            }

            return elements;
        }

        setupEventListeners() {
            console.log('Configurando event listeners...');
            const {
                startButton, pauseButton, resetButton, codeInput, repairButton,
                saveScore, closeModal, playerName, backToMenuButton
            } = this.elements;

            // Controles do jogo
            if (startButton) startButton.addEventListener('click', () => this.handleStart());
            if (pauseButton) pauseButton.addEventListener('click', () => this.handlePause());
            if (resetButton) resetButton.addEventListener('click', () => this.handleReset());
            if (repairButton) repairButton.addEventListener('click', () => this.handleRepair());
            if (codeInput) codeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleRepair();
            });
            if (closeModal) closeModal.addEventListener('click', () => this.hideGameOverModal());
            if (saveScore) saveScore.addEventListener('click', () => this.handleSaveScore());
            if (backToMenuButton) backToMenuButton.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
            // Teclas de atalho
            document.addEventListener('keydown', (e) => this.handleKeyPress(e));
            console.log('Event listeners configurados com sucesso!');
        }

        handleStart() {
            if (this.game.gameState === 'stopped' || this.game.gameState === 'gameOver') {
                this.game.startGame();
                this.elements.startButton.disabled = true;
                this.elements.pauseButton.disabled = false;
                this.elements.codeInput.disabled = false;
                this.elements.repairButton.disabled = false;
            } else if (this.game.gameState === 'paused') {
                this.game.resumeGame();
                this.elements.startButton.textContent = 'Iniciar Jogo';
                this.elements.pauseButton.disabled = false;
            }
        }

        handlePause() {
            if (this.game.gameState === 'running') {
                this.game.pauseGame();
                this.elements.startButton.disabled = false;
                this.elements.startButton.textContent = 'Retomar';
                this.elements.pauseButton.disabled = true;
                this.elements.codeInput.disabled = true;
                this.elements.repairButton.disabled = true;
            }
        }

        handleReset() {
            this.game.resetGame();
            this.elements.startButton.disabled = false;
            this.elements.startButton.textContent = 'Iniciar Jogo';
            this.elements.pauseButton.disabled = true;
            this.elements.codeInput.disabled = true;
            this.elements.repairButton.disabled = true;
            this.elements.codeInput.value = '';
            this.hideGameOverModal();
        }

        handleRepair() {
            const code = this.elements.codeInput.value.trim().toUpperCase();
            if (!code) return;

            const result = this.game.repairComponent(code);
            
            if (result.success) {
                this.elements.codeInput.value = '';
                this.elements.codeInput.focus();
            } else {
                this.elements.codeInput.select();
            }
        }

        handleRobotSelect(robotId) {
            this.game.selectRobot(robotId);
            this.elements.codeInput.focus();
        }

        handleKeyPress(e) {
            // Tecla ESC para pausar/retomar
            if (e.key === 'Escape') {
                if (this.game.gameState === 'running') {
                    this.handlePause();
                } else if (this.game.gameState === 'paused') {
                    this.handleStart();
                }
            }
            
            // Tecla R para resetar (Ctrl+R)
            if (e.key === 'r' && e.ctrlKey) {
                e.preventDefault();
                this.handleReset();
            }
        }

        updateDisplay() {
            this.updateStats();
            this.updateRobotList();
            this.updateCurrentRobot();
            this.updateComponentStack();
        }

        updateStats() {
            const stats = this.game.getCurrentStats();
            
            this.elements.timer.textContent = this.game.getFormattedTime();
            this.elements.robotCount.textContent = stats.robotsInQueue;
            this.elements.repairedCount.textContent = stats.robotsRepaired;
            this.elements.componentsCount.textContent = stats.componentsRepaired;
        }

        updateRobotList() {
            const robots = this.game.getAllRobots();
            const container = this.elements.robotList;
            
            container.innerHTML = '';
            
            if (robots.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: #ccc;">Nenhum robô na oficina</p>';
                return;
            }

            robots.forEach(robot => {
                const robotCard = this.createRobotCard(robot);
                container.appendChild(robotCard);
            });
        }

        createRobotCard(robot) {
            const card = document.createElement('div');
            card.className = `robot-card ${robot.priority}`;
            card.onclick = () => this.handleRobotSelect(robot.id);
            
            if (this.game.currentRobot && this.game.currentRobot.id === robot.id) {
                card.classList.add('selected');
            }

            const priorityLabel = {
                'emergency': 'Emergência',
                'standard': 'Padrão',
                'low': 'Baixo Risco'
            };

            card.innerHTML = `
                <div class="robot-info">
                    <div class="robot-name">${robot.model}</div>
                    <div class="robot-priority priority-${robot.priority}">
                        ${priorityLabel[robot.priority]}
                    </div>
                </div>
                <div class="robot-components">
                    <div>ID: ${robot.id}</div>
                    <div>Componentes: ${robot.getRemainingComponentCount()}</div>
                    <div>Tempo estimado: ${robot.getEstimatedRepairTime()}s</div>
                </div>
            `;

            return card;
        }

        updateCurrentRobot() {
            const container = this.elements.currentRobot;
            
            if (!this.game.currentRobot) {
                container.innerHTML = '<p>Selecione um robô para começar o reparo</p>';
                return;
            }

            const robot = this.game.currentRobot;
            container.innerHTML = `
                <div style="text-align: left;">
                    <h3>🤖 ${robot.model}</h3>
                    <p><strong>ID:</strong> ${robot.id}</p>
                    <p><strong>Prioridade:</strong> ${robot.priority}</p>
                    <p><strong>Componentes restantes:</strong> ${robot.getRemainingComponentCount()}</p>
                    <p><strong>Tempo estimado:</strong> ${robot.getEstimatedRepairTime()}s</p>
                </div>
            `;
        }

        updateComponentStack() {
            const container = this.elements.componentStack;
            
            if (!this.game.currentRobot) {
                container.innerHTML = '<p style="text-align: center; color: #ccc;">Selecione um robô para ver os componentes</p>';
                return;
            }

            const components = this.game.currentRobot.getRemainingComponents();
            
            if (components.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: #00ff88;">✅ Todos os componentes foram reparados!</p>';
                return;
            }

            container.innerHTML = '<h4>Componentes para Reparo:</h4>';
            
            components.forEach((component, index) => {
                const componentDiv = document.createElement('div');
                componentDiv.className = `component-item ${index === 0 ? 'current' : ''}`;
                
                componentDiv.innerHTML = `
                    <div class="component-name">${component.name}</div>
                    <div class="component-code">Código: ${component.code}</div>
                    <div class="component-time">Tempo de reparo: ${component.repairTime}s</div>
                    ${index === 0 ? '<div style="color: #00ff88; font-weight: bold; margin-top: 5px;">👆 PRÓXIMO</div>' : ''}
                `;
                
                container.appendChild(componentDiv);
            });
        }

        showMessage(message, type = 'info', duration = 3000) {
            // Remover mensagem anterior se existir
            this.clearMessage();

            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${type}`;
            messageDiv.textContent = message;
            // CSS removido daqui. Estilos agora estão em style.css

            document.body.appendChild(messageDiv);

            this.messageTimeout = setTimeout(() => {
                messageDiv.classList.add('slideOut'); // Adiciona classe para animação de saída
                setTimeout(() => {
                    if (messageDiv.parentNode) {
                        messageDiv.parentNode.removeChild(messageDiv);
                    }
                }, 300);
            }, duration);
        }

        showSuccessMessage(message) {
            this.showMessage(message, 'success');
        }

        showErrorMessage(message) {
            this.showMessage(message, 'error');
        }

        clearMessage() {
            if (this.messageTimeout) {
                clearTimeout(this.messageTimeout);
                this.messageTimeout = null;
            }
            
            const existingMessage = document.querySelector('.message');
            if (existingMessage) {
                existingMessage.parentNode.removeChild(existingMessage);
            }
        }

        showGameOverModal() {
            this.elements.gameOverModal.style.display = 'block';
            this.updateFinalStats();
            this.updateRankingDisplay();
        }

        hideGameOverModal() {
            this.elements.gameOverModal.style.display = 'none';
            this.elements.playerName.value = '';
        }

        updateFinalStats() {
            const stats = this.game.getCurrentStats();
            const score = this.game.calculateScore();
            
            this.elements.finalStats.innerHTML = `
                <div><strong>🤖 Robôs Reparados:</strong> ${stats.robotsRepaired}</div>
                <div><strong>🔧 Componentes Reparados:</strong> ${stats.componentsRepaired}</div>
                <div><strong>⏱️ Tempo Total:</strong> ${this.game.getFormattedTime()}</div>
                <div><strong>🏆 Pontuação:</strong> ${score} pontos</div>
            `;
        }

        updateRankingDisplay() {
            const rankings = this.game.getRankings();
            const container = this.elements.ranking;
            
            container.innerHTML = '<h3>🏆 Ranking de Jogadores</h3>';
            
            if (rankings.length === 0) {
                container.innerHTML += '<p>Nenhuma pontuação salva ainda.</p>';
                return;
            }

            rankings.forEach((score, index) => {
                const rankingItem = document.createElement('div');
                rankingItem.className = 'ranking-item';
                
                rankingItem.innerHTML = `
                    <div>
                        <strong>#${index + 1} ${score.name}</strong><br>
                        <small>${score.robotsRepaired} robôs • ${score.gameTime}s • ${score.date}</small>
                    </div>
                    <div><strong>${score.score}</strong></div>
                `;
                
                container.appendChild(rankingItem);
            });
        }

        handleSaveScore() {
            const playerName = this.elements.playerName.value.trim();
            
            if (!playerName) {
                this.showErrorMessage('Digite seu nome para salvar a pontuação');
                return;
            }

            if (this.game.saveScore(playerName)) {
                this.showSuccessMessage('Pontuação salva com sucesso!');
                this.updateRankingDisplay();
                this.elements.playerName.value = '';
                // Salva o ranking atualizado no localStorage
                try {
                    const rankings = this.game.getRankings();
                    localStorage.setItem('robot_repair_rankings', JSON.stringify(rankings));
                } catch (e) {
                    console.error('Erro ao salvar ranking no localStorage:', e);
                }
            } else {
                this.showErrorMessage('Erro ao salvar pontuação');
            }
        }

        showGameOver(reason, stats) {
            setTimeout(() => {
                this.showGameOverModal();
                this.showMessage(`Fim de Jogo: ${reason}`, 'error', 5000);
                
                // Desabilitar controles
                this.elements.startButton.disabled = false;
                this.elements.startButton.textContent = 'Iniciar Jogo';
                this.elements.pauseButton.disabled = true;
                this.elements.codeInput.disabled = true;
                this.elements.repairButton.disabled = true;
            }, 1000);
        }
    }

    // Exporta para o escopo global
    global.GameUI = GameUI;

    // Inicialização automática ao carregar a página
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.gameUI) {
            window.gameUI = new GameUI();
        }
    });

})(typeof window !== 'undefined' ? window : globalThis);

// Remove qualquer referência global antiga de Game
window.Game = undefined;
window.game = undefined;

// Prevenir fechamento acidental da página durante o jogo
window.addEventListener('beforeunload', (e) => {
    if (window.gameUI && window.gameUI.game.gameState === 'running') {
        e.preventDefault();
        e.returnValue = 'Tem certeza que deseja sair? O progresso do jogo será perdido.';
        return e.returnValue;
    }
});

// Log global para debug
window.addEventListener('error', (e) => {
    console.error('Erro JavaScript:', e.error);
});
