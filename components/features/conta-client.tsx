"use client";

import { useState } from "react";
import Link from "next/link";
import { usePerfil } from "@/contexts/perfil-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ContaClient() {
  const { perfil, definirPerfil } = usePerfil();
  const [nome, setNome] = useState(perfil.nome);
  const [salvo, setSalvo] = useState(false);

  function salvar() {
    const n = nome.trim() || "Convidado";
    definirPerfil({
      ...perfil,
      nome: n.slice(0, 24),
    });
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2000);
  }

  return (
    <div className="container max-w-lg">
      <p className="text-xs uppercase tracking-[0.2em] text-novlyx-accent/80">
        Conta
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
        Gerenciar perfil
      </h1>
      <p className="mt-2 text-sm text-white/45">
        Perfil local neste dispositivo. Nada é enviado para a internet.
      </p>

      <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <Avatar className="h-20 w-20 border border-white/10">
          <AvatarImage src={perfil.avatarUrl} alt={perfil.nome} />
          <AvatarFallback>{perfil.nome.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <div className="w-full space-y-2">
          <label className="text-xs text-white/50">Nome de exibição</label>
          <Input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            maxLength={24}
            className="h-12"
            placeholder="Seu nome"
          />
        </div>
        <Button
          type="button"
          onClick={salvar}
          className="min-h-11 w-full bg-novlyx-accent text-black hover:bg-novlyx-accent/90"
        >
          {salvo ? "Salvo" : "Salvar"}
        </Button>
      </div>

      <p className="mt-6 text-center text-xs text-white/35">
        <Link href="/configuracoes" className="text-novlyx-accent hover:underline">
          Configurações
        </Link>
        {" · "}
        <Link href="/" className="hover:underline">
          Voltar
        </Link>
      </p>
    </div>
  );
}
