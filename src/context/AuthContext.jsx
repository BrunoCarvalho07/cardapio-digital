"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCarregando(false);
    });
    return () => unsubscribe();
  }, []);

  async function cadastrar({ nome, email, telefone, senha }) {
    const cred = await createUserWithEmailAndPassword(auth, email, senha);
    await updateProfile(cred.user, { displayName: nome });

    await setDoc(doc(db, "usuarios", cred.user.uid), {
      nome,
      email,
      telefone,
      criadoEm: new Date().toISOString(),
    });

    return cred.user;
  }

  async function login({ email, senha }) {
    const cred = await signInWithEmailAndPassword(auth, email, senha);
    return cred.user;
  }

  async function logout() {
    await signOut(auth);
  }

  async function resetarSenha(email) {
    await sendPasswordResetEmail(auth, email);
  }

  return (
    <AuthContext.Provider
      value={{ usuario, carregando, cadastrar, login, logout, resetarSenha }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}