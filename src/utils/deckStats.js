import { useDeck } from "components/context/DeckContext";

export const calculateDeckStats = (cardsByZone) => {
  const { analyzeDeckLegality } = useDeck();
  const mainDeck = cardsByZone.Main;
  if (!mainDeck?.length) return null;

  const highestQuantityCard = mainDeck.reduce((highest, current) =>
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
        id: "mana-curve",
        toolbar: { show: false },
        type: "bar",
        stacked: true,
        fontFamily: "Plus Jakarta Display",
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadius: 2,
        },
      },
      dataLabels: { enabled: false },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      tooltip: {
        theme: "dark",
        shared: true,
        intersect: false,
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
        legend: {
          position: "top",
          horizontalAlign: "left",
          offsetX: 40,
          labels: { colors: "#A0AEC0" },
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

  const landDrawChartOptions = {
    chart: {
      id: "land-probability",
      toolbar: { show: false },
      type: "line",
    },
    xaxis: {
      categories: [
        "First Hand",
        "Mullugan 1",
        "Mullugan 2",
        "Mullugan 3",
        "Mullugan 4",
        "Mullugan 5",
        "Mullugan 6",
      ],
      labels: { style: { colors: "#A0AEC0" } },
    },
    yaxis: {
      title: {
        text: "Probability (%)",
        style: { color: "#A0AEC0" },
      },
      labels: { style: { colors: "#A0AEC0" } },
    },
    errorBar: {
      show: true,
      color: "#ffffff",
      width: 2,
      strokeWidth: 1,
      capWidth: 4,
    },
    markers: {
      size: 4,
    },
  };

  const calculateOpeningHandLandProbability = (deckSize, typeStat) => {
    const calculateProbability = (count) => {
      let probabilities = [];

      // For each mulligan step
      for (let mulligan = 0; mulligan < 7; mulligan++) {
        const handSizeAfterMulligan = 7 - mulligan;
        const statSizeAfterMulligan = count - mulligan;
        const deckSizeAfterMulligan = deckSize - mulligan;

        const mean = Math.max(
          (handSizeAfterMulligan * statSizeAfterMulligan) /
            deckSizeAfterMulligan,
          0
        ).toFixed(2);

        // Hypergeometric variance formula
        const variance =
          handSizeAfterMulligan *
          (statSizeAfterMulligan / deckSizeAfterMulligan) *
          ((deckSizeAfterMulligan - statSizeAfterMulligan) /
            deckSizeAfterMulligan) *
          ((deckSizeAfterMulligan - handSizeAfterMulligan) /
            (deckSizeAfterMulligan - 1));

        const stdDev = Math.sqrt(variance).toFixed(2);

        const x = mulligan === 0 ? "First Hand" : "Mulligan " + mulligan;

        probabilities.push({
          x: x,
          y: mean,
          errorBar: {
            upper: mean + stdDev,
            lower: mean - stdDev,
          },
        });
      }

      return probabilities;
    };

    console.log(calculateProbability(typeStat.lands));

    return [
      {
        name: "Lands",
        data: calculateProbability(typeStat.lands),
        color: "#48BB78",
      },
      {
        name: "Creatures",
        data: calculateProbability(typeStat.creatures),
        color: "#E53E3E",
      },
      {
        name: "Instants",
        data: calculateProbability(typeStat.instants),
        color: "#3182CE",
      },
      {
        name: "Sorceries",
        data: calculateProbability(typeStat.sorceries),
        color: "#805AD5",
      },
      {
        name: "Enchantments",
        data: calculateProbability(typeStat.enchantments),
        color: "#D69E2E",
      },
      {
        name: "Artifacts",
        data: calculateProbability(typeStat.artifacts),
        color: "#718096",
      },
    ];
  };

  return {
    landDrawData: {
      drawProbability: calculateOpeningHandLandProbability(
        totalCards,
        typeStats
      ),
      landDrawChartOptions: landDrawChartOptions,
    },
    deckSize: totalCards,
    deckLegality: analyzeDeckLegality(
      mainDeck,
      totalCards,
      highestQuantityCard
    ),
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
