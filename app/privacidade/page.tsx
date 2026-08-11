import type { Metadata } from "next";
import { PaginaLegal, Secao } from "@/components/shared/pagina-legal";

export const metadata: Metadata = {
  title: "Privacidade | NOVLYX",
  description: "Política de Privacidade da NOVLYX.",
};

const DATA = "7 de agosto de 2026";

export default function PaginaPrivacidade() {
  return (
    <PaginaLegal titulo="Política de Privacidade" atualizado={DATA}>
      <Secao titulo="1. Introdução">
        <p>
          Esta Política descreve como a NOVLYX trata informações no uso da
          Plataforma. Ao utilizar o serviço, você declara ter lido e compreendido
          este documento.
        </p>
      </Secao>

      <Secao titulo="2. Dados que podemos processar">
        <p>
          Em regra, a NOVLYX é pensada para funcionar com o mínimo de dados
          pessoais. Podemos tratar:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong className="text-white/90">Dados técnicos:</strong> endereço
            IP, tipo de navegador, páginas acessadas, horários e logs de
            servidor (quando hospedados por nós ou pelo provedor de hospedagem);
          </li>
          <li>
            <strong className="text-white/90">Dados locais no dispositivo:</strong>{" "}
            preferências, lista de favoritos e progresso de reprodução
            eventualmente salvos no armazenamento local do navegador;
          </li>
          <li>
            <strong className="text-white/90">Medições de conexão:</strong> se
            você usar o medidor de internet da home, o teste ocorre no seu
            navegador e o resultado não precisa ser enviado a nossos servidores.
          </li>
        </ul>
        <p>
          Não solicitamos cadastro com nome, CPF, cartão de crédito ou documentos
          como condição padrão de uso da interface atual.
        </p>
      </Secao>

      <Secao titulo="3. Finalidades">
        <p>Utilizamos informações técnicas para:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>manter a Plataforma funcionando e segura;</li>
          <li>diagnosticar erros e abuso;</li>
          <li>melhorar desempenho e experiência de navegação;</li>
          <li>cumprir obrigações legais quando exigido.</li>
        </ul>
      </Secao>

      <Secao titulo="4. Cookies e tecnologias similares">
        <p>
          Podemos usar cookies essenciais ou armazenamento local para lembrar
          preferências e funcionamento básico. Você pode limpar ou bloquear
          cookies nas configurações do navegador; algumas funções podem deixar de
          funcionar.
        </p>
      </Secao>

      <Secao titulo="5. Serviços de terceiros">
        <p>
          A Plataforma consome APIs e embeds de terceiros (metadados, imagens,
          players de vídeo). Esses serviços têm políticas próprias e podem
          coletar dados independentemente (incluindo IP, cookies e
          identificadores). Recomendamos a leitura das políticas de cada
          provedor.
        </p>
        <p>
          <strong className="text-white/90">
            Não controlamos e não somos responsáveis pelo tratamento de dados
            realizado por sites, APIs ou players externos.
          </strong>
        </p>
      </Secao>

      <Secao titulo="6. Compartilhamento">
        <p>
          Não vendemos dados pessoais. Podemos compartilhar informações técnicas
          com prestadores de infraestrutura (hospedagem, CDN, análise de erros)
          estritamente para operação do serviço, ou quando exigido por lei,
          ordem judicial ou proteção de direitos.
        </p>
      </Secao>

      <Secao titulo="7. Retenção">
        <p>
          Logs de servidor, quando existirem, são mantidos pelo tempo necessário
          à segurança e operação, ou conforme exigência legal. Dados no seu
          navegador permanecem até você limpá-los.
        </p>
      </Secao>

      <Secao titulo="8. Segurança">
        <p>
          Adotamos medidas razoáveis de proteção, mas nenhum sistema é 100%
          seguro. Você também deve proteger o dispositivo e a rede que utiliza.
        </p>
      </Secao>

      <Secao titulo="9. Direitos do titular (LGPD)">
        <p>
          Se você for titular de dados pessoais no Brasil, poderá solicitar
          confirmação de tratamento, acesso, correção, anonimização, eliminação
          de dados desnecessários, portabilidade quando aplicável e informações
          sobre compartilhamentos, nos termos da Lei nº 13.709/2018 (LGPD).
        </p>
        <p>
          Para exercer direitos relacionados a dados que de fato controlamos,
          utilize a Central de Ajuda. Pedidos relativos a dados coletados só por
          terceiros devem ser dirigidos a esses terceiros.
        </p>
      </Secao>

      <Secao titulo="10. Crianças e adolescentes">
        <p>
          Não coletamos intencionalmente dados de menores de 18 anos. Se
          identificar tratamento indevido, entre em contato para que possamos
          avaliar a exclusão do que estiver sob nosso controle.
        </p>
      </Secao>

      <Secao titulo="11. Alterações">
        <p>
          Esta Política pode ser atualizada. A data no topo indica a versão
          vigente.
        </p>
      </Secao>

      <Secao titulo="12. Contato">
        <p>
          Questões de privacidade:{" "}
          <a href="/central-de-ajuda" className="text-novlyx-accent hover:underline">
            Central de Ajuda
          </a>
          .
        </p>
      </Secao>
    </PaginaLegal>
  );
}
