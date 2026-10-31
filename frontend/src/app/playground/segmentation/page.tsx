"use client";

import SegmentationPlayground from "@/components/playground/SegmentationPlayground";
import { ToolWorkspaceLayout } from "@/components/playground/ToolWorkspaceLayout";

export default function SegmentationGamePage() {
  return (
    <ToolWorkspaceLayout
      title="Thresholding & Region Growing Segmentation"
      description="Adjust an intensity threshold or choose a seed point to explore connected image regions."
      href="/playground/segmentation"
    >
        <SegmentationPlayground />
    </ToolWorkspaceLayout>
  );
}
