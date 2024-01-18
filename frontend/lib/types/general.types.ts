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
  type CsvItem = {
    email: string;
    email_start_send_time: string;
    email_send_time?: string | null;
    tx_hash?: string | null;
    wallet: string;
    airdrop_status?: number | null;
    status?: number | null;
  };

  /** Papa parser */
  type CsvFileData = {
    data: Array<CsvItem>;
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

  /** Response */
  type GeneralResponse<T> = {
    data: T;
    id: string;
    status: number;
  };
  type GeneralItemsResponse<T> = {
    data: {
      items: Array<T>;
      total: number;
    };
    id: string;
    status: number;
  };
  type SuccessResponse = GeneralResponse<{ success: boolean }>;

  interface UserInterface {
    airdrop_status: number;
    createTime?: string;
    email: string;
    email_sent_time: string | null;
    email_start_send_time: string | null;
    id?: number | null;
    status?: number;
    tx_hash?: string | null;
    updateTime?: string;
    wallet: string | null;
  }

  type UsersResponse = GeneralItemsResponse<UserInterface>;

  interface StatisticsInterface {
    airdropped: number;
    emailSent: number;
    pending: number;
    threwError: number;
    total: number;
    walletLinked: number;
  }

  type StatisticsResponse = GeneralResponse<StatisticsInterface>;
}
