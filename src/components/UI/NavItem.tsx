import { Flex, Icon, Link, FlexProps } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { ReactText } from "react";

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
  focusItem: boolean;
}

const NavItem = ({ icon, children, focusItem, ...rest }: NavItemProps) => {
  return (
    <Link
      href="#"
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        backgroundColor={focusItem ? "green.400" : "white"}
        color={focusItem ? "white" : "black"}
        _hover={{
          bg: "green.400",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

export default NavItem;
