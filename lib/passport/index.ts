import { writeToIPFS } from "./ipfs";
import { Passport } from "./types";

export const IPFS_GATEWAY_PATH = "https://opensea.mypinata.cloud/ipfs/";

export const createPassport = async (address: string, passport: Passport) => {
  const cid = await writeToIPFS({
    ...passport,
    metadata: {
      displayName: "Kartik",
      bio: "sup",
      preferred_chain: "ethereum",
      profile_picture: {
        chain: "ethereum",
        contract_address: "0xc92ceddfb8dd984a89fb494c376f9a48b999aafc",
        token_identifier: 6625,
        token_uri: "ipfs://QmVDNzQNuD5jBKHmJ2nmVP35HsXUqhGRX9V2KVHvRznLg8/6625",
        image_url:
          "ipfs://QmeZGc1CL3eb9QJatKXTGT7ekgLMq9FyZUWckQ4oWdc53a/6625.jpg",
      },
      socials: {
        twitter: "Slokh",
        github: "Slokh",
        discord: "Kartik | OpenSea#0001",
      },
    },
  });
  await updateResolver(address, cid);
  return cid;
};

export const getPassport = async (address: string): Promise<any> => {
  const resolver = await getResolver(address);
  if (!resolver) {
    return undefined;
  }

  const data = await fetch(IPFS_GATEWAY_PATH + resolver);
  return { resolver, passport: await data.json() };
};

// TODO: This should not live in a centralized database
export const getResolver = async (address: string) => {
  const data = await fetch(`/api/${address}`);
  if (data.status === 200) {
    const { path } = await data.json();
    return path;
  }
  return "";
};

// TODO: This should not live in a centralized database
export const updateResolver = async (address: string, path: string) => {
  await fetch(`/api/${address}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ path: path }),
  });
};
