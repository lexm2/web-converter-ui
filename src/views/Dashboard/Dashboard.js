/*!

=========================================================
* Vision UI Free Chakra - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-chakra
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-chakra/blob/master LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// Chakra imports
import {
  Box,
  Button,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Grid,
  Icon,
  Progress,
  SimpleGrid,
  Spacer,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
// Styles for the circular progressbar
import medusa from "assets/img/cardimgfree.png";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import BarChart from "components/Charts/BarChart";
import LineChart from "components/Charts/LineChart";
import IconBox from "components/Icons/IconBox";
// Icons
import {
  CartIcon,
  DocumentIcon,
  GlobeIcon,
  RocketIcon,
  StatsIcon,
  WalletIcon,
} from "components/Icons/Icons.js";
import DashboardTableRow from "components/Tables/DashboardTableRow";
import TimelineRow from "components/Tables/TimelineRow";
import React from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { BiHappy } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";
import {
  IoCheckmarkDoneCircleSharp,
  IoEllipsisHorizontal,
} from "react-icons/io5";
import {
  TiCreditCard,
  TiChartPieOutline,
  TiStarburstOutline,
  TiBook,
} from "react-icons/ti";
// Data
import {
  barChartDataDashboard,
  barChartOptionsDashboard,
  lineChartDataDashboard,
  lineChartOptionsDashboard,
} from "variables/charts";
import { useDeck } from "components/context/DeckContext";

export default function Dashboard({ cardData }) {
  const { deck } = useDeck();
  cardData = deck[0];
  console.log(cardData);
  return (
    <Flex flexDirection="column" pt={{ base: "120px", md: "75px" }}>
      <SimpleGrid columns={{ sm: 1, md: 2, xl: 4 }} spacing="24px">
        {/* Mana Cost */}
        <Card>
          <CardBody>
            <Flex flexDirection="row" align="center" justify="center" w="100%">
              <Stat>
                <StatLabel
                  fontSize="sm"
                  color="gray.400"
                  fontWeight="bold"
                  pb="2px"
                >
                  Mana Cost
                </StatLabel>
                <Flex>
                  <StatNumber fontSize="lg" color="#fff">
                    {cardData ? cardData.cmc : "N/A"}
                  </StatNumber>
                </Flex>
              </Stat>
              <Spacer />
              <IconBox as="box" h={"45px"} w={"45px"} bg="brand.200">
                <Icon as={TiBook} h={"24px"} w={"24px"} color="#fff" />
              </IconBox>
            </Flex>
          </CardBody>
        </Card>
        {/* Card Type */}
        <Card minH="83px">
          <CardBody>
            <Flex flexDirection="row" align="center" justify="center" w="100%">
              <Stat me="auto">
                <StatLabel
                  fontSize="sm"
                  color="gray.400"
                  fontWeight="bold"
                  pb="2px"
                >
                  Card Type
                </StatLabel>
                <Flex>
                  <StatNumber fontSize="lg" color="#fff">
                    {cardData ? cardData.typeLine : "N/A"}
                  </StatNumber>
                </Flex>
              </Stat>
              <IconBox as="box" h={"45px"} w={"45px"} bg="brand.200">
                <Icon
                  as={TiChartPieOutline}
                  h={"24px"}
                  w={"24px"}
                  color="#fff"
                />
              </IconBox>
            </Flex>
          </CardBody>
        </Card>
        {/* Card Price */}
        <Card>
          <CardBody>
            <Flex flexDirection="row" align="center" justify="center" w="100%">
              <Stat>
                <StatLabel
                  fontSize="sm"
                  color="gray.400"
                  fontWeight="bold"
                  pb="2px"
                >
                  Card Price
                </StatLabel>
                <Flex>
                  <StatNumber fontSize="lg" color="#fff">
                    {cardData && cardData.prices
                      ? `$${cardData.prices.usd || "N/A"}`
                      : "N/A"}
                  </StatNumber>
                </Flex>
              </Stat>
              <Spacer />
              <IconBox as="box" h={"45px"} w={"45px"} bg="brand.200">
                <Icon as={TiCreditCard} h={"24px"} w={"24px"} color="#fff" />
              </IconBox>
            </Flex>
          </CardBody>
        </Card>
        {/* Rarity */}
        <Card>
          <CardBody>
            <Flex flexDirection="row" align="center" justify="center" w="100%">
              <Stat me="auto">
                <StatLabel
                  fontSize="sm"
                  color="gray.400"
                  fontWeight="bold"
                  pb="2px"
                >
                  Rarity
                </StatLabel>
                <Flex>
                  <StatNumber fontSize="lg" color="#fff" fontWeight="bold">
                    {cardData ? cardData.rarity : "N/A"}
                  </StatNumber>
                </Flex>
              </Stat>
              <IconBox as="box" h={"45px"} w={"45px"} bg="brand.200">
                <Icon
                  as={TiStarburstOutline}
                  h={"24px"}
                  w={"24px"}
                  color="#fff"
                />
              </IconBox>
            </Flex>
          </CardBody>
        </Card>
      </SimpleGrid>
      <Grid
        templateColumns={{ sm: "1fr", md: "1fr 1fr", "2xl": "2fr 1.2fr 1.5fr" }}
        my="26px"
        gap="18px"
      >
        {/* Welcome Card */}
        <Card p="28px 0px 0px 0px">
          <CardHeader mb="20px" ps="22px">
            <Flex direction="column" alignSelf="flex-start">
              <Text fontSize="lg" color="#fff" fontWeight="bold" mb="6px">
                {cardData ? cardData.name : "Card Name"}
              </Text>
              <Text fontSize="md" fontWeight="medium" color="gray.400">
                Oracle Text
              </Text>
            </Flex>
          </CardHeader>
          <Box w="100%" minH={{ sm: "300px" }}>
            <Text color="#fff" p="22px">
              {cardData && cardData.oracleText
                ? cardData.oracleText
                : "No oracle text available"}
            </Text>
          </Box>
        </Card>
        {/* Satisfaction Rate */}
        <Card gridArea={{ md: "2 / 1 / 3 / 2", "2xl": "auto" }}>
          <CardHeader mb="24px">
            <Flex direction="column">
              <Text color="#fff" fontSize="lg" fontWeight="bold" mb="4px">
                Satisfaction Rate
              </Text>
              <Text color="gray.400" fontSize="sm">
                From all projects
              </Text>
            </Flex>
          </CardHeader>
          <Flex direction="column" justify="center" align="center">
            <Box position="relative" width="200px" height="200px">
              <svg
                style={{ transform: "rotate(-90deg)", overflow: "visible" }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="100 100 200 200"
              >
                <linearGradient
                  id="progressGradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                  gradientTransform="rotate(90, .5, .5)"
                >
                  <stop offset="0" stopColor="rgba(117, 81, 255, 0)" />
                  <stop offset="100" stopColor="#582CFF" />
                </linearGradient>
                <circle
                  cx="200"
                  cy="200"
                  r="92.5"
                  stroke="#22234B"
                  strokeWidth="15"
                  fill="none"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="92.5"
                  fill="none"
                  strokeWidth="15"
                  strokeDasharray="581.1946409141117"
                  strokeDashoffset={581.1946409141117 * (1 - 0.8)} // Adjust for progress (80% in this case)
                  strokeLinecap="round"
                  stroke="url(#progressGradient)"
                />
              </svg>
              <Flex
                position="absolute"
                top="0"
                left="0"
                width="100%"
                height="100%"
                alignItems="center"
                justifyContent="center"
              >
                <IconBox bg="brand.200" borderRadius="50%" w="48px" h="48px">
                  <Icon as={BiHappy} color="#fff" w="30px" h="30px" />
                </IconBox>
              </Flex>
            </Box>
            <Stack
              direction="row"
              spacing={{ sm: "42px", md: "68px" }}
              justify="center"
              maxW={{ sm: "270px", md: "300px", lg: "100%" }}
              mx={{ sm: "auto", md: "0px" }}
              p="18px 22px"
              bg="linear-gradient(126.97deg, rgb(6, 11, 40) 28.26%, rgba(10, 14, 35) 91.2%)"
              borderRadius="20px"
              position="absolute"
              bottom="5%"
            >
              <Text fontSize="xs" color="gray.400">
                0%
              </Text>
              <Flex direction="column" align="center" minW="80px">
                <Text color="#fff" fontSize="28px" fontWeight="bold">
                  95%
                </Text>
                <Text fontSize="xs" color="gray.400">
                  Based on likes
                </Text>
              </Flex>
              <Text fontSize="xs" color="gray.400">
                100%
              </Text>
            </Stack>
          </Flex>
        </Card>
        {/* Referral Tracking */}
        <Card gridArea={{ md: "2 / 2 / 3 / 3", "2xl": "auto" }}>
          <Flex direction="column">
            <Flex justify="space-between" align="center" mb="40px">
              <Text color="#fff" fontSize="lg" fontWeight="bold">
                Referral Tracking
              </Text>
              <Button
                borderRadius="12px"
                w="38px"
                h="38px"
                bg="#22234B"
                _hover="none"
                _active="none"
              >
                <Icon as={IoEllipsisHorizontal} color="#7551FF" />
              </Button>
            </Flex>
            <Flex direction={{ sm: "column", md: "row" }}>
              <Flex
                direction="column"
                me={{ md: "6px", lg: "52px" }}
                mb={{ sm: "16px", md: "0px" }}
              >
                <Flex
                  direction="column"
                  p="22px"
                  pe={{ sm: "22e", md: "8px", lg: "22px" }}
                  minW={{ sm: "220px", md: "140px", lg: "220px" }}
                  bg="linear-gradient(126.97deg, #060C29 28.26%, rgba(4, 12, 48, 0.5) 91.2%)"
                  borderRadius="20px"
                  mb="20px"
                >
                  <Text color="gray.400" fontSize="sm" mb="4px">
                    Invited
                  </Text>
                  <Text color="#fff" fontSize="lg" fontWeight="bold">
                    145 people
                  </Text>
                </Flex>
                <Flex
                  direction="column"
                  p="22px"
                  pe={{ sm: "22px", md: "8px", lg: "22px" }}
                  minW={{ sm: "170px", md: "140px", lg: "170px" }}
                  bg="linear-gradient(126.97deg, #060C29 28.26%, rgba(4, 12, 48, 0.5) 91.2%)"
                  borderRadius="20px"
                >
                  <Text color="gray.400" fontSize="sm" mb="4px">
                    Bonus
                  </Text>
                  <Text color="#fff" fontSize="lg" fontWeight="bold">
                    1,465
                  </Text>
                </Flex>
              </Flex>
              <Box position="relative" width="200px" height="200px">
                <svg
                  style={{ transform: "rotate(-90deg)", overflow: "visible" }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="100 100 200 200"
                >
                  <linearGradient
                    id="safetyGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                    gradientTransform="rotate(90, .5, .5)"
                  >
                    <stop offset="0" stopColor="rgba(5, 205, 153, 0)" />
                    <stop offset="100" stopColor="#05CD99" />
                  </linearGradient>
                  <circle
                    cx="200"
                    cy="200"
                    r="92.5"
                    stroke="#22234B"
                    strokeWidth="15"
                    fill="none"
                  />
                  <circle
                    cx="200"
                    cy="200"
                    r="92.5"
                    fill="none"
                    strokeWidth="15"
                    strokeDasharray="581.1946409141117"
                    strokeDashoffset={581.1946409141117 * (1 - 0.7)} // Adjust for progress (70% in this case)
                    strokeLinecap="round"
                    stroke="url(#safetyGradient)"
                  />
                </svg>
                <Flex
                  position="absolute"
                  top="0"
                  left="0"
                  width="100%"
                  height="100%"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                >
                  <Text color="gray.400" fontSize="sm">
                    Safety
                  </Text>
                  <Text
                    color="#fff"
                    fontSize={{ md: "36px", lg: "50px" }}
                    fontWeight="bold"
                    mb="4px"
                  >
                    9.3
                  </Text>
                  <Text color="gray.400" fontSize="sm">
                    Total Score
                  </Text>
                </Flex>
              </Box>
            </Flex>
          </Flex>
        </Card>
      </Grid>
      <Grid
        templateColumns={{ sm: "1fr", lg: "1.7fr 1.3fr" }}
        maxW={{ sm: "100%", md: "100%" }}
        gap="24px"
        mb="24px"
      >
        {/* Sales Overview */}
        <Card p="28px 0px 0px 0px">
          <CardHeader mb="20px" ps="22px">
            <Flex direction="column" alignSelf="flex-start">
              <Text fontSize="lg" color="#fff" fontWeight="bold" mb="6px">
                Sales Overview
              </Text>
              <Text fontSize="md" fontWeight="medium" color="gray.400">
                <Text as="span" color="green.400" fontWeight="bold">
                  (+5%) more
                </Text>{" "}
                in 2021
              </Text>
            </Flex>
          </CardHeader>
          <Box w="100%" minH={{ sm: "300px" }}>
            <LineChart
              lineChartData={lineChartDataDashboard}
              lineChartOptions={lineChartOptionsDashboard}
            />
          </Box>
        </Card>
        {/* Active Users */}
        <Card p="16px">
          <CardBody>
            <Flex direction="column" w="100%">
              <Box
                bg="linear-gradient(126.97deg, #060C29 28.26%, rgba(4, 12, 48, 0.5) 91.2%)"
                borderRadius="20px"
                display={{ sm: "flex", md: "block" }}
                justify={{ sm: "center", md: "flex-start" }}
                align={{ sm: "center", md: "flex-start" }}
                minH={{ sm: "180px", md: "220px" }}
                p={{ sm: "0px", md: "22px" }}
              >
                <BarChart
                  barChartOptions={barChartOptionsDashboard}
                  barChartData={barChartDataDashboard}
                />
              </Box>
              <Flex
                direction="column"
                mt="24px"
                mb="36px"
                alignSelf="flex-start"
              >
                <Text fontSize="lg" color="#fff" fontWeight="bold" mb="6px">
                  Active Users
                </Text>
                <Text fontSize="md" fontWeight="medium" color="gray.400">
                  <Text as="span" color="green.400" fontWeight="bold">
                    (+23%)
                  </Text>{" "}
                  than last week
                </Text>
              </Flex>
              <SimpleGrid gap={{ sm: "12px" }} columns={4}>
                <Flex direction="column">
                  <Flex alignItems="center">
                    <IconBox
                      as="box"
                      h={"30px"}
                      w={"30px"}
                      bg="brand.200"
                      me="6px"
                    >
                      <WalletIcon h={"15px"} w={"15px"} color="#fff" />
                    </IconBox>
                    <Text fontSize="sm" color="gray.400">
                      Users
                    </Text>
                  </Flex>
                  <Text
                    fontSize={{ sm: "md", lg: "lg" }}
                    color="#fff"
                    fontWeight="bold"
                    mb="6px"
                    my="6px"
                  >
                    32,984
                  </Text>
                  <Progress
                    colorScheme="brand"
                    bg="#2D2E5F"
                    borderRadius="30px"
                    h="5px"
                    value={20}
                  />
                </Flex>
                <Flex direction="column">
                  <Flex alignItems="center">
                    <IconBox
                      as="box"
                      h={"30px"}
                      w={"30px"}
                      bg="brand.200"
                      me="6px"
                    >
                      <RocketIcon h={"15px"} w={"15px"} color="#fff" />
                    </IconBox>
                    <Text fontSize="sm" color="gray.400">
                      Clicks
                    </Text>
                  </Flex>
                  <Text
                    fontSize={{ sm: "md", lg: "lg" }}
                    color="#fff"
                    fontWeight="bold"
                    mb="6px"
                    my="6px"
                  >
                    2.42m
                  </Text>
                  <Progress
                    colorScheme="brand"
                    bg="#2D2E5F"
                    borderRadius="30px"
                    h="5px"
                    value={90}
                  />
                </Flex>
                <Flex direction="column">
                  <Flex alignItems="center">
                    <IconBox
                      as="box"
                      h={"30px"}
                      w={"30px"}
                      bg="brand.200"
                      me="6px"
                    >
                      <CartIcon h={"15px"} w={"15px"} color="#fff" />
                    </IconBox>
                    <Text fontSize="sm" color="gray.400">
                      Sales
                    </Text>
                  </Flex>
                  <Text
                    fontSize={{ sm: "md", lg: "lg" }}
                    color="#fff"
                    fontWeight="bold"
                    mb="6px"
                    my="6px"
                  >
                    2,400$
                  </Text>
                  <Progress
                    colorScheme="brand"
                    bg="#2D2E5F"
                    borderRadius="30px"
                    h="5px"
                    value={30}
                  />
                </Flex>
                <Flex direction="column">
                  <Flex alignItems="center">
                    <IconBox
                      as="box"
                      h={"30px"}
                      w={"30px"}
                      bg="brand.200"
                      me="6px"
                    >
                      <StatsIcon h={"15px"} w={"15px"} color="#fff" />
                    </IconBox>
                    <Text fontSize="sm" color="gray.400">
                      Items
                    </Text>
                  </Flex>
                  <Text
                    fontSize={{ sm: "md", lg: "lg" }}
                    color="#fff"
                    fontWeight="bold"
                    mb="6px"
                    my="6px"
                  >
                    320
                  </Text>
                  <Progress
                    colorScheme="brand"
                    bg="#2D2E5F"
                    borderRadius="30px"
                    h="5px"
                    value={50}
                  />
                </Flex>
              </SimpleGrid>
            </Flex>
          </CardBody>
        </Card>
      </Grid>
      <Grid
        templateColumns={{ sm: "1fr", md: "1fr 1fr", lg: "2fr 1fr" }}
        gap="24px"
      >
        {/* Projects */}
        {/* <Card p='16px' overflowX={{ sm: 'scroll', xl: 'hidden' }}>
					<CardHeader p='12px 0px 28px 0px'>
						<Flex direction='column'>
							<Text fontSize='lg' color='#fff' fontWeight='bold' pb='8px'>
								Projects
							</Text>
							<Flex align='center'>
								<Icon as={IoCheckmarkDoneCircleSharp} color='teal.300' w={4} h={4} pe='3px' />
								<Text fontSize='sm' color='gray.400' fontWeight='normal'>
									<Text fontWeight='bold' as='span'>
										30 done
									</Text>{' '}
									this month.
								</Text>
							</Flex>
						</Flex>
					</CardHeader>
					<Table variant='simple' color='#fff'>
						<Thead>
							<Tr my='.8rem' ps='0px'>
								<Th
									ps='0px'
									color='gray.400'
									fontFamily='Plus Jakarta Display'
									borderBottomColor='#56577A'>
									Companies
								</Th>
								<Th color='gray.400' fontFamily='Plus Jakarta Display' borderBottomColor='#56577A'>
									Members
								</Th>
								<Th color='gray.400' fontFamily='Plus Jakarta Display' borderBottomColor='#56577A'>
									Budget
								</Th>
								<Th color='gray.400' fontFamily='Plus Jakarta Display' borderBottomColor='#56577A'>
									Completion
								</Th>
							</Tr>
						</Thead>
						<Tbody>
							{dashboardTableData.map((row, index, arr) => {
								return (
									<DashboardTableRow
										name={row.name}
										logo={row.logo}
										members={row.members}
										budget={row.budget}
										progression={row.progression}
										lastItem={index === arr.length - 1 ? true : false}
									/>
								);
							})}
						</Tbody>
					</Table>
				</Card> */}
        {/* Orders Overview */}
        {/* <Card>
					<CardHeader mb='32px'>
						<Flex direction='column'>
							<Text fontSize='lg' color='#fff' fontWeight='bold' mb='6px'>
								Orders overview
							</Text>
							<Flex align='center'>
								<Icon as={AiFillCheckCircle} color='green.500' w='15px' h='15px' me='5px' />
								<Text fontSize='sm' color='gray.400' fontWeight='normal'>
									<Text fontWeight='bold' as='span' color='gray.400'>
										+30%
									</Text>{' '}
									this month
								</Text>
							</Flex>
						</Flex>
					</CardHeader>
					<CardBody>
						<Flex direction='column' lineHeight='21px'>
							{timelineData.map((row, index, arr) => {
								return (
									<TimelineRow
										logo={row.logo}
										title={row.title}
										date={row.date}
										color={row.color}
										index={index}
										arrLength={arr.length}
									/>
								);
							})}
						</Flex>
					</CardBody>
				</Card> */}
      </Grid>
    </Flex>
  );
}
