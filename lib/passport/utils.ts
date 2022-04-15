import { Passport, PassportAccountStatus } from "./types";

export const getPassportAccountStatus = (
  passport: Passport,
  address?: string
) => {
  if (!address) {
    return PassportAccountStatus.INVALID;
  }

  if (passport.accounts?.some((account) => account.address === address)) {
    return PassportAccountStatus.CONNECTED;
  }
  if (passport.pending?.some((account) => account.address === address)) {
    return PassportAccountStatus.PENDING;
  }
  return PassportAccountStatus.INVALID;
};
