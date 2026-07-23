"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-azulejo/10 shadow-md p-6">
        <h1 className="font-display font-bold text-2xl text-azulejo mb-6">Criar conta</h1>

        {erro && <p className="text-telha mb-4 text-sm">{erro}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Nome completo" required className="w-full border border-grafite/15 rounded-xl p-3 focus:outline-none focus:border-azulejo" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
          <input type="email" placeholder="E-mail" required className="w-full border border-grafite/15 rounded-xl p-3 focus:outline-none focus:border-azulejo" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input type="tel" placeholder="Telefone (com DDD)" required className="w-full border border-grafite/15 rounded-xl p-3 focus:outline-none focus:border-azulejo" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} />
          <input type="password" placeholder="Senha (min. 6 caracteres)" required minLength={6} className="w-full border border-grafite/15 rounded-xl p-3 focus:outline-none focus:border-azulejo" value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} />
          <button disabled={carregando} className="w-full bg-dourado text-azulejo rounded-full p-3 font-semibold disabled:opacity-50 transition-transform hover:scale-[1.02]">
            {carregando ? "Criando conta..." : "Cadastrar"}
          </button>
        </form>

        <p className="text-sm mt-4 text-center text-grafite/70">
          Ja tem conta? <Link href="/login" className="text-azulejo font-medium">Entrar</Link>
        </p>
      </div>
    </div>
  );
}

function traduzErro(code) {
  const mapa = {
    "auth/email-already-in-use": "Este e-mail ja esta cadastrado.",
    "auth/invalid-email": "E-mail invalido.",
    "auth/weak-password": "Senha muito fraca (minimo 6 caracteres).",
  };
  return mapa[code] || "Erro ao cadastrar. Tente novamente.";
}