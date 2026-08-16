import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const pipeline = [
  { title: "01 Upload", description: "Choose a clear palm image from your device." },
  { title: "02 Detect", description: "The system locates the hand and outlines the palm." },
  { title: "03 Extract", description: "Landmarks and proportions are measured for detail." },
  { title: "04 Analyze", description: "Finger and line signals are interpreted by the platform." },
  { title: "05 Report", description: "A refined reading is delivered in a polished report." },
];

const technologies = [
  { name: "YOLOv8", description: "Object detection for palm localization." },
  { name: "MediaPipe", description: "Precise hand landmark extraction and geometry." },
  { name: "OpenCV", description: "Image processing and line visualization." },
  { name: "FastAPI", description: "Secure backend pipeline and responsive endpoints." },
  { name: "PostgreSQL", description: "Structured storage for readings and history." },
];

const features = [
  "Palm Classification",
  "Finger Analysis",
  "Heart Line",
  "Head Line",
  "Life Line",
  "Fate Line",
  "Personalized Interpretation",
  "Life Trend Analysis",
  "Reading History",
];

function Home() {
  const { user } = useAuth();

  return (
    <div className="relative overflow-hidden bg-white text-slate-800 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      <div className="hero-particles">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-violet-700 dark:border-violet-500/30 dark:bg-white/10 dark:text-violet-200">
              <span className="h-2 w-2 rounded-full bg-violet-500 palm-badge" />
              Premium AI Palmistry
            </div>
            <div className="space-y-5">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Discover the story inside your palm.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                Experience a refined AI-powered palm reading platform that blends elegant design, intelligent analysis, and personalized guidance into one premium experience.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to={user ? "/dashboard" : "/register"}
                className="inline-flex items-center justify-center rounded-full bg-violet-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-500"
              >
                {user ? "Open dashboard" : "Analyze my palm"}
              </Link>
              <Link
                to="/tarot"
                className="inline-flex items-center justify-center rounded-full border border-violet-300/60 bg-white/70 px-6 py-3 text-base font-semibold text-slate-800 transition hover:border-violet-400 hover:bg-violet-500/10 dark:border-white/10 dark:bg-white/10 dark:text-white"
              >
                Explore tarot
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.5rem] border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">21 Landmarks</p>
                <p className="mt-3 text-xl font-semibold">Refined scanning</p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Secure</p>
                <p className="mt-3 text-xl font-semibold">Protected sessions</p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Responsive</p>
                <p className="mt-3 text-xl font-semibold">Every device</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="card-glass relative overflow-hidden rounded-[2rem] border border-violet-200/70 p-8 shadow-[0_40px_120px_-60px_rgba(124,58,237,0.55)] dark:border-white/10">
              <div className="absolute inset-x-0 top-10 h-44 bg-gradient-to-b from-violet-500/20 to-transparent opacity-80 blur-3xl" />
              <div className="palm-hero-art relative mx-auto h-[520px] w-full max-w-[430px] rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 p-6 shadow-2xl shadow-violet-500/20">
                <div className="absolute left-[10%] top-[8%] h-24 w-24 rounded-full bg-violet-500/20 blur-2xl" />
                <div className="absolute right-[8%] top-[20%] h-20 w-20 rounded-full bg-cyan-400/15 blur-2xl" />
                <div className="absolute left-[18%] bottom-[18%] h-24 w-24 rounded-full bg-pink-500/20 blur-2xl" />
                <div className="relative mx-auto mt-10 flex h-[400px] w-[280px] flex-col items-center justify-center rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-xl shadow-slate-950/40">
                  <div className="hand-ring absolute inset-0 rounded-[2rem] border border-violet-400/10" />
                  <div className="absolute left-1/2 top-8 h-24 w-24 -translate-x-1/2 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 opacity-30" />
                  <div className="relative z-10 flex h-full w-full flex-col items-center justify-between pb-8">
                    <div className="space-y-4 text-center">
                      <div className="mx-auto h-12 w-12 rounded-full border border-white/10 bg-white/10" />
                      <div className="space-y-2">
                        <div className="mx-auto h-16 w-16 rounded-full bg-violet-500/40 shadow-[0_0_40px_rgba(168,85,247,0.45)]" />
                        <div className="text-sm uppercase tracking-[0.4em] text-slate-400">Palm Insight</div>
                      </div>
                    </div>

                    <div className="grid w-full gap-3 rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-4 text-left shadow-inner shadow-slate-950/20">
                      {[
                        ["21 Landmarks", "violet"],
                        ["Palm Lines", "cyan"],
                        ["Finger Analysis", "fuchsia"],
                        ["AI Insights", "amber"],
                      ].map(([label, color]) => (
                        <div key={label} className="flex items-center justify-between text-sm text-slate-300">
                          <span>{label}</span>
                          <span className={`text-${color}-300`}>●</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 rounded-[2rem] border border-slate-200 bg-white/70 p-8 shadow-xl shadow-violet-100/40 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70 dark:shadow-slate-950/20">
          <div className="mb-8 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-violet-600 dark:text-violet-300">How palm analysis works</p>
            <h2 className="mt-3 text-3xl font-semibold">A guided AI workflow</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-5">
            {pipeline.map((item, index) => (
              <div key={item.title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-6 text-center shadow-sm dark:border-white/10 dark:bg-slate-950/60">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/15 text-sm font-semibold text-violet-700 dark:text-violet-200">
                  {index + 1}
                </div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.95fr]">
          <section className="rounded-[2rem] border border-slate-200 bg-white/70 p-8 shadow-xl shadow-slate-100/60 dark:border-white/10 dark:bg-slate-900/70">
            <p className="text-sm uppercase tracking-[0.35em] text-violet-600 dark:text-violet-300">Technology behind the analysis</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {technologies.map((technology) => (
                <div key={technology.name} className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-slate-950/60">
                  <h3 className="font-semibold">{technology.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{technology.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white/70 p-8 shadow-xl shadow-slate-100/60 dark:border-white/10 dark:bg-slate-900/70">
            <p className="text-sm uppercase tracking-[0.35em] text-violet-600 dark:text-violet-300">What you can explore</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {features.map((feature) => (
                <span key={feature} className="rounded-full border border-violet-300/40 bg-violet-500/10 px-4 py-2 text-sm text-slate-700 dark:text-slate-200">
                  {feature}
                </span>
              ))}
            </div>
            <div className="mt-8 rounded-[1.5rem] bg-gradient-to-br from-violet-600 to-cyan-600 p-6 text-white shadow-lg">
              <h3 className="text-2xl font-semibold">Ready to explore your palm?</h3>
              <p className="mt-3 text-sm leading-7 text-violet-50">Start a new analysis and open a refined report built around your own reading history.</p>
              <Link to="/palm" className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                Start your analysis
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Home;
