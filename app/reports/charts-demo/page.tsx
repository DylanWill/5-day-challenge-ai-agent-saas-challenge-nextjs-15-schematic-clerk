'use client';

import { useState, useEffect } from 'react';
import ChartImage from '@/components/charts/ChartImage';
import { 
  generatePriceTrendChart, 
  generatePropertyComparisonChart,
  generateMarketDistributionChart,
  generatePropertyCorrelationChart
} from '@/actions/generateCharts';

export default function ChartsDemo() {
  const [priceTrendChart, setPriceTrendChart] = useState<string | null>(null);
  const [propertyComparisonChart, setPropertyComparisonChart] = useState<string | null>(null);
  const [marketDistributionChart, setMarketDistributionChart] = useState<string | null>(null);
  const [propertyCorrelationChart, setPropertyCorrelationChart] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCharts() {
      try {
        setLoading(true);
        
        // Generate price trend chart (line graph)
        const priceTrend = await generatePriceTrendChart(
          'Los Angeles',
          ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          [
            {
              label: 'Single Family Homes',
              data: [750000, 760000, 775000, 790000, 810000, 825000, 840000, 835000, 830000, 845000, 860000, 875000]
            },
            {
              label: 'Condos',
              data: [450000, 455000, 460000, 470000, 480000, 485000, 490000, 495000, 490000, 485000, 495000, 500000]
            },
            {
              label: 'Townhouses',
              data: [550000, 560000, 570000, 580000, 590000, 600000, 610000, 615000, 620000, 625000, 630000, 640000]
            }
          ]
        );

        if (priceTrend.success) {
          setPriceTrendChart(priceTrend.chartUrl);
        }
        
        // Generate property comparison chart (bar chart)
        const propertyComparison = await generatePropertyComparisonChart(
          'Property Comparison',
          ['123 Main St', '456 Oak Ave', '789 Pine Ln', '101 Cedar Rd'],
          [
            {
              label: 'Price ($)',
              data: [750000, 850000, 650000, 950000]
            },
            {
              label: 'Size (sq ft)',
              data: [2200, 2500, 1800, 3000]
            },
            {
              label: 'Lot Size (sq ft)',
              data: [5000, 6000, 4500, 7500]
            }
          ]
        );

        if (propertyComparison.success) {
          setPropertyComparisonChart(propertyComparison.chartUrl);
        }
        
        // Generate market distribution chart (pie chart)
        const marketDistribution = await generateMarketDistributionChart(
          'Property Types in Los Angeles',
          ['Single Family', 'Condo', 'Townhouse', 'Multi-Family', 'Vacant Land'],
          [55, 25, 12, 5, 3]
        );

        if (marketDistribution.success) {
          setMarketDistributionChart(marketDistribution.chartUrl);
        }
        
        // Generate property correlation chart (scatter plot)
        const propertyCorrelation = await generatePropertyCorrelationChart(
          'Price vs. Size Correlation',
          [
            {
              label: 'Single Family Homes',
              data: [
                { x: 1500, y: 550000 },
                { x: 1800, y: 650000 },
                { x: 2000, y: 700000 },
                { x: 2200, y: 750000 },
                { x: 2500, y: 850000 },
                { x: 2800, y: 950000 },
                { x: 3000, y: 1050000 },
                { x: 3200, y: 1150000 },
                { x: 3500, y: 1250000 }
              ]
            },
            {
              label: 'Condos',
              data: [
                { x: 800, y: 350000 },
                { x: 1000, y: 400000 },
                { x: 1200, y: 450000 },
                { x: 1400, y: 500000 },
                { x: 1600, y: 550000 },
                { x: 1800, y: 600000 },
                { x: 2000, y: 650000 }
              ]
            }
          ],
          'Size (sq ft)',
          'Price ($)'
        );

        if (propertyCorrelation.success) {
          setPropertyCorrelationChart(propertyCorrelation.chartUrl);
        }
        
      } catch (err) {
        console.error('Error loading charts:', err);
        setError('Failed to load charts. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    loadCharts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Real Estate Chart Examples</h1>
      
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="ml-4 text-lg">Loading charts...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Line Graph - Price Trends */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Price Trends Over Time</h2>
            <p className="text-gray-600 mb-4">
              Line graphs show how property prices change over time, helping identify trends and seasonal patterns.
            </p>
            {priceTrendChart && (
              <ChartImage 
                src={priceTrendChart} 
                alt="Price trends in Los Angeles" 
                width={500}
                height={300}
              />
            )}
          </div>
          
          {/* Bar Chart - Property Comparison */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Property Comparison</h2>
            <p className="text-gray-600 mb-4">
              Bar charts allow for easy comparison of multiple properties across different metrics.
            </p>
            {propertyComparisonChart && (
              <ChartImage 
                src={propertyComparisonChart} 
                alt="Property comparison" 
                width={500}
                height={300}
              />
            )}
          </div>
          
          {/* Pie Chart - Market Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Market Distribution</h2>
            <p className="text-gray-600 mb-4">
              Pie charts show the distribution of property types or price ranges in a specific market.
            </p>
            {marketDistributionChart && (
              <ChartImage 
                src={marketDistributionChart} 
                alt="Property types in Los Angeles" 
                width={500}
                height={300}
              />
            )}
          </div>
          
          {/* Scatter Plot - Property Correlation */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Price vs. Size Correlation</h2>
            <p className="text-gray-600 mb-4">
              Scatter plots reveal relationships between variables like property size and price.
            </p>
            {propertyCorrelationChart && (
              <ChartImage 
                src={propertyCorrelationChart} 
                alt="Price vs. size correlation" 
                width={500}
                height={300}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
} 