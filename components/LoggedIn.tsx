import {
  Flex,
  IconButton,
  Input,
  Link,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { AddIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { useWallets } from "../context/wallets";
import {
  createPassport,
  getPassport,
  IPFS_GATEWAY_PATH,
  updateResolver,
} from "../lib/passport";
import {
  Passport,
  PassportAccount,
  PassportAccountStatus,
} from "../lib/passport/types";
import { getPassportAccountStatus } from "../lib/passport/utils";

const NewUser = () => {
  const { provider, chain, address } = useWallets();
  const [linkedAddress, setLinkedAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState("");

  const signAndCreate = async () => {
    // HACK: lol, assuming string length > 10 is an account to get done faster, this is all so bad
    setLoading(true);
    let did = `did:opensea:${address?.toLowerCase()}`;
    const signature = await provider?.signMessage(did, "utf8");

    if (address && chain && signature) {
      setPath(
        await createPassport(address, {
          id: did,
          accounts: [
            {
              chain: chain,
              address: address,
              verificationKey:
                chain === "solana"
                  ? `0x${signature.signature.toString("hex")}`
                  : signature,
            },
          ],
        })
      );
    }
    setLoading(false);
  };

  const signAndLink = async () => {
    setLoading(true);
    const { passport } = await getPassport(linkedAddress);
    if (passport) {
      const signature = await provider?.signMessage(passport.id, "utf8");
      if (address && chain && signature) {
        const newPath = await createPassport(linkedAddress, {
          id: passport.id,
          accounts: passport.accounts,
          pending: [
            {
              chain: chain,
              address: address,
              verificationKey:
                chain === "solana"
                  ? `0x${signature.signature.toString("hex")}`
                  : signature,
            },
          ],
        });
        updateResolver(address, newPath);
        setPath(newPath);
      }
    }

    setLoading(false);
  };

  return (
    <>
      <Flex>...</Flex>

      {path && !linkedAddress ? (
        <>
          <Flex>
            🎉🎉🎉 Congrats! You now have a decentralized Web3 profile.
          </Flex>
          <Flex>
            You can view your profile metadata at{" "}
            <Link
              href={IPFS_GATEWAY_PATH + path}
              ml={2}
              fontWeight="semibold"
            >{`ipfs://${path}`}</Link>
          </Flex>
          <Flex>Now refresh the page and see your profile persist!</Flex>
        </>
      ) : path && linkedAddress ? (
        <Flex>Now sign into your other account to confirm the connection!</Flex>
      ) : (
        <>
          <Flex>
            😰 You don't have a Web3 profile yet for this account... no worries,
            we can help 👍
          </Flex>
          <Flex align="center">
            Press this button to create a new profile 👉
            <IconButton
              ml={2}
              aria-label="submit"
              icon={<AddIcon />}
              size="sm"
              onClick={signAndCreate}
              isLoading={loading}
            />
          </Flex>
          <Flex align="center">
            <Text>... or enter another account to link to!</Text>
            <Input
              value={linkedAddress}
              onChange={(e) => setLinkedAddress(e.target.value)}
              ml={2}
              borderRadius={0}
              w={32}
              h={6}
              borderWidth={0}
              borderBottomWidth={2}
              _focus={{}}
            />
            <IconButton
              ml={2}
              aria-label="submit"
              icon={<CheckIcon />}
              size="sm"
              onClick={signAndLink}
              isLoading={loading}
              isDisabled={linkedAddress.length < 3}
            />
          </Flex>
        </>
      )}
    </>
  );
};

export const LoggedIn = () => {
  const { address } = useWallets();
  const [loading, setLoading] = useState(false);
  const [passport, setPassport] = useState<any>();

  const pendingAccount = passport?.passport?.pending?.[0];

  useEffect(() => {
    const fetchData = async () => {
      if (address) {
        setPassport(await getPassport(address));
      }
    };
    fetchData();
  }, []);

  const acceptConnection = async () => {
    if (address && pendingAccount) {
      setLoading(true);
      updateResolver(
        address,
        await createPassport(pendingAccount.address, {
          id: passport.passport.id,
          accounts: [...passport.passport.accounts, pendingAccount],
          pending: [],
        })
      );
      setPassport(await getPassport(address));
      setLoading(false);
    }
  };

  if (!passport) {
    return <NewUser />;
  }

  const accountStatus = getPassportAccountStatus(passport.passport, address);

  if (accountStatus === PassportAccountStatus.PENDING) {
    return (
      <Flex direction="column">
        <Text>...</Text>
        <Text>
          You have a pending connection request, log in to one of the following
          accounts to confirm:
        </Text>
        <UnorderedList>
          {passport.accounts?.map(({ chain, address }: PassportAccount) => (
            <ListItem key={address}>
              <Flex>
                <Text ml={1} mr={1} fontWeight="semibold">
                  {address}
                </Text>
                on
                <Text ml={1} mr={1} fontWeight="semibold">
                  {chain}
                </Text>
              </Flex>
            </ListItem>
          ))}
        </UnorderedList>
      </Flex>
    );
  }

  return (
    <>
      <Flex>
        You can view your profile metadata at{" "}
        <Link
          href={IPFS_GATEWAY_PATH + passport.resolver}
          ml={2}
          fontWeight="semibold"
        >{`ipfs://${passport.resolver}`}</Link>
      </Flex>
      {pendingAccount && (
        <>
          <Flex>...</Flex>
          <Flex align="center">
            You have a pending connection request from{" "}
            <Text fontWeight="semibold" ml={2}>
              {pendingAccount.address}
            </Text>
            <IconButton
              ml={2}
              aria-label="submit"
              icon={<CheckIcon />}
              size="xs"
              colorScheme="green"
              onClick={acceptConnection}
              isLoading={loading}
            />
            <IconButton
              ml={2}
              aria-label="remove"
              icon={<CloseIcon />}
              size="xs"
              colorScheme="red"
              isLoading={loading}
            />
          </Flex>
          <Flex>...</Flex>
        </>
      )}
      <Flex>👇 Here is your raw metadata</Flex>
      <div>
        <pre>{JSON.stringify(passport.passport, null, 2)}</pre>
      </div>
    </>
  );
};
