export type UpgradeChatMessage = {
  id: string; // Unique identifier for the chat
  createdAt: string; // ISO date string
  text: string;
  user: any;
  isSaved?: boolean; // Optional field to indicate if the message is saved
  image?: string;
};
