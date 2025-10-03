import React, { useState, useMemo } from "react";
import { Megaphone } from "lucide-react";
import CampaignsManager from "./CampaignsManager";
import AudienceAnalytics from "./AudienceAnalytics";
import AIInsights from "./AIInsights";

// Mock data
const campaignsData = [
  {
    id: 1,
    name: "Rice Promotion Campaign",
    status: "active",
    type: "Social Media",
    budget: 500000,
    spent: 320000,
    impressions: 125000,
    clicks: 8500,
    conversions: 450,
    roi: 185,
    startDate: "2024-11-15",
    endDate: "2024-12-15"
  },
  {
    id: 2,
    name: "New Product Launch",
    status: "scheduled",
    type: "Email Marketing",
    budget: 300000,
    spent: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    roi: 0,
    startDate: "2024-12-20",
    endDate: "2025-01-20"
  },
  {
    id: 3,
    name: "Holiday Sales Boost",
    status: "completed",
    type: "Search Ads",
    budget: 750000,
    spent: 750000,
    impressions: 280000,
    clicks: 15600,
    conversions: 890,
    roi: 215,
    startDate: "2024-11-01",
    endDate: "2024-11-30"
  },
  {
    id: 4,
    name: "Customer Retention",
    status: "paused",
    type: "SMS Marketing",
    budget: 200000,
    spent: 85000,
    impressions: 45000,
    clicks: 3200,
    conversions: 180,
    roi: 95,
    startDate: "2024-10-01",
    endDate: "2024-12-31"
  }
];

const audienceData = [
  { segment: "Small Retailers", size: 45, growth: 12, engagement: 68 },
  { segment: "Supermarkets", size: 23, growth: 8, engagement: 82 },
  { segment: "Restaurants", size: 18, growth: -2, engagement: 45 },
  { segment: "Hotels", size: 14, growth: 15, engagement: 76 }
];

const aiRecommendations = [
  {
    id: 1,
    type: "optimization",
    title: "Increase Budget for Rice Campaign",
    description: "Your rice promotion campaign is performing 185% above average. Consider increasing budget by 25% for maximum ROI.",
    impact: "high",
    confidence: 92
  },
  {
    id: 2,
    type: "timing",
    title: "Best Posting Times",
    description: "AI analysis shows your audience is most active between 7-9 PM. Schedule posts during these hours for 40% higher engagement.",
    impact: "medium",
    confidence: 88
  },
  {
    id: 3,
    type: "content",
    title: "Video Content Opportunity",
    description: "Competitor analysis shows video content gets 3x more engagement. Create product demonstration videos.",
    impact: "high",
    confidence: 85
  }
];

const socialMediaData = [
  { platform: "Facebook", followers: 12500, engagement: 4.2, growth: 12 },
  { platform: "Instagram", followers: 8900, engagement: 5.8, growth: 18 },
  { platform: "Twitter", followers: 3200, engagement: 2.1, growth: 5 },
  { platform: "LinkedIn", followers: 2100, engagement: 3.4, growth: 8 }
];

const audienceDemographics = [
  { location: "Dar es Salaam", retailers: 28, growth: 15, avgOrder: 450000 },
  { location: "Arusha", retailers: 18, growth: 8, avgOrder: 380000 },
  { location: "Mwanza", retailers: 12, growth: 12, avgOrder: 520000 },
  { location: "Dodoma", retailers: 8, growth: 5, avgOrder: 320000 },
  { location: "Mbeya", retailers: 10, growth: 20, avgOrder: 480000 }
];

const customerBehavior = [
  { behavior: "Frequent Buyers", count: 35, value: "High", trend: "up" },
  { behavior: "Seasonal Buyers", count: 42, value: "Medium", trend: "stable" },
  { behavior: "New Customers", count: 28, value: "High", trend: "up" },
  { behavior: "At Risk", count: 8, value: "Critical", trend: "down" }
];

function DigitalMarketingTools() {
  const [activeTab, setActiveTab] = useState("overview");
  const [campaignStatus, setCampaignStatus] = useState("all");

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const metrics = useMemo(() => {
    const activeCampaigns = campaignsData.filter(c => c.status === 'active');
    const totalBudget = campaignsData.reduce((sum, c) => sum + c.budget, 0);
    const totalSpent = campaignsData.reduce((sum, c) => sum + c.spent, 0);
    const totalImpressions = campaignsData.reduce((sum, c) => sum + c.impressions, 0);
    const totalConversions = campaignsData.reduce((sum, c) => sum + c.conversions, 0);
    
    const avgROI = campaignsData.filter(c => c.roi > 0).reduce((sum, c) => sum + c.roi, 0) / 
                  campaignsData.filter(c => c.roi > 0).length;

    return {
      activeCampaigns: activeCampaigns.length,
      totalBudget,
      totalSpent,
      totalImpressions,
      totalConversions,
      avgROI: avgROI || 0
    };
  }, []);

  const filteredCampaigns = useMemo(() => {
    if (campaignStatus === "all") return campaignsData;
    return campaignsData.filter(campaign => campaign.status === campaignStatus);
  }, [campaignStatus]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 font">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Digital Marketing Tools</h1>
            <p className="text-gray-600 mt-1">AI-powered marketing campaigns and analytics</p>
          </div>
          <button className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors flex items-center space-x-2">
            <Megaphone className="w-5 h-5" />
            <span>Create Campaign</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4">
          <div className="flex border-b border-gray-200">
            {["overview", "campaigns", "audience", "ai-insights"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-pink-500 text-pink-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            <CampaignsManager.OverviewMetrics 
              metrics={metrics} 
              formatCurrency={formatCurrency} 
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <AIInsights.Recommendations recommendations={aiRecommendations} />
              <AudienceAnalytics.EngagementOverview data={audienceData} />
            </div>
          </div>
        )}

        {activeTab === "campaigns" && (
          <CampaignsManager.CampaignsList
            campaigns={filteredCampaigns}
            campaignStatus={campaignStatus}
            setCampaignStatus={setCampaignStatus}
            formatCurrency={formatCurrency}
          />
        )}

        {activeTab === "audience" && (
          <AudienceAnalytics.DetailedView
            audienceData={audienceData}
            demographics={audienceDemographics}
            customerBehavior={customerBehavior}
            formatCurrency={formatCurrency}
          />
        )}

        {activeTab === "ai-insights" && (
          <AIInsights.DetailedView
            socialMediaData={socialMediaData}
            formatCurrency={formatCurrency}
          />
        )}
      </div>
    </div>
  );
}

export default DigitalMarketingTools;