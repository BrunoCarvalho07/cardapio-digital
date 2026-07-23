export function gerarNumeroPedido() {
  return Math.floor(1000 + Math.random() * 9000);
}

export function montarMensagemPedido({ numeroPedido, itens, subtotal, endereco, formaPagamento, trocoPara }) {
  let mensagem = `*NOVO PEDIDO #${numeroPedido}*\n\n`;

  mensagem += `*Itens do pedido:*\n`;
  itens.forEach((item) => {
    const totalItem = (item.preco * item.quantidade).toFixed(2).replace(".", ",");
    mensagem += `- ${item.quantidade}x ${item.nome} - R$ ${totalItem}\n`;
  });

  mensagem += `\n*Total: R$ ${subtotal.toFixed(2).replace(".", ",")}*\n\n`;

  mensagem += `*Endereco de entrega:*\n`;
  mensagem += `${endereco.logradouro}, ${endereco.numero}`;
  if (endereco.complemento) mensagem += ` - ${endereco.complemento}`;
  mensagem += `\n${endereco.bairro}, ${endereco.cidade} - ${endereco.estado}\n`;
  mensagem += `CEP: ${endereco.cep}\n\n`;

  mensagem += `*Forma de pagamento:* ${formaPagamento}`;
  if (formaPagamento === "Dinheiro" && trocoPara) {
    mensagem += ` (troco para R$ ${trocoPara})`;
  }

  return mensagem;
}

export function gerarLinkWhatsApp(mensagem) {
  const numero = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const mensagemCodificada = encodeURIComponent(mensagem);
  return `https://wa.me/${numero}?text=${mensagemCodificada}`;
}