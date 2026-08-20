import { useState } from "react";
import axios from "axios";

function Tarot() {
  const [loading, setLoading] = useState(false);
  const [reading, setReading] = useState(null);

  const drawCard = async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://127.0.0.1:8000/tarot/draw");

      setReading(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to draw tarot card.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-7xl space-y-10">
        <section className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-10 shadow-2xl shadow-violet-500/10 backdrop-blur-xl">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-violet-300">Tarot</p>
            <h1 className="mt-4 text-5xl font-semibold text-white">Tarot Reading</h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400">
              Reveal the whispers of fate with a premium card draw, interpretation, and guidance crafted for your path.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 shadow-lg shadow-slate-950/20">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Your ritual</p>
              <div className="mt-6 space-y-4 text-slate-300">
                <p>1. Tap any card back to draw your tarot card.</p>
                <p>2. Receive an elegant AI-powered meaning and insight.</p>
                <p>3. Explore guidance for the present, challenge, and outcome.</p>
              </div>
              <button
                onClick={drawCard}
                className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-xl shadow-violet-500/20 transition hover:brightness-105"
              >
                Draw your cards
              </button>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-violet-700 via-purple-900 to-slate-950 p-8 text-center shadow-2xl shadow-violet-500/15">
              <p className="text-sm uppercase tracking-[0.35em] text-violet-200">Fate awaits</p>
              <p className="mt-6 text-3xl font-semibold text-white">3-card reading</p>
              <p className="mt-4 text-sm leading-7 text-slate-200">Tap any card back and watch your personal message appear.</p>
            </div>
          </div>
        </section>

        {!reading && !loading && (
          <section className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-xl shadow-slate-950/20">
            <div className="flex flex-col items-center justify-center gap-6 lg:flex-row lg:justify-between">
              <div className="space-y-3 text-center lg:text-left">
                <p className="text-sm uppercase tracking-[0.35em] text-violet-300">Tap a card</p>
                <h2 className="text-3xl font-semibold text-white">Select a card to begin</h2>
                <p className="max-w-xl text-sm leading-7 text-slate-400">Each card holds a different energy. Draw now to receive clarity and insight.</p>
              </div>
              <div className="grid gap-6 sm:grid-cols-3">
                {[1, 2, 3].map((card) => (
                  <button
                    key={card}
                    onClick={drawCard}
                    className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-4 transition duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl"
                  >
                    <img
                      src="/tarot/card_back.png"
                      alt="Tarot Card Back"
                      className="mx-auto h-44 w-full rounded-[1.5rem] object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {loading && (
          <section className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-12 text-center shadow-xl shadow-slate-950/20">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-violet-500/25 bg-slate-950/80">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
            </div>
            <p className="mt-8 text-2xl font-semibold text-white">Drawing your card...</p>
            <p className="mt-3 text-sm text-slate-400">Generating AI interpretation and destiny insights.</p>
          </section>
        )}

        {reading && !loading && (
          <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-violet-500/10">
              <div className="text-center">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Card drawn</p>
                <h2 className="mt-4 text-4xl font-semibold text-white">{reading.card}</h2>
              </div>
              <div className="mt-8">
                <div className="rounded-[1.75rem] bg-slate-950/80 p-6 text-slate-300">
                  <p className="text-xs uppercase tracking-[0.35em] text-violet-300">Meaning</p>
                  <p className="mt-3 text-lg leading-7">{reading.meaning}</p>
                </div>
                
              </div>
              <div className="mt-8 text-center">
                <img
                  src={`/tarot/${reading.image}`}
                  alt={reading.card}
                  className="mx-auto h-96 w-full max-w-md rounded-[2rem] object-contain shadow-2xl shadow-violet-500/20"
                />
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-violet-700 to-cyan-700 p-8 text-white shadow-2xl shadow-cyan-500/20">
              <p className="text-sm uppercase tracking-[0.35em] text-violet-100">AI Interpretation</p>
              <div className="mt-6 space-y-5 text-sm leading-7 text-slate-100">
                <p>{reading.interpretation}</p>
              </div>
              <div className="mt-10 grid gap-3">
                <button
                  onClick={() => setReading(null)}
                  className="inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                >
                  Draw Another Card
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default Tarot;
