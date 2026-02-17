"use client";

import { useState } from "react";
import { Smile, ImageIcon, X, Check } from "lucide-react";
import Image from "next/image";
import { createPortal } from "react-dom";

const EMOJI_LIST = [
  "📝","📄","📃","📋","📊","📈","📉","🗒️","🗓️","📅",
  "💡","🔍","🔎","💼","🗂️","📁","📂","🗃️","🗄️","🗑️",
  "✅","☑️","🔔","🔕","⭐","🌟","💫","🎯","🏆","🎖️",
  "🚀","💻","🖥️","🖨️","⌨️","🖱️","💾","💿","📱","📲",
  "🎨","🎭","🎬","🎤","🎵","🎶","📚","📖","📰","🗞️",
  "🌍","🌎","🌏","🌐","🗺️","🧭","🏔️","🌋","🏕️","🏖️",
  "🔧","🔨","⚙️","🔩","🪛","🔑","🗝️","🔐","🔒","🔓",
  "❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💗",
];

const COVER_PRESETS = [
  { id: 1,  label: "Milky Way",       url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&q=80" },
  { id: 2,  label: "Japanese Forest", url: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=1600&q=80" },
  { id: 3,  label: "Desert Dunes",    url: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1600&q=80" },
  { id: 4,  label: "Neon City",       url: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1600&q=80" },
  { id: 5,  label: "Snowy Peaks",     url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80" },
  { id: 6,  label: "Ocean Sunset",    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80" },
  { id: 7,  label: "Autumn Road",     url: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1600&q=80" },
  { id: 8,  label: "Minimal Waves",   url: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1600&q=80" },
  { id: 9,  label: "Purple Nebula",   url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1600&q=80" },
  { id: 10, label: "Green Valley",    url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=80" },
];

interface PageHeaderProps {
  icon: string;
  cover: string;
  onIconChange: (icon: string) => void;
  onCoverChange: (cover: string) => void;
}

export default function PageHeader({
  icon,
  cover,
  onIconChange,
  onCoverChange,
}: PageHeaderProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCoverPicker, setShowCoverPicker] = useState(false);
  const [isHoveringCover, setIsHoveringCover] = useState(false);
  const [hoveredPreset, setHoveredPreset] = useState<number | null>(null);
  const [iconBtnRef, setIconBtnRef] = useState<HTMLDivElement | null>(null);

  const getPickerStyle = () => {
    if (!iconBtnRef) return {};
    const rect = iconBtnRef.getBoundingClientRect();
    return {
      top: rect.bottom + 8,
      left: rect.left,
    };
  };

  return (
    <div className="relative mb-8">
      <div
        className="relative w-full"
        onMouseEnter={() => setIsHoveringCover(true)}
        onMouseLeave={() => setIsHoveringCover(false)}
      >
        {cover ? (
          <div className="relative h-52 w-full overflow-hidden rounded-b-xl">
            <Image
              src={cover}
              alt="Page cover"
              fill
              priority
              sizes="100vw"
              className="object-cover transition-transform duration-500"
              style={{ transform: isHoveringCover ? "scale(1.02)" : "scale(1)" }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            <div
              className="absolute bottom-3 right-3 flex gap-2 transition-opacity duration-200"
              style={{ opacity: isHoveringCover ? 1 : 0 }}
            >
              <button
                onClick={() => setShowCoverPicker(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-black/50 hover:bg-black/70 text-white text-xs font-medium rounded-lg shadow-md transition-colors backdrop-blur-sm"
              >
                <ImageIcon size={12} /> Change cover
              </button>
              <button
                onClick={() => onCoverChange("")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-black/50 hover:bg-black/70 text-white text-xs font-medium rounded-lg shadow-md transition-colors backdrop-blur-sm"
              >
                <X size={12} /> Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="h-10 flex items-center">
            <div
              className="transition-opacity duration-150 px-2"
              style={{ opacity: isHoveringCover ? 1 : 0 }}
            >
              <button
                onClick={() => setShowCoverPicker(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800 text-xs rounded-md transition-colors"
              >
                <ImageIcon size={13} /> Add cover
              </button>
            </div>
          </div>
        )}
      </div>

      <div
        ref={setIconBtnRef}
        className={`relative ${cover ? "-mt-8 ml-8" : "mt-1 ml-2"} w-fit`}
      >
        {icon ? (
          <div className="relative group/icon">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-5xl leading-none hover:opacity-80 transition-opacity cursor-pointer select-none drop-shadow-sm"
              title="Change icon"
            >
              {icon}
            </button>
            <button
              onClick={() => {
                onIconChange("");
                setShowEmojiPicker(false);
              }}
              className="absolute -top-1 -right-1 opacity-0 group-hover/icon:opacity-100 w-4 h-4 bg-zinc-600 hover:bg-zinc-500 text-white rounded-full flex items-center justify-center transition-all shadow"
            >
              <X size={9} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs rounded-md transition-colors"
          >
            <Smile size={13} /> Add icon
          </button>
        )}
      </div>

      {showEmojiPicker && typeof window !== "undefined" && createPortal(
        <>
          <div
            className="fixed inset-0 z-100"
            onClick={() => setShowEmojiPicker(false)}
          />
          <div
            className="fixed z-[101] w-72 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-2xl p-3"
            style={getPickerStyle()}
            onMouseDown={(e) => e.preventDefault()}
          >
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2 font-medium px-1">
              Choose an icon
            </p>
            <div className="grid grid-cols-8 gap-0.5 max-h-52 overflow-y-auto">
              {EMOJI_LIST.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    onIconChange(emoji);
                    setShowEmojiPicker(false);
                  }}
                  className="text-xl w-8 h-8 flex items-center justify-center rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
            {icon && (
              <button
                onClick={() => {
                  onIconChange("");
                  setShowEmojiPicker(false);
                }}
                className="mt-2 w-full text-xs text-zinc-500 dark:text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 py-1.5 rounded-md transition-colors"
              >
                Remove icon
              </button>
            )}
          </div>
        </>,
        document.body
      )}

      {showCoverPicker && typeof window !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowCoverPicker(false)}
        >
          <div
            className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700 w-full max-w-lg mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                  Pick a cover
                </h3>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                  {COVER_PRESETS.length} curated photos
                </p>
              </div>
              <button
                onClick={() => setShowCoverPicker(false)}
                className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X size={16} className="text-zinc-400 dark:text-zinc-500" />
              </button>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                {COVER_PRESETS.map((preset) => {
                  const isSelected = cover === preset.url;
                  const isHovered = hoveredPreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => {
                        onCoverChange(preset.url);
                        setShowCoverPicker(false);
                      }}
                      onMouseEnter={() => setHoveredPreset(preset.id)}
                      onMouseLeave={() => setHoveredPreset(null)}
                      className={`
                        relative aspect-video rounded-xl overflow-hidden transition-all duration-200
                        ${isSelected
                          ? "ring-2 ring-blue-500 shadow-lg scale-[1.02]"
                          : "hover:scale-[1.02] hover:shadow-md ring-1 ring-zinc-200 dark:ring-zinc-700"
                        }
                      `}
                    >
                      <Image
                        src={preset.url}
                        alt={preset.label}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                        loading="lazy"
                      />
                      <div
                        className="absolute inset-0 bg-black transition-opacity duration-200"
                        style={{ opacity: isSelected ? 0.2 : isHovered ? 0.1 : 0 }}
                      />
                      <div
                        className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2.5 pb-2 pt-6 transition-opacity duration-200"
                        style={{ opacity: isHovered || isSelected ? 1 : 0 }}
                      >
                        <span className="text-white text-xs font-medium drop-shadow">
                          {preset.label}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
                          <Check size={11} className="text-blue-600" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {cover && (
              <div className="px-5 pb-4 pt-1 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={() => {
                    onCoverChange("");
                    setShowCoverPicker(false);
                  }}
                  className="w-full py-2 text-xs text-zinc-400 dark:text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  Remove current cover
                </button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}