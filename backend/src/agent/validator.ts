/**
 * VALIDATION LAYER
 * Validates plan JSON before rendering:
 * - Schema check
 * - Whitelisted component names
 * - Props match allowed schema
 * - Reject unknown fields, inline styles
 */

import type { StructuredPlan, PlanComponent } from "../types.js";

const ALLOWED_COMPONENTS = new Set([
  "Button",
  "Card",
  "Input",
  "Table",
  "Modal",
  "Sidebar",
  "Navbar",
  "Chart",
]);

const ALLOWED_PROPS: Record<string, Set<string>> = {
  Button: new Set(["variant", "label", "onClick", "type", "disabled"]),
  Card: new Set(["title", "description", "children"]),
  Input: new Set(["label", "placeholder", "value", "type", "disabled", "onChange"]),
  Table: new Set(["columns", "rows"]),
  Modal: new Set(["title", "open", "onClose", "children"]),
  Sidebar: new Set(["title", "items", "children"]),
  Navbar: new Set(["title", "subtitle"]),
  Chart: new Set(["dataKey", "title"]),
};

const ALLOWED_LAYOUTS = new Set(["sidebar-main", "centered", "full-width"]);
const FORBIDDEN_FIELDS = new Set(["style", "className", "class"]);
const FORBIDDEN_PROPS = new Set(["style", "className", "class"]);

export type ValidationError = {
  path: string;
  message: string;
};

export type ValidationResult =
  | { valid: true; plan: StructuredPlan }
  | { valid: false; errors: ValidationError[] };

function validateComponent(comp: unknown, path: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!comp || typeof comp !== "object") {
    errors.push({ path, message: "Component must be an object" });
    return errors;
  }

  const obj = comp as Record<string, unknown>;
  const type = obj.type;

  if (typeof type !== "string") {
    errors.push({ path, message: "Component must have 'type' string" });
    return errors;
  }

  if (!ALLOWED_COMPONENTS.has(type)) {
    errors.push({ path, message: `Unknown component: ${type}` });
    return errors;
  }

  const allowed = ALLOWED_PROPS[type];
  const props = obj.props;
  if (props !== undefined && props !== null) {
    if (typeof props !== "object") {
      errors.push({ path: `${path}.props`, message: "Props must be an object" });
    } else {
      for (const key of Object.keys(props as Record<string, unknown>)) {
        if (FORBIDDEN_PROPS.has(key)) {
          errors.push({ path: `${path}.props.${key}`, message: "Inline styles / className not allowed" });
        }
        if (!allowed.has(key)) {
          errors.push({ path: `${path}.props.${key}`, message: `Unknown prop: ${key}` });
        }
      }
    }
  }

  const children = obj.children;
  if (children !== undefined) {
    if (!Array.isArray(children)) {
      errors.push({ path: `${path}.children`, message: "Children must be array" });
    } else {
      (children as unknown[]).forEach((c, i) => {
        errors.push(...validateComponent(c, `${path}.children[${i}]`));
      });
    }
  }

  return errors;
}

export function validatePlan(candidate: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (!candidate || typeof candidate !== "object") {
    return { valid: false, errors: [{ path: "", message: "Plan must be an object" }] };
  }

  const obj = candidate as Record<string, unknown>;

  for (const key of Object.keys(obj)) {
    if (FORBIDDEN_FIELDS.has(key)) {
      errors.push({ path: key, message: "Inline styles / className not allowed" });
    }
  }

  const layout = obj.layout;
  if (typeof layout !== "string" || !ALLOWED_LAYOUTS.has(layout)) {
    errors.push({ path: "layout", message: "layout must be sidebar-main, centered, or full-width" });
  }

  const components = obj.components;
  if (!Array.isArray(components)) {
    errors.push({ path: "components", message: "components must be an array" });
  } else {
    components.forEach((c, i) => {
      errors.push(...validateComponent(c, `components[${i}]`));
    });
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, plan: candidate as StructuredPlan };
}
