import React from "react";
import { UserCircle } from "lucide-react";

function RetailerProfiles() {
  return (
    <div className="p-6">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Retailer Profiles
      </h1>

      {/* Profiles Section */}
      <div className="rounded-2xl shadow-sm border border-gray-200 bg-white p-6">
        <div className="flex flex-col items-center justify-center text-center py-10">
          <UserCircle className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Coming Soon
          </h2>
          <p className="text-gray-600 max-w-md">
            Retailer profiles will allow you to view detailed information,
            manage retailers, and track performance.
          </p>
        </div>
      </div>
    </div>
  );
}

export default RetailerProfiles;
