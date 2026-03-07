import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const defaultCategories = [
  { name: "Renewable Energy", slug: "renewable-energy", description: "Solar, wind, hydro and more", color: "#10B981", icon: "sun" },
  { name: "Oil & Gas", slug: "oil-gas", description: "Fossil fuel industry updates", color: "#F59E0B", icon: "droplet" },
  { name: "Policy & Regulation", slug: "policy-regulation", description: "Government policies and laws", color: "#6366F1", icon: "scale" },
  { name: "Sustainability", slug: "sustainability", description: "Environmental initiatives", color: "#22C55E", icon: "leaf" },
  { name: "Technology", slug: "technology", description: "Energy tech innovations", color: "#3B82F6", icon: "cpu" },
  { name: "Market Analysis", slug: "market-analysis", description: "Market trends and forecasts", color: "#EC4899", icon: "trending-up" },
];

const samplePosts = [
  {
    title: "The Future of Solar Energy: Breakthrough Technologies in 2025",
    excerpt: "Discover the latest innovations in solar panel technology that are revolutionizing renewable energy adoption worldwide.",
    content: `Solar energy continues to evolve at an unprecedented pace. In 2025, we are witnessing remarkable breakthroughs that promise to transform how we harness the power of the sun.

## Perovskite Solar Cells

Perovskite solar cells have emerged as a game-changing technology. These cells offer higher efficiency rates at lower production costs compared to traditional silicon-based panels. Recent laboratory tests have achieved conversion efficiencies exceeding 33%, a significant improvement over conventional panels.

## Bifacial Solar Panels

Bifacial panels, which capture sunlight from both sides, are gaining traction in utility-scale installations. These panels can increase energy yield by 10-30% compared to traditional single-sided panels, making them particularly attractive for large-scale projects.

## Solar Storage Integration

The integration of solar panels with advanced battery storage systems is addressing one of solar energy's biggest challenges: intermittency. New lithium-ion and solid-state battery technologies are enabling more efficient energy storage, allowing solar power to be available even when the sun isn't shining.

## Floating Solar Farms

Floating photovoltaic (FPV) systems are becoming increasingly popular, especially in regions with limited land availability. These installations on water bodies not only generate clean energy but also help reduce water evaporation and algae growth.

## Conclusion

The solar industry is poised for continued growth as these technologies mature and costs continue to decline. With supportive policies and increasing environmental awareness, solar energy is set to play a central role in the global transition to clean energy.`,
    categorySlug: "renewable-energy",
    featured: true,
    published: true,
  },
  {
    title: "Global Oil Markets: Analysis of Q1 2025 Trends",
    excerpt: "An in-depth look at oil price movements, OPEC decisions, and their impact on global energy markets.",
    content: `The first quarter of 2025 has seen significant volatility in global oil markets, driven by geopolitical tensions, supply adjustments, and changing demand patterns.

## OPEC+ Production Decisions

OPEC+ members have maintained their production cuts into 2025, supporting prices despite calls from consumer nations for increased output. The alliance has demonstrated remarkable discipline in managing supply to balance market fundamentals.

## Impact on Energy Transition

Higher oil prices are accelerating the transition to renewable energy in many regions. Countries are investing more in alternative energy sources as a hedge against oil price volatility.

## Regional Analysis

- **Middle East**: Continued stability in production with incremental capacity additions
- **North America**: Shale producers maintaining disciplined capital allocation
- **Asia Pacific**: Strong demand growth, particularly in India and Southeast Asia

## Price Forecast

Analysts project oil prices to remain in the $70-85 range for the remainder of 2025, with upside risks from potential supply disruptions.`,
    categorySlug: "oil-gas",
    featured: true,
    published: true,
  },
  {
    title: "Electric Vehicle Adoption Reaches Tipping Point in Europe",
    excerpt: "EV sales surpass diesel for the first time as charging infrastructure expands and prices become competitive.",
    content: `Europe has reached a significant milestone in its energy transition journey: electric vehicle sales have surpassed diesel vehicles for the first time in history.

## Key Statistics

- EV market share reached 25% in Q1 2025
- Diesel vehicle sales dropped to 22%
- Norway leads with 90% EV market share
- Charging infrastructure grew by 40% year-over-year

## Government Incentives

European governments continue to support EV adoption through:
- Purchase subsidies up to €7,000 in some countries
- Tax exemptions and reduced registration fees
- Low emission zones in major cities
- Free parking and charging in urban areas

## Industry Response

Major automakers have accelerated their EV production plans:
- Volkswagen committed to 80% EV sales by 2030
- BMW expanding EV lineup to 25 models
- Stellantis investing €30 billion in electrification

The momentum appears irreversible as EVs become the default choice for European consumers.`,
    categorySlug: "technology",
    featured: true,
    published: true,
  },
  {
    title: "Wind Power Expansion: Offshore Projects Set to Double by 2030",
    excerpt: "Major economies announce ambitious offshore wind targets as technology costs continue to decline.",
    content: `The global offshore wind industry is experiencing unprecedented growth, with installed capacity projected to more than double by 2030.

## Global Capacity Targets

- European Union: 300 GW by 2050
- United States: 30 GW by 2030
- China: Leading with aggressive expansion plans
- UK: Targeting 50 GW offshore wind capacity

## Technology Advances

Modern wind turbines have grown dramatically in size and efficiency:
- Average turbine capacity now exceeds 8 MW
- New 15 MW turbines under development
- Improved blade designs increasing capture efficiency
- Floating foundations enabling deeper water installations

The industry is maturing rapidly with standardization driving down costs.`,
    categorySlug: "renewable-energy",
    featured: false,
    published: true,
  },
  {
    title: "Carbon Capture Technology: From Promise to Reality",
    excerpt: "Carbon capture and storage facilities are scaling up globally as industries seek to meet net-zero targets.",
    content: `Carbon capture, utilization, and storage (CCUS) technology is transitioning from pilot projects to commercial scale operations.

## Current Status

Global CCUS capacity has grown to over 40 million tonnes of CO2 captured annually:
- North America leads with largest facilities
- Europe expanding rapidly with policy support
- Asia-Pacific emerging as key growth market

## Technology Types

**Post-combustion capture**
Most mature technology, capturing CO2 from flue gases at power plants and industrial facilities.

**Direct air capture (DAC)**
Emerging technology removing CO2 directly from atmosphere. Several large facilities now operational.

CCUS is becoming essential for hard-to-abate sectors like cement, steel, and chemicals.`,
    categorySlug: "sustainability",
    featured: false,
    published: true,
  },
];

async function main() {
  console.log("🌱 Starting seed...");

  // Create admin author
  const admin = await prisma.author.upsert({
    where: { email: "admin@energypulse.com" },
    update: {},
    create: {
      id: "admin-author",
      name: "Admin",
      email: "admin@energypulse.com",
      role: "Admin",
    },
  });
  console.log("✅ Created admin author");

  // Create categories
  for (const category of defaultCategories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }
  console.log("✅ Created categories");

  // Create sample posts
  for (const post of samplePosts) {
    const category = await prisma.category.findUnique({
      where: { slug: post.categorySlug },
    });

    if (category) {
      await prisma.post.upsert({
        where: { slug: post.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") },
        update: {},
        create: {
          title: post.title,
          slug: post.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
          excerpt: post.excerpt,
          content: post.content,
          featured: post.featured,
          published: post.published,
          authorId: admin.id,
          categoryId: category.id,
        },
      });
    }
  }
  console.log("✅ Created sample posts");

  console.log("🎉 Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
