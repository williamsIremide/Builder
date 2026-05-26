import { User } from "./user";
import { Branch } from "./store";
import {
  Iso8601DateTimeFormat,
  RefToInstance,
} from "~/constants/types/utilTypes";

export type SVGProps = React.ComponentPropsWithoutRef<"svg">;

export type ChatMessage = {
  id: string | number;
  sender?: User;
  recipient?: User | null;
  anonymous_device_token?: string;
  message_body: string;
  transmission_type?: "branch_to_user" | "user_to_branch";
  branch?: RefToInstance<Branch> | null;
  timestamp: Iso8601DateTimeFormat;
};

export interface UseChatProps {
  activeChat: ChatMessage[] | null;
  setChat: (chat: ChatMessage[]) => void;
  closeChat: () => void;
  addMessage: (message: ChatMessage) => void;
  setIsNewMessage?: React.Dispatch<React.SetStateAction<boolean>>;
  chats?: ChatMessage[];
}
