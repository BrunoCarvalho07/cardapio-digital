"use client";

import { useState } from "react";
import Link from "next/link";
import { useCarrinho } from "@/context/CarrinhoContext";
import { buscarEnderecoPorCep } from "@/lib/viacep";
import { gerarNumeroPedido, montarMensagemPedido, gerarLinkWhatsApp } from "@/lib/whatsapp";

export default function CheckoutPage() {
  const { itens, subtotal, limparCarrinho } = useCarrinho();

  const [endereco, setEndereco] = useState({
    cep: "", logradouro: "", bairro: "", cidade: "", estado: "", numero: "", complemento: "",
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
    const mensagem = montarMensagemPedido({ numeroPedido, itens, subtotal, endereco, formaPagamento, trocoPara });
    const link = gerarLinkWhatsApp(mensagem);

    window.open(link, "_blank");
    limparCarrinho();
  }

  if (itens.length === 0) {
    return (
      <div className="max-w-md mx-auto p-4 text-center mt-16">
        <p className="text-grafite/60">Seu carrinho esta vazio.</p>
        <Link href="/" className="inline-block mt-4 bg-dourado text-azulejo px-5 py-2 rounded-full font-semibold">
          Ver cardapio
        </Link>
      </div>
    );
  }

  const inputClass = "w-full border border-grafite/15 rounded-xl p-3 mt-1 focus:outline-none focus:border-azulejo";
  const inputReadClass = "w-full border border-grafite/15 rounded-xl p-3 mt-1 bg-porcelana focus:outline-none focus:border-azulejo";

  return (
    <div className="min-h-screen">
      <header className="bg-azulejo px-4 pt-6 pb-8">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <h1 className="font-display font-bold text-2xl text-porcelana">Finalizar Pedido</h1>
          <Link href="/carrinho" className="text-sm text-porcelana/90 font-medium">Voltar</Link>
        </div>
      </header>
      <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="w-full h-5 block">
        <path d="M0,0 H1200 V10 Q1150,30 1100,10 Q1050,30 1000,10 Q950,30 900,10 Q850,30 800,10 Q750,30 700,10 Q650,30 600,10 Q550,30 500,10 Q450,30 400,10 Q350,30 300,10 Q250,30 200,10 Q150,30 100,10 Q50,30 0,10 Z" fill="#1B4965" />
      </svg>

      <div className="max-w-md mx-auto p-4">
        <div className="bg-white rounded-2xl border border-azulejo/10 shadow-sm p-4 space-y-3">
          <h2 className="font-display font-semibold text-lg text-azulejo">Endereco de entrega</h2>

          <div>
            <label className="text-sm text-grafite/60">CEP</label>
            <input type="text" placeholder="00000-000" maxLength={9} className={inputClass} value={endereco.cep} onChange={handleCepChange} />
            {buscandoCep && <p className="text-sm text-grafite/40 mt-1">Buscando endereco...</p>}
            {erroCep && <p className="text-sm text-telha mt-1">{erroCep}</p>}
          </div>

          <div>
            <label className="text-sm text-grafite/60">Rua</label>
            <input type="text" className={inputReadClass} value={endereco.logradouro} onChange={(e) => setEndereco({ ...endereco, logradouro: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-grafite/60">Numero</label>
              <input type="text" className={inputClass} value={endereco.numero} onChange={(e) => setEndereco({ ...endereco, numero: e.target.value })} />
            </div>
            <div>
              <label className="text-sm text-grafite/60">Complemento</label>
              <input type="text" placeholder="Apto, bloco..." className={inputClass} value={endereco.complemento} onChange={(e) => setEndereco({ ...endereco, complemento: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="text-sm text-grafite/60">Bairro</label>
            <input type="text" className={inputReadClass} value={endereco.bairro} onChange={(e) => setEndereco({ ...endereco, bairro: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-grafite/60">Cidade</label>
              <input type="text" className={inputReadClass} value={endereco.cidade} onChange={(e) => setEndereco({ ...endereco, cidade: e.target.value })} />
            </div>
            <div>
              <label className="text-sm text-grafite/60">Estado</label>
              <input type="text" className={inputReadClass} value={endereco.estado} onChange={(e) => setEndereco({ ...endereco, estado: e.target.value })} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-azulejo/10 shadow-sm p-4 mt-4 space-y-3">
          <h2 className="font-display font-semibold text-lg text-azulejo">Forma de pagamento</h2>

          {["Pix", "Cartao de Credito", "Cartao de Debito", "Dinheiro"].map((opcao) => (
            <label key={opcao} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="pagamento" value={opcao} checked={formaPagamento === opcao} onChange={(e) => setFormaPagamento(e.target.value)} className="accent-azulejo" />
              <span>{opcao}</span>
            </label>
          ))}

          {formaPagamento === "Dinheiro" && (
            <div>
              <label className="text-sm text-grafite/60">Troco para quanto?</label>
              <input type="text" placeholder="Ex: 50,00 (opcional)" className={inputClass} value={trocoPara} onChange={(e) => setTrocoPara(e.target.value)} />
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-azulejo/10 shadow-sm p-4 mt-4">
          <div className="flex justify-between text-xl font-display font-bold text-azulejo">
            <span>Total</span>
            <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
          </div>
        </div>

        {erroValidacao && <p className="text-telha text-sm mt-3 text-center">{erroValidacao}</p>}

        <button onClick={handleEnviarPedido} className="w-full bg-dourado text-azulejo py-3 rounded-full font-semibold mt-4 transition-transform hover:scale-[1.02]">
          Enviar pedido pelo WhatsApp
        </button>
      </div>
    </div>
  );
}