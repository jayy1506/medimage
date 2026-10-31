"use client";

import SpatialConvolutionPlayground from "@/components/playground/SpatialConvolutionPlayground";
import { ToolWorkspaceLayout } from "@/components/playground/ToolWorkspaceLayout";

export default function ConvolutionGamePage() {
  return (
    <ToolWorkspaceLayout
      title="Spatial 2D Convolution Kernels"
      description="Apply and compare spatial kernels to smooth an image, enhance edges, or reveal fine structures."
      href="/playground/convolution"
    >
        <SpatialConvolutionPlayground />
    </ToolWorkspaceLayout>
  );
}
