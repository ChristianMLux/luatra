"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface AllocationChartProps {
    data: { name: string; value: number }[];
}

export default function AllocationChart({ data }: AllocationChartProps) {
    if (!data || data.length === 0) {
        return <div className="h-[300px] flex items-center justify-center text-muted-foreground">No data available</div>;
    }

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="hsl(var(--background))" strokeWidth={2} />
                        ))}
                    </Pie>
                    <Tooltip 
                         contentStyle={{ 
                            backgroundColor: "hsl(var(--background))",
                            borderColor: "hsl(var(--border))",
                            color: "hsl(var(--foreground))",
                            borderRadius: "8px"
                        }}
                        formatter={(value: number | string | Array<number | string> | undefined) => [`$${Number(value || 0).toFixed(2)}`, 'Amount']}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
