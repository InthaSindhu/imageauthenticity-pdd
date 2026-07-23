import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Search, Filter, CheckCircle2, AlertTriangle, XCircle, Calendar, SlidersHorizontal } from "lucide-react";

export function SearchFilterScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedDateRange, setSelectedDateRange] = useState<string>("all-time");

  const results = [
    { id: 1, name: 'landscape-2024.jpg', status: 'authentic', date: 'May 5, 2026', score: 94 },
    { id: 2, name: 'portrait-edit.png', status: 'suspicious', date: 'May 4, 2026', score: 58 },
    { id: 3, name: 'nature-scene.jpg', status: 'authentic', date: 'May 3, 2026', score: 96 },
    { id: 4, name: 'ai-generated.png', status: 'fake', date: 'May 2, 2026', score: 23 },
  ];

  const filteredResults = results.filter(result => {
    const matchesSearch = result.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || result.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate("/history")}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 flex-1">Search & Filter</h1>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by filename..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto w-full space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-600" />
              Filter by Result Type
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedFilter("all")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedFilter === "all"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">All</div>
                  <div className="text-xs text-gray-600">Show everything</div>
                </div>
              </button>

              <button
                onClick={() => setSelectedFilter("authentic")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedFilter === "authentic"
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-gray-900">Authentic</span>
                </div>
                <div className="text-xs text-gray-600">Verified images</div>
              </button>

              <button
                onClick={() => setSelectedFilter("suspicious")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedFilter === "suspicious"
                    ? "border-amber-600 bg-amber-50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-semibold text-gray-900">Suspicious</span>
                </div>
                <div className="text-xs text-gray-600">Needs review</div>
              </button>

              <button
                onClick={() => setSelectedFilter("fake")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedFilter === "fake"
                    ? "border-red-600 bg-red-50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-semibold text-gray-900">Fake</span>
                </div>
                <div className="text-xs text-gray-600">Manipulated</div>
              </button>
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Date Range
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "All Time", value: "all-time" },
                { label: "Last 7 Days", value: "week" },
                { label: "Last 30 Days", value: "month" },
                { label: "Custom", value: "custom" },
              ].map((range) => (
                <button
                  key={range.value}
                  onClick={() => setSelectedDateRange(range.value)}
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    selectedDateRange === range.value
                      ? "border-purple-600 bg-purple-50 text-purple-700"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">
                Results ({filteredResults.length})
              </h2>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                <SlidersHorizontal className="w-4 h-4" />
                Sort
              </button>
            </div>

            {filteredResults.length > 0 ? (
              <div className="space-y-3">
                {filteredResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => navigate("/result")}
                    className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      result.status === 'authentic' ? 'bg-green-100' :
                      result.status === 'suspicious' ? 'bg-amber-100' : 'bg-red-100'
                    }`}>
                      {result.status === 'authentic' ? <CheckCircle2 className="w-5 h-5 text-green-600" /> :
                       result.status === 'suspicious' ? <AlertTriangle className="w-5 h-5 text-amber-600" /> :
                       <XCircle className="w-5 h-5 text-red-600" />}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900 text-sm truncate">{result.name}</div>
                      <div className="text-xs text-gray-600">{result.date} • {result.score}% confidence</div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <Search className="w-12 h-12 mx-auto" />
                </div>
                <p className="text-gray-600">No results found</p>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
