// =====================
// Módulo de Lista Encadeada
// =====================

(function(global) {
    /**
     * Classe Node
     * Nó da lista encadeada
     */
    class Node {
        constructor(data) {
            this.data = data;
            this.next = null;
        }
    }

    /**
     * Classe LinkedList
     * Lista encadeada simples para uso geral
     */
    class LinkedList {
        constructor() {
            this.head = null;
            this.size = 0;
        }

        // Adicionar elemento no final da lista
        append(data) {
            const newNode = new Node(data);
            
            if (!this.head) {
                this.head = newNode;
            } else {
                let current = this.head;
                while (current.next) {
                    current = current.next;
                }
                current.next = newNode;
            }
            this.size++;
        }

        // Adicionar elemento no início da lista
        prepend(data) {
            const newNode = new Node(data);
            newNode.next = this.head;
            this.head = newNode;
            this.size++;
        }

        // Inserir elemento em uma posição específica
        insertAt(index, data) {
            if (index < 0 || index > this.size) {
                throw new Error('Índice fora dos limites');
            }

            if (index === 0) {
                this.prepend(data);
                return;
            }

            const newNode = new Node(data);
            let current = this.head;
            
            for (let i = 0; i < index - 1; i++) {
                current = current.next;
            }
            
            newNode.next = current.next;
            current.next = newNode;
            this.size++;
        }

        // Remover elemento por valor
        remove(data) {
            if (!this.head) return false;

            if (this.head.data === data) {
                this.head = this.head.next;
                this.size--;
                return true;
            }

            let current = this.head;
            while (current.next && current.next.data !== data) {
                current = current.next;
            }

            if (current.next) {
                current.next = current.next.next;
                this.size--;
                return true;
            }

            return false;
        }

        // Remover elemento por índice
        removeAt(index) {
            if (index < 0 || index >= this.size) {
                throw new Error('Índice fora dos limites');
            }

            if (index === 0) {
                const removedData = this.head.data;
                this.head = this.head.next;
                this.size--;
                return removedData;
            }

            let current = this.head;
            for (let i = 0; i < index - 1; i++) {
                current = current.next;
            }

            const removedData = current.next.data;
            current.next = current.next.next;
            this.size--;
            return removedData;
        }

        // Buscar elemento por valor
        find(data) {
            let current = this.head;
            let index = 0;

            while (current) {
                if (current.data === data) {
                    return { data: current.data, index };
                }
                current = current.next;
                index++;
            }

            return null;
        }

        // Buscar elemento por função de comparação
        findBy(predicate) {
            let current = this.head;
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

        // Obter elemento por índice
        get(index) {
            if (index < 0 || index >= this.size) {
                throw new Error('Índice fora dos limites');
            }

            let current = this.head;
            for (let i = 0; i < index; i++) {
                current = current.next;
            }

            return current.data;
        }

        // Verificar se a lista está vazia
        isEmpty() {
            return this.size === 0;
        }

        // Obter o tamanho da lista
        getSize() {
            return this.size;
        }

        // Limpar toda a lista
        clear() {
            this.head = null;
            this.size = 0;
        }

        // Converter para array (para facilitar visualização)
        toArray() {
            const result = [];
            let current = this.head;

            while (current) {
                result.push(current.data);
                current = current.next;
            }

            return result;
        }

        // Iterar sobre todos os elementos
        forEach(callback) {
            let current = this.head;
            let index = 0;

            while (current) {
                callback(current.data, index);
                current = current.next;
                index++;
            }
        }

        // Mapear elementos para um novo array
        map(callback) {
            const result = [];
            let current = this.head;
            let index = 0;

            while (current) {
                result.push(callback(current.data, index));
                current = current.next;
                index++;
            }

            return result;
        }

        // Filtrar elementos
        filter(predicate) {
            const result = new LinkedList();
            let current = this.head;
            let index = 0;

            while (current) {
                if (predicate(current.data, index)) {
                    result.append(current.data);
                }
                current = current.next;
                index++;
            }

            return result;
        }

        // Ordenar a lista (usando bubble sort implementado para lista encadeada)
        sort(compareFunction) {
            if (this.size <= 1) return;

            let swapped;
            do {
                swapped = false;
                let current = this.head;

                while (current && current.next) {
                    if (compareFunction(current.data, current.next.data) > 0) {
                        // Trocar os dados dos nós
                        const temp = current.data;
                        current.data = current.next.data;
                        current.next.data = temp;
                        swapped = true;
                    }
                    current = current.next;
                }
            } while (swapped);
        }

        // Mover elemento de uma posição para outra
        move(fromIndex, toIndex) {
            if (fromIndex < 0 || fromIndex >= this.size || 
                toIndex < 0 || toIndex >= this.size || 
                fromIndex === toIndex) {
                return false;
            }

            const data = this.removeAt(fromIndex);
            this.insertAt(toIndex, data);
            return true;
        }

        // Obter primeiro elemento
        getFirst() {
            return this.head ? this.head.data : null;
        }

        // Obter último elemento
        getLast() {
            if (!this.head) return null;

            let current = this.head;
            while (current.next) {
                current = current.next;
            }

            return current.data;
        }

        // Inverter a lista
        reverse() {
            let prev = null;
            let current = this.head;
            let next = null;

            while (current) {
                next = current.next;
                current.next = prev;
                prev = current;
                current = next;
            }

            this.head = prev;
        }

        // Clonar a lista
        clone() {
            const newList = new LinkedList();
            this.forEach(data => {
                // Clonagem profunda se o data for um objeto
                const clonedData = typeof data === 'object' ? 
                    JSON.parse(JSON.stringify(data)) : data;
                newList.append(clonedData);
            });
            return newList;
        }

        // Representação em string para debug
        toString() {
            const elements = this.toArray();
            return `LinkedList(${elements.length}): [${elements.join(', ')}]`;
        }
    }

    // Exporta para o escopo global
    global.Node = Node;
    global.LinkedList = LinkedList;

})(typeof window !== 'undefined' ? window : globalThis);
