<h1 align="center"> Snake Game - Jogo da Cobrinha </h1>

<p align="center">
Versão moderna e responsiva para navegadores do clássico jogo da cobrinha, desenvolvido com HTML, CSS e JavaScript puro, focado em boas práticas de programação e experiência do usuário em múltiplos dispositivos.
</p>

## 💡 Sobre o Projeto

Este projeto foi desenvolvido por mim como forma de estudo e prática de desenvolvimento web. O clássico jogo da cobrinha, popular nos celulares antigos, foi recriado para navegadores modernos com foco em responsividade e boas práticas.

O Snake Game desenvolvido contornou os seguintes desafios de projeto:

- Adaptação do jogo clássico para diferentes tamanhos de tela
- Implementação de controles tanto para desktop quanto para dispositivos móveis
- Manutenção de um sistema de pontuação com persistência de recordes (persistência local)
- Criação de uma experiência de jogo fluida e visualmente agradável, compatível com a web moderna

## 🚀 Tecnologias

Este projeto foi desenvolvido utilizando:

- HTML5 Canvas para renderização do jogo
- CSS3 com Flexbox para layout responsivo
- JavaScript puro (Vanilla JS)
- LocalStorage para persistência de dados
- Fontes externas (Google Fonts)
- Git e GitHub para versionamento

## 💻 Técnicas e Boas Práticas

**Performance:**
- Uso de `requestAnimationFrame` para animação suave
- Limitação dinâmica da taxa de atualização
- Otimização de renderização com redesenho condicional
- Pausa automática quando a janela perde o foco

**Responsividade:**
- Design adaptativo para diferentes dispositivos
- Media queries para ajuste de layout
- Redimensionamento dinâmico do canvas
- Controles de toque para dispositivos móveis

**Código:**
- Arquitetura modular com funções bem definidas
- Uso do padrão Immediately Invoked Function Expression (IIFE)
- Nomenclatura clara e consistente
- Escopo adequado de variáveis
- Eventos delegados e bem organizados

**Experiência do Usuário:**
- Feedback visual para interações
- Instruções claras para o jogador
- Sistema de pause/resume intuitivo
- Modais informativos
- Aumento progressivo da dificuldade

## 🎮 Funcionalidades

**Mecânicas de jogo:**
- Movimentação fluida da cobrinha em quatro direções
- Geração aleatória de comida em posições válidas
- Detecção de colisões (paredes e próprio corpo)
- Crescimento da cobrinha ao comer
- Aumento gradual da velocidade a cada 50 pontos

**Controles:**
- Controle por teclado usando as teclas de seta
- Botões na tela para dispositivos móveis
- Tecla ESC para pausar/continuar o jogo

**Interface:**
- Menu de jogo com botões para iniciar, pausar e reiniciar
- Painel de pontuação e recorde
- Modal de Game Over com resultado final
- Modal de instruções com regras do jogo
- Feedback visual para ações do jogador

**Persistência de dados:**
- Armazenamento do recorde no localStorage do navegador
- Detecção e comemoração de novo recorde

## 🔧 Implementações Técnicas

O projeto utiliza várias técnicas modernas de desenvolvimento web:

- **Canvas API**: Renderização eficiente dos elementos do jogo
- **Algoritmo de colisão**: Verificação precisa de colisões entre a cobrinha e elementos do jogo
- **Sistema de coordenadas baseado em grade**: Facilita posicionamento e cálculos
- **Controle de estados**: Gerenciamento adequado dos diferentes estados do jogo (inicial, em andamento, pausado, game over)
- **Temporizadores otimizados**: Uso eficiente de requestAnimationFrame com controle de tempo
- **Redimensionamento responsivo**: Cálculos dinâmicos para adaptação a qualquer tela

## 🧾 Licença

Esse projeto está sob a licença MIT.

<p align="center">
  <img alt="License" src="https://img.shields.io/static/v1?label=license&message=MIT&color=49AA26&labelColor=000000">
</p>
