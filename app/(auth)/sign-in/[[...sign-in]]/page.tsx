"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    setError(null);
    setLoading(true);
    const ok = await login({ email, password });
    setLoading(false);
    if (!ok) {
      setError("Invalid email or password");
      return;
    }
    router.push("/");
  };

  return (
    <div className="grid w-full grow items-center px-4 sm:justify-center bg-muted/20 py-8">
      <Card className="w-full sm:w-96 shadow-md">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center flex-col">
              <Link href="/" aria-label="go home">
                <Image src="/logo.png" alt="Logo" width={112} height={48} className="h-12 w-auto" />
              </Link>
              <span className="mt-3 text-lg">Sign in</span>
            </div>
          </CardTitle>
          <CardDescription>
            Welcome back! Please sign in to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-y-4">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="space-y-2">
            <Label>Email address</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" required />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" required />
          </div>
        </CardContent>
        <CardFooter>
          <div className="grid w-full gap-y-4">
            <Button onClick={onSubmit as any} disabled={loading}>
              {loading ? "Signing in..." : "Continue"}
            </Button>
            <Button variant="link" size="sm" asChild>
              <Link href="/sign-up">Don&apos;t have an account? Sign up</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
