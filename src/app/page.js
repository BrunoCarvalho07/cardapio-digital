"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useCarrinho } from "@/context/CarrinhoContext";
import { useAuth } from "@/context/AuthContext";
import ProdutoCard from "@/components/ProdutoCard";
import Link from "next/link";

export default function HomePage() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const { itens, setItens } = useCarrinho();
  const { usuario, logout } = useAuth();

  useEffect(() => {
    async function buscarProdutos() {
      const snapshot = await getDocs(collection(db, "produtos"));
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProdutos(lista);
      setCarregando(false);
    }
    buscarProdutos();
  }, []);

  function adicionarAoCarrinho(produto) {
    setItens((itensAtuais) => {
      const existente = itensAtuais.find((i) => i.id === produto.id);
      if (existente) {
        return itensAtuais.map((i) =>
          i.id === produto.id ? { ...i, quantidade: i.quantidade + 1 } : i
        );
      }
      return [...itensAtuais, { ...produto, quantidade: 1 }];
    });
  }

  const totalItensCarrinho = itens.reduce((soma, i) => soma + i.quantidade, 0);

  const produtosPorCategoria = produtos.reduce((grupos, produto) => {
    const categoria = produto.categoria || "Outros";
    if (!grupos[categoria]) grupos[categoria] = [];
    grupos[categoria].push(produto);
    return grupos;
  }, {});

  return (
    <div className="max-w-5xl mx-auto p-4">
      <header className="flex items-center justify-between py-4">
        <h1 className="text-2xl font-bold text-gray-800">Cardapio Digital</h1>

        <div className="flex items-center gap-3">
          {usuario ? (
            <button onClick={logout} className="text-sm text-gray-600 underline">
              Sair ({usuario.displayName || usuario.email})
            </button>
          ) : (
            <Link href="/login" className="text-sm text-green-600 font-medium">Entrar</Link>
          )}

          <Link href="/carrinho" className="relative bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
            Carrinho
            {totalItensCarrinho > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItensCarrinho}
              </span>
            )}
          </Link>
        </div>
      </header>

      {carregando ? (
        <p className="text-center text-gray-500 mt-10">Carregando cardapio...</p>
      ) : produtos.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          Nenhum produto cadastrado ainda.
        </p>
      ) : (
        Object.entries(produtosPorCategoria).map(([categoria, itensCategoria]) => (
          <section key={categoria} className="mt-8">
            <h2 className="text-xl font-bold text-gray-700 mb-4">{categoria}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {itensCategoria.map((produto) => (
                <ProdutoCard
                  key={produto.id}
                  produto={produto}
                  aoAdicionar={adicionarAoCarrinho}
                />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}