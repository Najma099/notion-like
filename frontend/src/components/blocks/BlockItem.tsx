import { Block } from "@/types/block.type";

export default function BlockItem({ block }: { block: Block }) {
  return (
    <div className="py-1 border-b">
      {block.content.text || "Empty block"}
    </div>
  );
}