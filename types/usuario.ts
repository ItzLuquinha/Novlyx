export interface Perfil {
  id: string;
  nome: string;
  avatarUrl: string;
  principal: boolean;
}

export interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  lida: boolean;
  criadaEm: string;
  posterUrl?: string;
}
