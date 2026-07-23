"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login, resetarSenha } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      await login({ email, senha });
      router.push("/");
    } catch {
      setErro("E-mail ou senha inválidos.");
    } finally {
      setCarregando(false);
    }
  }

  async function handleResetSenha() {
    if (!email) {
      setErro("Digite seu e-mail acima primeiro.");
      return;
    }
    try {
      await resetarSenha(email);
      setMensagem("Enviamos um link de redefinição para seu e-mail.");
      setErro("");
    } catch {
      setErro("Não foi possível enviar o e-mail de redefinição.");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6">Entrar</h1>

      {erro && <p className="text-red-600 mb-4 text-sm">{erro}</p>}
      {mensagem && <p className="text-green-600 mb-4 text-sm">{mensagem}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email" placeholder="E-mail" required
          className="w-full border rounded-lg p-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password" placeholder="Senha" required
          className="w-full border rounded-lg p-3"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <button
          disabled={carregando}
          className="w-full bg-green-600 text-white rounded-lg p-3 font-semibold disabled:opacity-50"
        >
          {carregando ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <button
        onClick={handleResetSenha}
        className="text-sm text-gray-600 mt-3 underline block mx-auto"
      >
        Esqueci minha senha
      </button>

      <p className="text-sm mt-4 text-center">
        Não tem conta?{" "}
        <a href="/cadastro" className="text-green-600 font-medium">Cadastre-se</a>
      </p>
    </div>
  );
}