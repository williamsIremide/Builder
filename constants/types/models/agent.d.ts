import { AgentType, DefaultFields, StoreRole } from "../utilTypes";
import { Branch } from "./store";
import { User } from "./user";

export interface BranchAgent extends DefaultFields {
  agent: User;
  agent_type: AgentType;
  branch: Branch;
  role: StoreRole;
}
