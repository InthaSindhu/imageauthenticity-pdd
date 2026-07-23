import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, TrendingUp, CheckCircle2, AlertTriangle, XCircle, Calendar, Eye, RefreshCw } from "lucide-react";
import { api } from "../services/api";

interface Scan {
  id: string;
  date: string;
  time: string;
  status: 'verified' | 'flagged' | 'uncertain';
  confidence: number;
  fileName: string;
  imageUrl?: string;
}

export function RecentActivityDashboard() {
  const navigate = useNavigate();
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getHistory();
        setScans(data);
      } catch (e) {
        console.error('Failed to load activity:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Last 7 days filter
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);

  const recentScans = scans.slice(0, 10);
  const totalScans = scans.length;
  const verified = scans.filter(s => s.status === 'verified').length;
  const uncertain = scans.filter(s => s.status === 'uncertain').length;
  const flagged = scans.filter(s => s.status === 'flagged').length;
  const successRate = totalScans > 0 ? Math.round((verified / totalScans) * 100) : 0;

  // Build last 5 days activity
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayActivity = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (4 - i));
    const dayName = days[d.getDay()];
    const dateStr = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    const dayScans = scans.filter(s => s.date === d.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' }));
    return {
      day: dayName,
      date: dateStr,
      total: dayScans.length,
      authentic: dayScans.filter(s => s.status === 'verified').length,
      fake: dayScans.filter(s => s.status === 'flagged').length,
    };
  });

  const avgConfidence = recentScans.length > 0
    ? Math.round(recentScans.reduce((sum, s) => sum + s.confidence, 0) / recentScans.length)
    : 0;

  const getStatusIcon = (status: string) => {
    if (status === 'verified') return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  const getStatusBg = (status: string) => {
    if (status === 'verified') return 'bg-green-100';
    return 'bg-red-100';
  };

  const timeAgo = (scan: Scan) => {
    return `${scan.date} · ${scan.time}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate("/home")}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">Recent Activity</h1>
          <p className="text-xs text-gray-600">All-time summary</p>
        </div>
        {loading && <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto w-full space-y-6">

          {/* Statistics Overview */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-6 text-white">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5" />
              <h2 className="font-semibold">Activity Statistics</h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <div className="text-3xl font-bold mb-1">{loading ? '—' : totalScans}</div>
                <div className="text-xs text-blue-100">Total Scans</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <div className="text-3xl font-bold mb-1">{loading ? '—' : `${successRate}%`}</div>
                <div className="text-xs text-blue-100">Authentic Rate</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <div className="text-3xl font-bold mb-1">{loading ? '—' : `${avgConfidence}%`}</div>
                <div className="text-xs text-blue-100">Avg Confidence</div>
              </div>
            </div>
          </div>

          {/* Results Breakdown */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Results Breakdown</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl border border-green-200">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Verified Authentic</div>
                  <div className="text-sm text-gray-600">High confidence results</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{loading ? '—' : verified}</div>
                  <div className="text-xs text-gray-600">
                    {totalScans > 0 ? `${Math.round((verified / totalScans) * 100)}%` : '0%'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-200">
                <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Uncertain</div>
                  <div className="text-sm text-gray-600">Needs manual review</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-amber-600">{loading ? '—' : uncertain}</div>
                  <div className="text-xs text-gray-600">0%</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-red-50 rounded-2xl border border-red-200">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Manipulated / Fake</div>
                  <div className="text-sm text-gray-600">Flagged as fake</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-600">{loading ? '—' : flagged}</div>
                  <div className="text-xs text-gray-600">
                    {totalScans > 0 ? `${Math.round((flagged / totalScans) * 100)}%` : '0%'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Activity (last 5 days) */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Daily Activity (Last 5 Days)
            </h2>
            <div className="space-y-3">
              {dayActivity.map((day, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-sm font-medium text-gray-900">{day.day}</span>
                      <span className="text-xs text-gray-500 ml-2">{day.date}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{day.total} scans</span>
                  </div>
                  {day.total > 0 ? (
                    <div className="flex gap-1 h-2">
                      {day.authentic > 0 && (
                        <div
                          className="bg-green-500 rounded-full"
                          style={{ width: `${(day.authentic / day.total) * 100}%` }}
                        />
                      )}
                      {day.fake > 0 && (
                        <div
                          className="bg-red-500 rounded-full"
                          style={{ width: `${(day.fake / day.total) * 100}%` }}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="h-2 bg-gray-200 rounded-full" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Most Recent Scans */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Most Recent Scans</h2>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl animate-pulse">
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-3 bg-gray-200 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentScans.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-6">No scans yet. Start verifying images!</p>
            ) : (
              <>
                <div className="space-y-3">
                  {recentScans.slice(0, 3).map((scan) => (
                    <button
                      key={scan.id}
                      onClick={() => navigate(`/result?id=${scan.id}`)}
                      className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusBg(scan.status)}`}>
                        {getStatusIcon(scan.status)}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-gray-900 text-sm truncate max-w-[200px]">{scan.fileName}</div>
                        <div className="text-xs text-gray-600">{timeAgo(scan)} • {scan.confidence}% confidence</div>
                      </div>
                      <Eye className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => navigate('/history')}
                  className="w-full mt-4 text-blue-600 font-semibold py-3 hover:text-blue-700"
                >
                  View All History →
                </button>
              </>
            )}
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Performance Metrics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {loading ? '—' : totalScans > 0 ? `${successRate}%` : 'N/A'}
                </div>
                <div className="text-xs text-gray-600">Authentic Rate</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {loading ? '—' : totalScans > 0 ? `${avgConfidence}%` : 'N/A'}
                </div>
                <div className="text-xs text-gray-600">Avg Confidence</div>
              </div>
              <div className="p-4 bg-green-50 rounded-xl border border-green-200 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {loading ? '—' : verified}
                </div>
                <div className="text-xs text-gray-600">Verified Images</div>
              </div>
              <div className="p-4 bg-orange-50 rounded-xl border border-orange-200 text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {loading ? '—' : flagged}
                </div>
                <div className="text-xs text-gray-600">Flagged Images</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
