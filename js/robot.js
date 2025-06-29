// =====================
// Módulo de Componentes e Robôs
// =====================

(function(global) {
    /**
     * Classe Component
     * Representa um componente defeituoso de um robô
     */
    class Component {
        constructor(name, code, repairTime, priority = 'standard') {
            this.name = name;
            this.code = code;
            this.repairTime = repairTime; // Em segundos
            this.priority = priority; // emergency, standard, low
            this.id = this.generateId();
        }

        generateId() {
            return 'COMP_' + Math.random().toString(36).substr(2, 9).toUpperCase();
        }

        toString() {
            return `${this.name} (${this.code}) - ${this.repairTime}s`;
        }
    }

    /**
     * Classe Robot
     * Representa um robô na oficina, com pilha de componentes defeituosos
     */
    class Robot {
        constructor(id, model, priority = 'standard') {
            this.id = id;
            this.model = model;
            this.priority = priority; // emergency, standard, low
            this.componentStack = new Stack(); // Pilha de componentes defeituosos
            this.state = 'pending'; // pending, in_repair, repaired
            this.arrivalTime = Date.now();
            this.repairStartTime = null;
            this.repairEndTime = null;
            this.repairedComponents = [];
            this.totalRepairTime = 0;
        }

        // Adiciona componentes defeituosos ao robô
        addDefectiveComponents(components) {
            components.forEach(component => {
                if (component instanceof Component) {
                    this.componentStack.push(component);
                } else {
                    // Se não for uma instância de Component, cria uma
                    const comp = new Component(
                        component.name,
                        component.code,
                        component.repairTime,
                        component.priority
                    );
                    this.componentStack.push(comp);
                }
            });
        }

        // Gera componentes defeituosos aleatórios
        generateRandomDefects(count = null) {
            const componentTypes = [
                { name: 'Sensor de Movimento', baseTime: 30 },
                { name: 'Motor Principal', baseTime: 45 },
                { name: 'Processador Central', baseTime: 60 },
                { name: 'Bateria Principal', baseTime: 25 },
                { name: 'Sensor de Visão', baseTime: 35 },
                { name: 'Braço Articulado', baseTime: 50 },
                { name: 'Sistema de Navegação', baseTime: 40 },
                { name: 'Módulo de Comunicação', baseTime: 20 },
                { name: 'Servo Motor', baseTime: 30 },
                { name: 'Placa de Circuito', baseTime: 55 },
                { name: 'Sensor Ultrassônico', baseTime: 15 },
                { name: 'Driver de Motor', baseTime: 25 }
            ];
            const priorities = ['emergency', 'standard', 'low'];
            const componentCount = count || Math.floor(Math.random() * 5) + 1;
            const components = [];
            for (let i = 0; i < componentCount; i++) {
                const randomType = componentTypes[Math.floor(Math.random() * componentTypes.length)];
                const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
                const code = this.generateComponentCode();
                let repairTime = randomType.baseTime;
                if (randomPriority === 'emergency') repairTime *= 0.8;
                else if (randomPriority === 'low') repairTime *= 1.2;
                const component = new Component(
                    randomType.name,
                    code,
                    Math.round(repairTime),
                    randomPriority
                );
                components.push(component);
            }
            this.addDefectiveComponents(components);
        }

        // Gera código alfanumérico para componente
        generateComponentCode() {
             const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
             const digits = '0123456789';
             const chars = letters + digits;

        // Garante 1 letra e 1 número
             const letter = letters[Math.floor(Math.random() * letters.length)];
             const digit = digits[Math.floor(Math.random() * digits.length)];

             let remaining = '';
             for (let i = 0; i < 2; i++) {
              remaining += chars[Math.floor(Math.random() * chars.length)];
           }

         // Embaralha os 4 caracteres para não deixar o padrao fixo (letra + número + 2 aleatorio)
             const codeArray = (letter + digit + remaining).split('');
             for (let i = codeArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
                [codeArray[i], codeArray[j]] = [codeArray[j], codeArray[i]];
             }

                 return codeArray.join('');
              }


        // Inicia reparo do robô
        startRepair() {
            if (this.state === 'pending') {
                this.state = 'in_repair';
                this.repairStartTime = Date.now();
            }
        }

        // Repara próximo componente
        repairNextComponent(inputCode) {
            if (this.componentStack.isEmpty()) {
                return {
                    success: false,
                    message: 'Nenhum componente para reparar'
                };
            }
            const result = this.componentStack.repairComponent(inputCode);
            if (result.success) {
                this.repairedComponents.push(result.component);
                if (this.componentStack.isEmpty()) {
                    this.completeRepair();
                }
            }
            return result;
        }

        // Finaliza reparo do robô
        completeRepair() {
            this.state = 'repaired';
            this.repairEndTime = Date.now();
            this.totalRepairTime = this.repairEndTime - this.repairStartTime;
        }

        // Verifica se o robô está completamente reparado
        isFullyRepaired() {
            return this.componentStack.isEmpty() && this.state === 'repaired';
        }

        // Métodos utilitários para a interface
        getNextComponent() {
            return this.componentStack.peek();
        }
        getRemainingComponents() {
            return this.componentStack.getAllComponents();
        }
        getRemainingComponentCount() {
            return this.componentStack.getSize();
        }
        getEstimatedRepairTime() {
            return this.componentStack.getTotalRepairTime();
        }
        getPriorityValue() {
            const priorityValues = { 'emergency': 1, 'standard': 2, 'low': 3 };
            return priorityValues[this.priority] || 2;
        }
        getInfo() {
            return {
                id: this.id,
                model: this.model,
                priority: this.priority,
                state: this.state,
                remainingComponents: this.getRemainingComponentCount(),
                nextComponent: this.getNextComponent(),
                estimatedTime: this.getEstimatedRepairTime(),
                arrivalTime: this.arrivalTime,
                repairStartTime: this.repairStartTime,
                repairEndTime: this.repairEndTime,
                totalRepairTime: this.totalRepairTime,
                repairedComponents: this.repairedComponents.length
            };
        }
        clone() {
            const cloned = new Robot(this.id, this.model, this.priority);
            cloned.state = this.state;
            cloned.arrivalTime = this.arrivalTime;
            cloned.repairStartTime = this.repairStartTime;
            cloned.repairEndTime = this.repairEndTime;
            cloned.totalRepairTime = this.totalRepairTime;
            cloned.repairedComponents = [...this.repairedComponents];
            cloned.componentStack = this.componentStack.clone();
            return cloned;
        }
        toString() {
            return `Robot ${this.id} (${this.model}) - ${this.priority} priority - ${this.getRemainingComponentCount()} components left`;
        }
    }

    /**
     * Classe RobotFactory
     * Factory para criar robôs com configurações pré-definidas
     */
    class RobotFactory {
        static createRandomRobot() {
            const models = [
                'Wall-E', 'Rob', 'Baymax', 'Karen', 'BB-8', 'R2-D2', 'EVE', 'C-3PO'
            ];
            const priorities = ['emergency', 'standard', 'low'];
            const priorityWeights = [0.2, 0.6, 0.2];
            let random = Math.random();
            let selectedPriority = 'standard';
            if (random < priorityWeights[0]) {
                selectedPriority = 'emergency';
            } else if (random < priorityWeights[0] + priorityWeights[1]) {
                selectedPriority = 'standard';
            } else {
                selectedPriority = 'low';
            }
            const id = this.generateRobotId();
            const model = models[Math.floor(Math.random() * models.length)];
            const robot = new Robot(id, model, selectedPriority);
            // Defeitos por prioridade: emergency=3, standard=2, low=1
            let componentCount = selectedPriority === 'emergency' ? 3 : selectedPriority === 'standard' ? 2 : 1;
            robot.generateRandomDefects(componentCount);
            return robot;
        }
        static generateRobotId() {
            const prefix = 'RBT';
            const number = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
            return `${prefix}-${number}`;
        }
    }

    // Exporta para o escopo global (compatível com <script> em HTML)
    global.Component = Component;
    global.Robot = Robot;
    global.RobotFactory = RobotFactory;

})(typeof window !== 'undefined' ? window : globalThis);
