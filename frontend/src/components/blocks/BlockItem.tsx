/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Block, BlockType } from "@/types/block.type";
import { updateBlock } from "@/lib/block.api";
import { MoreHorizontal, Trash, Type, ListTodo, Code, Heading1, Heading2 } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

interface BlockItemProps {
  block: Block;
  pageId: number;
  onUpdate: () => void;
  onDelete: (blockId: number) => void;
  onCreateBelow: (position: number) => void;
  isLast: boolean;
  isFirst: boolean;
  optimisticUpdate: (blockId: number, updates: Partial<Block>) => void;
}

export default function BlockItem({ 
  block, 
  pageId, 
  onUpdate, 
  onDelete,
  onCreateBelow,
  isLast,
  isFirst,
  optimisticUpdate
}: BlockItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(block.content.text || "");
  const [showMenu, setShowMenu] = useState(false);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [currentType, setCurrentType] = useState(block.type);
  const [currentContent, setCurrentContent] = useState(block.content);

  // --- FIX 1: Auto-resize textarea helper ---
  const autoResize = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  useEffect(() => {
    if (isLast && !block.content.text) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsEditing(true);
    }
  }, [isLast, block.content.text]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // Place cursor at end
      const len = inputRef.current.value.length;
      inputRef.current.setSelectionRange(len, len);
      // Trigger resize after focus
      autoResize();
    }
  }, [isEditing, autoResize]);

  // Re-sync when block prop changes externally
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setContent(block.content.text || "");
    setCurrentType(block.type);
    setCurrentContent(block.content);
  }, [block.content, block.type, block.id]);

  // Resize whenever content changes
  useEffect(() => {
    if (isEditing) autoResize();
  }, [content, isEditing, autoResize]);

  const handleSave = async () => {
    if (showSlashMenu) {
      setIsEditing(false);
      return;
    }

    if (content === block.content.text) {
      setIsEditing(false);
      return;
    }

    const newContent = { ...currentContent, text: content };

    optimisticUpdate(block.id, { content: newContent });
    setCurrentContent(newContent);
    setIsEditing(false);

    if (block.id < 0) return;

    try {
      await updateBlock(pageId, block.id, newContent);
    } catch {
      optimisticUpdate(block.id, { content: block.content });
      setCurrentContent(block.content);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === "/" && content === "") {
      e.preventDefault();
      setContent("/");
      setShowSlashMenu(true);
      return;
    }

    if (e.key === "Backspace" && content === "/" && showSlashMenu) {
      e.preventDefault();
      setShowSlashMenu(false);
      setContent("");
      return;
    }

    if (e.key === "Escape" && showSlashMenu) {
      e.preventDefault();
      setShowSlashMenu(false);
      setContent("");
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (showSlashMenu) {
        setShowSlashMenu(false);
        setContent("");
        return;
      }
      await handleSave();
      // --- FIX 4: pass correct next position ---
      onCreateBelow(block.position + 1);
      return;
    }

    if (e.key === "Escape") {
      setContent(block.content.text || "");
      setIsEditing(false);
      setShowSlashMenu(false);
      return;
    }

    // Only delete block on backspace if content is truly empty
    if (e.key === "Backspace" && content === "" && block.position > 0) {
      e.preventDefault();
      onDelete(block.id);
      return;
    }
  };

  const handleConvertType = async (newType: BlockType) => {
    const textContent = content.replace("/", "").trim();

    let newContent: any = {
      ...currentContent,
      text: textContent
    };

    switch (newType) {
      case BlockType.TODO:
        newContent.checked = false;
        delete newContent.code;
        break;
      case BlockType.CODE:
        newContent.code = textContent;
        delete newContent.checked;
        break;
      default:
        delete newContent.checked;
        delete newContent.code;
        break;
    }

    setCurrentType(newType);
    setCurrentContent(newContent);
    setContent(textContent);
    setShowSlashMenu(false);
    setIsEditing(false);

    optimisticUpdate(block.id, { 
      type: newType, 
      content: newContent
    });

    if (block.id < 0) return;

    try {
      await updateBlock(pageId, block.id, newContent, newType);
    } catch {
      setCurrentType(block.type);
      setCurrentContent(block.content);
      setContent(block.content.text || "");
      optimisticUpdate(block.id, { 
        type: block.type,
        content: block.content
      });
    }
  };

  const handleCheckboxChange = async (checked: boolean) => {
    const newContent = { ...currentContent, checked };
    
    setCurrentContent(newContent);
    optimisticUpdate(block.id, { content: newContent });

    if (block.id < 0) return;

    try {
      await updateBlock(pageId, block.id, newContent);
    } catch {
      const revertContent = { ...currentContent, checked: !checked };
      setCurrentContent(revertContent);
      optimisticUpdate(block.id, { content: revertContent });
    }
  };

  const blockTypeOptions = [
    { type: BlockType.PARAGRAPH, icon: Type, label: "Text", description: "Just start writing with plain text" },
    { type: BlockType.HEADING_1, icon: Heading1, label: "Heading 1", description: "Big section heading" },
    { type: BlockType.HEADING_2, icon: Heading2, label: "Heading 2", description: "Medium section heading" },
    { type: BlockType.TODO, icon: ListTodo, label: "To-do list", description: "Track tasks with a checkbox" },
    { type: BlockType.CODE, icon: Code, label: "Code", description: "Capture a code snippet" },
  ];

  // --- FIX 3: Effective type — first block always renders as Heading 1 ---
  const effectiveType = isFirst ? BlockType.HEADING_1 : currentType;

  const getPlaceholder = () => {
    if (isFirst) return "Untitled";
    return "Type '/' for commands...";
  };

  // --- FIX 1: Shared textarea with proper auto-resize ---
  const renderTextarea = () => (
    <>
      <textarea
        ref={inputRef}
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
        }}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`
          w-full bg-transparent outline-none resize-none overflow-hidden
          leading-snug
          ${isFirst
            ? "text-3xl font-bold text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-300 dark:placeholder:text-zinc-600 min-h-10"
            : effectiveType === BlockType.HEADING_2
              ? "text-2xl font-semibold text-zinc-900 dark:text-zinc-100 min-h-8"
              : effectiveType === BlockType.CODE
                ? "font-mono text-sm text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-900 p-3 rounded-md min-h-7"
                : "text-zinc-900 dark:text-zinc-100 min-h-7"
          }
        `}
        placeholder={getPlaceholder()}
        rows={1}
        // height managed purely by autoResize; no inline onInput needed
      />

      {showSlashMenu && (
        <div 
          className="fixed z-50 mt-1 w-72 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl overflow-hidden"
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="p-1">
            {blockTypeOptions.map((option) => (
              <button
                key={option.type}
                onClick={() => handleConvertType(option.type)}
                className="w-full flex items-start gap-3 px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors text-left"
              >
                <option.icon size={18} className="text-zinc-500 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {option.label}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {option.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );

  const renderBlock = () => {
    if (isEditing) return renderTextarea();

    const displayContent = currentContent.text || "";

    // First block always shows as Heading 1
    if (isFirst) {
      return (
        <h1
          className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 cursor-text py-1 min-h-10"
          onClick={() => setIsEditing(true)}
        >
          {displayContent || <span className="text-zinc-300 dark:text-zinc-600 font-bold">Untitled</span>}
        </h1>
      );
    }

    switch (effectiveType) {
      case BlockType.HEADING_1:
        return (
          <h1
            className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 cursor-text py-1"
            onClick={() => setIsEditing(true)}
          >
            {displayContent}
          </h1>
        );
      case BlockType.HEADING_2:
        return (
          <h2
            className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 cursor-text py-1"
            onClick={() => setIsEditing(true)}
          >
            {displayContent}
          </h2>
        );
      case BlockType.TODO:
        return (
          <div className="flex items-start gap-2 py-1">
            <input
              type="checkbox"
              checked={currentContent.checked || false}
              onChange={(e) => {
                e.stopPropagation();
                handleCheckboxChange(e.target.checked);
              }}
              className="mt-1.5 cursor-pointer"
            />
            <span
              className={`cursor-text flex-1 ${currentContent.checked ? "line-through text-zinc-400" : "text-zinc-900 dark:text-zinc-100"}`}
              onClick={() => setIsEditing(true)}
            >
              {displayContent}
            </span>
          </div>
        );
      case BlockType.CODE:
        return (
          <pre
            className="bg-zinc-100 dark:bg-zinc-900 p-3 rounded-md font-mono text-sm cursor-text my-1"
            onClick={() => setIsEditing(true)}
          >
            <code className="text-zinc-900 dark:text-zinc-100">{displayContent}</code>
          </pre>
        );
      default:
        return (
          <p
            className="text-zinc-900 dark:text-zinc-100 cursor-text min-h-7 py-0.5"
            onClick={() => setIsEditing(true)}
          >
            {displayContent}
          </p>
        );
    }
  };

  return (
    <div
      ref={containerRef}
      className="group relative py-1 px-2 -mx-2 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 rounded transition-colors"
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}
    >
      <div className={`absolute -left-7 top-2 transition-opacity ${showMenu && !isFirst ? "opacity-100" : "opacity-0"}`}>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded">
              <MoreHorizontal size={16} className="text-zinc-400" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md shadow-lg p-1 z-50"
              sideOffset={5}
            >
              <DropdownMenu.Label className="px-2 py-1.5 text-xs text-zinc-500 font-medium">
                Turn into
              </DropdownMenu.Label>

              {blockTypeOptions.map((option) => (
                <DropdownMenu.Item
                  key={option.type}
                  onSelect={() => handleConvertType(option.type)}
                  className="flex items-center gap-2 px-2 py-1.5 text-sm outline-none cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
                >
                  <option.icon size={14} /> {option.label}
                </DropdownMenu.Item>
              ))}

              <DropdownMenu.Separator className="h-px bg-zinc-200 dark:bg-zinc-800 my-1" />

              <DropdownMenu.Item
                onSelect={() => onDelete(block.id)}
                className="flex items-center gap-2 px-2 py-1.5 text-sm outline-none cursor-pointer hover:bg-red-50 text-red-600 rounded"
              >
                <Trash size={14} /> Delete
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      {renderBlock()}
    </div>
  );
}