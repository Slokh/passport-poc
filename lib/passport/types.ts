export type Passport = {
  id: string;
  accounts?: PassportAccount[];
  pending?: PassportAccount[];
  metadata?: any;
};

export type PassportAccount = {
  chain: string;
  address: string;
  verificationKey: string;
};

export enum PassportAccountStatus {
  CONNECTED = "connected",
  PENDING = "pending",
  INVALID = "invalid",
}
