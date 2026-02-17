"use client";

import { useState, useEffect, useRef } from "react";
import { useBlocks } from "@/hooks/useBlock";
import { usePageDetail } from "@/hooks/usePageDetails";
import { useWorkspace } from "@/context/WorkspaceContext";
import BlockList from "./BlockList";
import PageHeader from "../WorkspacePages/PageHeader";
import { updatePage } from "@/lib/page.api";

export default function BlockEditor({ pageId }: { pageId: number }) {
  const { activeWorkspace } = useWorkspace();
  const { page } = usePageDetail(pageId);

  const {
    blocks,
    loading,
    refetchBlocks,
    optimisticUpdateBlock,
    optimisticDeleteBlock,
    optimisticAddBlock,
    setBlocks,
  } = useBlocks(pageId);

  const [icon, setIcon] = useState("");
  const [cover, setCover] = useState("");

  // Tracks whether we've done the initial sync for the current pageId
  const synced = useRef(false);

  // Reset everything when navigating to a different page
  useEffect(() => {
    synced.current = false;
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIcon("");
    setCover("");
  }, [pageId]);

  // Sync ONCE when page data first arrives — never again after that
  useEffect(() => {
    if (page && !synced.current) {
      console.log("4. Syncing from page:", page.icon);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIcon(page.icon ?? "");
      setCover(page.coverImage ?? "");
      synced.current = true;
    }
  }, [page]);

  if (!activeWorkspace) return null;

  // In BlockEditor — handleIconChange
const handleIconChange = async (newIcon: string) => {
  console.log("1. Icon picked:", newIcon); // should show emoji
  setIcon(newIcon);
  try {
    const result = await updatePage(activeWorkspace.id, pageId, { icon: newIcon });
    console.log("2. API response:", result); // check if icon is in response
  } catch (err) {
    console.log("3. Error:", err);
  }
};

  const handleCoverChange = async (newCover: string) => {
    setCover(newCover); // instant UI
    try {
      await updatePage(activeWorkspace.id, pageId, { coverImage: newCover });
    } catch {
      setCover(cover); // revert on failure
    }
  };

  return (
    <div className="relative">
      <PageHeader
        icon={icon}
        cover={cover}
        onIconChange={handleIconChange}
        onCoverChange={handleCoverChange}
      />

      <div className="mx-auto max-w-[900px] px-24 pb-32">
        <BlockList
          blocks={blocks}
          loading={loading}
          pageId={pageId}
          refetchBlocks={refetchBlocks}
          optimisticUpdateBlock={optimisticUpdateBlock}
          optimisticDeleteBlock={optimisticDeleteBlock}
          optimisticAddBlock={optimisticAddBlock}
          setBlocks={setBlocks}
        />
      </div>
    </div>
  );
}