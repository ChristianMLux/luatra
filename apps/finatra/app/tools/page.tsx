"use client"

import { Card, CardHeader, CardTitle, CardContent, Badge } from "@repo/ui";
import { Bot, Wrench, Calculator, PieChart, Landmark, FileText, PlusCircle } from "lucide-react";

export default function ToolsPage() {
  return (
    <div className="container mx-auto p-6 max-w-5xl space-y-8">
      <div>
         <h1 className="text-2xl font-bold">Tools & Agents</h1>
         <p className="text-muted-foreground">Select a specialized tool to run directly or start a focused task.</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-primary">
            <Bot className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Specialized Agents</h2>
        </div>
        <p className="text-sm text-muted-foreground">AI agents that run automated tasks or retrieve information directly in the chat.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ToolCard 
                title="Loan Calculator" 
                desc="Calculate monthly payments and amortization schedules."
                tag="loan_calculator"
            />
            <ToolCard 
                title="Quick Add" 
                desc="Quickly add a new expense to your log."
                tag="add_expense"
            />
             <ToolCard 
                title="Expense Tracker" 
                desc="Analyze your spending habits and view expense history."
                tag="get_expenses"
            />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-orange-500">
            <Wrench className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Interactive Tools</h2>
        </div>
        <p className="text-sm text-muted-foreground">Apps and calculators with dedicated interfaces for complex inputs.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ToolCard 
                title="Calculate Compound Interest Milestone" 
                desc="Calculates future value based on compound interest and determines monthly contribution."
                tag="calculate_compound_"
            />
             <ToolCard 
                title="Calculate Compound Interest Goal" 
                desc="Calculates future value of an investment and solves for the required monthly contribution."
                tag="calculate_compound_"
            />
             <ToolCard 
                title="Compare Debt Vs Invest" 
                desc="A fair 'delta' simulation comparing a lump sum debt payoff vs investing that lump sum."
                tag="compare_debt_vs_inv"
            />
             <ToolCard 
                title="Debt Vs Investment Simulator" 
                desc="Calculates the net worth difference between paying off a car loan early versus investing."
                tag="simulator"
            />
        </div>
      </div>

    </div>
  );
}

function ToolCard({ title, desc, tag }: { title: string, desc: string, tag: string }) {
    return (
        <Card className="hover:border-primary/50 transition-colors cursor-pointer bg-secondary/5">
            <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3 min-h-[60px]">
                    {desc}
                </p>
                <Badge variant="secondary" className="font-mono text-xs text-muted-foreground">
                    {tag}
                </Badge>
            </CardContent>
        </Card>
    )
}
