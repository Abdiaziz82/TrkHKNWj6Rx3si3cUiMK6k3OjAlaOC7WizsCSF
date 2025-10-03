import React from "react";
import { 
  Megaphone, 
  TrendingUp, 
  Eye, 
  Download,
  Filter,
  Play,
  Pause,
  Edit,
  Target
} from "lucide-react";

// Badge Components
const StatusBadge = ({ status }) => {
  const statusConfig = {
    active: { color: "bg-green-100 text-green-800", label: "Active" },
    scheduled: { color: "bg-blue-100 text-blue-800", label: "Scheduled" },
    completed: { color: "bg-gray-100 text-gray-800", label: "Completed" },
    paused: { color: "bg-yellow-100 text-yellow-800", label: "Paused" }
  };

  const config = statusConfig[status] || statusConfig.active;

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

const TypeBadge = ({ type }) => {
  const typeConfig = {
    "Social Media": { color: "bg-pink-100 text-pink-800" },
    "Email Marketing": { color: "bg-purple-100 text-purple-800" },
    "Search Ads": { color: "bg-blue-100 text-blue-800" },
    "SMS Marketing": { color: "bg-green-100 text-green-800" }
  };

  const config = typeConfig[type] || typeConfig["Social Media"];

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {type}
    </span>
  );
};

// Overview Metrics Component
export const OverviewMetrics = ({ metrics, formatCurrency }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{metrics.activeCampaigns}</p>
          <div className="text-sm text-green-600 mt-1">+2 this month</div>
        </div>
        <div className="p-2 bg-pink-100 rounded-lg">
          <Megaphone className="w-5 h-5 text-pink-600" />
        </div>
      </div>
    </div>

    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Total Budget</p>
          <p className="text-xl font-bold text-gray-900 mt-1">
            {formatCurrency(metrics.totalBudget)}
          </p>
          <div className="text-sm text-gray-500 mt-1">Allocated</div>
        </div>
        <div className="p-2 bg-purple-100 rounded-lg">
          <TrendingUp className="w-5 h-5 text-purple-600" />
        </div>
      </div>
    </div>

    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Total Impressions</p>
          <p className="text-xl font-bold text-gray-900 mt-1">
            {(metrics.totalImpressions / 1000).toFixed(1)}K
          </p>
          <div className="text-sm text-green-600 mt-1">+15% growth</div>
        </div>
        <div className="p-2 bg-blue-100 rounded-lg">
          <Eye className="w-5 h-5 text-blue-600" />
        </div>
      </div>
    </div>

    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Avg ROI</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{metrics.avgROI.toFixed(0)}%</p>
          <div className="text-sm text-green-600 mt-1">+25% vs target</div>
        </div>
        <div className="p-2 bg-green-100 rounded-lg">
          <Target className="w-5 h-5 text-green-600" />
        </div>
      </div>
    </div>
  </div>
);

// Campaigns List Component
export const CampaignsList = ({ campaigns, campaignStatus, setCampaignStatus, formatCurrency }) => (
  <div className="space-y-4">
    {/* Campaign Filters */}
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCampaignStatus("all")}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              campaignStatus === "all" 
                ? "bg-pink-600 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Campaigns
          </button>
          {["active", "scheduled", "completed", "paused"].map((status) => (
            <button
              key={status}
              onClick={() => setCampaignStatus(status)}
              className={`px-3 py-1 rounded-lg text-sm font-medium capitalize ${
                campaignStatus === status 
                  ? "bg-pink-600 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
            <Filter className="w-4 h-4" />
            <span>More Filters</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>
    </div>

    {/* Campaigns Table */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spent</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROI</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{campaign.name}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <TypeBadge type={campaign.type} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(campaign.budget)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(campaign.spent)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`text-sm font-medium ${
                    campaign.roi >= 150 ? 'text-green-600' :
                    campaign.roi >= 100 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {campaign.roi}%
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <StatusBadge status={campaign.status} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center space-x-1">
                    <button className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    {campaign.status === 'active' && (
                      <button className="p-1 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded transition-colors">
                        <Pause className="w-4 h-4" />
                      </button>
                    )}
                    {campaign.status === 'paused' && (
                      <button className="p-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors">
                        <Play className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const CampaignsManager = {
  OverviewMetrics,
  CampaignsList
};

export default CampaignsManager;