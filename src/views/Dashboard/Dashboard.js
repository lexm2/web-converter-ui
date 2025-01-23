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
  Text,
  List,
  ListItem,
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
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import BarChart from "components/Charts/BarChart";
import LineChart from "components/Charts/LineChart";
import IconBox from "components/Icons/IconBox";
import LegalFormats from "components/Tables/LegalFormats";
import StatMenu from "components/Menu/StatMenu";
import { React, useState, useEffect } from "react";
import { MdLandscape } from "react-icons/md";
import {
  TiCreditCard,
  TiChartPieOutline,
  TiStarburstOutline,
  TiBook,
} from "react-icons/ti";
import { FaShield, FaPerson } from "react-icons/fa6";
import { GiArrowsShield, GiSpellBook, GiMagicAxe, GiGlowingArtifact} from "react-icons/gi";
// Data
import { useDeck } from "components/context/DeckContext";
import { StatCard } from "components/Dashboard/StatCard";
import { calculateDeckStats } from "utils/deckStats";

export default function Dashboard() {
  const { deck, organizeCardsByZone } = useDeck();
  const cardsByZone = organizeCardsByZone(deck);
  const [selectedStat, setSelectedStat] = useState("creatures");

  const deckStats = calculateDeckStats(cardsByZone);

  if (!deckStats) {
    return (
      <Flex
        flexDirection="column"
        pt={{ base: "120px", md: "75px" }}
        align="center"
        justify="center"
        minH="70vh"
      >
        <Card maxW="500px" w="100%" textAlign="center">
          <CardHeader>
            <Text fontSize="2xl" color="#fff" fontWeight="bold">
              No Deck Loaded
            </Text>
          </CardHeader>
          <CardBody>
            <IconBox
              as="box"
              h={"95px"}
              w={"95px"}
              bg="brand.200"
              margin="auto"
              mb={4}
            >
              <Icon as={TiBook} h={"50px"} w={"50px"} color="#fff" />
            </IconBox>
            <Text color="gray.400" mb={4}>
              Please load a deck to view detailed statistics and analysis
            </Text>
            <Button variant="brand" as="a" href="#/auth/loaddata">
              Load Deck
            </Button>
          </CardBody>
        </Card>
      </Flex>
    );
  }

  return (
    <Flex flexDirection="column" pt={{ base: "120px", md: "75px" }}>
      <SimpleGrid columns={{ sm: 1, md: 2, xl: 4 }} spacing="24px">
        <StatCard
          label="Average CMC"
          value={deckStats.manaStats.averageCmc.toFixed(2)}
          icon={TiChartPieOutline}
        />
        <StatCard
          label="Total Cost"
          value={`$${deckStats.valueStats.totalCost.toFixed(2)}`}
          icon={TiCreditCard}
        />
        <StatCard
          label="Average Power"
          value={deckStats.powerStats.averagePower.toFixed(2)}
          icon={GiArrowsShield}
        />
        <StatCard
          label="Average Toughness"
          value={deckStats.powerStats.averageToughness.toFixed(2)}
          icon={FaShield}
        />
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
              {console.log(deckStats?.deckLegality.deckLegality)}
              <LegalFormats
                deckLegality={deckStats?.deckLegality.deckLegality}
              />
            </Flex>
          </CardHeader>
          <Box w="100%" minH={{ sm: "20px" }}>
            <Text color="#fff" p="22px"></Text>
          </Box>
        </Card>
        {/* Satisfaction Rate */}
        <Card gridArea={{ md: "2 / 1 / 3 / 2", "2xl": "auto" }}>
          <CardHeader mb="24px">
            <Flex direction="column">
              <Text color="#fff" fontSize="lg" fontWeight="bold" mb="4px">
                Land percentage
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
                  strokeDashoffset={
                    581.1946409141117 *
                    (1 - deckStats?.manaStats.landPercentage / 100)
                  }
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
                  <Icon as={MdLandscape} color="#fff" w="30px" h="30px" />
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
                  {deckStats?.manaStats.landPercentage.toFixed(2) || "N/A"}%
                </Text>
                <Text fontSize="xs" color="gray.400">
                  Based on mainboard
                </Text>
              </Flex>
              <Text fontSize="xs" color="gray.400">
                100%
              </Text>
            </Stack>
          </Flex>
        </Card>
        {/* */}
        <Card gridArea={{ md: "2 / 2 / 3 / 3", "2xl": "auto" }}>
          <Flex direction="column">
            <Flex justify="space-between" align="center" mb="40px">
              <Text color="#fff" fontSize="lg" fontWeight="bold">
                Deck Compisition
              </Text>
              <StatMenu setSelectedStat={setSelectedStat} />
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
                    {selectedStat.charAt(0).toUpperCase() +
                      selectedStat.slice(1)}
                  </Text>
                  <Text color="#fff" fontSize="lg" fontWeight="bold">
                    {deckStats?.typeStats[selectedStat]}
                  </Text>
                </Flex>
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
                    Deck Size
                  </Text>
                  <Text color="#fff" fontSize="lg" fontWeight="bold">
                    {deckStats?.deckSize}
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
                    strokeDashoffset={
                      581.1946409141117 *
                      (1 -
                        deckStats?.typeStats[selectedStat] /
                          deckStats?.deckSize)
                    } // Adjust for progress (70% in this case)
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
                    {selectedStat.charAt(0).toUpperCase() +
                      selectedStat.slice(1)}
                  </Text>
                  <Text
                    color="#fff"
                    fontSize={{ md: "36px", lg: "43px" }}
                    fontWeight="bold"
                    mb="4px"
                  >
                    {(
                      (deckStats?.typeStats[selectedStat] /
                        deckStats?.deckSize) *
                      100
                    ).toFixed(1)}
                    %
                  </Text>
                  <Text color="gray.400" fontSize="sm">
                    Total Percentage
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
        {/* <Card p="28px 0px 0px 0px">
          <CardHeader mb="20px" ps="22px">
            <Flex direction="column" alignSelf="flex-start">
              <Text fontSize="lg" color="#fff" fontWeight="bold" mb="6px">
                Mana Curve Distribution
              </Text>
              <Text fontSize="md" fontWeight="medium" color="gray.400">
                Card count by converted mana cost
              </Text>
            </Flex>
          </CardHeader>
          <Box w="100%" minH={{ sm: "300px" }}>
            <LineChart
              lineChartData={generateManaCurveData()}
              lineChartOptions={manaCurveChartOptions}
            />
          </Box>
        </Card> */}
        {/* */}
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
                  barChartOptions={deckStats.manaCurve.chartOptions}
                  barChartData={deckStats.manaCurve.chartData}
                />
              </Box>
              <Flex
                direction="column"
                mt="24px"
                mb="36px"
                alignSelf="flex-start"
              >
                <Text fontSize="lg" color="#fff" fontWeight="bold" mb="6px">
                  Mana Value Distribution
                </Text>
                <Text fontSize="md" fontWeight="medium" color="gray.400">
                  Number of cards at each mana value
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
                      <FaPerson h={"15px"} w={"15px"} color="#fff" />
                    </IconBox>
                    <Text fontSize="sm" color="gray.400">
                      Avg Creatures/MV
                    </Text>
                  </Flex>
                  <Text
                    fontSize={{ sm: "md", lg: "lg" }}
                    color="#fff"
                    fontWeight="bold"
                    mb="6px"
                    my="6px"
                  >
                    {(deckStats?.distributionStats.avgCreaturesPerMV).toFixed(
                      1
                    )}
                  </Text>
                  <Progress
                    colorScheme="brand"
                    bg="#2D2E5F"
                    borderRadius="30px"
                    h="5px"
                    value={
                      (deckStats?.typeStats.creatures /
                        deckStats?.distributionStats.maxTypeCount) *
                      100
                    }
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
                      <GiSpellBook h={"15px"} w={"15px"} color="#fff" />
                    </IconBox>
                    <Text fontSize="sm" color="gray.400">
                      Avg Spell/MV
                    </Text>
                  </Flex>
                  <Text
                    fontSize={{ sm: "md", lg: "lg" }}
                    color="#fff"
                    fontWeight="bold"
                    mb="6px"
                    my="6px"
                  >
                    {(deckStats?.distributionStats.avgSpellsPerMV).toFixed(1)}
                  </Text>
                  <Progress
                    colorScheme="brand"
                    bg="#2D2E5F"
                    borderRadius="30px"
                    h="5px"
                    value={
                      ((deckStats?.typeStats.instants +
                        deckStats?.typeStats.sorceries) /
                        deckStats?.distributionStats.maxTypeCount) *
                      100
                    }
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
                      <GiMagicAxe h={"15px"} w={"15px"} color="#fff" />
                    </IconBox>
                    <Text fontSize="sm" color="gray.400">
                      Avg Enchantments/MV
                    </Text>
                  </Flex>
                  <Text
                    fontSize={{ sm: "md", lg: "lg" }}
                    color="#fff"
                    fontWeight="bold"
                    mb="6px"
                    my="6px"
                  >
                    {(deckStats?.distributionStats.avgEnchantmentsPerMV).toFixed(
                      1
                    )}
                  </Text>
                  <Progress
                    colorScheme="brand"
                    bg="#2D2E5F"
                    borderRadius="30px"
                    h="5px"
                    value={
                      (deckStats?.typeStats.enchantments /
                        deckStats?.distributionStats.maxTypeCount) *
                      100
                    }
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
                      <GiGlowingArtifact h={"15px"} w={"15px"} color="#fff" />
                    </IconBox>
                    <Text fontSize="sm" color="gray.400">
                      Avg Artifacts/MV
                    </Text>
                  </Flex>
                  <Text
                    fontSize={{ sm: "md", lg: "lg" }}
                    color="#fff"
                    fontWeight="bold"
                    mb="6px"
                    my="6px"
                  >
                    {(deckStats?.distributionStats.avgArtifactsPerMV).toFixed(
                      1
                    )}
                  </Text>
                  <Progress
                    colorScheme="brand"
                    bg="#2D2E5F"
                    borderRadius="30px"
                    h="5px"
                    value={
                      (deckStats?.typeStats.artifacts /
                        deckStats?.distributionStats.maxTypeCount) *
                      100
                    }
                  />
                </Flex>
              </SimpleGrid>
            </Flex>
          </CardBody>
        </Card>
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
