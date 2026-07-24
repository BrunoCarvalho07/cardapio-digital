import "./globals.css";
import { Fraunces, Work_Sans } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { CarrinhoProvider } from "@/context/CarrinhoContext";
import Footer from "@/components/Footer";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["500", "600", "700"],
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Cardapio Digital",
  description: "Faca seu pedido online",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${workSans.variable}`}>
      <body className="bg-porcelana min-h-screen font-sans text-grafite">
        <AuthProvider>
          <CarrinhoProvider>{children}</CarrinhoProvider>
        </AuthProvider>
        <Footer />
      </body>
    </html>
  );
}