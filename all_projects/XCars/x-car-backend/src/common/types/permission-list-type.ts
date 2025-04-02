import { PageName } from '../enum/page-name.enum';
import { UserActions } from '../enum/user-actions.enum';

export type PermissionListType = {
  [key in PageName]: {
    LABEL: string;
    ORDER: number;
    CAPABILITIES?: Partial<{
      [key2 in UserActions]: number;
    }>;
    FEATURE?: { name: string; id: number }[];
  };
};
