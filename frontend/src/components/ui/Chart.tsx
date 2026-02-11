import React from "react";

export type ChartDataKey =
  | "mockRevenue"
  | "mockUsers"
  | "mockOrders"
  | "mockTraffic";

const MOCK_DATA: Record<ChartDataKey, { label: string; value: number }[]> = {
  mockRevenue: [
    { label: "Jan", value: 12 },
    { label: "Feb", value: 19 },
    { label: "Mar", value: 15 },
    { label: "Apr", value: 22 },
  ],
  mockUsers: [
    { label: "Week 1", value: 120 },
    { label: "Week 2", value: 145 },
    { label: "Week 3", value: 138 },
    { label: "Week 4", value: 165 },
  ],
  mockOrders: [
    { label: "Mon", value: 42 },
    { label: "Tue", value: 38 },
    { label: "Wed", value: 55 },
    { label: "Thu", value: 48 },
  ],
  mockTraffic: [
    { label: "Morning", value: 200 },
    { label: "Afternoon", value: 350 },
    { label: "Evening", value: 180 },
  ],
};

export type ChartProps = {
  dataKey: ChartDataKey;
  title?: string;
};

export const Chart: React.FC<ChartProps> = ({ dataKey, title }) => {
  const data = MOCK_DATA[dataKey] ?? MOCK_DATA.mockRevenue;
  const max = Math.max(...data.map((d) => d.value));

  const heightClass = (v: number) => {
    if (!max) return "h-0";
    const pct = v / max;
    if (pct <= 0.25) return "h-6";
    if (pct <= 0.5) return "h-12";
    if (pct <= 0.75) return "h-20";
    return "h-24";
  };

  return (
    <div className="rounded-md border border-gray-200 bg-white p-4">
      {title && <h3 className="mb-3 text-sm font-medium text-gray-900">{title}</h3>}
      <div className="flex h-28 items-end gap-2">
        {data.map((d, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <div className={`w-full rounded-t bg-blue-500 ${heightClass(d.value)}`} />
            <span className="text-xs text-gray-600">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
