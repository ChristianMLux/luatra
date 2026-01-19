"use client"

import { Card, CardHeader, CardTitle, CardContent, Progress } from "@repo/ui";

export function BudgetOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Budget Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
            <span className="font-medium">Monthly Budget</span>
            <span className="text-muted-foreground text-sm">$2,450.00 left</span>
        </div>
        
        <Progress value={65} className="h-2 bg-muted [&>div]:bg-orange-600" />
        
        <p className="text-xs text-muted-foreground">
            You have spent 65% of your total budget.
        </p>
      </CardContent>
    </Card>
  );
}
