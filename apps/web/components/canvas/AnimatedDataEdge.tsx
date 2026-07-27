"use client";

import React, { memo } from "react";
import { BaseEdge, EdgeProps, getBezierPath } from "@xyflow/react";

function AnimatedDataEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      {/* Background edge line */}
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: selected ? "#6366f1" : "#334155",
          strokeWidth: selected ? 2.5 : 1.5,
          opacity: 0.7,
          ...style,
        }}
      />

      {/* Animated streaming particle */}
      <circle r="3" fill="#818cf8" className="hardware-accelerated">
        <animateMotion dur="2.5s" repeatCount="indefinite" path={edgePath} />
      </circle>
    </>
  );
}

// Export memoized edge component
export const AnimatedDataEdge = memo(AnimatedDataEdgeComponent);
