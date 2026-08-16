import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ToastProvider";
import { uploadPalmImage } from "../services/analysisService";

const analysisStages = [
  { label: "Image uploaded", detail: "Your file is ready for analysis." },
  { label: "Palm detection", detail: "The hand is being located in the image." },
  { label: "Landmarks detected", detail: "Key positions are being mapped." },
  { label: "Feature analysis", detail: "Shape and proportions are assessed." },
  { label: "Line analysis", detail: "Palm lines are being interpreted." },
  { label: "Interpretation", detail: "A reading is being composed." },
];

function PalmAnalysis() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  const currentStage = analysisStages[stageIndex] || analysisStages[0];

  const handleFile = (fileItem) => {
    if (fileItem) {
      setFile(fileItem);
      setPreview(URL.createObjectURL(fileItem));
      setProgress(0);
      setStageIndex(0);
      setUploadError(null);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (event.dataTransfer.files?.[0]) {
      handleFile(event.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.notify("Please select an image first.", "error");
      return;
    }

    setUploading(true);
    setStageIndex(0);
    setProgress(0);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);

    const stageTimer = setInterval(() => {
      setStageIndex((current) => {
        if (current < analysisStages.length - 1) {
          return current + 1;
        }
        return current;
      });
    }, 1800);

    try {
      const response = await uploadPalmImage(formData, (progressEvent) => {
        const percentage = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        setProgress(percentage);
      });

      setStageIndex(analysisStages.length - 1);
      setProgress(100);
      clearInterval(stageTimer);
      toast.notify("Analysis complete. Your report is ready.", "success");

      const latestAnalysis = {
        analysis: response.data,
        readingId: response.data.reading_id || null,
      };

      window.localStorage.setItem("latestAnalysis", JSON.stringify(latestAnalysis));
      navigate("/results", { state: latestAnalysis });
    } catch (error) {
      clearInterval(stageTimer);
      setUploading(false);
      const message = error?.response?.data?.detail || error?.message || "Unable to upload image.";
      setUploadError(message);
      toast.notify(message, "error");
    } finally {
      setUploading(false);
    }
  };

  const previewImage = useMemo(() => preview, [preview]);

  return (
    <div className="min-h-[calc(100vh-72px)] bg-white px-4 py-10 text-slate-800 transition-colors duration-300 sm:px-6 lg:px-8 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white/80 p-8 shadow-xl shadow-slate-100/60 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80 dark:shadow-slate-950/20">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-violet-600 dark:text-violet-300">Palm analysis studio</p>
              <h1 className="mt-3 text-3xl font-semibold">A premium analysis workspace.</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">Upload an image, preview it instantly, and follow the live analysis pipeline from palm detection to interpretation.</p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 px-6 py-4 shadow-sm dark:border-white/10 dark:bg-slate-950/70">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Current stage</p>
              <p className="mt-2 text-lg font-semibold">{currentStage.label}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{currentStage.detail}</p>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <section className="rounded-[2rem] border border-slate-200 bg-white/80 p-8 shadow-xl shadow-slate-100/60 dark:border-white/10 dark:bg-slate-900/90">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="group relative rounded-[2rem] border-2 border-dashed border-violet-400/40 bg-slate-50/80 p-10 text-center transition duration-300 hover:border-violet-500 hover:bg-violet-500/5 dark:bg-slate-950/70"
            >
              <div className="pointer-events-none absolute inset-x-0 top-6 mx-auto h-14 w-14 rounded-full bg-violet-500/20 blur-2xl" />
              <p className="relative text-sm uppercase tracking-[0.35em] text-violet-600 dark:text-violet-300">Drag & drop</p>
              <p className="relative mt-4 text-2xl font-semibold">Drop your palm image here</p>
              <p className="relative mt-3 text-sm text-slate-600 dark:text-slate-400">Choose a clear photo to begin the reading workflow.</p>
              <label className="mt-8 inline-flex cursor-pointer items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-800 transition hover:border-violet-400 hover:bg-violet-500/10 dark:border-white/10 dark:bg-slate-900 dark:text-white">
                <input type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0])} className="hidden" />
                {file ? file.name : "Select image"}
              </label>
            </div>

            <div className="mt-8 space-y-6">
              <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-6 shadow-sm dark:border-white/10 dark:bg-slate-950/80">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Upload progress</p>
                    <p className="mt-2 text-xl font-semibold">{progress}%</p>
                  </div>
                  <div className="rounded-full border border-violet-300/50 bg-violet-500/10 px-4 py-2 text-sm text-violet-700 dark:text-violet-200">{uploading ? "Live" : "Ready"}</div>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {analysisStages.map((stage, index) => (
                  <div key={stage.label} className={`rounded-[1.25rem] border px-5 py-4 transition ${index <= stageIndex ? "border-violet-400 bg-violet-500/10 text-slate-900 dark:text-white" : "border-slate-200 bg-white text-slate-500 dark:border-white/10 dark:bg-slate-950 dark:text-slate-400"}`}>
                    <p className="text-sm font-semibold">{stage.label}</p>
                    <p className="mt-1 text-xs leading-5">{stage.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white/80 p-8 shadow-xl shadow-slate-100/60 dark:border-white/10 dark:bg-slate-900/90">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Preview</p>
                <h2 className="mt-3 text-2xl font-semibold">Selected image</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-4 py-2 text-xs uppercase tracking-[0.35em] text-slate-600 dark:bg-slate-950 dark:text-slate-300">{file ? "Image ready" : "Waiting"}</span>
            </div>

            <div className="mt-6 overflow-hidden rounded-[1.75rem] bg-slate-100 p-4 dark:bg-slate-950">
              {previewImage ? (
                <img src={previewImage} alt="Palm preview" className="h-96 w-full rounded-[1.5rem] object-cover" />
              ) : (
                <div className="flex h-96 items-center justify-center rounded-[1.5rem] bg-white/70 text-center text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                  <div>
                    <p className="text-lg font-semibold">No preview available</p>
                    <p className="mt-2 text-sm">Upload a palm image to see it here.</p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="mt-8 w-full rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 text-base font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading ? "Analyzing your palm…" : "Upload and analyze"}
            </button>

            {uploadError && (
              <div className="mt-4 rounded-[1.25rem] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-100">
                {uploadError}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default PalmAnalysis;
