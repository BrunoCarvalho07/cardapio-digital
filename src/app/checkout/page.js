"use client";

import { useState } from "react";
import Link from "next/link";
import { useCarrinho } from "@/context/CarrinhoContext";
import { buscarEnderecoPorCep } from "@/lib/viacep";
import { gerarNumeroPedido, montarMensagemPedido, gerarLinkWhatsApp } from "@/lib/whatsapp";

export default function CheckoutPage() {
  const { itens, subtotal, limparCarrinho } = useCarrinho();

  const [endereco, setEndereco] = useState({
    cep: "",
    logradouro: "",
    bairro: "",
    cidade: "",
    estado: "",
    numero: "",
    complemento: "",
  });

  const [buscandoCep, setBuscandoCep] = useState(false);
  const [erroCep, setErroCep] = useState("");
  const [erroValidacao, setErroValidacao] = useState("");

  const [formaPagamento, setFormaPagamento] = useState("Pix");
  const [trocoPara, setTrocoPara] = useState("");

  async function handleCepChange(e) {
    const cep = e.target.value;
    setEndereco((atual) => ({ ...atual, cep }));
    setErroCep("");

    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      setBuscandoCep(true);
      try {
        const dados = await buscarEnderecoPorCep(cep);
        setEndereco((atual) => ({ ...atual, ...dados }));
      } catch (err) {
        setErroCep(err.message);
      } finally {
        setBuscandoCep(false);
      }
    }
  }

  function handleEnviarPedido() {
    setErroValidacao("");

    if (!endereco.cep || !endereco.logradouro || !endereco.numero) {
      setErroValidacao("Preencha o CEP, rua e numero antes de continuar.");
      return;
    }

    const numeroPedido = gerarNumeroPedido();

    const mensagem = montarMensagemPedido({
      numeroPedido,
      itens,
      subtotal,
      endereco,
      formaPagamento,
      trocoPara,
    });

    const link = gerarLinkWhatsApp(mensagem);

    window.open(link, "_blank");

    limparCarrinho();
  }

  if (itens.length === 0) {
    return (
      <div className="max-w-md mx-auto p-4 text-center mt-16">
        <p className="text-gray-500">Seu carrinho esta vazio.</p>
        <Link href="/" className="inline-block mt-4 bg-green-600 text-white px-5 py-2 rounded-lg font-semibold">
          Ver cardapio
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="flex items-center justify-between py-4">
        <h1 className="text-2xl font-bold text-gray-800">Finalizar Pedido</h1>
        <Link href="/carrinho" className="text-sm text-green-600 font-medium">Voltar</Link>
      </div>

      <div className="bg-white rounded-lg shadow p-4 space-y-3">
        <h2 className="font-bold text-lg">Endereco de entrega</h2>

        <div>
          <label className="text-sm text-gray-600">CEP</label>
          <input
            type="text"
            placeholder="00000-000"
            maxLength={9}
            className="w-full border rounded-lg p-3 mt-1"
            value={endereco.cep}
            onChange={handleCepChange}
          />
          {buscandoCep && <p className="text-sm text-gray-400 mt-1">Buscando endereco...</p>}
          {erroCep && <p className="text-sm text-red-600 mt-1">{erroCep}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-600">Rua</label>
          <input
            type="text"
            className="w-full border rounded-lg p-3 mt-1 bg-gray-50"
            value={endereco.logradouro}
            onChange={(e) => setEndereco({ ...endereco, logradouro: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600">Numero</label>
            <input
              type="text"
              className="w-full border rounded-lg p-3 mt-1"
              value={endereco.numero}
              onChange={(e) => setEndereco({ ...endereco, numero: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Complemento</label>
            <input
              type="text"
              placeholder="Apto, bloco..."
              className="w-full border rounded-lg p-3 mt-1"
              value={endereco.complemento}
              onChange={(e) => setEndereco({ ...endereco, complemento: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600">Bairro</label>
          <input
            type="text"
            className="w-full border rounded-lg p-3 mt-1 bg-gray-50"
            value={endereco.bairro}
            onChange={(e) => setEndereco({ ...endereco, bairro: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600">Cidade</label>
            <input
              type="text"
              className="w-full border rounded-lg p-3 mt-1 bg-gray-50"
              value={endereco.cidade}
              onChange={(e) => setEndereco({ ...endereco, cidade: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Estado</label>
            <input
              type="text"
              className="w-full border rounded-lg p-3 mt-1 bg-gray-50"
              value={endereco.estado}
              onChange={(e) => setEndereco({ ...endereco, estado: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mt-4 space-y-3">
        <h2 className="font-bold text-lg">Forma de pagamento</h2>

        {["Pix", "Cartao de Credito", "Cartao de Debito", "Dinheiro"].map((opcao) => (
          <label key={opcao} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="pagamento"
              value={opcao}
              checked={formaPagamento === opcao}
              onChange={(e) => setFormaPagamento(e.target.value)}
            />
            <span>{opcao}</span>
          </label>
        ))}

        {formaPagamento === "Dinheiro" && (
          <div>
            <label className="text-sm text-gray-600">Troco para quanto?</label>
            <input
              type="text"
              placeholder="Ex: 50,00 (opcional)"
              className="w-full border rounded-lg p-3 mt-1"
              value={trocoPara}
              onChange={(e) => setTrocoPara(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-4 mt-4">
        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>
          <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
        </div>
      </div>

      {erroValidacao && (
        <p className="text-red-600 text-sm mt-3 text-center">{erroValidacao}</p>
      )}

      <button
        onClick={handleEnviarPedido}
        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold mt-4"
      >
        Enviar pedido pelo WhatsApp
      </button>
    </div>
  );
}