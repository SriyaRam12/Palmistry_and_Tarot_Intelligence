import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

const badgeStyles = {
  Strong: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  Moderate: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  Weak: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  NotVisible: "bg-slate-500/15 text-slate-700 dark:text-slate-300",
  ComingSoon: "bg-violet-500/15 text-violet-700 dark:text-violet-200",
};

function Results() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [latestAnalysis, setLatestAnalysis] = useState({ analysis: null, readingId: null });
  const [downloading, setDownloading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      const stored = window.localStorage.getItem("latestAnalysis");
      const parsedStored = stored ? JSON.parse(stored) : null;

      if (state?.analysis) {
        const payload = {
          analysis: state.analysis,
          readingId: state.readingId || parsedStored?.readingId || null,
        };
        setLatestAnalysis(payload);
        window.localStorage.setItem("latestAnalysis", JSON.stringify(payload));
      } else if (parsedStored) {
        setLatestAnalysis(parsedStored);
      }
    } catch (e) {
      console.error(e);
      setError("Unable to load the latest analysis.");
    } finally {
      setLoading(false);
    }
  }, [state]);

  const downloadPDF = async () => {
    if (!latestAnalysis.readingId) {
      window.print();
      return;
    }

    try {
      setDownloading(true);
      const response = await api.get(`/reports/${latestAnalysis.readingId}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Palm_Report_${latestAnalysis.readingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Unable to download PDF report. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const analysis = latestAnalysis.analysis;

  const summary = useMemo(() => {
    if (!analysis) return {};

    return {
      originalImage: analysis.original_image || null,
      processedImage: analysis.processed_image || null,
      lineImage: analysis.line_image || null,
      classification: analysis.classification || {},
      finger: analysis.finger_analysis || {},
      lines: analysis.line_analysis || {},
      interpretation:
        analysis.interpretation?.ai_reading ||
        analysis.interpretation ||
        "No interpretation available.",
      structured: analysis.interpretation?.structured_analysis || {},
    };
  }, [analysis]);

  const keyStats = [
    { label: "Palm Shape", value: summary.classification?.palm_shape || "Unknown" },
    { label: "Finger Type", value: summary.classification?.finger_type || "Unknown" },
    { label: "Palm Ratio", value: summary.classification?.palm_ratio?.toFixed(2) ?? "N/A" },
    { label: "Longest Finger", value: summary.finger?.longest_finger || "N/A" },
  ];

  const fingerBars = Object.entries(summary.finger?.lengths || {}).map(
  ([key, value]) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1),
    value: typeof value === "number" ? value : Number(value) || 0,
  })
);

const maxFingerLength = Math.max(
  ...fingerBars.map((item) => item.value),
  1
);

  const lineEntries = Object.entries(summary.lines || {}).filter(([key, value]) => value && typeof value === "object");

  const interpretationSections = useMemo(() => {
  if (!summary.interpretation) return [];

  const structured = summary.structured || {};

  const structuredSections = [
    {
      key: "Personality",
      value: structured.personality || "",
    },
    {
      key: "Career",
      value: structured.career || "",
    },
    {
      key: "Relationships",
      value: structured.relationships || "",
    },
    {
      key: "Health",
      value: structured.health || "",
    },
    {
      key: "Strengths",
      value: structured.strengths || "",
    },
    {
      key: "Suggestions",
      value: structured.suggestions || "",
    },
  ].filter((section) => section.value);

  // If backend already provides structured data, use it.
  if (structuredSections.length > 0) {
    return structuredSections;
  }

  // Otherwise parse the existing AI text.
  const text = summary.interpretation
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");

  const sectionNames = [
    "Personality",
    "Career",
    "Relationships",
    "Health",
    "Strengths",
    "Suggestions",
  ];

  const pattern = new RegExp(
    `\\*\\*(${sectionNames.join("|")})\\s*:?\\*\\*`,
    "gi"
  );

  const matches = [...text.matchAll(pattern)];

  if (matches.length === 0) {
    return [
      {
        key: "Reading",
        value: text
          .replace(/\*\*/g, "")
          .replace(/\*/g, "")
          .trim(),
      },
    ];
  }

  return matches
    .map((match, index) => {
      const start = match.index + match[0].length;
      const end =
        index + 1 < matches.length
          ? matches[index + 1].index
          : text.length;

      const value = text
        .slice(start, end)
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .replace(/\n+/g, " ")
        .trim();

      return {
        key: match[1],
        value,
      };
    })
    .filter((section) => section.value);
}, [summary]);

  return (
    <div className="min-h-[calc(100vh-72px)] bg-white px-4 py-10 text-slate-800 transition-colors duration-300 sm:px-6 lg:px-8 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white/80 p-8 shadow-xl shadow-slate-100/60 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80 dark:shadow-slate-950/20">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-violet-600 dark:text-violet-300">Palm analysis report</p>
              <h1 className="mt-3 text-4xl font-semibold">Your AI palm reading is ready.</h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-400">Review classification, finger insights, line analysis, and recommendations in a refined report layout.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/history")}
                className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-violet-400 hover:bg-violet-500/10 dark:border-white/10 dark:bg-slate-950 dark:text-white"
              >
                Back to history
              </button>
              <button
                onClick={downloadPDF}
                disabled={downloading}
                className="rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
              >
                {downloading ? "Preparing..." : "Download report"}
              </button>
            </div>
          </div>
        </section>

        {error && (
          <section className="rounded-[2rem] border border-rose-200 bg-rose-50 p-6 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-100">
            {error}
          </section>
        )}

        {loading ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white/70 p-10 text-center shadow-xl dark:border-white/10 dark:bg-slate-900/70">
            <p className="text-lg font-semibold">Loading your report…</p>
          </div>
        ) : (
          <>
            <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6">
                <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-xl shadow-slate-100/50 dark:border-white/10 dark:bg-slate-900/80">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Reading details</p>
                      <h2 className="mt-2 text-2xl font-semibold">Palm analysis overview</h2>
                    </div>
                    <div className="rounded-full bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-700 dark:text-violet-200">ID #{latestAnalysis.readingId || "Auto"}</div>
                  </div>
                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-slate-950/60">
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Original palm</p>
                      {summary.originalImage ? (
                        <img src={`http://127.0.0.1:8000/uploads/${summary.originalImage}`} alt="Original palm" className="mt-4 h-56 w-full rounded-[1.25rem] object-cover" />
                      ) : (
                        <div className="mt-4 flex h-56 items-center justify-center rounded-[1.25rem] bg-white/70 text-slate-500 dark:bg-slate-900">Unavailable</div>
                      )}
                    </div>
                    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-slate-950/60">
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Processed scan</p>
                      {summary.processedImage ? (
                        <img src={`http://127.0.0.1:8000/uploads/${summary.processedImage}`} alt="Processed palm" className="mt-4 h-56 w-full rounded-[1.25rem] object-cover" />
                      ) : (
                        <div className="mt-4 flex h-56 items-center justify-center rounded-[1.25rem] bg-white/70 text-slate-500 dark:bg-slate-900">Unavailable</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-xl shadow-slate-100/50 dark:border-white/10 dark:bg-slate-900/80">
                  <h2 className="text-xl font-semibold">AI scan visualizer</h2>
                  <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-slate-950/60">
                    {summary.lineImage ? (
                      <img src={`http://127.0.0.1:8000/uploads/${summary.lineImage}`} alt="Detected palm lines" className="w-full rounded-[1.25rem] object-cover" />
                    ) : (
                      <div className="flex h-72 items-center justify-center rounded-[1.25rem] bg-white/70 text-slate-500 dark:bg-slate-900">No line imagery available</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-xl shadow-slate-100/50 dark:border-white/10 dark:bg-slate-900/80">
                  <h2 className="text-xl font-semibold">Quick highlights</h2>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {keyStats.map((item) => (
                      <div key={item.label} className="rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-slate-950/60">
                        <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">{item.label}</p>
                        <p className="mt-3 text-2xl font-semibold">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-xl shadow-slate-100/50 dark:border-white/10 dark:bg-slate-900/80">
  <div className="flex items-center justify-between gap-4">
    <div>
      <p className="text-xs uppercase tracking-[0.35em] text-violet-600 dark:text-violet-300">
        AI interpretation
      </p>

      <h2 className="mt-2 text-2xl font-semibold">
        Your reading
      </h2>
    </div>

    <div className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-700 dark:text-violet-200">
      Insight
    </div>
  </div>

  <div className="mt-6 space-y-4">
    {interpretationSections.map((section) => (
      <div
        key={section.key}
        className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-slate-950/60"
      >
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" />

          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            {section.key}
          </h3>
        </div>

        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
          {section.value}
        </p>
      </div>
    ))}
  </div>
</div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-xl shadow-slate-100/50 dark:border-white/10 dark:bg-slate-900/80">
                <h2 className="text-xl font-semibold">Palm classification</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-slate-950/60">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Palm type</p>
                    <p className="mt-3 text-lg font-semibold">{summary.classification?.palm_type || "N/A"}</p>
                  </div>
                  <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-slate-950/60">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Palm shape</p>
                    <p className="mt-3 text-lg font-semibold">{summary.classification?.palm_shape || "N/A"}</p>
                  </div>
                  <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-slate-950/60">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Finger ratio</p>
                    <p className="mt-3 text-lg font-semibold">{summary.classification?.finger_ratio?.toFixed(2) ?? "N/A"}</p>
                  </div>
                  <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-slate-950/60">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Palm ratio</p>
                    <p className="mt-3 text-lg font-semibold">{summary.classification?.palm_ratio?.toFixed(2) ?? "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-xl shadow-slate-100/50 dark:border-white/10 dark:bg-slate-900/80">
                <h2 className="text-xl font-semibold">Finger analysis</h2>
                <div className="mt-6 space-y-4">
                  {fingerBars.length > 0 ? (
  fingerBars.map((item) => {
    const percentage = Math.max(
      8,
      (item.value / maxFingerLength) * 100
    );

    return (
      <div key={item.label} className="min-w-0">
        <div className="mb-2 flex items-center justify-between gap-4 text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {item.label}
          </span>

          <span className="shrink-0 text-slate-500 dark:text-slate-400">
            {item.value > 0 ? `${item.value.toFixed(2)} px` : "N/A"}
          </span>
        </div>

        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            className="h-full max-w-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-700"
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>
      </div>
    );
  })
) : (
  <p className="text-sm text-slate-500 dark:text-slate-400">
    Finger measurements are not available for this reading.
  </p>
)}
                </div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-xl shadow-slate-100/50 dark:border-white/10 dark:bg-slate-900/80">
                <h2 className="text-xl font-semibold">Palm line analysis</h2>
                <div className="mt-6 space-y-4">
                  {lineEntries.length > 0 ? lineEntries.map(([lineName, lineValue]) => (
                    <div key={lineName} className="flex items-center justify-between rounded-[1.25rem] border border-slate-200 bg-slate-50/80 px-5 py-4 dark:border-white/10 dark:bg-slate-950/60">
                      <div>
                        <p className="font-semibold capitalize">{lineName.replace(/_/g, " ")}</p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{lineValue.status || lineValue.type || "Information available"}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeStyles[lineValue.status] || "bg-slate-500/15 text-slate-700 dark:text-slate-300"}`}>
                        {lineValue.status || "Coming Soon"}
                      </span>
                    </div>
                  )) : <p className="text-sm text-slate-500 dark:text-slate-400">No line details available.</p>}
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-xl shadow-slate-100/50 dark:border-white/10 dark:bg-slate-900/80">
                <h2 className="text-xl font-semibold">Personalized recommendations</h2>
                <div className="mt-6 space-y-4">
                  {analysis?.recommendations?.length ? (
                    analysis.recommendations.map((item, index) => (
                      <div key={index} className="rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-slate-950/60">
                        <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">{item.category}</p>
                        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">{item.message}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">No recommendations available for this reading.</p>
                  )}
                </div>
              </div>
            </section>

            

            {analysis?.life_trends && (
              <section className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-xl shadow-slate-100/50 dark:border-white/10 dark:bg-slate-900/80">
                <h2 className="text-xl font-semibold">Life trend analysis</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {Object.entries(analysis.life_trends).map(([key, value]) => (
                    <div key={key} className="rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-slate-950/60">
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">{key.replace(/_/g, " ")}</p>
                      <p className="mt-3 text-lg font-semibold">Trend: {value.trend}</p>
                      <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">{value.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Results;
 