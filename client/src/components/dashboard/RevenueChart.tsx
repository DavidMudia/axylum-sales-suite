import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

type Props = {
  data: {
    month: string;
    revenue: number;
  }[];
};

export default function RevenueChart({
  data,
}: Props) {
  return (
    <ResponsiveContainer
      width="100%"
      height={300}
    >
      <AreaChart data={data}>

        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="month" />

        <Tooltip
          formatter={(value) =>
            `₦${Number(value).toLocaleString()}`
          }
        />

        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#2563eb"
          fill="#3b82f6"
          fillOpacity={0.15}
        />

      </AreaChart>
    </ResponsiveContainer>
  );
}