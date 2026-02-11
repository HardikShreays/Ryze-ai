import React from "react";
import {
  Button,
  Card,
  Input,
  Table,
  Modal,
  Sidebar,
  Navbar,
  Chart,
} from "@/components/ui";
import type { StructuredPlan, PlanComponent } from "@/lib/types";

const COMPONENT_MAP = {
  Button,
  Card,
  Input,
  Table,
  Modal,
  Sidebar,
  Navbar,
  Chart,
} as const;

const EVENT_HANDLER_PROPS = new Set(["onClick", "onChange", "onClose"]);

function sanitizeProps(props: Record<string, unknown>): Record<string, unknown> {
  const out = { ...props };
  for (const key of EVENT_HANDLER_PROPS) {
    if (key in out && typeof out[key] !== "function") {
      out[key] = undefined;
    }
  }
  return out;
}

function renderComponent(comp: PlanComponent): React.ReactNode {
  const C = COMPONENT_MAP[comp.type as keyof typeof COMPONENT_MAP];
  if (!C) return null;

  const props = sanitizeProps({ ...comp.props } as Record<string, unknown>);
  if (comp.children?.length) {
    props.children = comp.children.map((c, i) =>
      React.createElement(React.Fragment, { key: i }, renderComponent(c))
    );
  }

  return React.createElement(C as React.ComponentType<Record<string, unknown>>, props);
}

export function renderPlan(plan: StructuredPlan): React.ReactNode {
  const sidebarIdx = plan.components.findIndex((c) => c.type === "Sidebar");
  const sidebar = sidebarIdx >= 0 ? renderComponent(plan.components[sidebarIdx]) : null;
  const mainContent = plan.components
    .filter((_, i) => i !== sidebarIdx)
    .map((c, i) => <React.Fragment key={i}>{renderComponent(c)}</React.Fragment>);

  const layoutClass =
    plan.layout === "sidebar-main"
      ? "flex min-h-screen"
      : plan.layout === "centered"
        ? "flex min-h-screen items-center justify-center p-4"
        : "min-h-screen p-4";

  return (
    <div className={layoutClass}>
      {plan.layout === "sidebar-main" ? (
        <>
          {sidebar}
          <main className="flex-1 space-y-4 overflow-auto p-4">{mainContent}</main>
        </>
      ) : (
        <div className="w-full max-w-2xl space-y-4">{mainContent}</div>
      )}
    </div>
  );
}
