import {
  DefaultFields,
  Iso8601DateTimeFormat,
  PermissionType,
  URLResourceType,
} from "../utilTypes";
import { BranchAgent } from "./agent";

// Interface representing Resource model
export interface Resource extends DefaultFields {
  name: URLResourceType; // The name of the resource (max_length=100)
}

// Interface representing Permission model
export interface Permission extends DefaultFields {
  type: PermissionType; // The specific type of permission (max_length=100)
  hasAccess(employee: BranchAgent, resource: Resource): boolean; // Method to check access
}

// Interface representing BranchEmployeePermission model
export interface BranchEmployeePermission extends DefaultFields {
  id: number; // Assuming Django auto-increments the primary key
  employee: BranchAgent; // Reference to StoreEmployee
  permission: Permission; // Reference to Permission
  resource: Resource; // Reference to Resource
  createdAt: Iso8601DateTimeFormat; // Auto-add timestamp
  updatedAt: Iso8601DateTimeFormat; // Auto-update timestamp
}
