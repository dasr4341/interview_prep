
export interface PretaaGetPermissions {
  pretaaGetPermissions?: (PretaaGetPermissionsEntity)[] | null;
}
export interface PretaaGetPermissionsEntity {
  name: string;
  label: string;
  capabilities: Capabilities;
  isAllChecked: boolean;
}
export interface Capabilities {
  CREATE?: number | null;
  VIEW?: number | null;
  EDIT?: number | null;
  DELETE?: number | null;
  EXECUTE?: number | null;
}
