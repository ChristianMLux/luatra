"use client"

import { Card, CardHeader, CardTitle, CardContent, Button, Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@repo/ui";
import { Plus, Search, Package, Coffee } from "lucide-react";

const EXPENSES = [
  { id: 1, name: "Coffee", desc: "Coffee spending", amount: 3.00, date: "30.12.2025", icon: Coffee },
  { id: 2, name: "Food", desc: "grocery shopping", amount: 25.00, date: "29.12.2025", icon: Package },
  { id: 3, name: "Coffee", desc: "Coffee", amount: 3.45, date: "29.12.2025", icon: Coffee },
  { id: 4, name: "Coffee", desc: "Coffee purchase", amount: 2.34, date: "29.12.2025", icon: Coffee },
  { id: 5, name: "asd", desc: "asd", amount: 123.00, date: "28.12.2025", icon: Package },
];

export default function ExpensesPage() {
  return (
    <div className="container mx-auto p-6 max-w-5xl space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Expenses</h1>
          <p className="text-muted-foreground">Manage and view all your transactions.</p>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700 text-white">
            <Plus className="mr-2 h-4 w-4" /> Add Expense
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base font-medium">Recent Expenses</CardTitle>
            <div className="flex gap-2">
                <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search expenses..." className="pl-8" />
                </div>
                <Select defaultValue="newest">
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                        <SelectItem value="highest">Highest</SelectItem>
                        <SelectItem value="lowest">Lowest</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                {EXPENSES.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-primary">
                                <expense.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-medium">{expense.name}</p>
                                <p className="text-sm text-muted-foreground">{expense.desc}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-bold">${expense.amount.toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground">{expense.date}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="flex justify-end items-center gap-2 mt-6 pt-4 border-t">
                <Button variant="ghost" size="sm" disabled>Previous</Button>
                <span className="text-xs text-muted-foreground">Page 1 of 7</span>
                <Button variant="ghost" size="sm">Next</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
