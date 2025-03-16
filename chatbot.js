// Iniciar isso aqui escreva no terminal: node chatbot.js

// Importando bibliotecas necessárias
const qrcode = require('qrcode-terminal'); // Gera QR Code para autenticação do WhatsApp
const { Client, Buttons, List, MessageMedia } = require('whatsapp-web.js'); // Biblioteca para integração com WhatsApp
const client = new Client({
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
}); // Criando uma instância do cliente

// Criando variáveis globais para controle de atendimento
const usuariosAtendidos = new Set(); // Armazena números de usuários já atendidos
const usuariosSilenciados = new Map(); // Armazena usuários que pediram para não receber mais mensagens por um tempo
const estadoUsuarios = new Map(); // Armazena em que etapa do atendimento o usuário está

// Evento acionado quando um QR Code for gerado
client.on('qr', qr => {
    qrcode.generate(qr, { small: true }); // Exibe o QR Code no terminal
});

// Evento acionado quando o bot está pronto para uso
client.on('ready', () => {
    console.log('Tudo certo! WhatsApp conectado.');
});

// Inicializa o cliente do WhatsApp
client.initialize();

// Função para criar um atraso (delay) assíncrono
const delay = ms => new Promise(res => setTimeout(res, ms));

// Evento acionado sempre que o bot recebe uma mensagem
client.on('message', async msg => {
    if (msg.isGroupMsg) return; // Se for mensagem de grupo, ignora e não responde

    const chat = await msg.getChat();
    if (chat.isMuted || chat.isArchived || chat.isReadOnly) return; // Não responde mensagens de chats trancados, arquivados ou somente leitura

    const numero = msg.from; // Número do usuário que enviou a mensagem
    const mensagem = msg.body.toLowerCase(); // Conteúdo da mensagem em minúsculas para facilitar a comparação
    const agora = Date.now(); // Obtém o timestamp atual
    
    // Verifica se o usuário está silenciado e impede resposta se ainda estiver no período de 2 horas
    if (usuariosSilenciados.has(numero)) {
        const tempoPassado = agora - usuariosSilenciados.get(numero);
        if (tempoPassado < 2 * 60 * 60 * 1000) { // 2 horas em milissegundos
            return; // Se ainda estiver no tempo de silêncio, não responde
        } else {
            usuariosSilenciados.delete(numero); // Remove da lista de silenciados após 2 horas
        }
    }

    // Se o usuário ainda não foi atendido, inicia a interação inicial
    if (!usuariosAtendidos.has(numero) && msg.from.endsWith('@c.us')) {
        const contact = await msg.getContact(); // Obtém informações do contato
        const name = contact.pushname ? contact.pushname.split(" ")[0] : "amigo"; // Pega o primeiro nome do contato

        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await client.sendMessage(msg.from, `Olá, ${name}! 😊 Muito prazer sou Lucas um assistente virtual.` +
            //"Já que ele se encontra ocupado, estou aqui para ajudar a agilizar os assuntos." +
            "Por gentileza, me diga qual ajuda você gostaria digitando uma das opções:" +
            "0️⃣ - Ver o menu de Opções." +
            "#️⃣ - Falar com um atendente.");
            //"⚠️ Se digitar *#* em qualquer momento da conversa, irei parar de lhe responder por 2h ⚠️");

        usuariosAtendidos.add(numero);
        return;
    }

    // Se o usuário quiser ver o menu de opções
    if (mensagem === '0' && !estadoUsuarios.has(numero)) {
        await client.sendMessage(msg.from, "Digite o número da opção desejada:\n" +
            "1️⃣ - Formatação Windows/Linux\n" +
            "2️⃣ - Manutenção em Computador ou Notebook\n" +
            "3️⃣ - Montar PC Gamer\n" +
            "4️⃣ - Aulas de reforço\n" +
            "5️⃣ - Informações sobre maquininhas Ton\n" +
            "6️⃣ - Criar um bot de WhatsApp\n" +
            "#️⃣ - Encerrar a conversa");
        return;
    }

    // Selecão da opção e armazenamento do estado
    if (['1', '2', '3', '4', '5', '6'].includes(mensagem)) {
        estadoUsuarios.set(numero, mensagem);
    }

    // Definição das respostas com base na opção escolhida
    const respostas = {
        '1': "Formatação para seu computador. Escolha Windows ou Linux.",
        '2': "Envie fotos, vídeos ou áudios do problema.",
        '3': "Descreva seu sonho gamer!", 
        '4': "Para aulas de reforço, acesse: https://wa.me/p/7663163480368904/5521982545315", 
        '5': "O Vinícius responderá diretamente.",
        '6': "O Vinícius pode criar um bot para você. Aguarde contato."
    };

    if (respostas[mensagem]) {
        await delay(3000);
        await chat.sendStateTyping();
        await client.sendMessage(msg.from, respostas[mensagem]);
        await client.sendMessage(msg.from, "Para encerrar a conversa, digite #️⃣.\nPara ver outra opção, digite 9️⃣.");
        return;
    }

    // Se o usuário quiser escolher outra opção
    if (mensagem === '9') {
        estadoUsuarios.delete(numero);
        await client.sendMessage(msg.from, "Você pode escolher outra opção. Digite 0️⃣ para ver as opções novamente.");
        return;
    }

    // Se o usuário quiser encerrar a conversa
    if (mensagem === '#') {
        estadoUsuarios.delete(numero);
        usuariosAtendidos.delete(numero);
        usuariosSilenciados.set(numero, agora); // Armazena o horário de encerramento da conversa
        await client.sendMessage(msg.from, "Conversa encerrada. Um atendente logo logo irá lhe atender! 😊");
        return;
    }
    // Verifica se o usuário está silenciado e impede resposta se ainda estiver dentro do período de 2 horas
if (usuariosSilenciados.has(numero)) {
    const tempoPassado = agora - usuariosSilenciados.get(numero);
    if (tempoPassado < 2 * 60 * 60 * 1000) { // 2 horas em milissegundos
        return; // Ignora a mensagem se estiver dentro do período de silêncio
    } else {
        usuariosSilenciados.delete(numero); // Remove o usuário da lista após 2 horas
    }
}

    await client.sendMessage(msg.from, "Opção inválida. Digite 0️⃣ para voltar ao menu.");
});
