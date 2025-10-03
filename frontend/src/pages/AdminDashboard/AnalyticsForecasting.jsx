import React from "react";
import { BarChart3 } from "lucide-react";

export default function AnalyticsForecasting() {
  return (
    <div className="p-6">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Analytics & Forecasting
      </h1>

      {/* Content Placeholder */}
      <div className="rounded-2xl shadow-sm border border-gray-200 bg-white p-6">
        <div className="flex flex-col items-center justify-center text-center py-10">
          <BarChart3 className="w-16 h-16 text-blue-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Coming Soon
          </h2>
          <p className="text-gray-600 max-w-md">
            The Analytics & Forecasting dashboard will provide insights,
            performance metrics, and AI-powered predictions to support smarter
            decision-making.
          </p>
        </div>
      </div>
    </div>
  );
}
