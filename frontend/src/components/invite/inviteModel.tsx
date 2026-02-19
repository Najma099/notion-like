"use client";

import { useState } from "react";
import { X, Mail, Loader2, CheckCircle } from "lucide-react";
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
  const [role, setRole] = useState< "EDITOR" | "VIEWER">("EDITOR");
  const [isLoading, setIsLoading] = useState(false);
  const [justSent, setJustSent] = useState(false);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiClient.post(
        `/workspaces/${workspaceId}/invite`,
        { email, role }
      );

      setJustSent(true);
      toast.success(`Invitation sent to ${email}`);
      
      setTimeout(() => {
        setEmail("");
        setJustSent(false);
      }, 2000);
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to send invitation";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Invite to {workspaceName}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Add members via email
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X size={18} className="text-zinc-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSendInvite} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 ml-0.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@company.com"
              disabled={justSent}
              className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 ml-0.5">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as  "EDITOR" | "VIEWER")}
              disabled={justSent}
              className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-50"
            >
              <option value="VIEWER">Viewer — Can view only</option>
              <option value="EDITOR">Editor — Can edit pages</option>
            </select>
          </div>

          {/* Success message */}
          {justSent && (
            <div className="flex items-center gap-2 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
              <p className="text-sm text-green-700 dark:text-green-300">
                Invitation email sent successfully!
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-medium rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              {justSent ? "Done" : "Cancel"}
            </button>
            <button
              type="submit"
              disabled={isLoading || justSent}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : justSent ? (
                <>
                  <CheckCircle size={16} />
                  Sent
                </>
              ) : (
                <>
                  <Mail size={16} />
                  Send Invite
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}