import { Flex, Stack, Text, useDisclosure } from "@chakra-ui/react";
import type { NextPage } from "next";
import { ConnectModal } from "../components/ConnectModal";
import { LoggedIn } from "../components/LoggedIn";
import { useWallets } from "../context/wallets";

const Connect = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex>
      To start,
      <Text
        ml={1}
        mr={1}
        fontWeight="semibold"
        cursor="pointer"
        onClick={onOpen}
      >
        connect your wallet
      </Text>
      👈
      <ConnectModal isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
};

const Home: NextPage = () => {
  const { address, chain } = useWallets();

  return (
    <Stack w="full" p={4}>
      <Flex>
        👋 Welcome to{" "}
        <Text ml={1} fontWeight="semibold">
          Passport
        </Text>
        !
      </Flex>
      <Flex>
        This is the one-stop shop to managing your Web3 identity
        <Text ml={1} fontStyle="italic" fontWeight="semibold">
          completely decentralized on IPFS ✨
        </Text>
      </Flex>
      {!address ? (
        <Connect />
      ) : (
        <Flex>
          You're logged in as{" "}
          <Text ml={1} mr={1} fontWeight="semibold">
            {address}
          </Text>
          on
          <Text ml={1} mr={1} fontWeight="semibold">
            {chain}
          </Text>
        </Flex>
      )}
      {address && <LoggedIn />}
    </Stack>
  );
};

export default Home;
