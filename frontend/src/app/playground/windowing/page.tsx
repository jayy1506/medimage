"use client";

import WindowLevelPlayground from "@/components/playground/WindowLevelPlayground";
import { ToolWorkspaceLayout } from "@/components/playground/ToolWorkspaceLayout";

export default function WindowingGamePage() {
  return (
    <ToolWorkspaceLayout
      title="Window Width / Level (HU Mapping)"
      description="Adjust the CT display window to focus contrast on tissues within a selected Hounsfield unit range."
      href="/playground/windowing"
    >
        <WindowLevelPlayground />
    </ToolWorkspaceLayout>
  );
}
