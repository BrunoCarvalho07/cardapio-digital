"use client";

import { useCarrinho } from "@/context/CarrinhoContext";
import CarrinhoItem from "@/components/CarrinhoItem";
import Link from "next/link";

export default function CarrinhoPage() {
  const { itens, alterarQuantidade, removerItem, subtotal } = useCarrinho();

  const taxaEntrega = 0;
  const total = subtotal + taxaEntrega;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-between py-4">
        <h1 className="text-2xl font-bold text-gray-800">Seu Carrinho</h1>
        <Link href="/" className="text-sm text-green-600 font-medium">Voltar ao cardapio</Link>
      </div>

      {itens.length === 0 ? (
        <div className="text-center mt-16">
          <p className="text-gray-500">Seu carrinho esta vazio.</p>
          <Link href="/" className="inline-block mt-4 bg-green-600 text-white px-5 py-2 rounded-lg font-semibold">
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

          <div className="bg-white rounded-lg shadow p-4 mt-6 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
            </div>
            <div className="flex justify-between text-xl font-bold pt-2 border-t">
              <span>Total</span>
              <span>R$ {total.toFixed(2).replace(".", ",")}</span>
            </div>
          </div>

          <Link href="/checkout" className="block text-center bg-green-600 text-white py-3 rounded-lg font-semibold mt-4">
            Continuar para entrega e pagamento
          </Link>
        </>
      )}
    </div>
  );
}