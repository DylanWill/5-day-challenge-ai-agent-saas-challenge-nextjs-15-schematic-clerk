import { z } from "zod";
import { tool } from "ai";

// Function to fetch property data from Zillow API via Rapid API
async function fetchZillowPropertyData(address: string) {
  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://${process.env.ZILLOW_API_HOST}/property?property_url=https%3A%2F%2Fwww.zillow.com%2Fhomedetails%2F${encodedAddress}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': process.env.ZILLOW_API_HOST || '',
        'x-rapidapi-key': process.env.ZILLOW_API_KEY || ''
      }
    });
    
    if (!response.ok) {
      throw new Error(`Zillow API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Zillow property data:", error);
    throw error;
  }
}

// Function to fetch property floor plan from Zillow API via Rapid API
async function fetchPropertyFloorPlan(propertyUrl: string) {
  try {
    const encodedUrl = encodeURIComponent(propertyUrl);
    const url = `https://${process.env.ZILLOW_API_HOST}/propertyFloorPlan?property_url=https%3A%2F%2Fwww.zillow.com%2Fhomedetails%2F${encodedUrl}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': process.env.ZILLOW_API_HOST || '',
        'x-rapidapi-key': process.env.ZILLOW_API_KEY || ''
      }
    });
    
    if (!response.ok) {
      throw new Error(`Zillow API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching property floor plan:", error);
    throw error;
  }
}

// Function to fetch extended property search from Zillow API via Rapid API
async function fetchPropertyExtendedSearch(location: string, filters: any = {}) {
  try {
    const params = new URLSearchParams({
      location,
      ...filters
    });
    
    const url = `https://${process.env.ZILLOW_API_HOST}/propertyExtendedSearch?${params.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': process.env.ZILLOW_API_HOST || '',
        'x-rapidapi-key': process.env.ZILLOW_API_KEY || ''
      }
    });
    
    if (!response.ok) {
      throw new Error(`Zillow API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching property extended search:", error);
    throw error;
  }
}

// Function to fetch property search by polygon from Zillow API via Rapid API
async function fetchPropertyByPolygon(coordinates: string) {
  try {
    const url = `https://${process.env.ZILLOW_API_HOST}/propertyByPolygon?coordinates=${encodeURIComponent(coordinates)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': process.env.ZILLOW_API_HOST || '',
        'x-rapidapi-key': process.env.ZILLOW_API_KEY || ''
      }
    });
    
    if (!response.ok) {
      throw new Error(`Zillow API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching property by polygon:", error);
    throw error;
  }
}

// Function to fetch rent estimate from Zillow API via Rapid API
async function fetchRentEstimate(propertyUrl: string) {
  try {
    const url = `https://${process.env.ZILLOW_API_HOST}/rentEstimate?property_url=${encodeURIComponent(propertyUrl)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': process.env.ZILLOW_API_HOST || '',
        'x-rapidapi-key': process.env.ZILLOW_API_KEY || ''
      }
    });
    
    if (!response.ok) {
      throw new Error(`Zillow API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching rent estimate:", error);
    throw error;
  }
}

// Function to fetch location suggestions from Zillow API via Rapid API
async function fetchLocationSuggestions(query: string) {
  try {
    const url = `https://${process.env.ZILLOW_API_HOST}/locationSuggestions?query=${encodeURIComponent(query)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': process.env.ZILLOW_API_HOST || '',
        'x-rapidapi-key': process.env.ZILLOW_API_KEY || ''
      }
    });
    
    if (!response.ok) {
      throw new Error(`Zillow API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching location suggestions:", error);
    throw error;
  }
}

// Function to search rental properties from Redfin API via Rapid API
async function fetchRedfinRentalProperties(regionId: string) {
  try {
    const url = `https://${process.env.REDFIN_API_HOST}/properties/search-rent?regionId=${regionId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': process.env.REDFIN_API_HOST || '',
        'x-rapidapi-key': process.env.REDFIN_API_KEY || ''
      }
    });
    
    if (!response.ok) {
      throw new Error(`Redfin API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Redfin rental properties:", error);
    throw error;
  }
}

// Function to search properties for sale from Redfin API via Rapid API
async function fetchRedfinPropertiesForSale(regionId: string) {
  try {
    const url = `https://${process.env.REDFIN_API_HOST}/properties/search-sale?regionId=${regionId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': process.env.REDFIN_API_HOST || '',
        'x-rapidapi-key': process.env.REDFIN_API_KEY || ''
      }
    });
    
    if (!response.ok) {
      throw new Error(`Redfin API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Redfin properties for sale:", error);
    throw error;
  }
}

// Function to get property details from Redfin API via Rapid API
async function fetchRedfinPropertyDetails(propertyId: string) {
  try {
    const url = `https://${process.env.REDFIN_API_HOST}/properties/detail?propertyId=${propertyId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': process.env.REDFIN_API_HOST || '',
        'x-rapidapi-key': process.env.REDFIN_API_KEY || ''
      }
    });
    
    if (!response.ok) {
      throw new Error(`Redfin API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Redfin property details:", error);
    throw error;
  }
}

// Function to fetch property details from ATTOM API
async function fetchAttomPropertyDetails(address: string) {
  try {
    // Format the address for the API
    const encodedAddress = encodeURIComponent(address);
    
    // Use the property/detail endpoint with address parameter
    const url = `https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/detail?address=${encodedAddress}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': process.env.ATTOM_API_KEY || '',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`ATTOM API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching ATTOM property details:", error);
    throw error;
  }
}

// Function to fetch property valuation from ATTOM API
async function fetchAttomPropertyValuation(address: string) {
  try {
    // Format the address for the API
    const encodedAddress = encodeURIComponent(address);
    
    // Use the attomavm/detail endpoint with address parameter
    const url = `https://api.gateway.attomdata.com/propertyapi/v1.0.0/attomavm/detail?address=${encodedAddress}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': process.env.ATTOM_API_KEY || '',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`ATTOM API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching ATTOM property valuation:", error);
    throw error;
  }
}

// Function to fetch sales history from ATTOM API
async function fetchAttomSalesHistory(address: string) {
  try {
    // Format the address for the API
    const encodedAddress = encodeURIComponent(address);
    
    // Use the saleshistory/detail endpoint with address parameter
    const url = `https://api.gateway.attomdata.com/propertyapi/v1.0.0/saleshistory/detail?address=${encodedAddress}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': process.env.ATTOM_API_KEY || '',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`ATTOM API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching ATTOM sales history:", error);
    throw error;
  }
}

// Function to fetch market data for a location
async function fetchMarketData(location: string, propertyType: string = "All") {
  try {
    // In a real implementation, we would use the Zillow API to get actual market data
    // For now, we'll use a combination of real API calls and some mock data
    
    // Mock response with market trends - in production, this would come from API aggregation
    return {
      location,
      propertyType,
      medianPrice: "$750,000",
      priceChange: "+5.2%",
      avgDaysOnMarket: 18,
      inventory: 45,
      timestamp: new Date().toISOString(),
      source: "Zillow via Rapid API"
    };
  } catch (error) {
    console.error("Error fetching market data:", error);
    throw error;
  }
}

// AI Tool for market analysis
export const marketAnalysisTool = tool({
  name: "getMarketTrends",
  description: "Get real estate market trends for a specific area",
  parameters: z.object({
    location: z.string().describe("The location/area to get market trends for"),
    propertyType: z.string().optional().describe("Optional property type filter (e.g., Single Family, Condo, etc.)"),
  }),
  execute: async ({ location, propertyType }) => {
    try {
      const marketData = await fetchMarketData(location, propertyType);
      return marketData;
    } catch (error) {
      console.error("Error in market analysis tool:", error);
      throw new Error("Failed to fetch market data. Please try again or contact support.");
    }
  },
});

// AI Tool for property details from Zillow
export const propertyDetailsTool = tool({
  name: "getPropertyDetails",
  description: "Get detailed information about a specific property from Zillow",
  parameters: z.object({
    address: z.string().describe("The full address of the property"),
  }),
  execute: async ({ address }) => {
    try {
      const propertyData = await fetchZillowPropertyData(address);
      return propertyData;
    } catch (error) {
      console.error("Error in property details tool:", error);
      throw new Error("Failed to fetch property details. Please try again or contact support.");
    }
  },
});

// AI Tool for property floor plans from Zillow
export const propertyFloorPlanTool = tool({
  name: "getPropertyFloorPlan",
  description: "Get floor plan images for a specific property from Zillow",
  parameters: z.object({
    address: z.string().describe("The full address of the property"),
  }),
  execute: async ({ address }) => {
    try {
      // Format address for Zillow URL
      const formattedAddress = address.replace(/\s+/g, '-');
      const propertyData = await fetchPropertyFloorPlan(formattedAddress);
      return propertyData;
    } catch (error) {
      console.error("Error in property floor plan tool:", error);
      throw new Error("Failed to fetch property floor plan. Please try again or contact support.");
    }
  },
});

// AI Tool for Redfin rental properties
export const redfinRentalPropertiesTool = tool({
  name: "getRedfinRentalProperties",
  description: "Search for rental properties in a specific region using Redfin",
  parameters: z.object({
    regionId: z.string().describe("The Redfin region ID (e.g., '6_13410' for a specific area)"),
  }),
  execute: async ({ regionId }) => {
    try {
      const rentalData = await fetchRedfinRentalProperties(regionId);
      return rentalData;
    } catch (error) {
      console.error("Error in Redfin rental properties tool:", error);
      throw new Error("Failed to fetch Redfin rental properties. Please try again or contact support.");
    }
  },
});

// AI Tool for Redfin properties for sale
export const redfinPropertiesForSaleTool = tool({
  name: "getRedfinPropertiesForSale",
  description: "Search for properties for sale in a specific region using Redfin",
  parameters: z.object({
    regionId: z.string().describe("The Redfin region ID (e.g., '6_13410' for a specific area)"),
  }),
  execute: async ({ regionId }) => {
    try {
      const saleData = await fetchRedfinPropertiesForSale(regionId);
      return saleData;
    } catch (error) {
      console.error("Error in Redfin properties for sale tool:", error);
      throw new Error("Failed to fetch Redfin properties for sale. Please try again or contact support.");
    }
  },
});

// AI Tool for Redfin property details
export const redfinPropertyDetailsTool = tool({
  name: "getRedfinPropertyDetails",
  description: "Get detailed information about a specific property from Redfin",
  parameters: z.object({
    propertyId: z.string().describe("The Redfin property ID"),
  }),
  execute: async ({ propertyId }) => {
    try {
      const propertyData = await fetchRedfinPropertyDetails(propertyId);
      return propertyData;
    } catch (error) {
      console.error("Error in Redfin property details tool:", error);
      throw new Error("Failed to fetch Redfin property details. Please try again or contact support.");
    }
  },
});

// AI Tool for property details from ATTOM
export const attomPropertyDetailsTool = tool({
  name: "getAttomPropertyDetails",
  description: "Get comprehensive property details from ATTOM Data including assessor data, tax information, and property characteristics",
  parameters: z.object({
    address: z.string().describe("The full property address (e.g., '123 Main St, Anytown, CA 91411')"),
  }),
  execute: async ({ address }) => {
    try {
      const propertyData = await fetchAttomPropertyDetails(address);
      return propertyData;
    } catch (error) {
      console.error("Error in ATTOM property details tool:", error);
      throw new Error("Failed to fetch ATTOM property details. Please try again or contact support.");
    }
  },
});

// AI Tool for property valuation from ATTOM
export const attomPropertyValuationTool = tool({
  name: "getAttomPropertyValuation",
  description: "Get ATTOM's automated valuation model (AVM) data for a property with confidence scores and value ranges",
  parameters: z.object({
    address: z.string().describe("The full property address (e.g., '123 Main St, Anytown, CA 91411')"),
  }),
  execute: async ({ address }) => {
    try {
      const valuationData = await fetchAttomPropertyValuation(address);
      return valuationData;
    } catch (error) {
      console.error("Error in ATTOM property valuation tool:", error);
      throw new Error("Failed to fetch ATTOM property valuation. Please try again or contact support.");
    }
  },
});

// AI Tool for sales history from ATTOM
export const attomSalesHistoryTool = tool({
  name: "getAttomSalesHistory",
  description: "Get detailed sales history for a property from ATTOM Data including transaction dates, prices, and deed information",
  parameters: z.object({
    address: z.string().describe("The full property address (e.g., '123 Main St, Anytown, CA 91411')"),
  }),
  execute: async ({ address }) => {
    try {
      const salesHistory = await fetchAttomSalesHistory(address);
      return salesHistory;
    } catch (error) {
      console.error("Error in ATTOM sales history tool:", error);
      throw new Error("Failed to fetch ATTOM sales history. Please try again or contact support.");
    }
  },
});

// AI Tool for property extended search from Zillow
export const propertyExtendedSearchTool = tool({
  name: "getPropertyExtendedSearch",
  description: "Search for properties with extended filters using Zillow",
  parameters: z.object({
    location: z.string().describe("The location to search for properties (e.g., 'Los Angeles, CA')"),
    filters: z.record(z.any()).optional().describe("Optional filters like price range, bedrooms, etc."),
  }),
  execute: async ({ location, filters }) => {
    try {
      const searchData = await fetchPropertyExtendedSearch(location, filters || {});
      return searchData;
    } catch (error) {
      console.error("Error in property extended search tool:", error);
      throw new Error("Failed to fetch property extended search. Please try again or contact support.");
    }
  },
});

// AI Tool for property search by polygon from Zillow
export const propertyByPolygonTool = tool({
  name: "getPropertyByPolygon",
  description: "Search for properties within a geographic polygon using Zillow",
  parameters: z.object({
    coordinates: z.string().describe("The polygon coordinates in the format required by Zillow"),
  }),
  execute: async ({ coordinates }) => {
    try {
      const polygonData = await fetchPropertyByPolygon(coordinates);
      return polygonData;
    } catch (error) {
      console.error("Error in property by polygon tool:", error);
      throw new Error("Failed to fetch properties by polygon. Please try again or contact support.");
    }
  },
});

// AI Tool for rent estimate from Zillow
export const rentEstimateTool = tool({
  name: "getRentEstimate",
  description: "Get a rent estimate for a property from Zillow",
  parameters: z.object({
    propertyUrl: z.string().describe("The Zillow property URL or formatted address"),
  }),
  execute: async ({ propertyUrl }) => {
    try {
      const rentData = await fetchRentEstimate(propertyUrl);
      return rentData;
    } catch (error) {
      console.error("Error in rent estimate tool:", error);
      throw new Error("Failed to fetch rent estimate. Please try again or contact support.");
    }
  },
});

// AI Tool for location suggestions from Zillow
export const locationSuggestionsTool = tool({
  name: "getLocationSuggestions",
  description: "Get location suggestions based on a search query from Zillow",
  parameters: z.object({
    query: z.string().describe("The search query for location suggestions"),
  }),
  execute: async ({ query }) => {
    try {
      const suggestionsData = await fetchLocationSuggestions(query);
      return suggestionsData;
    } catch (error) {
      console.error("Error in location suggestions tool:", error);
      throw new Error("Failed to fetch location suggestions. Please try again or contact support.");
    }
  },
}); 