"use client";

import FourierPlayground from "@/components/playground/FourierPlayground";
import { ToolWorkspaceLayout } from "@/components/playground/ToolWorkspaceLayout";

export default function FourierGamePage() {
  return (
    <ToolWorkspaceLayout
      title="2D Fourier Transform & Frequency Filters"
      description="Inspect the centered frequency spectrum, adjust a filter response, and view the inverse-transform result."
      href="/playground/fourier"
    >
        <FourierPlayground />
    </ToolWorkspaceLayout>
  );
}
