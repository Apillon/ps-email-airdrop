export interface ConfigInterface {
  APP_URL: string;
  API_BASE: string;
  CHAIN_ID: string;
}

export type AuthResponseProfile = {
  id: number;
  authUser: {
    id: number;
    status: number;
    username: string;
    email?: string;
    roles: any[];
    permissions: any[];
  };
};

export type AuthResponse = {
  profile: AuthResponseProfile;
  authToken: {
    status: boolean;
    data: string;
  };
};

declare global {
  /** Papa parser */
  type CsvFileData = {
    data: Array<any>;
    errors: Array<any>;
    meta: {
      aborted: boolean;
      cursor: number;
      delimeter: string;
      fields: Array<string>;
      linebreak: string;
      truncated: boolean;
    };
  };
}
