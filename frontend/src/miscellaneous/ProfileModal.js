import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  Image,
} from "@chakra-ui/react";

function ProfileModal({ user, children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
          color={"white"}
          background={"black"}
          _hover={{ backgroundColor: "#0B141A" }}
        />
      )}

      <Modal size="lg" isOpen={isOpen} onClose={onClose} background={"black"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="30px"
            display="flex"
            justifyContent="center"
            bg={"#202124"}
            color="white"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
            bg={"#202124"}
          >
            <Image
              borderRadius="full"
              src={user.pic}
              alt={user.name}
              w="120px"
              h="120px"
              objectFit="cover"
            />
          </ModalBody>

          <ModalFooter
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
            bg={"#202124"}
            color="white"
          >
            {user.email}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ProfileModal;
