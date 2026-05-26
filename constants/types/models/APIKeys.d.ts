import { APIKeyStatus, DefaultFields, UUIDType } from "../utilTypes";
import { User } from "./user";

export interface APIKey extends DefaultFields {
  name: string | null; // Optional, nullable name field (string)
  user: User; // Reference to a User instance
  key: UUIDType; // UUIDField, stored as a string
  expires_at?: string | null; // DateTimeField for expiration (ISO8601 string)
  status: APIKeyStatus; // Status of the API key (active, revoked, etc.)
}
