"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import InviteModal from "./inviteModel";
import { useWorkspace } from "@/context/WorkspaceContext";

export default function Invitesend() {
  const [showModal, setShowModal] = useState(false);
  const { activeWorkspace } = useWorkspace();

  if (!activeWorkspace) return null;

  return (
    <>
      <Button className="bg-black text-white" onClick={() => setShowModal(true)}>
        Invite
      </Button>

      <InviteModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        workspaceId={activeWorkspace.id}
        workspaceName={activeWorkspace.name}
      />
    </>
  );
}