"use client";

import { useState } from "react";
import {
  BarChart3,
  Brain,
  Download,
  Filter,
  Home as HomeIcon,
  LineChart,
  MapPin,
  Search,
  Share2,
  TrendingUp,
  X,
} from "lucide-react";
import Link from "next/link";
import AiAgentChat from "@/components/AiAgentChat";

// Mock data for market trends
const mockMarketTrends = [
  {
    id: 1,
    neighborhood: "Downtown",
    medianPrice: "$750,000",
    priceChange: "+5.2%",
    avgDaysOnMarket: 18,
    inventory: 45,
    activeListings: 32,
    soldLastMonth: 28,
  },
  {
    id: 2,
    neighborhood: "Westside",
    medianPrice: "$925,000",
    priceChange: "+3.8%",
    avgDaysOnMarket: 22,
    inventory: 38,
    activeListings: 25,
    soldLastMonth: 19,
  },
  {
    id: 3,
    neighborhood: "Northridge",
    medianPrice: "$550,000",
    priceChange: "+6.5%",
    avgDaysOnMarket: 15,
    inventory: 52,
    activeListings: 41,
    soldLastMonth: 35,
  },
  {
    id: 4,
    neighborhood: "Eastwood",
    medianPrice: "$480,000",
    priceChange: "+4.1%",
    avgDaysOnMarket: 24,
    inventory: 63,
    activeListings: 48,
    soldLastMonth: 31,
  },
  {
    id: 5,
    neighborhood: "Southbay",
    medianPrice: "$675,000",
    priceChange: "+2.9%",
    avgDaysOnMarket: 28,
    inventory: 41,
    activeListings: 29,
    soldLastMonth: 22,
  },
];

// Mock data for property listings
const mockListings = [
  {
    id: 1,
    address: "123 Main St",
    neighborhood: "Downtown",
    price: "$749,000",
    beds: 3,
    baths: 2,
    sqft: 1850,
    type: "Single Family",
    daysOnMarket: 7,
    status: "Active",
  },
  {
    id: 2,
    address: "456 Oak Ave",
    neighborhood: "Westside",
    price: "$925,000",
    beds: 4,
    baths: 3,
    sqft: 2400,
    type: "Single Family",
    daysOnMarket: 14,
    status: "Active",
  },
  {
    id: 3,
    address: "789 Pine St",
    neighborhood: "Northridge",
    price: "$550,000",
    beds: 2,
    baths: 2,
    sqft: 1500,
    type: "Condo",
    daysOnMarket: 5,
    status: "Active",
  },
  {
    id: 4,
    address: "321 Elm St",
    neighborhood: "Eastwood",
    price: "$485,000",
    beds: 3,
    baths: 1.5,
    sqft: 1650,
    type: "Single Family",
    daysOnMarket: 21,
    status: "Active",
  },
  {
    id: 5,
    address: "555 Maple Dr",
    neighborhood: "Southbay",
    price: "$675,000",
    beds: 3,
    baths: 2.5,
    sqft: 1950,
    type: "Townhouse",
    daysOnMarket: 10,
    status: "Active",
  },
];

export default function MarketAnalysisPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [propertyAddress, setPropertyAddress] = useState("");
  const [isSearchingProperty, setIsSearchingProperty] = useState(false);
  const [selectedDataSource, setSelectedDataSource] = useState<"zillow" | "redfin" | "attom">("zillow");
  const [redfinRegionId, setRedfinRegionId] = useState("6_13410"); // Default to a sample region ID

  // Filter market trends based on search term and neighborhood
  const filteredMarketTrends = mockMarketTrends.filter(
    (trend) =>
      trend.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedNeighborhood || trend.neighborhood === selectedNeighborhood)
  );

  // Filter listings based on search term and neighborhood
  const filteredListings = mockListings.filter(
    (listing) =>
      (listing.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.neighborhood.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!selectedNeighborhood || listing.neighborhood === selectedNeighborhood)
  );

  // Function to handle property search
  const handlePropertySearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (propertyAddress.trim() || (selectedDataSource === "redfin" && redfinRegionId.trim())) {
      setIsSearchingProperty(true);
      // In a real implementation, this would call the selected API (Zillow, Redfin, or ATTOM)
      // For now, we'll just simulate a search
      setTimeout(() => {
        setIsSearchingProperty(false);
      }, 1500);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Market Analysis</h1>
          <p className="text-gray-600 mt-2">
            Analyze real estate market trends and property data
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <button
            onClick={() => setShowAIAssistant(!showAIAssistant)}
            className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg flex items-center gap-2 hover:bg-blue-200 transition-colors"
          >
            <Brain className="w-4 h-4" />
            {showAIAssistant ? "Hide AI Assistant" : "AI Market Assistant"}
          </button>
          <Link
            href="/reports/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            Create Report
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        {!showAIAssistant ? (
          <div className="lg:col-span-3">
            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search neighborhoods or addresses..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    value={selectedNeighborhood || ""}
                    onChange={(e) =>
                      setSelectedNeighborhood(
                        e.target.value === "" ? null : e.target.value
                      )
                    }
                  >
                    <option value="">All Neighborhoods</option>
                    {mockMarketTrends.map((trend) => (
                      <option key={trend.id} value={trend.neighborhood}>
                        {trend.neighborhood}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Property Search */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Property Search</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedDataSource("zillow")}
                      className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 ${
                        selectedDataSource === "zillow"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <HomeIcon className="w-3 h-3" />
                      Zillow
                    </button>
                    <button
                      onClick={() => setSelectedDataSource("redfin")}
                      className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 ${
                        selectedDataSource === "redfin"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <HomeIcon className="w-3 h-3" />
                      Redfin
                    </button>
                    <button
                      onClick={() => setSelectedDataSource("attom")}
                      className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 ${
                        selectedDataSource === "attom"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <BarChart3 className="w-3 h-3" />
                      ATTOM
                    </button>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handlePropertySearch} className="mb-4">
                <div className="flex flex-col md:flex-row gap-4">
                  {selectedDataSource === "redfin" ? (
                    <div className="relative flex-grow">
                      <MapPin className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Enter Redfin region ID (e.g., '6_13410')"
                        className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={redfinRegionId}
                        onChange={(e) => setRedfinRegionId(e.target.value)}
                      />
                    </div>
                  ) : (
                    <div className="relative flex-grow">
                      <MapPin className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder={
                          selectedDataSource === "attom"
                            ? "Enter address (format: street, city, state zip)..."
                            : "Enter full property address..."
                        }
                        className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={propertyAddress}
                        onChange={(e) => setPropertyAddress(e.target.value)}
                      />
                    </div>
                  )}
                  <button
                    type="submit"
                    className={`px-4 py-2 text-white rounded-lg flex items-center gap-2 transition-colors ${
                      selectedDataSource === "zillow"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : selectedDataSource === "redfin"
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-purple-600 hover:bg-purple-700"
                    }`}
                    disabled={isSearchingProperty}
                  >
                    {isSearchingProperty ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        Search Property
                      </>
                    )}
                  </button>
                </div>
              </form>
              
              <div className="text-sm text-gray-500">
                {selectedDataSource === "zillow" ? (
                  <>
                    <p>Search for property details and floor plans using the Zillow API.</p>
                    <p className="mt-1">Example: "123 Main St, Anytown, CA 91411"</p>
                  </>
                ) : selectedDataSource === "redfin" ? (
                  <>
                    <p>Search for properties for sale or rent in a specific region using the Redfin API.</p>
                    <p className="mt-1">Enter a Redfin region ID (e.g., "6_13410" for a specific area)</p>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div className="bg-red-50 p-2 rounded-lg">
                        <span className="text-xs font-medium text-red-800">Rental Properties</span>
                        <p className="text-xs text-gray-600">Find available rental properties</p>
                      </div>
                      <div className="bg-red-50 p-2 rounded-lg">
                        <span className="text-xs font-medium text-red-800">Properties for Sale</span>
                        <p className="text-xs text-gray-600">Search homes currently on the market</p>
                      </div>
                      <div className="bg-red-50 p-2 rounded-lg">
                        <span className="text-xs font-medium text-red-800">Property Details</span>
                        <p className="text-xs text-gray-600">Get detailed information about specific properties</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <p>Search for comprehensive property data, valuations, and sales history using the ATTOM API.</p>
                    <p className="mt-1">Example: "123 Main St, Anytown, CA 91411"</p>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div className="bg-purple-50 p-2 rounded-lg">
                        <span className="text-xs font-medium text-purple-800">Property Details</span>
                        <p className="text-xs text-gray-600">Assessor data, tax info, and property characteristics</p>
                      </div>
                      <div className="bg-purple-50 p-2 rounded-lg">
                        <span className="text-xs font-medium text-purple-800">Automated Valuation</span>
                        <p className="text-xs text-gray-600">ATTOM AVM with confidence scores</p>
                      </div>
                      <div className="bg-purple-50 p-2 rounded-lg">
                        <span className="text-xs font-medium text-purple-800">Sales History</span>
                        <p className="text-xs text-gray-600">Historical transaction data with deed information</p>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      <p>ATTOM API provides comprehensive property data from over 155 million U.S. properties.</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Market Trends */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Market Trends</h2>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Market Trends Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Neighborhood
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Median Price
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Price Change
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Avg. Days on Market
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Inventory
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Active Listings
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Sold Last Month
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMarketTrends.map((trend) => (
                      <tr
                        key={trend.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 font-medium">
                          {trend.neighborhood}
                        </td>
                        <td className="py-3 px-4">{trend.medianPrice}</td>
                        <td
                          className={`py-3 px-4 ${
                            trend.priceChange.startsWith("+")
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {trend.priceChange}
                        </td>
                        <td className="py-3 px-4">{trend.avgDaysOnMarket}</td>
                        <td className="py-3 px-4">{trend.inventory}</td>
                        <td className="py-3 px-4">{trend.activeListings}</td>
                        <td className="py-3 px-4">{trend.soldLastMonth}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Property Listings */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Property Listings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
                  >
                    <div className="h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                      <HomeIcon className="w-12 h-12 text-gray-400" />
                    </div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{listing.address}</h3>
                      <span className="text-blue-600 font-medium">
                        {listing.price}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{listing.neighborhood}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-3">
                      <span>{listing.beds} beds</span>
                      <span>{listing.baths} baths</span>
                      <span>{listing.sqft} sqft</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {listing.type}
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {listing.daysOnMarket} days on market
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm p-6">
            <div className="h-[600px]">
              <AiAgentChat context="market-analysis" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 