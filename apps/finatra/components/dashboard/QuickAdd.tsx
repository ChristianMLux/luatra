"use client"

import { Card, CardHeader, CardTitle, CardContent, Input, Button, Label } from "@repo/ui";

export function QuickAdd() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Quick Add</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" placeholder="$ 0.00" type="number" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" placeholder="e.g. Food" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input id="description" placeholder="What did you buy?" />
        </div>
        <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">Add Expense</Button>
      </CardContent>
    </Card>
  );
}
