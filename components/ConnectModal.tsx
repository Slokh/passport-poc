import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import { useWallets } from "../context/wallets";

export const ConnectModal = ({
  isOpen,
  onClose,
}: {
  isOpen: any;
  onClose: any;
}) => {
  const { connectPhantom, connectMetamask } = useWallets();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody p={0}>
          <Stack spacing={0} divider={<StackDivider />}>
            <Button
              bgColor="#fff"
              w="full"
              h={32}
              onClick={connectPhantom}
              _focus={{
                outline: "none",
              }}
            >
              <Image boxSize={16} src="phantom.png" alt="phantom" mr={4} />
              <Text fontSize="lg">Connect to Phantom</Text>
            </Button>
            <Button
              bgColor="#fff"
              w="full"
              h={32}
              onClick={connectMetamask}
              _focus={{
                outline: "none",
              }}
            >
              <Image boxSize={16} src="metamask.svg" alt="metamask" mr={4} />
              <Text fontSize="lg">Connect to MetaMask</Text>
            </Button>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
