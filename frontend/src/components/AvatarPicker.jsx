import { useMemo, useState } from "react";

import female1 from "../avatars/female-1.avif";
import female2 from "../avatars/female-2.webp";
import female3 from "../avatars/female-3.webp";
import female4 from "../avatars/female-4.avif";

import male1 from "../avatars/male-1.avif";
import male2 from "../avatars/male-2.avif";
import male3 from "../avatars/male-3.webp";
import male4 from "../avatars/male-4.avif";

const avatarOptions = [
  {
    id: "female-1",
    label: "Female avatar 1",
    group: "Female",
    image: female1,
  },
  {
    id: "female-2",
    label: "Female avatar 2",
    group: "Female",
    image: female2,
  },
  {
    id: "female-3",
    label: "Female avatar 3",
    group: "Female",
    image: female3,
  },
  {
    id: "female-4",
    label: "Female avatar 4",
    group: "Female",
    image: female4,
  },
  {
    id: "male-1",
    label: "Male avatar 1",
    group: "Male",
    image: male1,
  },
  {
    id: "male-2",
    label: "Male avatar 2",
    group: "Male",
    image: male2,
  },
  {
    id: "male-3",
    label: "Male avatar 3",
    group: "Male",
    image: male3,
  },
  {
    id: "male-4",
    label: "Male avatar 4",
    group: "Male",
    image: male4,
  },
];

function AvatarPicker({ value, onSelect, compact = false }) {
  const [open, setOpen] = useState(false);

  const selectedAvatar = useMemo(
    () =>
      avatarOptions.find((item) => item.id === value) ||
      avatarOptions[0],
    [value]
  );

  const handleSelect = (avatarId) => {
    if (onSelect) {
      onSelect(avatarId);
    }

    setOpen(false);
  };

  return (
    <div className="space-y-3">

      {/* CURRENT AVATAR */}
      <div className="flex items-center gap-3">

        <img
          src={selectedAvatar.image}
          alt={selectedAvatar.label}
          className={`rounded-full border border-slate-200 bg-white object-cover shadow-sm ${
            compact ? "h-12 w-12" : "h-16 w-16"
          }`}
        />

        {!compact && (
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              {selectedAvatar.label}
            </p>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Choose a profile avatar
            </p>
          </div>
        )}
      </div>

      {/* CHANGE BUTTON */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-violet-300/60 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-violet-400 hover:bg-violet-500/10 dark:border-white/10 dark:bg-slate-950 dark:text-slate-100"
      >
        Change avatar
      </button>

      {/* AVATAR MODAL */}
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 p-4">

          <div className="w-full max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-slate-900">

            {/* HEADER */}
            <div className="flex items-center justify-between gap-4">

              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-violet-600 dark:text-violet-300">
                  Profile avatar
                </p>

                <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Choose your avatar
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 dark:border-white/10 dark:text-slate-300"
              >
                Close
              </button>

            </div>

            {/* AVATAR GRID */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {avatarOptions.map((avatar) => {

                const isSelected = avatar.id === value;

                return (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => handleSelect(avatar.id)}
                    className={`flex flex-col items-center rounded-[1.5rem] border p-4 text-center transition ${
                      isSelected
                        ? "border-violet-400 bg-violet-500/10 shadow-sm"
                        : "border-slate-200 bg-slate-50/80 hover:border-violet-300 dark:border-white/10 dark:bg-slate-950/60"
                    }`}
                  >

                    <img
                      src={avatar.image}
                      alt={avatar.label}
                      className="h-20 w-20 rounded-full border border-slate-200 object-cover"
                    />

                    <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {avatar.label}
                    </p>

                    <p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                      {avatar.group}
                    </p>

                  </button>
                );

              })}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default AvatarPicker;