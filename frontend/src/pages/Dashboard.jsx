import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDashboardData } from "../services/dashboardService";
import { getHistory } from "../services/historyService";

function Dashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const [dashboardResponse, historyResponse] = await Promise.all([
          getDashboardData().catch(() => ({ data: null })),
          getHistory().catch(() => ({ data: [] })),
        ]);

        if (!isMounted) return;

        setDashboard(dashboardResponse?.data ?? null);
        const historyData = Array.isArray(historyResponse?.data) ? historyResponse.data : [];
        setRecent(historyData.slice(0, 4));
      } catch (fetchError) {
        if (isMounted) {
          setError("Unable to load dashboard data. Please refresh the page.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(
    () => [
      {
        title: "Total Readings",
        value: dashboard?.total_readings ?? recent.length,
        description: "Completed palm scans",
      },
      {
        title: "Latest Palm Shape",
        value: dashboard?.latest_palm_shape || recent[0]?.palm_shape || recent[0]?.classification?.palm_shape || "N/A",
        description: "Most recent classification",
      },
      {
        title: "Latest Reading Date",
        value: dashboard?.latest_reading_date ? new Date(dashboard.latest_reading_date).toLocaleDateString() : (recent[0]?.created_at ? new Date(recent[0].created_at).toLocaleDateString() : "N/A"),
        description: "Most recent analysis",
      },
      {
        title: "Member Since",
        value: dashboard?.member_since ? new Date(dashboard.member_since).toLocaleDateString() : (user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"),
        description: "Joined the platform",
      },
    ],
    [dashboard, recent, user]
  );

  const shapeDistribution = useMemo(() => {
    const counts = recent.reduce((acc, item) => {
      const shape = item.palm_shape || item.classification?.palm_shape || "Unknown";
      acc[shape] = (acc[shape] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).slice(0, 4);
  }, [recent]);

  return (
    <div className="min-h-[calc(100vh-72px)] bg-white px-4 py-10 text-slate-800 transition-colors duration-300 sm:px-6 lg:px-8 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white/80 p-8 shadow-xl shadow-slate-100/60 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80 dark:shadow-slate-950/20">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-violet-600 dark:text-violet-300">Dashboard</p>
              <h1 className="mt-3 text-4xl font-semibold">Welcome back, {user?.full_name || "reader"}.</h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-400">A focused workspace for recent palm readings, trend awareness, and your reading history.</p>
            </div>
            
          </div>
        </section>

        {error && (
          <section className="rounded-[2rem] border border-rose-200 bg-rose-50 p-6 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-100">
            {error}
          </section>
        )}

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {loading ? (
            [...Array(4)].map((_, index) => (
              <div key={index} className="h-40 animate-pulse rounded-[2rem] bg-slate-100 dark:bg-slate-900" />
            ))
          ) : (
            stats.map((item) => (
              <div key={item.title} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-xl shadow-slate-100/50 dark:border-white/10 dark:bg-slate-900/80">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">{item.title}</p>
                <p className="mt-4 text-3xl font-semibold">{item.value}</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
              </div>
            ))
          )}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-8 shadow-xl shadow-slate-100/60 dark:border-white/10 dark:bg-slate-900/80">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-violet-600 dark:text-violet-300">Recent Analysis</p>
                <h2 className="mt-3 text-2xl font-semibold">Latest readings</h2>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {loading ? (
                [...Array(3)].map((_, index) => (
                  <div key={index} className="h-28 rounded-[1.75rem] bg-slate-100 animate-pulse dark:bg-slate-900" />
                ))
              ) : recent.length === 0 ? (
                <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50/70 p-8 text-slate-600 dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-400">
                  No recent readings available yet. Analyze a palm to populate this list.
                </div>
              ) : (
                recent.map((item, index) => (
                  <div key={item.id || index} className="rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-6 shadow-sm dark:border-white/10 dark:bg-slate-950/60">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">{new Date(item.created_at || item.timestamp || Date.now()).toLocaleDateString()}</p>
                        <h3 className="mt-2 text-xl font-semibold">{item.palm_shape || item.classification?.palm_shape || "Palm reading"}</h3>
                        <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">{item.ai_reading || item.summary || item.interpretation || "AI interpretation summary."}</p>
                      </div>
                      <span className="rounded-full bg-violet-500/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-violet-700 dark:text-violet-200">{item.status || "Completed"}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-violet-700 to-cyan-700 p-8 shadow-2xl shadow-cyan-500/20">
              <p className="text-sm uppercase tracking-[0.35em] text-violet-100">Quick Actions</p>
              <h2 className="mt-4 text-2xl font-semibold text-white">Launch a new reading</h2>
              <p className="mt-3 text-sm leading-7 text-slate-200">Upload your palm image and explore a full suite of analysis sections, from line detection to AI interpretation.</p>
              <div className="mt-6 grid gap-3">
                <Link to="/palm" className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">Upload palm image</Link>
                <Link to="/history" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20">View history</Link>
                <Link to="/profile" className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-950/80">Open profile</Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-8 shadow-xl shadow-slate-100/60 dark:border-white/10 dark:bg-slate-900/80">
              <h3 className="text-xl font-semibold">Reading insights</h3>
              <div className="mt-6 space-y-4">
                {shapeDistribution.length === 0 ? (
                  <p className="text-sm text-slate-600 dark:text-slate-400">Not enough readings yet.</p>
                ) : shapeDistribution.map(([shape, count]) => (
                  <div key={shape}>
                    <div className="mb-2 flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                      <span>{shape}</span>
                      <span>{count}</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-800">
                      <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" style={{ width: `${Math.max(20, count * 25)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
