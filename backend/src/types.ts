/**
 * Structured plan output from the Planner agent.
 * AI may ONLY use components and props defined here.
 */
export type PlanComponent = {
  type: "Button" | "Card" | "Input" | "Table" | "Modal" | "Sidebar" | "Navbar" | "Chart";
  props: Record<string, unknown>;
  children?: PlanComponent[];
};

export type StructuredPlan = {
  layout: "sidebar-main" | "centered" | "full-width";
  components: PlanComponent[];
};
