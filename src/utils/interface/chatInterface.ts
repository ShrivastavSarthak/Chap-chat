export interface ChatInterface {
  id?: string;
  user?: string;
  assistant?: string[] | string;
}

export interface BotRequestInterface {
  user_id: string;
  user_role: string;
  message: string;
}

