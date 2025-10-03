import React from "react";
import { Users, TrendingUp, Target, Sparkles, MapPin } from "lucide-react";

// Chart Components
export const EngagementChart = ({ data }) => {
  const maxEngagement = Math.max(...data.map(item => item.engagement));
  
  return (
    <div className="flex items-end justify-between h-32 space-x-2 mt-4">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div className="text-xs text-gray-500 mb-1">{item.segment.split(' ')[0]}</div>
          <div
            className="w-full bg-gradient-to-t from-purple-500 to-purple-600 rounded-t-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 cursor-pointer"
            style={{ 
              height: `${(item.engagement / maxEngagement) * 100}%`,
              minHeight: '8px'
            }}
            title={`${item.segment}: ${item.engagement}% engagement`}
          />
          <div className="text-xs text-gray-600 mt-1">{item.engagement}%</div>
        </div>
      ))}
    </div>
  );
};

export const LocationChart = ({ data }) => {
  const maxRetailers = Math.max(...data.map(item => item.retailers));
  
  return (
    <div className="flex items-end justify-between h-32 space-x-2 mt-4">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div className="text-xs text-gray-500 mb-1">{item.location.split(' ')[0]}</div>
          <div
            className="w-full bg-gradient-to-t from-green-500 to-green-600 rounded-t-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 cursor-pointer"
            style={{ 
              height: `${(item.retailers / maxRetailers) * 100}%`,
              minHeight: '8px'
            }}
            title={`${item.location}: ${item.retailers} retailers`}
          />
          <div className="text-xs text-gray-600 mt-1">{item.retailers}</div>
        </div>
      ))}
    </div>
  );
};

// Overview Component
export const EngagementOverview = ({ data }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Audience Engagement</h3>
    <EngagementChart data={data} />
    <div className="mt-4 grid grid-cols-2 gap-3">
      {data.map((segment, index) => (
        <div key={index} className="text-center p-2 bg-gray-50 rounded-lg">
          <div className="font-semibold text-gray-900 text-sm">{segment.segment}</div>
          <div className="text-xs text-gray-600">{segment.size} retailers</div>
          <div className={`text-xs ${segment.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {segment.growth >= 0 ? '+' : ''}{segment.growth}%
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Detailed View Component
export const DetailedView = ({ audienceData, demographics, customerBehavior, formatCurrency }) => (
  <div className="space-y-4">
    {/* Audience Overview Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Audience</p>
            <p className="text-xl font-bold text-gray-900 mt-1">
              {audienceData.reduce((sum, item) => sum + item.size, 0)}
            </p>
            <div className="text-sm text-green-600 mt-1">Active retailers</div>
          </div>
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Avg Engagement</p>
            <p className="text-xl font-bold text-gray-900 mt-1">
              {Math.round(audienceData.reduce((sum, item) => sum + item.engagement, 0) / audienceData.length)}%
            </p>
            <div className="text-sm text-green-600 mt-1">+8% this month</div>
          </div>
          <div className="p-2 bg-green-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Top Segment</p>
            <p className="text-xl font-bold text-gray-900 mt-1">Small Retailers</p>
            <div className="text-sm text-gray-500 mt-1">45 businesses</div>
          </div>
          <div className="p-2 bg-purple-100 rounded-lg">
            <Target className="w-5 h-5 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Growth Rate</p>
            <p className="text-xl font-bold text-gray-900 mt-1">+12%</p>
            <div className="text-sm text-green-600 mt-1">Monthly average</div>
          </div>
          <div className="p-2 bg-pink-100 rounded-lg">
            <Sparkles className="w-5 h-5 text-pink-600" />
          </div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Audience Segments */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Audience Segments</h3>
        <EngagementChart data={audienceData} />
        <div className="mt-4 space-y-3">
          {audienceData.map((segment, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{segment.segment}</div>
                  <div className="text-xs text-gray-500">{segment.size} retailers</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900 text-sm">{segment.engagement}%</div>
                <div className={`text-xs ${segment.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {segment.growth >= 0 ? '+' : ''}{segment.growth}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Geographic Distribution */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
        <LocationChart data={demographics} />
        <div className="mt-4 space-y-3">
          {demographics.map((location, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{location.location}</div>
                  <div className="text-xs text-gray-500">{location.retailers} retailers</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900 text-sm">{formatCurrency(location.avgOrder)}</div>
                <div className={`text-xs ${location.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {location.growth >= 0 ? '+' : ''}{location.growth}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Customer Behavior */}
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Behavior Analysis</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {customerBehavior.map((behavior, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">{behavior.count}</div>
              <div className="text-sm font-medium text-gray-900 mb-1">{behavior.behavior}</div>
              <div className={`text-xs font-medium ${
                behavior.value === 'High' ? 'text-green-600' :
                behavior.value === 'Medium' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {behavior.value} Value
              </div>
              <div className={`text-xs mt-1 ${
                behavior.trend === 'up' ? 'text-green-600' :
                behavior.trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {behavior.trend === 'up' ? '↗ Increasing' :
                 behavior.trend === 'down' ? '↘ Decreasing' : '→ Stable'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AudienceAnalytics = {
  EngagementOverview,
  DetailedView,
  EngagementChart,
  LocationChart
};

export default AudienceAnalytics;