"use client";
import { useAuth } from "@/providers/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const initials = (user?.name ?? "").split(" ").map((p) => p[0]).join("").slice(0,2).toUpperCase() || "U";
  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 rounded-lg">
              <AvatarImage src={user?.image ?? ""} alt={user?.name ?? "User"} />
              <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="font-medium text-lg">{user?.name ?? "User"}</p>
              <p className="text-muted-foreground">{user?.email ?? ""}</p>
            </div>
            {isAuthenticated && (
              <div className="ml-auto">
                <Button variant="outline" onClick={logout}>Log out</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
