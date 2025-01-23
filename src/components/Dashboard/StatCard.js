import {
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  Spacer,
  Icon,
} from "@chakra-ui/react";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import IconBox from "components/Icons/IconBox";

export const StatCard = ({ label, value, icon }) => (
  <Card>
    <CardBody>
      <Flex flexDirection="row" align="center" justify="center" w="100%">
        <Stat>
          <StatLabel fontSize="sm" color="gray.400" fontWeight="bold" pb="2px">
            {label}
          </StatLabel>
          <Flex>
            <StatNumber fontSize="lg" color="#fff">
              {value}
            </StatNumber>
          </Flex>
        </Stat>
        <Spacer />
        <IconBox as="box" h={"45px"} w={"45px"} bg="brand.200">
          <Icon as={icon} h={"24px"} w={"24px"} color="#fff" />
        </IconBox>
      </Flex>
    </CardBody>
  </Card>
);
