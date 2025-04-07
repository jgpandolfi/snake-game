document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const telaJogo = document.getElementById('tela-jogo');
    const ctx = telaJogo.getContext('2d');
    const valorPontuacao = document.getElementById('valor-pontuacao');
    const valorRecorde = document.getElementById('valor-recorde');
    const botaoIniciar = document.getElementById('botao-iniciar');
    const botaoPausar = document.getElementById('botao-pausar');
    const botaoReiniciar = document.getElementById('botao-reiniciar');
    const modalGameOver = document.getElementById('modal-game-over');
    const pontuacaoFinal = document.getElementById('pontuacao-final');
    const mensagemRecorde = document.getElementById('mensagem-recorde');
    const botaoJogarNovamente = document.getElementById('botao-jogar-novamente');
    const botaoInstrucoes = document.getElementById('botao-instrucoes');
    const modalInstrucoes = document.getElementById('modal-instrucoes');
    const botaoFecharInstrucoes = document.getElementById('fechar-instrucoes');
    
    // Botões de controle para dispositivos móveis
    const botaoCima = document.getElementById('botao-cima');
    const botaoBaixo = document.getElementById('botao-baixo');
    const botaoEsquerda = document.getElementById('botao-esquerda');
    const botaoDireita = document.getElementById('botao-direita');

    // Configurações do jogo
    const tamanhoBloco = 20;
    let larguraJogo = 400;
    let alturaJogo = 400;
    let cobrinha = [];
    let direcao = 'direita';
    let direcaoProxima = 'direita';
    let comida = {};
    let pontuacao = 0;
    let recorde = localStorage.getItem('recordeCobrinha') || 0;
    let jogoEmAndamento = false;
    let jogoPausado = false;
    let velocidadeJogo = 150;
    let idAnimacao;
    let ultimaAtualizacao = 0;
    
    // Inicialização
    function inicializar() {
        ajustarTamanhoCanvas();
        valorRecorde.textContent = recorde;
        
        // Eventos de teclado
        document.addEventListener('keydown', controlarTeclado);
        
        // Eventos de botões
        botaoIniciar.addEventListener('click', iniciarJogo);
        botaoPausar.addEventListener('click', pausarJogo);
        botaoReiniciar.addEventListener('click', reiniciarJogo);
        botaoJogarNovamente.addEventListener('click', fecharModalEIniciar);
        botaoInstrucoes.addEventListener('click', abrirInstrucoes);
        botaoFecharInstrucoes.addEventListener('click', fecharInstrucoes);
        
        // Controles de toque para dispositivos móveis
        botaoCima.addEventListener('click', () => mudarDirecao('cima'));
        botaoBaixo.addEventListener('click', () => mudarDirecao('baixo'));
        botaoEsquerda.addEventListener('click', () => mudarDirecao('esquerda'));
        botaoDireita.addEventListener('click', () => mudarDirecao('direita'));
        
        // Redimensionamento da janela
        window.addEventListener('resize', ajustarTamanhoCanvas);
        
        // Desenha o estado inicial
        desenharTelaInicial();
    }
    
    // Ajusta o tamanho do canvas com base no tamanho da tela
    function ajustarTamanhoCanvas() {
        const containerWidth = document.getElementById('painel-jogo').offsetWidth;
        
        // Calcula o tamanho ideal para o canvas
        const tamanhoIdeal = Math.min(containerWidth, 400);
        
        // Ajusta para ser múltiplo do tamanho do bloco
        larguraJogo = Math.floor(tamanhoIdeal / tamanhoBloco) * tamanhoBloco;
        alturaJogo = larguraJogo; // Mantém o quadrado
        
        // Define as dimensões do canvas
        telaJogo.width = larguraJogo;
        telaJogo.height = alturaJogo;
        
        // Se o jogo não estiver em andamento, redesenha a tela inicial
        if (!jogoEmAndamento) {
            desenharTelaInicial();
        }
    }
    
    // Desenha a tela inicial
    function desenharTelaInicial() {
        ctx.fillStyle = '#f3eff0';
        ctx.fillRect(0, 0, larguraJogo, alturaJogo);
        
        ctx.fillStyle = '#f13f6f';
        ctx.font = '24px Roboto';
        ctx.textAlign = 'center';
        ctx.fillText('Jogo da Cobrinha', larguraJogo / 2, alturaJogo / 2 - 30);
        
        ctx.font = '16px Roboto';
        ctx.fillText('Clique em "Iniciar Jogo" para começar', larguraJogo / 2, alturaJogo / 2 + 10);
        
        ctx.font = '14px Roboto';
        ctx.fillText('Use as setas do teclado para jogar', larguraJogo / 2, alturaJogo / 2 + 40);
    }
    
    // Inicia o jogo
    function iniciarJogo() {
        resetarJogo();
        jogoEmAndamento = true;
        jogoPausado = false;
        
        // Atualiza os botões
        botaoIniciar.disabled = true;
        botaoPausar.disabled = false;
        botaoReiniciar.disabled = false;
        
        // Inicia o loop do jogo
        loopJogo();
    }
    
    // Pausa o jogo
    function pausarJogo() {
        if (jogoEmAndamento) {
            jogoPausado = !jogoPausado;
            
            if (jogoPausado) {
                cancelAnimationFrame(idAnimacao);
                botaoPausar.textContent = 'Continuar';
                
                // Desenha mensagem de pausa
                ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                ctx.fillRect(0, 0, larguraJogo, alturaJogo);
                
                ctx.fillStyle = '#fff';
                ctx.font = '24px Roboto';
                ctx.textAlign = 'center';
                ctx.fillText('JOGO PAUSADO', larguraJogo / 2, alturaJogo / 2);
            } else {
                botaoPausar.textContent = 'Pausar';
                loopJogo();
            }
        }
    }
    
    // Reinicia o jogo
    function reiniciarJogo() {
        if (jogoEmAndamento) {
            cancelAnimationFrame(idAnimacao);
            iniciarJogo();
        }
    }
    
    // Reseta o estado do jogo
    function resetarJogo() {
        // Cria a cobrinha inicial com 3 segmentos
        cobrinha = [
            {x: 6 * tamanhoBloco, y: 10 * tamanhoBloco},
            {x: 5 * tamanhoBloco, y: 10 * tamanhoBloco},
            {x: 4 * tamanhoBloco, y: 10 * tamanhoBloco}
        ];
        
        direcao = 'direita';
        direcaoProxima = 'direita';
        pontuacao = 0;
        valorPontuacao.textContent = pontuacao;
        velocidadeJogo = 150;
        
        // Cria a primeira comida
        criarComida();
    }
    
    // Loop principal do jogo
    function loopJogo(timestamp) {
        if (!jogoEmAndamento || jogoPausado) return;
        
        idAnimacao = requestAnimationFrame(loopJogo);
        
        // Limita a taxa de atualização com base na velocidade do jogo
        if (timestamp - ultimaAtualizacao < velocidadeJogo) return;
        ultimaAtualizacao = timestamp;
        
        // Atualiza a direção
        direcao = direcaoProxima;
        
        // Move a cobrinha
        moverCobrinha();
        
        // Verifica colisões
        if (verificarColisoes()) {
            fimDeJogo();
            return;
        }
        
        // Verifica se a cobrinha comeu a comida
        verificarComida();
        
        // Desenha o jogo
        desenharJogo();
    }
    
    // Move a cobrinha na direção atual
    function moverCobrinha() {
        // Cria a nova cabeça baseada na direção
        const cabeca = {x: cobrinha[0].x, y: cobrinha[0].y};
        
        switch (direcao) {
            case 'cima':
                cabeca.y -= tamanhoBloco;
                break;
            case 'baixo':
                cabeca.y += tamanhoBloco;
                break;
            case 'esquerda':
                cabeca.x -= tamanhoBloco;
                break;
            case 'direita':
                cabeca.x += tamanhoBloco;
                break;
        }
        
        // Adiciona a nova cabeça ao início da cobrinha
        cobrinha.unshift(cabeca);
        
        // Remove o último segmento, a menos que tenha comido
        if (cabeca.x === comida.x && cabeca.y === comida.y) {
            // A cauda não é removida quando come, fazendo a cobrinha crescer
        } else {
            cobrinha.pop();
        }
    }
    
    // Verifica colisões com as paredes ou com o próprio corpo
    function verificarColisoes() {
        const cabeca = cobrinha[0];
        
        // Colisão com as paredes
        if (
            cabeca.x < 0 || 
            cabeca.x >= larguraJogo || 
            cabeca.y < 0 || 
            cabeca.y >= alturaJogo
        ) {
            return true;
        }
        
        // Colisão com o próprio corpo
        for (let i = 1; i < cobrinha.length; i++) {
            if (cabeca.x === cobrinha[i].x && cabeca.y === cobrinha[i].y) {
                return true;
            }
        }
        
        return false;
    }
    
    // Verifica se a cobrinha comeu a comida
    function verificarComida() {
        const cabeca = cobrinha[0];
        
        if (cabeca.x === comida.x && cabeca.y === comida.y) {
            // Aumenta a pontuação
            pontuacao += 10;
            valorPontuacao.textContent = pontuacao;
            
            // Cria nova comida
            criarComida();
            
            // Aumenta a velocidade a cada 5 comidas
            if (pontuacao % 50 === 0) {
                velocidadeJogo = Math.max(50, velocidadeJogo - 10);
            }
        }
    }
    
    // Cria uma nova comida em posição aleatória
    function criarComida() {
        // Calcula quantos blocos cabem no canvas
        const maxX = larguraJogo / tamanhoBloco;
        const maxY = alturaJogo / tamanhoBloco;
        
        let posicaoValida = false;
        let novaComida = {};
        
        // Garante que a comida não apareça sobre a cobrinha
        while (!posicaoValida) {
            novaComida = {
                x: Math.floor(Math.random() * maxX) * tamanhoBloco,
                y: Math.floor(Math.random() * maxY) * tamanhoBloco
            };
            
            posicaoValida = true;
            
            // Verifica se a posição não coincide com nenhum segmento da cobrinha
            for (let segmento of cobrinha) {
                if (novaComida.x === segmento.x && novaComida.y === segmento.y) {
                    posicaoValida = false;
                    break;
                }
            }
        }
        
        comida = novaComida;
    }
    
    // Desenha o estado atual do jogo
    function desenharJogo() {
        // Limpa o canvas
        ctx.fillStyle = '#f3ecee';
        ctx.fillRect(0, 0, larguraJogo, alturaJogo);
        
        // Desenha a cobrinha
        for (let i = 0; i < cobrinha.length; i++) {
            // Cabeça com cor diferente
            if (i === 0) {
                ctx.fillStyle = '#8c2541';
            } else {
                ctx.fillStyle = '#f13f6f';
            }
            
            ctx.fillRect(cobrinha[i].x, cobrinha[i].y, tamanhoBloco, tamanhoBloco);
            
            // Borda dos segmentos
            ctx.strokeStyle = '#f3ecee';
            ctx.strokeRect(cobrinha[i].x, cobrinha[i].y, tamanhoBloco, tamanhoBloco);
        }
        
        // Desenha a comida
        ctx.fillStyle = '#ffae4e';
        ctx.beginPath();
        const raio = tamanhoBloco / 2;
        ctx.arc(
            comida.x + raio, 
            comida.y + raio, 
            raio, 
            0, 
            Math.PI * 2
        );
        ctx.fill();
    }
    
    // Controla a cobrinha com o teclado
    function controlarTeclado(evento) {
        // Previne o comportamento padrão das setas (rolar a página)
        if ([37, 38, 39, 40, 27].includes(evento.keyCode)) {
            evento.preventDefault();
        }
        
        // Tecla ESC para pausar
        if (evento.keyCode === 27) {
            pausarJogo();
            return;
        }
        
        // Só processa se o jogo estiver em andamento e não pausado
        if (!jogoEmAndamento || jogoPausado) return;
        
        // Evita que a cobrinha faça um retorno de 180 graus
        switch (evento.keyCode) {
            // Seta para cima
            case 38:
                if (direcao !== 'baixo') direcaoProxima = 'cima';
                break;
            // Seta para baixo
            case 40:
                if (direcao !== 'cima') direcaoProxima = 'baixo';
                break;
            // Seta para esquerda
            case 37:
                if (direcao !== 'direita') direcaoProxima = 'esquerda';
                break;
            // Seta para direita
            case 39:
                if (direcao !== 'esquerda') direcaoProxima = 'direita';
                break;
        }
    }
    
    // Muda a direção da cobrinha (para controles de toque)
    function mudarDirecao(novaDirecao) {
        if (!jogoEmAndamento || jogoPausado) return;
        
        // Evita que a cobrinha faça um retorno de 180 graus
        switch (novaDirecao) {
            case 'cima':
                if (direcao !== 'baixo') direcaoProxima = 'cima';
                break;
            case 'baixo':
                if (direcao !== 'cima') direcaoProxima = 'baixo';
                break;
            case 'esquerda':
                if (direcao !== 'direita') direcaoProxima = 'esquerda';
                break;
            case 'direita':
                if (direcao !== 'esquerda') direcaoProxima = 'direita';
                break;
        }
    }
    
    // Fim de jogo
    function fimDeJogo() {
        jogoEmAndamento = false;
        cancelAnimationFrame(idAnimacao);
        
        // Atualiza o recorde se necessário
        if (pontuacao > recorde) {
            recorde = pontuacao;
            localStorage.setItem('recordeCobrinha', recorde);
            valorRecorde.textContent = recorde;
            mensagemRecorde.textContent = 'Novo recorde!';
        } else {
            mensagemRecorde.textContent = '';
        }
        
        // Atualiza a pontuação final e mostra o modal
        pontuacaoFinal.textContent = pontuacao;
        modalGameOver.style.display = 'flex';
        
        // Reseta os botões
        botaoIniciar.disabled = false;
        botaoPausar.disabled = true;
        botaoPausar.textContent = 'Pausar';
        botaoReiniciar.disabled = true;
    }
    
    // Fecha o modal e inicia um novo jogo
    function fecharModalEIniciar() {
        modalGameOver.style.display = 'none';
        iniciarJogo();
    }
    
    // Abre o modal de instruções
    function abrirInstrucoes() {
        modalInstrucoes.style.display = 'flex';
        
        // Pausa o jogo se estiver em andamento
        if (jogoEmAndamento && !jogoPausado) {
            pausarJogo();
        }
    }
    
    // Fecha o modal de instruções
    function fecharInstrucoes() {
        modalInstrucoes.style.display = 'none';
    }
    
    // Inicializa o jogo
    inicializar();
});
