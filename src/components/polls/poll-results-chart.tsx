"use client";

import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface ChartDataPoint {
    name: string;
    votes: number;
    percentage: number;
}

interface PollResultsChartProps {
    data: ChartDataPoint[];
}

export default function PollResultsChart({ data }: PollResultsChartProps) {
    return (
        <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        fontSize={12}
                    />
                    <YAxis />
                    <Tooltip
                        formatter={(value: number, name: string) => [
                            `${value} votes (${data.find((d) => d.votes === value)?.percentage.toFixed(1)
                            }%)`,
                            name,
                        ]}
                    />
                    <Bar dataKey="votes" fill="#d64575" radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
