"use client";

import { useCarrinho } from "@/context/CarrinhoContext";
import CarrinhoItem from "@/components/CarrinhoItem";
import Link from "next/link";

export default function CarrinhoPage() {
  const { itens, alterarQuantidade, removerItem, subtotal } = useCarrinho();

  const taxaEntrega = 0;
  const total = subtotal + taxaEntrega;

  return (
    <div className="min-h-screen">
      <header className="bg-azulejo px-4 pt-6 pb-8">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="font-display font-bold text-2xl text-porcelana">Seu Carrinho</h1>
          <Link href="/" className="text-sm text-porcelana/90 font-medium">Voltar ao cardapio</Link>
        </div>
      </header>
      <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="w-full h-5 block">
        <path d="M0,0 H1200 V10 Q1150,30 1100,10 Q1050,30 1000,10 Q950,30 900,10 Q850,30 800,10 Q750,30 700,10 Q650,30 600,10 Q550,30 500,10 Q450,30 400,10 Q350,30 300,10 Q250,30 200,10 Q150,30 100,10 Q50,30 0,10 Z" fill="#1B4965" />
      </svg>

      <div className="max-w-2xl mx-auto p-4">
        {itens.length === 0 ? (
          <div className="text-center mt-16">
            <p className="text-grafite/60">Seu carrinho esta vazio.</p>
            <Link href="/" className="inline-block mt-4 bg-dourado text-azulejo px-5 py-2 rounded-full font-semibold transition-transform hover:scale-105">
              Ver cardapio
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {itens.map((item) => (
                <CarrinhoItem
                  key={item.id}
                  item={item}
                  aoAlterarQuantidade={alterarQuantidade}
                  aoRemover={removerItem}
                />
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-azulejo/10 shadow-sm p-4 mt-6 space-y-2">
              <div className="flex justify-between text-grafite/60">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex justify-between text-xl font-display font-bold pt-2 border-t border-dashed border-grafite/20 text-azulejo">
                <span>Total</span>
                <span>R$ {total.toFixed(2).replace(".", ",")}</span>
              </div>
            </div>

            <Link href="/checkout" className="block text-center bg-dourado text-azulejo py-3 rounded-full font-semibold mt-4 transition-transform hover:scale-[1.02]">
              Continuar para entrega e pagamento
            </Link>
          </>
        )}
      </div>
    </div>
  );
}