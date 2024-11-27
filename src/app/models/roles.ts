export interface Permission {
  PermissionId: number;
  PermissionType: number;
  Name: string;
}

export interface Role {
  Name: string;
  Description: string;
  Permissions: Permission[];
}
