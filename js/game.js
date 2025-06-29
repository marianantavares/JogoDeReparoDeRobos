// =====================
// Módulo do Jogo de Reparo de Robôs
// =====================

(function(global) {
    /**
     * Classe RepairGame
     * Gerencia toda a lógica do jogo, fila de robôs (lista encadeada), estatísticas e ranking
     */
    class RepairGame {
        constructor() {
            this.robotQueue = new LinkedList(); // Lista encadeada de robôs
            this.currentRobot = null;
            this.gameState = 'stopped'; // stopped, running, paused, gameOver
            this.startTime = null;
            this.pausedTime = 0;
            this.totalPausedDuration = 0;
            
            // Configurações do jogo
            this.maxRobotsInWorkshop = 8; // Limite máximo de robôs na oficina
            this.robotSpawnInterval = 8000; // Intervalo para chegada de novos robôs (ms) - AJUSTADO PARA 8s
            this.spawnTimer = null;
            
            // Estatísticas
            this.stats = {
                robotsRepaired: 0,
                componentsRepaired: 0,
                totalGameTime: 0,
                robotsLost: 0 // Robôs que não foram atendidos a tempo
            };

            // Rankings salvos no localStorage
            this.rankings = this.loadRankings();
            
            // Timer para atualização da interface
            this.uiUpdateInterval = null;
        }

        // Iniciar o jogo
        startGame() {
            if (this.gameState === 'running') return;

            this.gameState = 'running';
            this.startTime = Date.now() - this.totalPausedDuration;

            // Limpar estatísticas se for um novo jogo
            if (this.robotQueue.isEmpty()) {
                this.resetStats();
            }

            // Iniciar spawn de robôs
            this.startRobotSpawning();
            // Iniciar atualização da interface
            this.startUIUpdates();

            // Gerar apenas 1 robô inicial
            if (this.robotQueue.isEmpty()) {
                const newRobot = RobotFactory.createRandomRobot();
                this.robotQueue.append(newRobot);
            }

            this.notifyGameStateChange('Jogo iniciado!');
            this.notifyUIUpdate();
        }

        // Pausar o jogo
        pauseGame() {
            if (this.gameState !== 'running') return;

            this.gameState = 'paused';
            this.pausedTime = Date.now();
            
            // Parar spawning de robôs
            this.stopRobotSpawning();
            
            // Parar atualizações da interface
            this.stopUIUpdates();

            this.notifyGameStateChange('Jogo pausado');
        }

        // Retomar o jogo
        resumeGame() {
            if (this.gameState !== 'paused') return;

            this.gameState = 'running';
            this.totalPausedDuration += Date.now() - this.pausedTime;
            
            // Retomar spawning de robôs
            this.startRobotSpawning();
            
            // Retomar atualizações da interface
            this.startUIUpdates();

            this.notifyGameStateChange('Jogo retomado!');
        }

        // Reiniciar o jogo
        resetGame() {
            this.stopGame();
            this.robotQueue.clear();
            this.currentRobot = null;
            this.resetStats();
            this.totalPausedDuration = 0;
            this.pausedTime = 0;
            
            this.notifyGameStateChange('Jogo reiniciado');
            this.notifyUIUpdate();
        }

        // Parar o jogo
        stopGame() {
            this.gameState = 'stopped';
            this.stopRobotSpawning();
            this.stopUIUpdates();
        }

        // Finalizar jogo (Game Over)
        endGame(reason = 'Limite de robôs excedido') {
            this.gameState = 'gameOver';
            this.stopRobotSpawning();
            this.stopUIUpdates();
            this.robotQueue.clear(); // Limpa a fila de robôs ao finalizar o jogo
            this.stats.totalGameTime = this.getElapsedTime();
            
            this.notifyGameOver(reason);
        }

        // Gerar novo robô na oficina
        spawnNewRobot() {
            if (this.gameState !== 'running') return;

            // Verificar limite de robôs
            if (this.robotQueue.getSize() >= this.maxRobotsInWorkshop) {
                this.endGame('Oficina lotada! Muitos robôs aguardando reparo.');
                return;
            }

            const newRobot = RobotFactory.createRandomRobot();
            this.robotQueue.append(newRobot);
            
            this.notifyNewRobot(newRobot);
            this.notifyUIUpdate();
        }

        // Selecionar robô para reparo
        selectRobot(robotId) {
            const robotData = this.robotQueue.findBy(robot => robot.id === robotId);
            
            if (robotData) {
                this.currentRobot = robotData.data;
                this.currentRobot.startRepair();
                this.notifyRobotSelected(this.currentRobot);
                this.notifyUIUpdate();
                return true;
            }
            
            return false;
        }

        // Tentar reparar componente do robô atual
        repairComponent(inputCode) {
            if (!this.currentRobot || this.gameState !== 'running') {
                return { success: false, message: 'Nenhum robô selecionado ou jogo pausado' };
            }

            const result = this.currentRobot.repairNextComponent(inputCode);
            
            if (result.success) {
                this.stats.componentsRepaired++;
                this.notifyComponentRepaired(result.component);
                
                // Verificar se o robô foi completamente reparado
                if (this.currentRobot.isFullyRepaired()) {
                    this.completeRobotRepair();
                }
            } else {
                this.notifyRepairFailed(result.message);
            }

            this.notifyUIUpdate();
            return result;
        }

        // Completar reparo de um robô
        completeRobotRepair() {
            if (!this.currentRobot) return;

            this.stats.robotsRepaired++;
            
            // Remover robô da lista
            this.robotQueue.remove(this.currentRobot);
            
            this.notifyRobotCompleted(this.currentRobot);
            
            // Limpar seleção atual
            this.currentRobot = null;
            
            this.notifyUIUpdate();
        }

        // Obter todos os robôs na fila
        getAllRobots() {
            return this.robotQueue.toArray();
        }

        // Obter robô por ID
        getRobotById(id) {
            const result = this.robotQueue.findBy(robot => robot.id === id);
            return result ? result.data : null;
        }

        // Obter estatísticas atuais
        getCurrentStats() {
            return {
                ...this.stats,
                currentGameTime: this.getElapsedTime(),
                robotsInQueue: this.robotQueue.getSize(),
                currentRobotId: this.currentRobot ? this.currentRobot.id : null
            };
        }

        // Calcular tempo decorrido
        getElapsedTime() {
            if (!this.startTime) return 0;
            
            let currentTime = Date.now();
            if (this.gameState === 'paused') {
                currentTime = this.pausedTime;
            }
            
            return Math.floor((currentTime - this.startTime - this.totalPausedDuration) / 1000);
        }

        // Formatar tempo em MM:SS
        getFormattedTime() {
            const seconds = this.getElapsedTime();
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        }

        // Resetar estatísticas
        resetStats() {
            this.stats = {
                robotsRepaired: 0,
                componentsRepaired: 0,
                totalGameTime: 0,
                robotsLost: 0
            };
        }

        // Iniciar spawning de robôs
        startRobotSpawning() {
            this.stopRobotSpawning(); // Garantir que não há timer duplicado
            this.spawnTimer = setInterval(() => {
                this.spawnNewRobot();
            }, this.robotSpawnInterval);
        }

        // Parar spawning de robôs
        stopRobotSpawning() {
            if (this.spawnTimer) {
                clearInterval(this.spawnTimer);
                this.spawnTimer = null;
            }
        }

        // Iniciar atualizações da interface
        startUIUpdates() {
            this.stopUIUpdates(); // Garantir que não há timer duplicado
            this.uiUpdateInterval = setInterval(() => {
                this.notifyUIUpdate();
            }, 1000); // Atualizar a cada segundo
        }

        // Parar atualizações da interface
        stopUIUpdates() {
            if (this.uiUpdateInterval) {
                clearInterval(this.uiUpdateInterval);
                this.uiUpdateInterval = null;
            }
        }

        // Salvar pontuação no ranking
        saveScore(playerName) {
            if (!playerName.trim()) return false;

            const score = {
                name: playerName.trim(),
                robotsRepaired: this.stats.robotsRepaired,
                componentsRepaired: this.stats.componentsRepaired,
                gameTime: this.stats.totalGameTime,
                date: new Date().toLocaleDateString('pt-BR'),
                score: this.calculateScore()
            };

            this.rankings.push(score);
            
            // Ordenar por score (maior primeiro)
            this.rankings.sort((a, b) => b.score - a.score);
            
            // Manter apenas os top 10
            this.rankings = this.rankings.slice(0, 10);
            
            this.saveRankings();
            return true;
        }

        // Calcular pontuação
        calculateScore() {
            const baseScore = this.stats.robotsRepaired * 100;
            const componentBonus = this.stats.componentsRepaired * 10;
            const timeBonus = Math.max(0, 3600 - this.stats.totalGameTime); // Bônus por tempo
            
            return baseScore + componentBonus + timeBonus;
        }

        // Carregar rankings do localStorage
        loadRankings() {
            try {
                const saved = localStorage.getItem('robotRepairRankings');
                return saved ? JSON.parse(saved) : [];
            } catch (error) {
                console.error('Erro ao carregar rankings:', error);
                return [];
            }
        }

        // Salvar rankings no localStorage
        saveRankings() {
            try {
                localStorage.setItem('robotRepairRankings', JSON.stringify(this.rankings));
            } catch (error) {
                console.error('Erro ao salvar rankings:', error);
            }
        }

        // Obter rankings
        getRankings() {
            return [...this.rankings]; // Retorna cópia para evitar modificações
        }

        // Métodos de notificação para a interface (serão implementados na interface)
        notifyGameStateChange(message) {
            // Implementado na interface
            if (window.gameUI) {
                window.gameUI.showMessage(message);
            }
        }

        notifyNewRobot(robot) {
            // Implementado na interface
            if (window.gameUI) {
                window.gameUI.showMessage(`Novo robô chegou: ${robot.model}`);
            }
        }

        notifyRobotSelected(robot) {
            // Implementado na interface
            if (window.gameUI) {
                window.gameUI.showMessage(`Reparando: ${robot.model}`);
            }
        }

        notifyComponentRepaired(component) {
            // Implementado na interface
            if (window.gameUI) {
                window.gameUI.showSuccessMessage(`✅ ${component.name} reparado!`);
            }
        }

        notifyRepairFailed(message) {
            // Implementado na interface
            if (window.gameUI) {
                window.gameUI.showErrorMessage(`❌ ${message}`);
            }
        }

        notifyRobotCompleted(robot) {
            // Implementado na interface
            if (window.gameUI) {
                window.gameUI.showSuccessMessage(`🎉 ${robot.model} completamente reparado!`);
            }
        }

        notifyGameOver(reason) {
            // Implementado na interface
            if (window.gameUI) {
                window.gameUI.showGameOver(reason, this.getCurrentStats());
            }
        }

        notifyUIUpdate() {
            // Implementado na interface
            if (window.gameUI) {
                window.gameUI.updateDisplay();
            }
        }

        // Método para debug/teste
        debugInfo() {
            return {
                gameState: this.gameState,
                robotsInQueue: this.robotQueue.getSize(),
                currentRobotId: this.currentRobot ? this.currentRobot.id : null,
                stats: this.getCurrentStats(),
                elapsedTime: this.getFormattedTime()
            };
        }
    }

    // Exporta para o escopo global
    global.RepairGame = RepairGame;

})(typeof window !== 'undefined' ? window : globalThis);
