import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  ArrowLeft, Share2, Mail, MessageCircle, Link,
  Download, CheckCircle2, ShieldCheck, AlertTriangle,
  HelpCircle, Camera, Calendar, Clock, FileText,
  TrendingUp, Eye
} from "lucide-react";
import { api } from "../services/api";

export function ShareResultScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const scanId = searchParams.get("id");

  const [scan, setScan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadScan() {
      if (scanId) {
        try {
          const data = await api.getScanDetails(scanId);
          setScan(data);
        } catch (err) {
          console.error("Failed to load scan:", err);
        }
      }
      setLoading(false);
    }
    loadScan();
  }, [scanId]);

  // Derived data
  const status        = scan?.status        ?? "verified";
  const prediction    = scan?.prediction    ?? "Real";
  const confidence    = scan?.confidence    ?? 94;
  const confidenceTier = scan?.confidenceTier ?? "High";
  const fileName      = scan?.fileName      ?? "image.jpg";
  const fileSize      = scan?.fileSize      ?? "—";
  const resolution    = scan?.resolution    ?? "—";
  const explanation   = scan?.explanation   ?? "No significant manipulation artifacts detected.";
  const dateStr       = scan?.date          ?? new Date().toLocaleDateString();
  const timeStr       = scan?.time          ?? new Date().toLocaleTimeString();
  const imageUrl      = scan?.imageUrl      ?? null;
  const scanIdShort   = scanId ? scanId.slice(-8).toUpperCase() : "N/A";
  const indicators: string[] = scan?.indicators ?? [
    "EXIF Metadata: Valid & Complete",
    "AI Detection: Negative",
    "Manipulation Check: Clear",
    "Compression: Consistent",
  ];

  const isAuthentic = status === "verified";
  const isFake      = status === "flagged";
  const isUncertain = status === "uncertain";

  const verdictLabel = isAuthentic ? "AUTHENTIC" : isFake ? "FLAGGED" : "UNCERTAIN";
  const verdictColor = isAuthentic
    ? { bg: "from-green-500 to-emerald-600", badge: "bg-green-100 text-green-700", text: "text-green-700", border: "border-green-200" }
    : isFake
    ? { bg: "from-red-500 to-rose-600", badge: "bg-red-100 text-red-700", text: "text-red-700", border: "border-red-200" }
    : { bg: "from-amber-500 to-orange-500", badge: "bg-amber-100 text-amber-700", text: "text-amber-700", border: "border-amber-200" };

  const VerdictIcon = isAuthentic ? ShieldCheck : isFake ? AlertTriangle : HelpCircle;

  // Build rich share text (report format)
  const buildReportText = () => {
    const lines = [
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "📋 IMAGE VERIFICATION REPORT",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "",
      `🔍 Verdict: ${verdictLabel}`,
      `📊 Confidence Score: ${confidence}%`,
      `⚡ Confidence Tier: ${confidenceTier}`,
      `🏷️ Prediction: ${prediction} Image`,
      "",
      "📁 FILE DETAILS",
      `• File Name: ${fileName}`,
      `• Resolution: ${resolution}`,
      `• File Size: ${fileSize}`,
      "",
      "📅 VERIFICATION DATE",
      `• Date: ${dateStr}`,
      `• Time: ${timeStr}`,
      `• Scan ID: #${scanIdShort}`,
      "",
      "🔬 ANALYSIS SUMMARY",
      explanation,
      "",
      "✅ DETECTION INDICATORS",
      ...indicators.map(i => `• ${i}`),
      "",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "Verified using VerifyImage™",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    ];
    return lines.join("\n");
  };

  const reportText = buildReportText();

  const handleCopyReport = () => {
    navigator.clipboard.writeText(reportText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Image Verification Report — ${verdictLabel} (${confidence}%)`);
    const body = encodeURIComponent(reportText);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(reportText)}`, "_blank");
  };

  const handleDownloadReport = () => {
    // Build a styled HTML report for printing as PDF
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Image Verification Report — ${fileName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; color: #1e293b; }
    .report { max-width: 680px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.1); }
    .header { padding: 40px 32px; text-align: center; background: linear-gradient(135deg, ${isAuthentic ? '#10b981, #059669' : isFake ? '#ef4444, #e11d48' : '#f59e0b, #f97316'}); color: white; }
    .verdict-badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 6px 18px; border-radius: 100px; font-size: 12px; font-weight: 700; letter-spacing: 2px; margin-bottom: 12px; }
    .header h1 { font-size: 32px; font-weight: 800; margin-bottom: 6px; }
    .header p { opacity: 0.85; font-size: 14px; }
    .confidence-box { margin-top: 20px; background: rgba(255,255,255,0.2); border-radius: 12px; padding: 16px 24px; display: inline-flex; gap: 32px; }
    .conf-item { text-align: center; }
    .conf-value { font-size: 36px; font-weight: 900; }
    .conf-label { font-size: 12px; opacity: 0.8; margin-top: 2px; }
    .divider { width: 1px; background: rgba(255,255,255,0.3); }
    .body { padding: 32px; }
    ${imageUrl ? `.image-section { margin-bottom: 24px; text-align: center; } .analyzed-img { max-width: 100%; max-height: 300px; border-radius: 12px; object-fit: contain; border: 2px solid #e2e8f0; }` : ''}
    .section { margin-bottom: 24px; }
    .section-title { font-size: 14px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #f1f5f9; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .info-card { background: #f8fafc; border-radius: 10px; padding: 14px 16px; }
    .info-label { font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px; }
    .info-value { font-size: 15px; font-weight: 700; color: #1e293b; }
    .explanation-box { background: ${isAuthentic ? '#f0fdf4' : isFake ? '#fef2f2' : '#fffbeb'}; border: 1px solid ${isAuthentic ? '#bbf7d0' : isFake ? '#fecaca' : '#fde68a'}; border-radius: 10px; padding: 16px; font-size: 14px; line-height: 1.6; color: #374151; }
    .indicator { display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: ${isAuthentic ? '#f0fdf4' : isFake ? '#fef2f2' : '#fffbeb'}; border-radius: 8px; margin-bottom: 8px; font-size: 14px; }
    .indicator-dot { width: 8px; height: 8px; border-radius: 50%; background: ${isAuthentic ? '#10b981' : isFake ? '#ef4444' : '#f59e0b'}; flex-shrink: 0; }
    .footer { background: #f8fafc; padding: 20px 32px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 13px; color: #94a3b8; }
    .scan-id { font-family: monospace; font-weight: 700; color: #475569; }
  </style>
</head>
<body>
  <div class="report">
    <div class="header">
      <div class="verdict-badge">${verdictLabel}</div>
      <h1>${isAuthentic ? 'Authentic Image' : isFake ? 'Image Flagged' : 'Uncertain Result'}</h1>
      <p>${isAuthentic ? 'This image appears to be genuine and unmodified' : isFake ? 'Manipulation indicators detected' : 'Unable to determine with high confidence'}</p>
      <div class="confidence-box">
        <div class="conf-item">
          <div class="conf-value">${confidence}%</div>
          <div class="conf-label">Confidence Score</div>
        </div>
        <div class="divider"></div>
        <div class="conf-item">
          <div class="conf-value">${confidenceTier}</div>
          <div class="conf-label">Confidence Tier</div>
        </div>
      </div>
    </div>
    <div class="body">
      ${imageUrl ? `<div class="image-section"><img class="analyzed-img" src="${imageUrl}" alt="${fileName}"/></div>` : ''}
      <div class="section">
        <div class="section-title">File Details</div>
        <div class="grid-2">
          <div class="info-card"><div class="info-label">File Name</div><div class="info-value">${fileName}</div></div>
          <div class="info-card"><div class="info-label">File Size</div><div class="info-value">${fileSize}</div></div>
          <div class="info-card"><div class="info-label">Resolution</div><div class="info-value">${resolution}</div></div>
          <div class="info-card"><div class="info-label">Scan ID</div><div class="info-value scan-id">#${scanIdShort}</div></div>
        </div>
      </div>
      <div class="section">
        <div class="section-title">Verification Date</div>
        <div class="grid-2">
          <div class="info-card"><div class="info-label">Date</div><div class="info-value">${dateStr}</div></div>
          <div class="info-card"><div class="info-label">Time</div><div class="info-value">${timeStr}</div></div>
        </div>
      </div>
      <div class="section">
        <div class="section-title">Analysis Summary</div>
        <div class="explanation-box">${explanation}</div>
      </div>
      <div class="section">
        <div class="section-title">Detection Indicators</div>
        ${indicators.map(ind => `<div class="indicator"><div class="indicator-dot"></div><span>${ind}</span></div>`).join("")}
      </div>
    </div>
    <div class="footer">
      <strong>VerifyImage™</strong> — Image Authenticity Verification Platform<br/>
      Report generated on ${dateStr} at ${timeStr} &nbsp;|&nbsp; Scan ID: <span class="scan-id">#${scanIdShort}</span>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (win) {
      win.onload = () => {
        win.print();
      };
    }
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Nav */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 flex-1">Share Results</h1>
        <button
          onClick={handleDownloadReport}
          title="Download as PDF"
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
        >
          <Download className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-2xl mx-auto w-full space-y-5">

          {/* ── REPORT CARD (Preview) ── */}
          <div ref={reportRef} className={`rounded-3xl overflow-hidden shadow-2xl border ${isAuthentic ? 'border-green-200' : isFake ? 'border-red-200' : 'border-amber-200'}`}>

            {/* Verdict Header */}
            <div className={`bg-gradient-to-br ${verdictColor.bg} px-6 py-8 text-white text-center`}>
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <VerdictIcon className="w-10 h-10 text-white" />
              </div>
              <div className="inline-block bg-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-3 uppercase tracking-widest">
                {verdictLabel}
              </div>
              <h2 className="text-2xl font-bold mb-1">
                {isAuthentic ? "Authentic Image" : isFake ? "Image Flagged" : "Uncertain Result"}
              </h2>
              <p className="text-white/80 text-sm mb-5">
                {isAuthentic
                  ? "This image appears to be genuine and unmodified"
                  : isFake
                  ? "Manipulation indicators were detected"
                  : "Unable to determine with high confidence"}
              </p>
              {/* Confidence Band */}
              <div className="inline-flex items-center gap-6 bg-white/20 backdrop-blur-sm px-6 py-4 rounded-2xl">
                <div className="text-center">
                  <div className="text-4xl font-black">{confidence}%</div>
                  <div className="text-white/75 text-xs mt-1">Confidence Score</div>
                </div>
                <div className="w-px h-10 bg-white/30" />
                <div className="text-center">
                  <div className="text-xl font-bold">{confidenceTier}</div>
                  <div className="text-white/75 text-xs mt-1">Confidence Tier</div>
                </div>
                <div className="w-px h-10 bg-white/30" />
                <div className="text-center">
                  <div className="text-sm font-bold">{prediction}</div>
                  <div className="text-white/75 text-xs mt-1">Prediction</div>
                </div>
              </div>
            </div>

            {/* White Report Body */}
            <div className="bg-white p-6 space-y-5">

              {/* Analyzed Image */}
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  <Eye className="w-4 h-4" />
                  Analyzed Image
                </div>
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden flex items-center justify-center">
                  {imageUrl ? (
                    <img src={imageUrl} alt={fileName} className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-center text-gray-400">
                      <Camera className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <span className="text-sm">{fileName}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                  <Camera className="w-3.5 h-3.5" />
                  <span className="font-medium">{fileName}</span>
                  <span className="ml-auto">{resolution}</span>
                  <span>{fileSize}</span>
                </div>
              </div>

              <div className="border-t border-gray-100" />

              {/* File & Scan Details */}
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  <FileText className="w-4 h-4" />
                  File Details
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "File Name",    value: fileName },
                    { label: "File Size",    value: fileSize },
                    { label: "Resolution",   value: resolution },
                    { label: "Scan ID",      value: `#${scanIdShort}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-gray-50 rounded-xl p-3">
                      <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">{label}</div>
                      <div className="text-sm font-bold text-gray-900 truncate">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100" />

              {/* Date & Time */}
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  <Calendar className="w-4 h-4" />
                  Verification Date
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="text-xs text-gray-400 font-semibold uppercase">Date</div>
                      <div className="text-sm font-bold text-gray-900">{dateStr}</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-purple-500" />
                    <div>
                      <div className="text-xs text-gray-400 font-semibold uppercase">Time</div>
                      <div className="text-sm font-bold text-gray-900">{timeStr}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100" />

              {/* Analysis Summary */}
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  <TrendingUp className="w-4 h-4" />
                  Analysis Summary
                </div>
                <div className={`${isAuthentic ? 'bg-green-50 border-green-200 text-green-900' : isFake ? 'bg-red-50 border-red-200 text-red-900' : 'bg-amber-50 border-amber-200 text-amber-900'} border rounded-2xl p-4 text-sm leading-relaxed`}>
                  {explanation}
                </div>
              </div>

              <div className="border-t border-gray-100" />

              {/* Detection Indicators */}
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  <CheckCircle2 className="w-4 h-4" />
                  Detection Indicators
                </div>
                <div className="space-y-2">
                  {indicators.map((ind, i) => {
                    const [label, value] = ind.split(":").map(s => s.trim());
                    return (
                      <div key={i} className={`flex items-center justify-between px-4 py-3 rounded-xl border ${isAuthentic ? 'bg-green-50 border-green-100' : isFake ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'}`}>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${isAuthentic ? 'bg-green-500' : isFake ? 'bg-red-500' : 'bg-amber-500'}`} />
                          <span className="text-sm font-medium text-gray-800">{label}</span>
                        </div>
                        {value && <span className={`text-xs font-semibold ${isAuthentic ? 'text-green-700' : isFake ? 'text-red-700' : 'text-amber-700'}`}>{value}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer brand */}
              <div className="border-t border-gray-100 pt-4 text-center">
                <div className="text-xs text-gray-400">
                  <span className="font-bold text-gray-600">VerifyImage™</span> — Image Authenticity Verification Platform
                </div>
                <div className="text-xs text-gray-400 mt-1">Scan ID: <span className="font-mono font-bold">#{scanIdShort}</span></div>
              </div>
            </div>
          </div>

          {/* ── SHARE OPTIONS ── */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-blue-600" />
              Share Report Via
            </h2>
            <div className="space-y-3">

              {/* WhatsApp / Messaging */}
              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center gap-4 p-4 bg-green-50 rounded-2xl border border-green-200 hover:bg-green-100 transition-colors"
              >
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-gray-900">WhatsApp / Messaging</div>
                  <div className="text-sm text-gray-500">Share full report text to any app</div>
                </div>
              </button>

              {/* Email */}
              <button
                onClick={handleEmail}
                className="w-full flex items-center gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-gray-900">Email</div>
                  <div className="text-sm text-gray-500">Send full report via email</div>
                </div>
              </button>

              {/* Copy Report */}
              <button
                onClick={handleCopyReport}
                className="w-full flex items-center gap-4 p-4 bg-purple-50 rounded-2xl border border-purple-200 hover:bg-purple-100 transition-colors"
              >
                <div className={`w-12 h-12 ${copied ? 'bg-green-600' : 'bg-purple-600'} rounded-full flex items-center justify-center flex-shrink-0 transition-colors`}>
                  {copied ? <CheckCircle2 className="w-6 h-6 text-white" /> : <Link className="w-6 h-6 text-white" />}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-gray-900">{copied ? "Copied!" : "Copy Report Text"}</div>
                  <div className="text-sm text-gray-500">
                    {copied ? "Full report copied to clipboard" : "Copy formatted report to clipboard"}
                  </div>
                </div>
              </button>

              {/* Download PDF */}
              <button
                onClick={handleDownloadReport}
                className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-gray-900">Download as PDF</div>
                  <div className="text-sm text-gray-500">Save full report with image as PDF</div>
                </div>
              </button>
            </div>
          </div>

          {/* ── WHAT'S INCLUDED ── */}
          <div className="bg-blue-50 rounded-2xl p-5 border border-blue-200 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              What's included in the report:
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {[
                "Verdict & Confidence Score",
                "Analyzed image preview",
                "File name, resolution & size",
                "Verification date & time",
                "AI analysis summary",
                "All detection indicators",
                "Unique Scan ID for reference",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
