"use client";

import DicomExplorerPlayground from "@/components/playground/DicomExplorerPlayground";
import { ToolWorkspaceLayout } from "@/components/playground/ToolWorkspaceLayout";

export default function DicomGamePage() {
  return (
    <ToolWorkspaceLayout
      title="DICOM Explorer"
      description="Load and navigate local DICOM images, then inspect the metadata and pixel values used to display each slice."
      href="/playground/dicom"
    >
        <DicomExplorerPlayground />
    </ToolWorkspaceLayout>
  );
}
