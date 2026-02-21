"use client";

import { useState } from "react";
import { X, ChevronDown, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/apiClient";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: number;
  workspaceName: string;
}

export default function InviteModal({
  isOpen,
  onClose,
  workspaceId,
  workspaceName,
}: InviteModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"EDITOR" | "VIEWER">("EDITOR");
  const [isLoading, setIsLoading] = useState(false);
  const [justSent, setJustSent] = useState(false);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiClient.post(`/workspace-invites/${workspaceId}/send`, {
        email,
        role,
      });

      setJustSent(true);
      toast.success(`Invitation sent to ${email}`);

      setTimeout(() => {
        setEmail("");
        setJustSent(false);
      }, 2000);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to send invitation";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setRole("EDITOR");
    setJustSent(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      onClick={handleClose}
    >
      <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />

      <div
        className="relative w-full max-w-115 bg-white dark:bg-[#1f1f1f] rounded-lg shadow-[0_4px_24px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.5)] border border-zinc-200/80 dark:border-zinc-700/60 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
          <span className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300">
            Invite to{" "}
            <span className="text-zinc-900 dark:text-zinc-100 font-semibold">
              {workspaceName}
            </span>
          </span>
          <button
            onClick={handleClose}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X size={14} className="text-zinc-400 dark:text-zinc-500" />
          </button>
        </div>

        <form onSubmit={handleSendInvite} className="p-4 space-y-3">
          <div className="flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Add emails..."
              disabled={justSent}
              className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded text-[13px] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-500 focus:border-zinc-400 transition-all disabled:opacity-50"
            />

            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "EDITOR" | "VIEWER")}
                disabled={justSent}
                className="appearance-none pl-3 pr-7 py-1.5 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded text-[13px] text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all cursor-pointer disabled:opacity-50"
              >
                <option value="EDITOR">Editor</option>
                <option value="VIEWER">Viewer</option>
              </select>
              <ChevronDown
                size={12}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
              />
            </div>
          </div>

          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 px-0.5">
            {role === "EDITOR"
              ? "Editors can view and make changes to pages."
              : "Viewers can read pages but cannot make edits."}
          </p>

          {justSent && (
            <div className="flex items-center gap-2 py-1.5 px-2 bg-zinc-50 dark:bg-zinc-800 rounded text-[12px] text-zinc-500 dark:text-zinc-400">
              <Check size={13} className="text-emerald-500 shrink-0" />
              Invite sent to {email}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={handleClose}
              className="px-3 py-1.5 text-[13px] text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || justSent || !email}
              className="px-3 py-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[13px] font-medium rounded hover:bg-zinc-700 dark:hover:bg-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
            >
              {isLoading ? (
                <Loader2 size={13} className="animate-spin" />
              ) : justSent ? (
                <Check size={13} />
              ) : null}
              {justSent ? "Sent" : "Invite"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}