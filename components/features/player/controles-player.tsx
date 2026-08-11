"use client";

import { Play, Pause, Maximize, Minimize, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { formatarTempoPlayer } from "@/utils/formatadores";
import { cn } from "@/lib/utils";

interface ControlesPlayerProps {
  tocando: boolean;
  tempoAtual: number;
  duracaoTotal: number;
  volume: number;
  mudo: boolean;
  telaCheia: boolean;
  temProximo: boolean;
  temAnterior: boolean;
  visivel: boolean;
  onAlternarPlay: () => void;
  onBuscar: (segundos: number) => void;
  onAlternarVolume: () => void;
  onMudarVolume: (valor: number) => void;
  onAlternarTelaCheia: () => void;
  onProximoEpisodio?: () => void;
  onEpisodioAnterior?: () => void;
}

export function ControlesPlayer({
  tocando,
  tempoAtual,
  duracaoTotal,
  volume,
  mudo,
  telaCheia,
  temProximo,
  temAnterior,
  visivel,
  onAlternarPlay,
  onBuscar,
  onAlternarVolume,
  onMudarVolume,
  onAlternarTelaCheia,
  onProximoEpisodio,
  onEpisodioAnterior,
}: ControlesPlayerProps) {
  return (
    <div
      className={cn(
        "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent px-4 pb-4 pt-16 transition-opacity duration-300 sm:px-8 sm:pb-6",
        visivel ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div className="mb-3 flex items-center gap-3">
        <span className="w-12 text-xs text-novlyx-gray-light">
          {formatarTempoPlayer(tempoAtual)}
        </span>
        <Slider
          value={[tempoAtual]}
          max={duracaoTotal || 100}
          step={1}
          onValueChange={([valor]) => onBuscar(valor ?? 0)}
          className="flex-1"
        />
        <span className="w-12 text-xs text-novlyx-gray-light">
          {formatarTempoPlayer(duracaoTotal)}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Episodio anterior"
            disabled={!temAnterior}
            onClick={onEpisodioAnterior}
          >
            <SkipBack className="h-5 w-5" />
          </Button>

          <Button
            variant="accent"
            size="icon"
            aria-label={tocando ? "Pausar" : "Reproduzir"}
            onClick={onAlternarPlay}
            className="h-11 w-11"
          >
            {tocando ? (
              <Pause className="h-5 w-5 fill-current" />
            ) : (
              <Play className="h-5 w-5 fill-current" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Proximo episodio"
            disabled={!temProximo}
            onClick={onProximoEpisodio}
          >
            <SkipForward className="h-5 w-5" />
          </Button>

          <div className="ml-2 flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label={mudo ? "Ativar som" : "Silenciar"}
              onClick={onAlternarVolume}
            >
              {mudo || volume === 0 ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>
            <Slider
              value={[mudo ? 0 : volume]}
              max={100}
              step={1}
              onValueChange={([valor]) => onMudarVolume(valor ?? 0)}
              className="hidden w-24 sm:flex"
            />
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          aria-label={telaCheia ? "Sair da tela cheia" : "Tela cheia"}
          onClick={onAlternarTelaCheia}
        >
          {telaCheia ? (
            <Minimize className="h-5 w-5" />
          ) : (
            <Maximize className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
}
