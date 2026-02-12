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

const STRING_PROPS = new Set(["title", "description", "label", "subtitle", "placeholder", "value"]);

function sanitizeProps(
  props: Record<string, unknown>,
  compType: string
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if (EVENT_HANDLER_PROPS.has(key) && typeof value !== "function") {
      continue;
    }
    if (STRING_PROPS.has(key)) {
      out[key] = typeof value === "string" || typeof value === "number" ? value : value ? String(value) : "";
      continue;
    }
    if (key === "children") {
      continue;
    }
    if (key === "columns") {
      out[key] = Array.isArray(value)
        ? value.map((c) =>
            typeof c === "object" && c && "key" in c && "header" in c
              ? { key: String(c.key), header: String(c.header) }
              : { key: "", header: "" }
          )
        : [];
      continue;
    }
    if (key === "rows") {
      out[key] = Array.isArray(value)
        ? value.map((r) => {
            if (typeof r !== "object" || !r) return {};
            const row: Record<string, string | number> = {};
            for (const [k, v] of Object.entries(r)) {
              row[k] = typeof v === "string" || typeof v === "number" ? v : String(v);
            }
            return row;
          })
        : [];
      continue;
    }
    if (key === "items") {
      out[key] = Array.isArray(value)
        ? value.map((item) =>
            typeof item === "object" && item && "label" in item
              ? { ...item, label: String(item.label), id: item.id != null ? String(item.id) : undefined }
              : { label: "" }
          )
        : [];
      continue;
    }
    if (key === "open" && typeof value === "boolean") {
      out[key] = value;
      continue;
    }
    if (key === "type" && (compType === "Button" || compType === "Input")) {
      out[key] = ["button", "submit", "reset", "text", "number", "email", "password"].includes(String(value)) ? value : "button";
      continue;
    }
    if (key === "disabled" && typeof value === "boolean") {
      out[key] = value;
      continue;
    }
    if (key === "variant" && value === "primary") {
      out[key] = "primary";
      continue;
    }
    if (key === "variant" && value === "secondary") {
      out[key] = "secondary";
      continue;
    }
    if (key === "dataKey" && typeof value === "string") {
      const valid = ["mockRevenue", "mockUsers", "mockOrders", "mockTraffic"];
      out[key] = valid.includes(value) ? value : "mockRevenue";
      continue;
    }
    out[key] = value;
  }
  if (compType === "Table") {
    if (!Array.isArray(out.columns)) out.columns = [];
    if (!Array.isArray(out.rows)) out.rows = [];
  }
  if (compType === "Sidebar") {
    if (!Array.isArray(out.items)) out.items = [];
  }
  if (compType === "Modal" && out.open === undefined) {
    out.open = true;
  }
  return out;
}

function renderComponent(comp: PlanComponent): React.ReactNode {
  try {
    const type = String(comp.type);
    const C = COMPONENT_MAP[type as keyof typeof COMPONENT_MAP];
    if (!C) return null;

    const props = sanitizeProps({ ...comp.props } as Record<string, unknown>, type);
    if (comp.children?.length) {
      props.children = comp.children.map((c, i) =>
        React.createElement(React.Fragment, { key: i }, renderComponent(c))
      );
    }

    return React.createElement(C as React.ComponentType<Record<string, unknown>>, props);
  } catch (err) {
    console.warn("Failed to render component:", comp.type, err);
    return null;
  }
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
