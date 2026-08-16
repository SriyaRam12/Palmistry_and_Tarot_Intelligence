import { useEffect, useMemo, useState } from "react";
import { getHistory, getHistoryById } from "../services/historyService";
import { useNavigate } from "react-router-dom";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");
  const navigate = useNavigate();

  useEffect(() => {
    getHistory()
      .then((response) => {
        setHistory(Array.isArray(response.data) ? response.data : []);
      })
      .catch((errorResponse) => {
        setError(errorResponse?.response?.data?.detail || "Unable to load history.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredHistory = useMemo(() => {
    const sorted = [...history].sort((a, b) => {
      const dateA = new Date(a.created_at || a.timestamp || 0).getTime();
      const dateB = new Date(b.created_at || b.timestamp || 0).getTime();
      return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
    });

    return sorted.filter((item) => {
      const palmShape = (item.palm_shape || item.classification?.palm_shape || "").toLowerCase();
      const matchesSearch = `${item.id || ""} ${palmShape}`.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "All" || filter === "Recent" ? true : palmShape === filter.toLowerCase();
      return matchesSearch && matchesFilter;
    });
  }, [history, filter, search, sortOrder]);

  const handleViewReport = async (readingId) => {
    try {
      const response = await getHistoryById(readingId);
      navigate("/results", {
        state: {
          analysis: {
            original_image: response.data.original_image,
            processed_image: response.data.processed_image,
            line_image: response.data.line_image,
            classification: response.data.classification,
            finger_analysis: response.data.finger_analysis,
            line_analysis: response.data.line_analysis,
            interpretation: response.data.interpretation,
            recommendations: response.data.recommendations,
            life_trends: response.data.life_trends,
          },
          readingId: response.data.id,
        },
      });
    } catch (err) {
      console.error(err);
      alert("Unable to load report.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-white px-4 py-10 text-slate-800 transition-colors duration-300 sm:px-6 lg:px-8 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white/80 p-8 shadow-xl shadow-slate-100/60 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80 dark:shadow-slate-950/20">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-violet-600 dark:text-violet-300">Reading history</p>
              <h1 className="mt-3 text-4xl font-semibold">Your palm analysis timeline</h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-400">Browse past readings, filter by palm shape, and reopen any report in a polished card layout.</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search history"
              className="rounded-full border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-violet-400 dark:border-white/10 dark:bg-slate-950 dark:text-slate-200"
            />
            <select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-full border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-violet-400 dark:border-white/10 dark:bg-slate-950 dark:text-slate-200">
              <option value="All">All</option>
              <option value="Recent">Recent</option>
              <option value="Water">Water</option>
              <option value="Fire">Fire</option>
              <option value="Earth">Earth</option>
              <option value="Air">Air</option>
            </select>
            <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} className="rounded-full border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-violet-400 dark:border-white/10 dark:bg-slate-950 dark:text-slate-200">
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
            </select>
          </div>
        </section>

        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-36 animate-pulse rounded-[2rem] bg-slate-100 dark:bg-slate-900" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-6 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-100">
            {error}
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 p-10 text-center shadow-sm dark:border-white/10 dark:bg-slate-900/70">
            <h2 className="text-2xl font-semibold">No matching history yet</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">Try a different search or start a new palm analysis.</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {filteredHistory.map((item, index) => (
              <div key={item.id || index} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-xl shadow-slate-100/60 dark:border-white/10 dark:bg-slate-900/80">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">{new Date(item.created_at || item.timestamp || Date.now()).toLocaleDateString()}</p>
                    <h2 className="mt-3 text-2xl font-semibold">Reading #{item.id || "—"}</h2>
                  </div>
                  <span className="rounded-full bg-violet-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-violet-700 dark:text-violet-200">Completed</span>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-slate-950/60">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Palm shape</p>
                    <p className="mt-3 text-lg font-semibold">{item.palm_shape || item.classification?.palm_shape || "Unknown"}</p>
                  </div>
                  <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-slate-950/60">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Longest finger</p>
                    <p className="mt-3 text-lg font-semibold">{item.longest_finger || item.finger_analysis?.longest_finger || "N/A"}</p>
                  </div>
                  <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-slate-950/60">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Shortest finger</p>
                    <p className="mt-3 text-lg font-semibold">{item.shortest_finger || item.finger_analysis?.shortest_finger || "N/A"}</p>
                  </div>
                  <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-slate-950/60">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Palm lines</p>
                    <p className="mt-3 text-lg font-semibold">Heart • Head • Life • Fate</p>
                  </div>
                </div>

                <button
                  onClick={() => handleViewReport(item.id)}
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  View report
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
