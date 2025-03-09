/**
 * QuickChart API Integration for Real Estate Visualizations
 * 
 * This utility provides functions to generate various chart types for real estate data
 * using the QuickChart API (https://quickchart.io/).
 */

// Base URL for the QuickChart API
const QUICKCHART_API_URL = 'https://quickchart.io/chart';
const QUICKCHART_API_KEY = process.env.QUICKCHART_API_KEY;

/**
 * Generate a chart URL using the QuickChart API
 * @param chartConfig The Chart.js configuration object
 * @param width The width of the chart image (default: 500)
 * @param height The height of the chart image (default: 300)
 * @param backgroundColor The background color of the chart (default: white)
 * @returns The URL to the generated chart image
 */
export function generateChartUrl(
  chartConfig: any,
  width: number = 500,
  height: number = 300,
  backgroundColor: string = 'white'
): string {
  // Create the chart configuration
  const config = {
    ...chartConfig,
    options: {
      ...chartConfig.options,
      plugins: {
        ...chartConfig.options?.plugins,
        title: {
          ...chartConfig.options?.plugins?.title,
          display: true,
          font: {
            size: 16,
            weight: 'bold'
          }
        }
      }
    }
  };

  // Construct the URL with parameters
  const params = new URLSearchParams({
    c: JSON.stringify(config),
    w: width.toString(),
    h: height.toString(),
    bkg: backgroundColor,
  });

  // Add API key if available
  if (QUICKCHART_API_KEY) {
    params.append('key', QUICKCHART_API_KEY);
  }

  return `${QUICKCHART_API_URL}?${params.toString()}`;
}

/**
 * Generate a line graph for real estate data over time
 * @param title The title of the chart
 * @param labels The x-axis labels (typically dates or time periods)
 * @param datasets The data series to display
 * @returns The URL to the generated line graph
 */
export function generateLineGraph(
  title: string,
  labels: string[],
  datasets: Array<{
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
  }>
): string {
  const chartConfig = {
    type: 'line',
    data: {
      labels,
      datasets: datasets.map(dataset => ({
        label: dataset.label,
        data: dataset.data,
        fill: false,
        borderColor: dataset.borderColor || getRandomColor(),
        backgroundColor: dataset.backgroundColor || 'rgba(0, 0, 0, 0.1)',
        tension: 0.1
      }))
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          text: title
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        },
        legend: {
          position: 'top',
        }
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Time Period'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Value'
          },
          beginAtZero: true
        }
      }
    }
  };

  return generateChartUrl(chartConfig);
}

/**
 * Generate a bar chart for comparing real estate data
 * @param title The title of the chart
 * @param labels The x-axis labels (typically categories)
 * @param datasets The data series to display
 * @param horizontal Whether to display the bars horizontally (default: false)
 * @returns The URL to the generated bar chart
 */
export function generateBarChart(
  title: string,
  labels: string[],
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
  }>,
  horizontal: boolean = false
): string {
  const chartConfig = {
    type: horizontal ? 'horizontalBar' : 'bar',
    data: {
      labels,
      datasets: datasets.map(dataset => ({
        label: dataset.label,
        data: dataset.data,
        backgroundColor: dataset.backgroundColor || getRandomColors(dataset.data.length),
      }))
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          text: title
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        },
        legend: {
          position: 'top',
        }
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: horizontal ? 'Value' : 'Category'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: horizontal ? 'Category' : 'Value'
          },
          beginAtZero: true
        }
      }
    }
  };

  return generateChartUrl(chartConfig);
}

/**
 * Generate a pie chart for showing distribution of real estate data
 * @param title The title of the chart
 * @param labels The labels for each segment
 * @param data The data values for each segment
 * @param backgroundColor Optional array of background colors for segments
 * @returns The URL to the generated pie chart
 */
export function generatePieChart(
  title: string,
  labels: string[],
  data: number[],
  backgroundColor?: string[]
): string {
  const chartConfig = {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: backgroundColor || getRandomColors(data.length),
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          text: title
        },
        legend: {
          position: 'right',
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              const label = context.label || '';
              const value = context.raw || 0;
              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    }
  };

  return generateChartUrl(chartConfig);
}

/**
 * Generate a scatter plot for analyzing relationships between real estate variables
 * @param title The title of the chart
 * @param datasets The data series to display
 * @param xAxisLabel The label for the x-axis
 * @param yAxisLabel The label for the y-axis
 * @returns The URL to the generated scatter plot
 */
export function generateScatterPlot(
  title: string,
  datasets: Array<{
    label: string;
    data: Array<{ x: number; y: number }>;
    backgroundColor?: string;
  }>,
  xAxisLabel: string,
  yAxisLabel: string
): string {
  const chartConfig = {
    type: 'scatter',
    data: {
      datasets: datasets.map(dataset => ({
        label: dataset.label,
        data: dataset.data,
        backgroundColor: dataset.backgroundColor || getRandomColor(),
        pointRadius: 5,
        pointHoverRadius: 7,
      }))
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          text: title
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              return `${context.dataset.label}: (${context.parsed.x}, ${context.parsed.y})`;
            }
          }
        },
        legend: {
          position: 'top',
        }
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: xAxisLabel
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: yAxisLabel
          }
        }
      }
    }
  };

  return generateChartUrl(chartConfig);
}

/**
 * Generate a random color in rgba format
 * @returns A random color string in rgba format
 */
function getRandomColor(): string {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgba(${r}, ${g}, ${b}, 0.7)`;
}

/**
 * Generate an array of random colors
 * @param count The number of colors to generate
 * @returns An array of random color strings
 */
function getRandomColors(count: number): string[] {
  return Array.from({ length: count }, () => getRandomColor());
}

/**
 * Real estate color palette for consistent branding
 */
export const realEstateColorPalette = {
  primary: 'rgba(59, 130, 246, 0.7)', // Blue
  secondary: 'rgba(139, 92, 246, 0.7)', // Purple
  accent1: 'rgba(16, 185, 129, 0.7)', // Green
  accent2: 'rgba(245, 158, 11, 0.7)', // Amber
  accent3: 'rgba(239, 68, 68, 0.7)', // Red
  accent4: 'rgba(14, 165, 233, 0.7)', // Sky
  accent5: 'rgba(168, 85, 247, 0.7)', // Violet
  accent6: 'rgba(249, 115, 22, 0.7)', // Orange
};

/**
 * Get a palette of colors for charts based on the real estate color palette
 * @param count The number of colors needed
 * @returns An array of color strings
 */
export function getRealEstateColorPalette(count: number): string[] {
  const colors = Object.values(realEstateColorPalette);
  
  // If we need more colors than are in the palette, generate random ones
  if (count <= colors.length) {
    return colors.slice(0, count);
  } else {
    return [
      ...colors,
      ...Array.from({ length: count - colors.length }, () => getRandomColor())
    ];
  }
} 