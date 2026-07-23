"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Logo from "@/components/Logo";

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
      setErro("E-mail ou senha invalidos.");
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
      setMensagem("Enviamos um link de redefinicao para seu e-mail.");
      setErro("");
    } catch {
      setErro("Nao foi possivel enviar o e-mail de redefinicao.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-azulejo/10 shadow-md p-6">
        <Logo />
        <h1 className="font-display font-bold text-2xl text-azulejo mb-6">Entrar</h1>

        {erro && <p className="text-telha mb-4 text-sm">{erro}</p>}
        {mensagem && <p className="text-green-700 mb-4 text-sm">{mensagem}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="E-mail" required className="w-full border border-grafite/15 rounded-xl p-3 focus:outline-none focus:border-azulejo" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Senha" required className="w-full border border-grafite/15 rounded-xl p-3 focus:outline-none focus:border-azulejo" value={senha} onChange={(e) => setSenha(e.target.value)} />
          <button disabled={carregando} className="w-full bg-dourado text-azulejo rounded-full p-3 font-semibold disabled:opacity-50 transition-transform hover:scale-[1.02]">
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <button onClick={handleResetSenha} className="text-sm text-grafite/60 mt-3 underline block mx-auto">
          Esqueci minha senha
        </button>

        <p className="text-sm mt-4 text-center text-grafite/70">
          Nao tem conta? <Link href="/cadastro" className="text-azulejo font-medium">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}