import React from "react";
import { Megaphone } from "lucide-react";

function DigitalMarketingTools() {
  return (
    <div className="p-6">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Digital Marketing Tools
      </h1>

      {/* Content Placeholder */}
      <div className="rounded-2xl shadow-sm border border-gray-200 bg-white p-6">
        <div className="flex flex-col items-center justify-center text-center py-10">
          <Megaphone className="w-16 h-16 text-pink-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Coming Soon
          </h2>
          <p className="text-gray-600 max-w-md">
            The Digital Marketing Tools dashboard will provide campaign
            management, SEO optimization, social media insights, and more to
            help businesses grow.
          </p>
        </div>
      </div>
    </div>
  );
}

export default DigitalMarketingTools;
