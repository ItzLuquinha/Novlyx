import type { Metadata } from "next";
import { PaginaLegal, Secao } from "@/components/shared/pagina-legal";

export const metadata: Metadata = {
  title: "Termos de Uso | NOVLYX",
  description: "Termos e condições de uso da plataforma NOVLYX.",
};

const DATA = "7 de agosto de 2026";

export default function PaginaTermos() {
  return (
    <PaginaLegal titulo="Termos de Uso" atualizado={DATA}>
      <Secao titulo="1. Aceitação">
        <p>
          Ao acessar ou utilizar a NOVLYX (“Plataforma”, “nós”), você concorda
          com estes Termos de Uso e com a Política de Privacidade. Se não
          concordar, não utilize o serviço.
        </p>
      </Secao>

      <Secao titulo="2. Natureza do serviço">
        <p>
          A NOVLYX é uma interface de navegação e agregação de informações sobre
          filmes, séries, animes, doramas e conteúdos relacionados. A Plataforma
          pode exibir metadados (títulos, capas, sinopses) obtidos de fontes
          públicas de terceiros e incorporar players hospedados por serviços
          externos.
        </p>
        <p>
          <strong className="text-white/90">
            A NOVLYX não hospeda, armazena, envia nem distribui arquivos de
            vídeo.
          </strong>{" "}
          Qualquer reprodução ocorre exclusivamente nos servidores e
          responsabilidades dos provedores de terceiros incorporados via
          iframe ou link.
        </p>
      </Secao>

      <Secao titulo="3. Conteúdo de terceiros">
        <p>
          Links, embeds e APIs de terceiros podem mudar, ficar indisponíveis ou
          conter material sobre o qual não temos controle editorial. Não
          garantimos disponibilidade, qualidade, legenda, dublagem, legalidade
          ou continuidade desses serviços.
        </p>
        <p>
          Você é o único responsável por verificar se o uso de qualquer conteúdo
          está de acordo com as leis do seu país e com os direitos dos
          respectivos titulares.
        </p>
      </Secao>

      <Secao titulo="4. Uso permitido">
        <p>Você se compromete a:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>usar a Plataforma apenas de forma lícita e pessoal;</li>
          <li>
            não tentar sobrecarregar, invadir, automatizar de forma abusiva ou
            explorar falhas da Plataforma;
          </li>
          <li>
            não utilizar a NOVLYX para redistribuir, revender ou comercializar
            conteúdo audiovisual de terceiros;
          </li>
          <li>
            não remover avisos legais, marcas ou créditos eventualmente
            exibidos.
          </li>
        </ul>
      </Secao>

      <Secao titulo="5. Contas e dados locais">
        <p>
          Recursos como “Minha Lista” ou “Continuar assistindo” podem ser
          gravados apenas no seu dispositivo (ex.: armazenamento local do
          navegador). Não garantimos sincronização entre aparelhos nem
          recuperação definitiva desses dados.
        </p>
      </Secao>

      <Secao titulo="6. Isenção de garantias">
        <p>
          A Plataforma é oferecida “como está” e “conforme disponível”, sem
          garantias de qualquer tipo, expressas ou implícitas, incluindo
          adequação a um fim específico, ausência de erros ou interrupções.
        </p>
      </Secao>

      <Secao titulo="7. Limitação de responsabilidade">
        <p>
          Na máxima extensão permitida pela lei aplicável, a NOVLYX, seus
          operadores e colaboradores não respondem por:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            danos decorrentes de conteúdo, anúncios ou players de terceiros;
          </li>
          <li>perda de dados, lucros ou oportunidades;</li>
          <li>
            problemas de conexão, dispositivos, malware ou sites externos
            abertos a partir da Plataforma;
          </li>
          <li>
            reclamações de direitos autorais relativas a material não hospedado
            por nós.
          </li>
        </ul>
      </Secao>

      <Secao titulo="8. Propriedade intelectual">
        <p>
          Marcas, layout, logotipo e código da interface NOVLYX pertencem aos
          seus respectivos titulares. Títulos, pôsteres, trailers e obras
          audiovisuais pertencem aos seus legítimos detentores de direitos.
        </p>
        <p>
          Notificações de direitos autorais sobre material que acreditamos estar
          indevidamente referenciado podem ser enviadas pelos canais indicados
          na Central de Ajuda. Analisaremos pedidos legítimos de remoção de
          links ou embeds quando aplicável.
        </p>
      </Secao>

      <Secao titulo="9. Publicidade e links externos">
        <p>
          Players e páginas de terceiros podem exibir anúncios, redirecionamentos
          ou coletar dados próprios. Não controlamos essas práticas e não somos
          responsáveis por elas.
        </p>
      </Secao>

      <Secao titulo="10. Menores de idade">
        <p>
          O serviço não é direcionado a menores de 18 anos. Responsáveis legais
          devem supervisionar o uso por menores e a adequação da classificação
          indicativa dos conteúdos.
        </p>
      </Secao>

      <Secao titulo="11. Alterações">
        <p>
          Podemos alterar estes Termos a qualquer momento. A data de
          “Última atualização” no topo reflete a versão vigente. O uso
          continuado após mudanças constitui aceitação.
        </p>
      </Secao>

      <Secao titulo="12. Lei aplicável">
        <p>
          Estes Termos são interpretados conforme as leis da República
          Federativa do Brasil, sem prejuízo de normas imperativas do local do
          usuário. Foro preferencial: comarca do operador da Plataforma, salvo
          disposição legal em contrário em favor do consumidor.
        </p>
      </Secao>

      <Secao titulo="13. Contato">
        <p>
          Dúvidas sobre estes Termos: utilize a{" "}
          <a href="/central-de-ajuda" className="text-novlyx-accent hover:underline">
            Central de Ajuda
          </a>
          .
        </p>
      </Secao>
    </PaginaLegal>
  );
}
