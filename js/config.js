/*
 * Configurações editáveis da landing page da Agência Extend.
 * Este arquivo é carregado no <head>, antes de tudo, porque o título dinâmico
 * (H1 por campanha) precisa dele antes da primeira pintura.
 */

/* WhatsApp da Extend, com o 55 do país. (48) 99612-7742 */
var WHATSAPP_NUMBER = "5548996127742";

/* Mensagem dos botões de WhatsApp fora do formulário (o código de origem é somado no fim). */
var MENSAGEM_CURTA = "Olá! Vim pelo site da Extend e quero mais clientes no WhatsApp da minha empresa.";

/*
 * Rastreamento. Vazio = nenhum script de terceiros é carregado.
 * Mesmo preenchidos, só carregam depois do "Aceitar" no aviso de cookies.
 * Formatos esperados: GTM-XXXXXXX, 123456789012345, AW-123456789
 */
var GTM_ID = "";
var META_PIXEL_ID = "";
var GOOGLE_ADS_ID = "";

/* Por quantos dias as UTMs e os IDs de clique ficam guardados no navegador (só para as tags). */
var ATRIBUICAO_DIAS = 90;

/*
 * Título dinâmico (message match com o anúncio).
 * Só valores desta lista fixa são aceitos. Qualquer outro valor cai no título padrão.
 */
var H1_PADRAO = "Mais clientes chamando no WhatsApp da sua empresa. Todo mês.";

var H1_POR_KW = {
  "agencia-marketing": "Agência de marketing que coloca mais clientes chamando no WhatsApp da sua empresa.",
  "trafego-pago": "Tráfego pago que traz cliente para o seu WhatsApp, e não só clique."
};

var H1_REMARKETING = "Você já viu como a Extend trabalha. Agora é a vez do seu negócio.";

/* {cidade} é trocado pelo nome da cidade da lista abaixo. */
var H1_CIDADE = "Mais clientes chamando no WhatsApp da sua empresa em {cidade}. Todo mês.";

var CIDADES = {
  "sombrio": "Sombrio",
  "ararangua": "Araranguá",
  "criciuma": "Criciúma",
  "icara": "Içara",
  "forquilhinha": "Forquilhinha",
  "braco-do-norte": "Braço do Norte",
  "meleiro": "Meleiro",
  "nova-veneza": "Nova Veneza",
  "sideropolis": "Siderópolis",
  "turvo": "Turvo",
  "urussanga": "Urussanga",
  "praia-grande": "Praia Grande",
  "mampituba": "Mampituba"
};

/* Trecho do H1 que ganha a cor de destaque (o primeiro que aparecer no título). */
var H1_DESTAQUES = ["Todo mês.", "chamando no WhatsApp", "o seu WhatsApp", "a vez do seu negócio"];
