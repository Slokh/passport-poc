import * as IPFS from "ipfs-core";
import { Passport } from "./types";

export const writeToIPFS = async (passport: Passport) => {
  const ipfs = await IPFS.create();
  const { cid } = await ipfs.add(JSON.stringify(passport));
  return cid.toString();
};
