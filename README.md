# 🛠️ Jogo de Reparo de Robôs - Oficina Futurista

## 📝 Descrição

Este é um jogo desenvolvido para a disciplina de Algoritmos e Estruturas de Dados, implementando o projeto "Jogo de Reparo de Robôs em uma Oficina Futurista". O jogo utiliza **listas encadeadas** e **pilhas** implementadas manualmente, sem uso de bibliotecas prontas, seguindo os requisitos do professor.

## 🎮 Como Jogar

1. **Iniciar o Jogo**: Clique em "Iniciar Jogo" para começar
2. **Selecionar Robô**: Clique em um robô na fila para começar o reparo
3. **Reparar Componentes**: Digite o código exato do componente que aparece no topo da pilha
4. **Gerenciar Prioridades**: Robôs de emergência têm prioridade maior
5. **Evitar Sobrecarga**: Não deixe a oficina ficar lotada (máximo 8 robôs)

## 🎯 Objetivo

Reparar o máximo de robôs possível no menor tempo, gerenciando eficientemente a fila de atendimento e as pilhas de componentes defeituosos.

## 🔧 Mecânicas do Jogo

### Robôs
- **ID Único**: Cada robô possui um identificador único
- **Modelo**: Nome do modelo do robô
- **Prioridade**: Emergência (vermelho), Padrão (laranja), Baixo Risco (verde)
- **Pilha de Componentes**: Cada robô tem uma pilha de componentes defeituosos
- **Estado**: Pendente, Em Reparo, Reparado

### Componentes
- **Nome**: Tipo do componente (ex: Sensor de Movimento, Motor Principal)
- **Código**: Código alfanumérico que deve ser digitado corretamente
- **Tempo de Reparo**: Tempo estimado para substituição
- **Prioridade**: Influencia a dificuldade e urgência

### Sistema de Pontuação
- **100 pontos** por robô completamente reparado
- **10 pontos** por componente reparado
- **Bônus de tempo** baseado na velocidade
- **Ranking** salvo localmente

## 🏗️ Estruturas de Dados Implementadas

### Lista Encadeada (`LinkedList`)
- **Uso**: Armazenamento da fila de robôs na oficina
- **Operações**: Inserção, remoção, busca, ordenação, movimentação
- **Métodos**: `append()`, `remove()`, `find()`, `sort()`, `move()`, etc.

### Pilha (`Stack`)
- **Uso**: Armazenamento dos componentes defeituosos de cada robô
- **Implementação**: Baseada em lista encadeada
- **Operações**: `push()`, `pop()`, `peek()`, `isEmpty()`
- **LIFO**: Último componente adicionado é o primeiro a ser reparado

## 🔄 Orientação a Objetos

### Classes Principais

1. **`Component`**: Representa um componente defeituoso
2. **`Robot`**: Representa um robô com sua pilha de componentes
3. **`RobotFactory`**: Factory para criação de robôs aleatórios
4. **`RepairGame`**: Classe principal que gerencia toda a lógica do jogo
5. **`GameUI`**: Interface do usuário e controle dos elementos HTML

### Princípios Aplicados
- **Encapsulamento**: Dados privados e métodos públicos bem definidos
- **Abstração**: Interfaces claras para cada classe
- **Composição**: Robot usa Stack, Game usa LinkedList
- **Factory Pattern**: Para criação de robôs com configurações variadas

## 📊 Estatísticas e Ranking

O jogo registra:
- Total de robôs reparados
- Total de componentes substituídos
- Tempo total de jogo
- Ranking de jogadores (salvo no navegador)

## 🖥️ Tecnologias Utilizadas

- **HTML5**: Estrutura da página
- **CSS3**: Estilos modernos com gradientes e animações
- **JavaScript ES6+**: Lógica do jogo e orientação a objetos
- **LocalStorage**: Persistência do ranking

## 🎨 Interface

- **Design Moderno**: Visual futurista com gradientes azuis
- **Responsivo**: Funciona em desktop e mobile
- **Animações**: Transições suaves e feedback visual
- **Cores Temáticas**: Sistema de cores baseado em prioridade

## 🚀 Como Executar

1. Baixe todos os arquivos do projeto
2. Abra o arquivo `index.html` em um navegador moderno
3. Clique em "Iniciar Jogo" e comece a reparar robôs!

## 📁 Estrutura do Projeto

```
JogoReparoDeRobos/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── linkedList.js       # Implementação da Lista Encadeada
├── stack.js           # Implementação da Pilha
├── robot.js           # Classes Robot, Component e RobotFactory
├── game.js            # Classe principal RepairGame
├── main.js            # Interface e controle do jogo
└── README.md          # Este arquivo
```

## 🎯 Requisitos Cumpridos

✅ **Lista Encadeada**: Implementação manual completa  
✅ **Orientação a Objetos**: Classes bem estruturadas  
✅ **Interface Gráfica**: Visual atrativo e funcional  
✅ **Mecânica de Jogo**: Sistema de pilhas e prioridades  
✅ **Estatísticas**: Tracking completo de performance  
✅ **Sem Bibliotecas**: Implementação própria das estruturas  

## 🎮 Controles

- **Clique**: Selecionar robô
- **Enter**: Confirmar reparo de componente
- **ESC**: Pausar/Retomar jogo
- **Ctrl+R**: Reiniciar jogo

## 🏆 Dicas para Alta Pontuação

1. Priorize robôs de emergência (vermelhos)
2. Alterne entre robôs para otimizar o tempo
3. Memorize padrões de códigos comuns
4. Mantenha a oficina organizada (não deixe lotar)
5. Seja rápido mas preciso na digitação

---

**Desenvolvido por**: [Seu Nome]  
**Disciplina**: Algoritmos e Estruturas de Dados  
**Data**: Junho 2025
