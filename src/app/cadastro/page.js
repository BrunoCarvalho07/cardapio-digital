"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function CadastroPage() {
  const { cadastrar } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", senha: "" });
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      await cadastrar(form);
      router.push("/");
    } catch (err) {
      setErro(traduzErro(err.code));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6">Criar conta</h1>

      {erro && <p className="text-red-600 mb-4 text-sm">{erro}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text" placeholder="Nome completo" required
          className="w-full border rounded-lg p-3"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
        />
        <input
          type="email" placeholder="E-mail" required
          className="w-full border rounded-lg p-3"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="tel" placeholder="Telefone (com DDD)" required
          className="w-full border rounded-lg p-3"
          value={form.telefone}
          onChange={(e) => setForm({ ...form, telefone: e.target.value })}
        />
        <input
          type="password" placeholder="Senha (mín. 6 caracteres)" required minLength={6}
          className="w-full border rounded-lg p-3"
          value={form.senha}
          onChange={(e) => setForm({ ...form, senha: e.target.value })}
        />
        <button
          disabled={carregando}
          className="w-full bg-green-600 text-white rounded-lg p-3 font-semibold disabled:opacity-50"
        >
          {carregando ? "Criando conta..." : "Cadastrar"}
        </button>
      </form>

      <p className="text-sm mt-4 text-center">
        Já tem conta?{" "}
        <a href="/login" className="text-green-600 font-medium">Entrar</a>
      </p>
    </div>
  );
}

function traduzErro(code) {
  const mapa = {
    "auth/email-already-in-use": "Este e-mail já está cadastrado.",
    "auth/invalid-email": "E-mail inválido.",
    "auth/weak-password": "Senha muito fraca (mínimo 6 caracteres).",
  };
  return mapa[code] || "Erro ao cadastrar. Tente novamente.";
}