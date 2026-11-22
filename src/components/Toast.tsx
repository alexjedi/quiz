import { useToast } from "../state/toast";

export function Toast() {
  const toast = useToast();
  if (!toast) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-20 flex justify-center px-4" role="status">
      <div
        key={toast.id}
        className="animate-toast rounded-2xl border-[3px] border-edge bg-accent px-5 py-3 text-base font-black text-accent-ink shadow-[0_5px_0_rgb(0_0_0/0.25)]"
      >
        {toast.text}
      </div>
    </div>
  );
}
