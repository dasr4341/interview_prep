import { Roles } from '@prisma/client';
import { PermissionListType } from 'src/common/types/permission-list-type';

export const PermissionList: PermissionListType = {
  DASHBOARD: {
    LABEL: 'Dashboard',
    ORDER: 1,
    CAPABILITIES: {
      VIEW: 11,
      CREATE: 12,
      EDIT: 13,
      DELETE: 14,
    },
  },
};

export const permissions = {
  [Roles.ADMIN]: [],
  [Roles.DEALER]: [],
  [Roles.USER]: [],
};
