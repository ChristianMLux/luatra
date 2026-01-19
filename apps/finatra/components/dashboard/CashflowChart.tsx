"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CashflowChartProps {
    data: { name: string; value: number }[];
}

export default function CashflowChart({ data }: CashflowChartProps) {
    if (!data || data.length === 0) {
        return <div className="h-[300px] flex items-center justify-center text-muted-foreground">No data available</div>;
    }

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                        dataKey="name" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                        stroke="hsl(var(--muted-foreground))"
                    />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: "hsl(var(--background))",
                            borderColor: "hsl(var(--border))",
                            color: "hsl(var(--foreground))",
                            borderRadius: "8px"
                        }}
                        formatter={(value: number | string | Array<number | string> | undefined) => [`$${Number(value || 0).toFixed(2)}`, 'Total']}
                        cursor={{ fill: 'transparent' }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
