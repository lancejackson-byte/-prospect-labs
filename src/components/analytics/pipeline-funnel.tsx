"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { PipelineStageData } from "@/lib/analytics/types";

interface PipelineFunnelProps {
  data: PipelineStageData[];
}

export function PipelineFunnel({ data }: PipelineFunnelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Pipeline by Stage</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 20, bottom: 60, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              interval={0}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar
              dataKey="count"
              name="Deals"
              radius={[4, 4, 0, 0]}
            >
              {data.map((entry, index) => (
                <rect key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
