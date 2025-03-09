'use server';

import { 
  generateLineGraph, 
  generateBarChart, 
  generatePieChart, 
  generateScatterPlot,
  getRealEstateColorPalette
} from '@/lib/charts/quickchart';

/**
 * Generate a price trend line graph
 */
export async function generatePriceTrendChart(
  locationName: string,
  timeLabels: string[],
  priceSeries: Array<{
    label: string;
    data: number[];
  }>
) {
  try {
    // Get colors from our real estate palette
    const colors = getRealEstateColorPalette(priceSeries.length);
    
    // Add colors to each series
    const enhancedSeries = priceSeries.map((series, index) => ({
      ...series,
      borderColor: colors[index],
      backgroundColor: colors[index].replace('0.7', '0.2')
    }));
    
    // Generate the chart URL
    const chartUrl = generateLineGraph(
      `Price Trends in ${locationName}`,
      timeLabels,
      enhancedSeries
    );
    
    return { success: true, chartUrl };
  } catch (error) {
    console.error('Error generating price trend chart:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Generate a property comparison bar chart
 */
export async function generatePropertyComparisonChart(
  title: string,
  properties: string[],
  metrics: Array<{
    label: string;
    data: number[];
  }>,
  horizontal: boolean = false
) {
  try {
    // Get colors from our real estate palette
    const colors = getRealEstateColorPalette(metrics.length);
    
    // Add colors to each metric
    const enhancedMetrics = metrics.map((metric, index) => ({
      ...metric,
      backgroundColor: colors[index]
    }));
    
    // Generate the chart URL
    const chartUrl = generateBarChart(
      title,
      properties,
      enhancedMetrics,
      horizontal
    );
    
    return { success: true, chartUrl };
  } catch (error) {
    console.error('Error generating property comparison chart:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Generate a market distribution pie chart
 */
export async function generateMarketDistributionChart(
  title: string,
  categories: string[],
  values: number[]
) {
  try {
    // Get colors from our real estate palette
    const colors = getRealEstateColorPalette(categories.length);
    
    // Generate the chart URL
    const chartUrl = generatePieChart(
      title,
      categories,
      values,
      colors
    );
    
    return { success: true, chartUrl };
  } catch (error) {
    console.error('Error generating market distribution chart:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Generate a property attribute correlation scatter plot
 */
export async function generatePropertyCorrelationChart(
  title: string,
  datasets: Array<{
    label: string;
    data: Array<{ x: number; y: number }>;
  }>,
  xAxisLabel: string,
  yAxisLabel: string
) {
  try {
    // Get colors from our real estate palette
    const colors = getRealEstateColorPalette(datasets.length);
    
    // Add colors to each dataset
    const enhancedDatasets = datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor: colors[index]
    }));
    
    // Generate the chart URL
    const chartUrl = generateScatterPlot(
      title,
      enhancedDatasets,
      xAxisLabel,
      yAxisLabel
    );
    
    return { success: true, chartUrl };
  } catch (error) {
    console.error('Error generating property correlation chart:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
} 