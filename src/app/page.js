"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useCarrinho } from "@/context/CarrinhoContext";
import { useAuth } from "@/context/AuthContext";
import ProdutoCard from "@/components/ProdutoCard";
import Reveal from "@/components/Reveal";
import Link from "next/link";

export default function HomePage() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [rolou, setRolou] = useState(false);
  const { itens, setItens } = useCarrinho();
  const { usuario, logout } = useAuth();

  useEffect(() => {
    async function buscarProdutos() {
      const snapshot = await getDocs(collection(db, "produtos"));
      const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProdutos(lista);
      setCarregando(false);
    }
    buscarProdutos();
  }, []);

  useEffect(() => {
    function handleScroll() {
      setRolou(window.scrollY > 10);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function adicionarAoCarrinho(produto) {
    setItens((itensAtuais) => {
      const existente = itensAtuais.find((i) => i.id === produto.id);
      if (existente) {
        return itensAtuais.map((i) => i.id === produto.id ? { ...i, quantidade: i.quantidade + 1 } : i);
      }
      return [...itensAtuais, { ...produto, quantidade: 1 }];
    });
  }

  const totalItensCarrinho = itens.reduce((soma, i) => soma + i.quantidade, 0);

  const categorias = ["Todos", ...Array.from(new Set(produtos.map((p) => p.categoria || "Outros")))];

  const produtosFiltrados = produtos.filter((produto) => {
    const combinaCategoria = categoriaAtiva === "Todos" || produto.categoria === categoriaAtiva;
    const combinaBusca = produto.nome.toLowerCase().includes(busca.toLowerCase());
    return combinaCategoria && combinaBusca;
  });

  const produtosPorCategoria = produtosFiltrados.reduce((grupos, produto) => {
    const categoria = produto.categoria || "Outros";
    if (!grupos[categoria]) grupos[categoria] = [];
    grupos[categoria].push(produto);
    return grupos;
  }, {});

  return (
    <div className="min-h-screen">
      <div className={rolou ? "sticky top-0 z-20 shadow-lg transition-shadow duration-300" : "sticky top-0 z-20 transition-shadow duration-300"}>
        <header className="bg-azulejo px-4 pt-6 pb-8">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <h1 className="font-display font-bold text-2xl md:text-3xl text-porcelana">Cardapio Digital</h1>
            <div className="flex items-center gap-3">
              {usuario ? (
                <button onClick={logout} className="text-sm text-porcelana/80 underline">Sair ({usuario.displayName || usuario.email})</button>
              ) : (
                <Link href="/login" className="text-sm text-porcelana/90 font-medium">Entrar</Link>
              )}
              <Link href="/carrinho" className="relative bg-dourado text-azulejo px-4 py-2 rounded-full text-sm font-semibold transition-transform hover:scale-105">
                Carrinho
                {totalItensCarrinho > 0 && (
                  <span className="absolute -top-2 -right-2 bg-telha text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{totalItensCarrinho}</span>
                )}
              </Link>
            </div>
          </div>
        </header>
        <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="w-full h-5 block">
          <path d="M0,0 H1200 V10 Q1150,30 1100,10 Q1050,30 1000,10 Q950,30 900,10 Q850,30 800,10 Q750,30 700,10 Q650,30 600,10 Q550,30 500,10 Q450,30 400,10 Q350,30 300,10 Q250,30 200,10 Q150,30 100,10 Q50,30 0,10 Z" fill="#1B4965" />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <div className="relative mt-6">
          <input
            type="text"
            placeholder="Buscar no cardapio..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full border border-grafite/15 bg-white rounded-full pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-azulejo"
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-grafite/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
        </div>

        <div className="flex gap-2 overflow-x-auto mt-4 pb-2">
          {categorias.map((categoria) => (
            <button
              key={categoria}
              onClick={() => setCategoriaAtiva(categoria)}
              className={categoriaAtiva === categoria ? "whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border bg-azulejo text-porcelana border-azulejo transition-colors" : "whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border bg-white text-grafite/70 border-grafite/15 transition-colors hover:border-azulejo"}
            >
              {categoria}
            </button>
          ))}
        </div>

        {carregando ? (
          <p className="text-center text-grafite/50 mt-10">Carregando cardapio...</p>
        ) : produtosFiltrados.length === 0 ? (
          <p className="text-center text-grafite/50 mt-10">Nenhum produto encontrado.</p>
        ) : (
          Object.entries(produtosPorCategoria).map(([categoria, itensCategoria]) => (
            <Reveal key={categoria}>
              <section className="mt-8">
                <h2 className="font-display font-semibold text-xl text-azulejo mb-4">{categoria}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-4">
                  {itensCategoria.map((produto) => (
                    <ProdutoCard key={produto.id} produto={produto} aoAdicionar={adicionarAoCarrinho} />
                  ))}
                </div>
              </section>
            </Reveal>
          ))
        )}

        <div className="h-10"></div>
      </div>
    </div>
  );
}