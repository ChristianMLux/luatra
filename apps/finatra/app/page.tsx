"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui";
import { ToolChatInterface } from "@/components/chat/ToolChatInterface";
import CashflowChart from "@/components/dashboard/CashflowChart";
import AllocationChart from "@/components/dashboard/AllocationChart";
import { QuickAdd } from "@/components/dashboard/QuickAdd";
import { BudgetOverview } from "@/components/dashboard/BudgetOverview";

// Dummy data
const CASHFLOW_DATA = [
  { name: '2025-11', value: 300 },
  { name: '2025-12', value: 1900 },
  { name: '2026-01', value: 1200 },
  { name: '2026-02', value: 1500 },
];

const ALLOCATION_DATA = [
  { name: 'Food', value: 400 },
  { name: 'Rent', value: 1000 },
  { name: 'Transport', value: 200 },
  { name: 'Entertainment', value: 300 },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-6 gap-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-full">
        <div className="flex flex-col gap-6 overflow-y-auto pr-2 pb-2">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Expense Allocation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AllocationChart data={ALLOCATION_DATA} />
                  </CardContent>
               </Card>
               <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Monthly Cashflow</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CashflowChart data={CASHFLOW_DATA} />
                  </CardContent>
               </Card>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <QuickAdd />
               <BudgetOverview />
           </div>
           
           <Card className="flex-1 min-h-[200px]">
             <CardHeader>
               <CardTitle>Recent Expenses</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-sm text-muted-foreground">No recent expenses.</div>
             </CardContent>
           </Card>
        </div>

        <div className="h-full min-h-[600px]">
           <ToolChatInterface initialPrompt="Analyze my spending pattern" />
        </div>
      </div>
    </div>
  );
}
