import React from "react";
import { Sparkles, Zap, Share2 } from "lucide-react";

// Impact Badge Component
const ImpactBadge = ({ impact }) => {
  const impactConfig = {
    high: { color: "bg-red-100 text-red-800", label: "High Impact" },
    medium: { color: "bg-yellow-100 text-yellow-800", label: "Medium Impact" },
    low: { color: "bg-blue-100 text-blue-800", label: "Low Impact" }
  };

  const config = impactConfig[impact] || impactConfig.medium;

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

// Recommendations Component
export const Recommendations = ({ recommendations }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
      <Sparkles className="w-5 h-5 text-yellow-500" />
    </div>
    <div className="space-y-3">
      {recommendations.map((recommendation) => (
        <div key={recommendation.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-gray-900 text-sm">{recommendation.title}</h4>
            <ImpactBadge impact={recommendation.impact} />
          </div>
          <p className="text-gray-600 text-sm mb-2">{recommendation.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">{recommendation.confidence}% confidence</span>
            <button className="text-pink-600 hover:text-pink-700 text-sm font-medium">
              Apply Suggestion
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Detailed View Component
export const DetailedView = ({ socialMediaData, formatCurrency }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
    {/* AI Performance Predictions */}
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <div className="flex items-center space-x-2 mb-4">
        <Zap className="w-5 h-5 text-yellow-500" />
        <h3 className="text-lg font-semibold text-gray-900">AI Performance Predictions</h3>
      </div>
      <div className="space-y-4">
        <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-blue-900 text-sm">Optimal Campaign Timing</h4>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">92% accuracy</span>
          </div>
          <p className="text-blue-800 text-sm mb-2">
            Launch campaigns on Tuesday and Thursday mornings for 35% higher engagement rates.
          </p>
          <div className="text-xs text-blue-600">Based on 6 months of performance data</div>
        </div>

        <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-green-900 text-sm">Budget Optimization</h4>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">88% accuracy</span>
          </div>
          <p className="text-green-800 text-sm mb-2">
            Reallocate 15% of search ads budget to social media for better ROI based on current trends.
          </p>
          <div className="text-xs text-green-600">Predicted ROI increase: 22%</div>
        </div>

        <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-purple-900 text-sm">Content Strategy</h4>
            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">85% accuracy</span>
          </div>
          <p className="text-purple-800 text-sm mb-2">
            Video content performs 3x better than images. Focus on product demonstration videos.
          </p>
          <div className="text-xs text-purple-600">Engagement boost prediction: 45%</div>
        </div>
      </div>
    </div>

    {/* Social Media Analytics */}
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media Performance</h3>
      <div className="space-y-3">
        {socialMediaData.map((platform, index) => (
          <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                platform.platform === 'Facebook' ? 'bg-blue-100' :
                platform.platform === 'Instagram' ? 'bg-pink-100' :
                platform.platform === 'Twitter' ? 'bg-sky-100' : 'bg-blue-100'
              }`}>
                <Share2 className={`w-5 h-5 ${
                  platform.platform === 'Facebook' ? 'text-blue-600' :
                  platform.platform === 'Instagram' ? 'text-pink-600' :
                  platform.platform === 'Twitter' ? 'text-sky-600' : 'text-blue-600'
                }`} />
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">{platform.platform}</div>
                <div className="text-xs text-gray-500">{platform.followers.toLocaleString()} followers</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-900 text-sm">{platform.engagement}%</div>
              <div className={`text-xs ${
                platform.growth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {platform.growth >= 0 ? '+' : ''}{platform.growth}%
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="flex items-center space-x-2 mb-1">
          <Sparkles className="w-4 h-4 text-yellow-600" />
          <h4 className="font-semibold text-yellow-900 text-sm">AI Suggestion</h4>
        </div>
        <p className="text-yellow-800 text-sm">
          Focus on Instagram growth - it shows the highest engagement rate and growth potential.
        </p>
      </div>
    </div>
  </div>
);

const AIInsights = {
  Recommendations,
  DetailedView
};

export default AIInsights;