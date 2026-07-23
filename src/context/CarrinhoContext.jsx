"use client";

import { createContext, useContext, useState } from "react";

const CarrinhoContext = createContext(null);

export function CarrinhoProvider({ children }) {
  const [itens, setItens] = useState([]);

  function removerItem(produtoId) {
    setItens((atuais) => atuais.filter((i) => i.id !== produtoId));
  }

  function alterarQuantidade(produtoId, novaQuantidade) {
    if (novaQuantidade < 1) {
      removerItem(produtoId);
      return;
    }
    setItens((atuais) =>
      atuais.map((i) =>
        i.id === produtoId ? { ...i, quantidade: novaQuantidade } : i
      )
    );
  }

  function limparCarrinho() {
    setItens([]);
  }

  const subtotal = itens.reduce((soma, i) => soma + i.preco * i.quantidade, 0);

  return (
    <CarrinhoContext.Provider
      value={{ itens, setItens, removerItem, alterarQuantidade, limparCarrinho, subtotal }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  return useContext(CarrinhoContext);
}