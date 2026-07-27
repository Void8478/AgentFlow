/**
 * AgentFlow Design Token System
 * Inspired by Apple, Linear, Raycast, Vercel, and Mission Control.
 */

export const tokens = {
  colors: {
    // Base Canvas & Surfaces
    canvas: {
      base: "#07080a",
      grid: "rgba(255, 255, 255, 0.03)",
      dot: "rgba(255, 255, 255, 0.08)",
    },
    surface: {
      panel: "rgba(15, 17, 23, 0.75)",
      panelHover: "rgba(24, 27, 36, 0.85)",
      overlay: "rgba(6, 7, 9, 0.90)",
      input: "rgba(0, 0, 0, 0.40)",
      cardHeader: "rgba(255, 255, 255, 0.03)",
    },
    // Borders
    border: {
      subtle: "rgba(255, 255, 255, 0.08)",
      interactive: "rgba(255, 255, 255, 0.18)",
      focus: "#6366f1",
      divider: "rgba(255, 255, 255, 0.05)",
    },
    // Text Hierarchy
    text: {
      primary: "#f8fafc",
      secondary: "#94a3b8",
      muted: "#64748b",
      inverse: "#07080a",
      accent: "#6366f1",
    },
    // Node Type Brandings
    nodes: {
      agent: {
        primary: "#6366f1",
        bg: "rgba(99, 102, 241, 0.12)",
        border: "rgba(99, 102, 241, 0.30)",
        glow: "rgba(99, 102, 241, 0.25)",
      },
      tool: {
        primary: "#10b981",
        bg: "rgba(16, 185, 129, 0.12)",
        border: "rgba(16, 185, 129, 0.30)",
        glow: "rgba(16, 185, 129, 0.25)",
      },
      input: {
        primary: "#8b5cf6",
        bg: "rgba(139, 92, 246, 0.12)",
        border: "rgba(139, 92, 246, 0.30)",
        glow: "rgba(139, 92, 246, 0.25)",
      },
      output: {
        primary: "#f59e0b",
        bg: "rgba(245, 158, 11, 0.12)",
        border: "rgba(245, 158, 11, 0.30)",
        glow: "rgba(245, 158, 11, 0.25)",
      },
      router: {
        primary: "#ec4899",
        bg: "rgba(236, 72, 153, 0.12)",
        border: "rgba(236, 72, 153, 0.30)",
        glow: "rgba(236, 72, 153, 0.25)",
      },
    },
    // Execution Status Tokens
    status: {
      idle: {
        color: "#64748b",
        bg: "rgba(100, 116, 139, 0.10)",
        border: "rgba(100, 116, 139, 0.20)",
        label: "Ready",
      },
      running: {
        color: "#f59e0b",
        bg: "rgba(245, 158, 11, 0.15)",
        border: "rgba(245, 158, 11, 0.35)",
        label: "Executing...",
      },
      completed: {
        color: "#10b981",
        bg: "rgba(16, 185, 129, 0.15)",
        border: "rgba(16, 185, 129, 0.35)",
        label: "Completed",
      },
      failed: {
        color: "#f43f5e",
        bg: "rgba(244, 63, 94, 0.15)",
        border: "rgba(244, 63, 94, 0.35)",
        label: "Failed",
      },
    },
  },

  typography: {
    fontSans:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontMono:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    sizes: {
      display: { fontSize: "24px", lineHeight: "32px", letterSpacing: "-0.02em" },
      section: { fontSize: "16px", lineHeight: "24px", letterSpacing: "-0.01em" },
      body: { fontSize: "14px", lineHeight: "20px", letterSpacing: "0em" },
      small: { fontSize: "12px", lineHeight: "16px", letterSpacing: "0em" },
      caption: { fontSize: "11px", lineHeight: "14px", letterSpacing: "0.01em" },
      code: { fontSize: "11px", lineHeight: "16px", letterSpacing: "0em" },
    },
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  shadows: {
    glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
    modal: "0 20px 50px rgba(0, 0, 0, 0.75)",
    glowIndigo: "0 0 20px rgba(99, 102, 241, 0.35)",
    glowEmerald: "0 0 20px rgba(16, 185, 129, 0.35)",
    glowAmber: "0 0 20px rgba(245, 158, 11, 0.35)",
    glowRose: "0 0 20px rgba(244, 63, 94, 0.35)",
  },

  radii: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    full: "9999px",
  },

  spacing: {
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    5: "20px",
    6: "24px",
    8: "32px",
    10: "40px",
    12: "48px",
  },

  motion: {
    fast: "150ms cubic-bezier(0.16, 1, 0.3, 1)",
    spring: "250ms cubic-bezier(0.34, 1.56, 0.64, 1)",
    slow: "350ms cubic-bezier(0.16, 1, 0.3, 1)",
  },
} as const;

export type NodeCategory = keyof typeof tokens.colors.nodes;
export type ExecutionStatus = keyof typeof tokens.colors.status;

export function getNodeTheme(type: NodeCategory) {
  return tokens.colors.nodes[type] || tokens.colors.nodes.agent;
}

export function getStatusTheme(status: ExecutionStatus) {
  return tokens.colors.status[status] || tokens.colors.status.idle;
}
