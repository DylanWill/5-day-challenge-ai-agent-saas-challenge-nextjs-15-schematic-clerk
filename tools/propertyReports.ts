import { z } from "zod";
import { tool } from "ai";
import { 
  generatePriceTrendChart, 
  generatePropertyComparisonChart,
  generateMarketDistributionChart,
  generatePropertyCorrelationChart
} from '@/actions/generateCharts';

// Mock function to generate a property report
async function generatePropertyReport(
  address: string,
  propertyType: string,
  bedrooms: number,
  bathrooms: number,
  squareFeet: number
) {
  // In a real implementation, this would call a real estate data API
  console.log(`Generating property report for ${address}`);
  
  // Mock response with property analysis
  return {
    property: {
      address,
      propertyType,
      bedrooms,
      bathrooms,
      squareFeet,
      estimatedValue: `$${(750000 + (bedrooms * 50000) + (bathrooms * 25000) + (squareFeet * 200)).toLocaleString()}`,
    },
    comparableProperties: [
      {
        address: "456 Oak Ave, Anytown, USA",
        soldPrice: "$785,000",
        soldDate: "2023-01-15",
        squareFeet: squareFeet - 200,
        bedrooms,
        bathrooms,
      },
      {
        address: "789 Pine St, Anytown, USA",
        soldPrice: "$810,000",
        soldDate: "2023-02-20",
        squareFeet: squareFeet + 150,
        bedrooms,
        bathrooms: bathrooms + 0.5,
      },
      {
        address: "321 Elm St, Anytown, USA",
        soldPrice: "$750,000",
        soldDate: "2023-03-10",
        squareFeet: squareFeet - 100,
        bedrooms: bedrooms - 1,
        bathrooms,
      },
    ],
    marketTrends: {
      medianPrice: "$775,000",
      priceChange: "+4.8%",
      avgDaysOnMarket: 22,
      inventory: 38,
      historicalPrices: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        data: [750000, 755000, 760000, 765000, 770000, 775000, 780000, 785000, 790000, 795000, 800000, 805000]
      }
    },
    propertyTypeDistribution: {
      labels: ['Single Family', 'Condo', 'Townhouse', 'Multi-Family', 'Vacant Land'],
      data: [60, 20, 10, 7, 3]
    },
    priceVsSizeData: [
      {
        label: 'Similar Properties',
        data: [
          { x: squareFeet - 300, y: 700000 },
          { x: squareFeet - 200, y: 725000 },
          { x: squareFeet - 100, y: 750000 },
          { x: squareFeet, y: parseInt(String(750000 + (bedrooms * 50000) + (bathrooms * 25000) + (squareFeet * 200))) },
          { x: squareFeet + 100, y: 800000 },
          { x: squareFeet + 200, y: 825000 },
          { x: squareFeet + 300, y: 850000 }
        ]
      }
    ],
    reportId: "report_" + Date.now(),
    timestamp: new Date().toISOString(),
  };
}

// Generate charts for the property report
async function generateReportCharts(reportData: any) {
  try {
    // Extract data for charts
    const property = reportData.property;
    const comps = reportData.comparableProperties;
    
    // 1. Price Comparison Bar Chart
    const propertyLabels = [
      property.address.split(',')[0], // First part of the address
      ...comps.map((comp: any) => comp.address.split(',')[0])
    ];
    
    const priceValues = [
      parseInt(property.estimatedValue.replace(/[^0-9]/g, '')),
      ...comps.map((comp: any) => parseInt(comp.soldPrice.replace(/[^0-9]/g, '')))
    ];
    
    const priceComparisonResult = await generatePropertyComparisonChart(
      'Property Price Comparison',
      propertyLabels,
      [{
        label: 'Price ($)',
        data: priceValues
      }]
    );
    
    // 2. Size Comparison Bar Chart
    const sizeValues = [
      property.squareFeet,
      ...comps.map((comp: any) => comp.squareFeet)
    ];
    
    const sizeComparisonResult = await generatePropertyComparisonChart(
      'Property Size Comparison',
      propertyLabels,
      [{
        label: 'Size (sq ft)',
        data: sizeValues
      }]
    );
    
    // 3. Market Trends Line Chart
    const marketTrendsResult = await generatePriceTrendChart(
      'Historical Price Trends',
      reportData.marketTrends.historicalPrices.labels,
      [{
        label: 'Median Price',
        data: reportData.marketTrends.historicalPrices.data
      }]
    );
    
    // 4. Property Type Distribution Pie Chart
    const distributionResult = await generateMarketDistributionChart(
      'Property Types in the Area',
      reportData.propertyTypeDistribution.labels,
      reportData.propertyTypeDistribution.data
    );
    
    // 5. Price vs Size Scatter Plot
    const correlationResult = await generatePropertyCorrelationChart(
      'Price vs. Size Correlation',
      reportData.priceVsSizeData,
      'Size (sq ft)',
      'Price ($)'
    );
    
    return {
      priceComparison: priceComparisonResult.success ? priceComparisonResult.chartUrl : null,
      sizeComparison: sizeComparisonResult.success ? sizeComparisonResult.chartUrl : null,
      marketTrends: marketTrendsResult.success ? marketTrendsResult.chartUrl : null,
      propertyTypeDistribution: distributionResult.success ? distributionResult.chartUrl : null,
      priceVsSize: correlationResult.success ? correlationResult.chartUrl : null
    };
  } catch (error) {
    console.error("Error generating report charts:", error);
    return null;
  }
}

// AI Tool for property report generation
export const propertyReportTool = tool({
  name: "generatePropertyReport",
  description: "Generate a comparative market analysis report for a property",
  parameters: z.object({
    address: z.string().describe("Address of the property"),
    propertyType: z.string().describe("Type of property (e.g., Single Family, Condo, etc.)"),
    bedrooms: z.number().describe("Number of bedrooms"),
    bathrooms: z.number().describe("Number of bathrooms"),
    squareFeet: z.number().describe("Square footage of the property"),
    includeCharts: z.boolean().optional().describe("Whether to include charts in the report (default: false)"),
  }),
  execute: async ({ address, propertyType, bedrooms, bathrooms, squareFeet, includeCharts = false }) => {
    try {
      // Generate the property report
      const report = await generatePropertyReport(address, propertyType, bedrooms, bathrooms, squareFeet);
      
      // Generate charts if requested
      if (includeCharts) {
        const charts = await generateReportCharts(report);
        
        return {
          ...report,
          charts,
        };
      }
      
      return report;
    } catch (error) {
      console.error("Error in property report tool:", error);
      throw new Error("Failed to generate property report. Please try again or contact support.");
    }
  },
}); 