export type ValidationError = {
  path: string;
  message: string;
};

export type PlanComponent = {
  type: "Button" | "Card" | "Input" | "Table" | "Modal" | "Sidebar" | "Navbar" | "Chart";
  props: Record<string, unknown>;
  children?: PlanComponent[];
};

export type StructuredPlan = {
  layout: "sidebar-main" | "centered" | "full-width";
  components: PlanComponent[];
};
