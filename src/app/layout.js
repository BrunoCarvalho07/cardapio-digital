import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CarrinhoProvider } from "@/context/CarrinhoContext";

export const metadata = {
  title: "Cardápio Digital",
  description: "Faça seu pedido online",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 min-h-screen">
        <AuthProvider>
          <CarrinhoProvider>{children}</CarrinhoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}