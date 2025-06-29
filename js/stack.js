// =====================
// Módulo de Pilha (Stack)
// =====================

(function(global) {
    
    class StackNode {
        constructor(data) {
            this.data = data;
            this.next = null;
        }
    }

    class Stack {
        constructor() {
            this.top = null;
            this.size = 0;
        }

        // Adiciona elemento no topo da pilha
        push(data) {
            const newNode = new StackNode(data);
            newNode.next = this.top;
            this.top = newNode;
            this.size++;
        }

        // Remove e retorna o elemento do topo da pilha
        pop() {
            if (this.isEmpty()) {
                throw new Error('Pilha vazia - não é possível fazer pop');
            }

            const data = this.top.data;
            this.top = this.top.next;
            this.size--;
            return data;
        }

        // Visualizar o elemento do topo sem removê-lo
        peek() {
            if (this.isEmpty()) {
                return null;
            }
            return this.top.data;
        }

        // Verificar se a pilha está vazia
        isEmpty() {
            return this.size === 0;
        }

        // Obter o tamanho da pilha
        getSize() {
            return this.size;
        }

        // Limpar toda a pilha
        clear() {
            this.top = null;
            this.size = 0;
        }

        // Converter pilha para array (do topo para a base)
        toArray() {
            const result = [];
            let current = this.top;

            while (current) {
                result.push(current.data);
                current = current.next;
            }

            return result;
        }

        // Converter pilha para array (da base para o topo)
        toArrayReversed() {
            return this.toArray().reverse();
        }

        // Buscar elemento na pilha
        contains(data) {
            let current = this.top;

            while (current) {
                if (current.data === data) {
                    return true;
                }
                current = current.next;
            }

            return false;
        }

        // Buscar elemento por função de comparação
        findBy(predicate) {
            let current = this.top;
            let index = 0;

            while (current) {
                if (predicate(current.data)) {
                    return { data: current.data, index };
                }
                current = current.next;
                index++;
            }

            return null;
        }

        // Iterar sobre todos os elementos (do topo para a base)
        forEach(callback) {
            let current = this.top;
            let index = 0;

            while (current) {
                callback(current.data, index);
                current = current.next;
                index++;
            }
        }

        // Obter elemento por índice (0 = topo)
        getAt(index) {
            if (index < 0 || index >= this.size) {
                throw new Error('Índice fora dos limites');
            }

            let current = this.top;
            for (let i = 0; i < index; i++) {
                current = current.next;
            }

            return current.data;
        }

        // Clonar a pilha
        clone() {
            const newStack = new Stack();
            const tempArray = this.toArrayReversed(); // Inverte para manter a ordem

            tempArray.forEach(data => {
                // Clonagem profunda se o data for um objeto
                const clonedData = typeof data === 'object' ? 
                    JSON.parse(JSON.stringify(data)) : data;
                newStack.push(clonedData);
            });

            return newStack;
        }

        // Representação em string para debug
        toString() {
            const elements = this.toArray();
            return `Stack(${this.size}): [${elements.join(' <- ')}] (topo à esquerda)`;
        }

        // Métodos específicos para o jogo

        // Adicionar múltiplos componentes de uma vez
        pushMultiple(components) {
            components.forEach(component => {
                this.push(component);
            });
        }

        // Obter todos os componentes como array para exibição
        getAllComponents() {
            return this.toArray();
        }

        // Verificar se o próximo componente tem o código especificado
        checkTopCode(code) {
            if (this.isEmpty()) {
                return false;
            }
            return this.peek().code === code;
        }

        // Reparar componente (remover do topo se o código estiver correto)
        repairComponent(code) {
            if (this.isEmpty()) {
                return { success: false, message: 'Nenhum componente para reparar' };
            }

            const topComponent = this.peek();
            if (topComponent.code === code) {
                const repairedComponent = this.pop();
                return { 
                    success: true, 
                    component: repairedComponent,
                    message: `Componente ${repairedComponent.name} reparado com sucesso!` 
                };
            } else {
                return { 
                    success: false, 
                    message: `Código incorreto! Esperado: ${topComponent.code}` 
                };
            }
        }

        // Obter resumo da pilha para exibição
        getSummary() {
            return {
                isEmpty: this.isEmpty(),
                size: this.getSize(),
                topComponent: this.peek(),
                allComponents: this.getAllComponents()
            };
        }

        // Calcular tempo total estimado para todos os componentes
        getTotalRepairTime() {
            let totalTime = 0;
            this.forEach(component => {
                totalTime += component.repairTime || 0;
            });
            return totalTime;
        }

        // Obter componentes ordenados por prioridade de reparo
        getComponentsByPriority() {
            const components = this.toArray();
            return components.sort((a, b) => {
                const priorityOrder = { 'emergency': 1, 'standard': 2, 'low': 3 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            });
        }
    }

    // Exporta para o escopo global
    global.StackNode = StackNode;
    global.Stack = Stack;

})(typeof window !== 'undefined' ? window : globalThis);
