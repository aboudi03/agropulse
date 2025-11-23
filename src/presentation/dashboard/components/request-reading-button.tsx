"use client";

interface RequestReadingButtonProps {
  isLoading: boolean;
  onClick: () => Promise<void> | void;
}

export const RequestReadingButton = ({ isLoading, onClick }: RequestReadingButtonProps) => {
  return (
    <button
      type="button"
      onClick={() => void onClick()}
      disabled={isLoading}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300"
    >
      {isLoading ? (
        <>
          <span className="h-2 w-2 animate-ping rounded-full bg-white" />
          Sending request...
        </>
      ) : (
        <>Request fresh reading</>
      )}
    </button>
  );
};
