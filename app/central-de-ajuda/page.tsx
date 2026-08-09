import type { Metadata } from "next";
import { PaginaLegal, Secao } from "@/components/shared/pagina-legal";

export const metadata: Metadata = {
  title: "Central de Ajuda | NOVLYX",
  description: "Ajuda, avisos legais e canais de contato da NOVLYX.",
};

const DATA = "7 de agosto de 2026";

export default function PaginaAjuda() {
  return (
    <PaginaLegal titulo="Central de Ajuda" atualizado={DATA}>
      <Secao titulo="O que é a NOVLYX?">
        <p>
          É uma interface para descobrir e organizar títulos (filmes, séries,
          animes e doramas). Metadados vêm de APIs públicas; a reprodução, quando
          disponível, ocorre em players de terceiros.
        </p>
      </Secao>

      <Secao titulo="O vídeo não carrega">
        <ul className="list-disc space-y-1 pl-5">
          <li>Troque a fonte do player (BR → Multiembed → 2Embed → VidSrc).</li>
          <li>Desative bloqueadores de anúncio temporariamente no embed.</li>
          <li>Teste outra rede ou o medidor de conexão no final da home.</li>
        </ul>
      </Secao>

      <Secao titulo="Dublagem e legendas em português">
        <p>
          Nem todo título possui áudio ou legenda em PT nas fontes disponíveis.
          Quando existir, selecione no menu interno do player.
        </p>
      </Secao>

      <Secao titulo="Aviso importante sobre direitos autorais">
        <p>
          A NOVLYX não hospeda filmes nem séries. Se você é titular de direitos e
          acredita que um link ou embed na interface aponta indevidamente para
          material protegido, envie notificação com:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>identificação do titular e contato;</li>
          <li>URL da página na NOVLYX;</li>
          <li>descrição da obra e do material contestado;</li>
          <li>declaração de boa-fé de que é o titular ou representante.</li>
        </ul>
        <p>
          Analisaremos pedidos legítimos e poderemos remover referências ou
          embeds sob nosso controle editorial da interface.
        </p>
      </Secao>

      <Secao titulo="Contato">
        <p>
          Para termos, privacidade ou notificações de direitos, utilize o e-mail
          de contato configurado pelo operador do site (substitua pelo seu e-mail
          real antes de publicar em produção):
        </p>
        <p className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-mono text-novlyx-gold">
          rianbraga718@gmail.com
        </p>
        <p className="text-xs text-white/40">
          Troque o endereço acima pelo seu e-mail verdadeiro no código-fonte
          antes de colocar no ar.
        </p>
      </Secao>

      <Secao titulo="Documentos">
        <p>
          <a href="/termos" className="text-novlyx-gold hover:underline">
            Termos de Uso
          </a>
          {" · "}
          <a href="/privacidade" className="text-novlyx-gold hover:underline">
            Política de Privacidade
          </a>
        </p>
      </Secao>
    </PaginaLegal>
  );
}
