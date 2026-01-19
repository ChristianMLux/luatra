"use client"

import { Card, CardHeader, CardTitle, CardContent, Input, Button, Label } from "@repo/ui";

export default function SettingsPage() {
  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div>
         <h1 className="text-2xl font-bold">Settings</h1>
         <p className="text-muted-foreground">Manage your application preferences.</p>
      </div>

      <Card>
          <CardHeader>
              <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="space-y-2">
                  <Label htmlFor="name">Full Name (Display Name)</Label>
                  <div className="flex gap-2">
                    <Input id="name" placeholder="Enter your name" defaultValue="" />
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white">Save</Button>
                  </div>
              </div>
               <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value="christian.m.lux@gmail.com" disabled />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="role">My Role</Label>
                   <Input id="role" value="Free Plan" disabled />
              </div>
          </CardContent>
      </Card>

      <Card>
          <CardHeader>
              <CardTitle>General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
               <div className="space-y-2">
                  <Label htmlFor="appName">Application Name</Label>
                  <Input id="appName" value="Finance Tracker" disabled />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input id="currency" value="USD ($)" disabled />
              </div>
          </CardContent>
      </Card>
      
      <Card>
          <CardHeader>
              <CardTitle>Data Management</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
             <div>
                 <h3 className="font-medium">Clear Data</h3>
                 <p className="text-sm text-muted-foreground">Remove all expenses and reset local state.</p>
             </div>
             <Button variant="destructive">Clear All Data</Button>
          </CardContent>
      </Card>
    </div>
  );
}
