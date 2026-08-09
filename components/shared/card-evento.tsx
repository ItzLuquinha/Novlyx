import { ImagemPlaceholder as Image } from "@/components/shared/imagem-placeholder";
import { Radio, Calendar, CheckCircle2 } from "lucide-react";
import { EventoEsportivo } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatarDataCurta, formatarHora } from "@/utils/formatadores";

const STATUS_CONFIG = {
  ao_vivo: { texto: "AO VIVO", icone: Radio, cor: "bg-red-600/90 text-novlyx-white" },
  agendado: { texto: "AGENDADO", icone: Calendar, cor: "bg-white/10 text-novlyx-white" },
  encerrado: {
    texto: "ENCERRADO",
    icone: CheckCircle2,
    cor: "bg-novlyx-graphite-light text-novlyx-gray-light",
  },
};

export function CardEvento({ evento }: { evento: EventoEsportivo }) {
  const status = STATUS_CONFIG[evento.status];
  const StatusIcon = status.icone;

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video w-full">
        <Image src={evento.imagemUrl} alt={evento.titulo} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        <Badge className={`absolute left-3 top-3 flex items-center gap-1 ${status.cor}`}>
          <StatusIcon className="h-2.5 w-2.5" />
          {status.texto}
        </Badge>
        <span className="absolute right-3 top-3 rounded bg-black/60 px-2 py-0.5 text-xs text-novlyx-white">
          {evento.canal}
        </span>

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
          <div className="flex flex-col items-center gap-1.5">
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white/10">
              <Image
                src={evento.timeCasaEscudoUrl}
                alt={evento.timeCasa}
                fill
                className="object-cover"
              />
            </div>
            <span className="max-w-[80px] truncate text-xs text-novlyx-white">
              {evento.timeCasa}
            </span>
          </div>

          <div className="flex flex-col items-center px-2">
            {evento.status !== "agendado" ? (
              <span className="text-lg font-bold text-novlyx-gold">
                {evento.placarCasa} - {evento.placarVisitante}
              </span>
            ) : (
              <span className="text-sm font-semibold text-novlyx-white">
                {formatarHora(evento.dataHora)}
              </span>
            )}
            <span className="text-[10px] text-novlyx-gray-light">
              {formatarDataCurta(evento.dataHora)}
            </span>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white/10">
              <Image
                src={evento.timeVisitanteEscudoUrl}
                alt={evento.timeVisitante}
                fill
                className="object-cover"
              />
            </div>
            <span className="max-w-[80px] truncate text-xs text-novlyx-white">
              {evento.timeVisitante}
            </span>
          </div>
        </div>
      </div>

      <div className="p-3">
        <p className="truncate text-xs font-medium text-novlyx-gold">
          {evento.campeonato}
        </p>
      </div>
    </Card>
  );
}
