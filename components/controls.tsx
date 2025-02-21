"use client";
import toast from "react-hot-toast";

export default function Controls({
  shouldStart,
  setShouldStart,
}: {
  shouldStart: boolean;
  setShouldStart: (shouldStart: boolean) => void;
}) {
  return (
    <div className="flex gap-4 p-4">
      <button
        onClick={() => {
          if (!shouldStart) {
            toast.success("Tracing vulnerabilities...");
          } else {
            toast.error("Stopped tracing vulnerabilities");
          }
          setShouldStart(!shouldStart);
        }}
        className={`px-4 py-2 rounded-md font-medium transition-colors ${
          shouldStart
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-green-500 hover:bg-green-600 text-white"
        }`}
      >
        {shouldStart ? "Stop Fetching" : "Start Fetching"}
      </button>
    </div>
  );
}
