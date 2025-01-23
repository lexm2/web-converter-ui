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
// Styles for the circular progressbar
import medusa from "assets/img/cardimgfree.png";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import BarChart from "components/Charts/BarChart";
import LineChart from "components/Charts/LineChart";
import IconBox from "components/Icons/IconBox";
import LegalFormats from "components/Tables/LegalFormats";
import StatMenu from "components/Menu/StatMenu";
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
import { React, useState, useEffect } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { MdLandscape } from "react-icons/md";
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

export default function Dashboard() {
  const { deck, organizeCardsByZone, analyzeDeckLegality } = useDeck();
  const cardsByZone = organizeCardsByZone(deck);
  const [selectedStat, setSelectedStat] = useState("creatures");
  const [showChart, setShowChart] = useState(false);

  const calculateDeckStats = (cardsByZone) => {
    const mainDeck = cardsByZone.Main;
    if (!mainDeck?.length) return null;

    const highestQuatityCard = mainDeck.reduce((highest, current) =>
      current.quantity > highest.quantity ? current : highest
    );
    const totalCards = mainDeck.reduce((sum, card) => sum + card.quantity, 0);
    const landCount = mainDeck.reduce(
      (sum, card) =>
        card.typeLine?.includes("Land") ? sum + card.quantity : sum,
      0
    );

    const typeStats = {
      creatures: mainDeck.reduce(
        (sum, card) =>
          card.typeLine?.includes("Creature") ? sum + card.quantity : sum,
        0
      ),
      instants: mainDeck.reduce(
        (sum, card) =>
          card.typeLine?.includes("Instant") ? sum + card.quantity : sum,
        0
      ),
      sorceries: mainDeck.reduce(
        (sum, card) =>
          card.typeLine?.includes("Sorcery") ? sum + card.quantity : sum,
        0
      ),
      artifacts: mainDeck.reduce(
        (sum, card) =>
          card.typeLine?.includes("Artifact") ? sum + card.quantity : sum,
        0
      ),
      enchantments: mainDeck.reduce(
        (sum, card) =>
          card.typeLine?.includes("Enchantment") ? sum + card.quantity : sum,
        0
      ),
      lands: landCount,
      landPercentage: (landCount / totalCards) * 100,
    };

    let typeDistributions = {
      creatures: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 },
      instants: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 },
      sorceries: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 },
      enchantments: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 },
      artifacts: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 },
      lands: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 },
    };

    const manaCurve = {
      distribution: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 },
      chartData: [
        {
          name: "Creatures",
          data: [0, 0, 0, 0, 0, 0, 0, 0],
          color: "#E53E3E",
        },
        {
          name: "Instants",
          data: [0, 0, 0, 0, 0, 0, 0, 0],
          color: "#3182CE",
        },
        {
          name: "Sorceries",
          data: [0, 0, 0, 0, 0, 0, 0, 0],
          color: "#805AD5",
        },
        {
          name: "Enchantments",
          data: [0, 0, 0, 0, 0, 0, 0, 0],
          color: "#D69E2E",
        },
        {
          name: "Artifacts",
          data: [0, 0, 0, 0, 0, 0, 0, 0],
          color: "#718096",
        },
        {
          name: "Lands",
          data: [0, 0, 0, 0, 0, 0, 0, 0],
          color: "#48BB78",
        },
      ],
      chartOptions: {
        chart: {
          toolbar: { show: false },
          type: "bar",
          stacked: true,
        },
        tooltip: {
          theme: "dark",
          title: "Mana Distribution",
        },
        xaxis: {
          categories: [
            "0 MV",
            "1 MV",
            "2 MV",
            "3 MV",
            "4 MV",
            "5 MV",
            "6 MV",
            "7 MV",
          ],
          title: {
            text: "Converted Mana Cost",
            style: { color: "#A0AEC0" },
          },
          labels: {
            style: { colors: "#A0AEC0" },
          },
        },
        yaxis: {
          min: 0,
          title: {
            text: "Number of Cards",
            style: { color: "#A0AEC0" },
          },
          labels: {
            style: { colors: "#A0AEC0" },
          },
        },
        xaxis: {
          categories: [
            "0 MV",
            "1 MV",
            "2 MV",
            "3 MV",
            "4 MV",
            "5 MV",
            "6 MV",
            "7 MV",
          ],
        },
      },
    };

    mainDeck.forEach((card) => {
      const manaCost = card.cmc || 0;
      if (card.typeLine?.includes("Land")) {
        typeDistributions.lands[manaCost] += card.quantity;
      }
      if (card.typeLine?.includes("Creature")) {
        typeDistributions.creatures[manaCost] += card.quantity;
      }
      if (card.typeLine?.includes("Instant")) {
        typeDistributions.instants[manaCost] += card.quantity;
      }
      if (card.typeLine?.includes("Sorcery")) {
        typeDistributions.sorceries[manaCost] += card.quantity;
      }
      if (card.typeLine?.includes("Enchantment")) {
        typeDistributions.enchantments[manaCost] += card.quantity;
      }
      if (card.typeLine?.includes("Artifact")) {
        typeDistributions.artifacts[manaCost] += card.quantity;
      }
    });

    manaCurve.chartData = [
      {
        name: "Creatures",
        data: Object.values(typeDistributions.creatures),
        color: "#E53E3E",
      },
      {
        name: "Instants",
        data: Object.values(typeDistributions.instants),
        color: "#3182CE",
      },
      {
        name: "Sorceries",
        data: Object.values(typeDistributions.sorceries),
        color: "#805AD5",
      },
      {
        name: "Enchantments",
        data: Object.values(typeDistributions.enchantments),
        color: "#D69E2E",
      },
      {
        name: "Artifacts",
        data: Object.values(typeDistributions.artifacts),
        color: "#718096",
      },
      {
        name: "Lands",
        data: Object.values(typeDistributions.lands),
        color: "#48BB78",
      },
    ];

    return {
      deckSize: totalCards,
      legality: analyzeDeckLegality(mainDeck, totalCards, highestQuatityCard),
      valueStats: {
        totalCost: mainDeck.reduce(
          (acc, card) => acc + Number(card.prices?.usd || 0) * card.quantity,
          0
        ),
        averageCardPrice:
          mainDeck.reduce(
            (acc, card) => acc + Number(card.prices?.usd || 0) * card.quantity,
            0
          ) / totalCards,
      },
      manaStats: {
        landPercentage: (landCount / totalCards) * 100,
        producingManaPercentage:
          mainDeck.reduce(
            (sum, card) =>
              card.extraData?.produced_mana ? sum + card.quantity : sum,
            0
          ) / totalCards,
        averageCmc:
          mainDeck.reduce(
            (acc, card) => acc + (card.cmc || 0) * card.quantity,
            0
          ) / totalCards,
        colorDistribution: mainDeck.reduce((acc, card) => {
          card.colors?.forEach(
            (color) => (acc[color] = (acc[color] || 0) + card.quantity)
          );
          return acc;
        }, {}),
      },
      typeStats,
      manaCurve,
      powerStats: {
        averagePower:
          mainDeck.reduce(
            (acc, card) =>
              acc + (Number(card.extraData?.power) || 0) * card.quantity,
            0
          ) /
          mainDeck.reduce(
            (sum, card) => (card.extraData?.power ? sum + card.quantity : sum),
            0
          ),
        averageToughness:
          mainDeck.reduce(
            (acc, card) =>
              acc + (Number(card.extraData?.toughness) || 0) * card.quantity,
            0
          ) /
          mainDeck.reduce(
            (sum, card) =>
              card.extraData?.toughness ? sum + card.quantity : sum,
            0
          ),
      },
      distributionStats: {
        avgCreaturesPerMV:
          typeStats.creatures / Object.keys(manaCurve.distribution).length,
        avgSpellsPerMV:
          (typeStats.instants + typeStats.sorceries) /
          Object.keys(manaCurve.distribution).length,
        avgEnchantmentsPerMV:
          typeStats.enchantments / Object.keys(manaCurve.distribution).length,
        avgArtifactsPerMV:
          typeStats.artifacts / Object.keys(manaCurve.distribution).length,
        maxTypeCount: Math.max(
          typeStats.creatures,
          typeStats.instants + typeStats.sorceries,
          typeStats.enchantments,
          typeStats.artifacts
        ),
      },
    };
  };

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
        {/* Average CMC */}
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
                  Average CMC
                </StatLabel>
                <Flex>
                  <StatNumber fontSize="lg" color="#fff">
                    {deckStats?.manaStats.averageCmc.toFixed(2) || "N/A"}
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

        {/* Total Cost */}
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
                  Total Cost
                </StatLabel>
                <Flex>
                  <StatNumber fontSize="lg" color="#fff">
                    ${deckStats?.valueStats.totalCost.toFixed(2) || "N/A"}
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
        {/* Average Power */}
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
                  Average Power
                </StatLabel>
                <Flex>
                  <StatNumber fontSize="lg" color="#fff" fontWeight="bold">
                    {deckStats?.powerStats.averagePower.toFixed(2) || "N/A"}
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
        {/* Average Toughness */}
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
                  Average Toughness
                </StatLabel>
                <Flex>
                  <StatNumber fontSize="lg" color="#fff">
                    {deckStats?.powerStats.averageToughness.toFixed(2) || "N/A"}
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
              <LegalFormats
                fullyLegalFormats={deckStats.legality.fullyLegalFormats}
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
                      <TiStarburstOutline h={"15px"} w={"15px"} color="#fff" />
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
                      <TiChartPieOutline h={"15px"} w={"15px"} color="#fff" />
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
                      <TiBook h={"15px"} w={"15px"} color="#fff" />
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
                      <TiCreditCard h={"15px"} w={"15px"} color="#fff" />
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
