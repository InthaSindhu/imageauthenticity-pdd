import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, CheckCircle2, AlertTriangle, Clock, ChevronRight, Trash2, RefreshCw } from "lucide-react";
import { api } from "../services/api";

interface ScanItem {
  id: string;
  date: string;
  time: string;
  status: 'verified' | 'flagged' | 'uncertain';
  confidence: number;
  fileName: string;
  imageUrl?: string;
}

export function HistoryScreen() {
  const navigate = useNavigate();
  const [scans, setScans] = useState<ScanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getHistory();
      setScans(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(id);
    try {
      await api.deleteScan(id);
      setScans(prev => prev.filter(s => s.id !== id));
    } catch (e: any) {
      alert(e.message || 'Failed to delete scan');
    } finally {
      setDeletingId(null);
    }
  };

  const totalScans = scans.length;
  const verified = scans.filter(s => s.status === 'verified').length;
  const flagged = scans.filter(s => s.status === 'flagged' || s.status === 'uncertain').length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate("/home")}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 flex-1">Verification History</h1>
        <button
          onClick={loadHistory}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
          title="Refresh"
        >
          <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-gray-900 mb-1">{totalScans}</div>
            <div className="text-xs text-gray-600">Total Scans</div>
          </div>
          <div className="bg-green-50 rounded-2xl p-4 text-center border border-green-200">
            <div className="text-2xl font-bold text-green-600 mb-1">{verified}</div>
            <div className="text-xs text-gray-700">Verified</div>
          </div>
          <div className="bg-red-50 rounded-2xl p-4 text-center border border-red-200">
            <div className="text-2xl font-bold text-red-600 mb-1">{flagged}</div>
            <div className="text-xs text-gray-700">Flagged</div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Recent Activity</h2>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4 animate-pulse">
                <div className="w-20 h-20 rounded-xl bg-gray-200 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-600 font-medium mb-3">{error}</p>
            <button onClick={loadHistory} className="text-blue-600 font-semibold hover:text-blue-700">
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && scans.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Clock className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No History Yet</h3>
            <p className="text-gray-600 mb-6">Upload and verify your first image to see results here.</p>
            <button
              onClick={() => navigate("/upload")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-2xl font-semibold hover:shadow-lg transition-shadow"
            >
              Start Scanning
            </button>
          </div>
        )}

        {/* Scan List */}
        {!loading && !error && scans.length > 0 && (
          <div className="space-y-3">
            {scans.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group"
              >
                <button
                  className="flex items-center gap-4 flex-1 text-left"
                  onClick={() => navigate(`/result?id=${item.id}`)}
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt="Scan thumbnail"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Clock className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {item.status === 'verified' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : item.status === 'uncertain' ? (
                        <Clock className="w-4 h-4 text-amber-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      )}
                      <span className={`text-sm font-semibold ${
                        item.status === 'verified' ? 'text-green-600' :
                        item.status === 'uncertain' ? 'text-amber-500' :
                        'text-red-600'
                      }`}>
                        {item.status === 'verified' ? 'Verified Authentic' : item.status === 'uncertain' ? 'Uncertain' : 'Flagged'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-900 font-medium mb-1 truncate max-w-[180px]">
                      {item.fileName}
                    </div>
                    <div className="text-sm font-bold text-gray-800 mb-1">
                      {item.confidence}% confidence
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Clock className="w-3 h-3" />
                      <span>{item.date} at {item.time}</span>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </button>

                {/* Delete button */}
                <button
                  onClick={(e) => handleDelete(item.id, e)}
                  disabled={deletingId === item.id}
                  className="opacity-0 group-hover:opacity-100 w-9 h-9 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all flex-shrink-0"
                  title="Delete"
                >
                  {deletingId === item.id ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
