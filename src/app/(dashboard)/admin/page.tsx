"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { generateBetaCode } from "@/lib/beta/codes";
import { toast } from "sonner";
import { Copy, Key } from "lucide-react";

interface GeneratedCode {
  fullCode: string;
  prefix: string;
  created: Date;
}

export default function AdminPage() {
  const [codes, setCodes] = useState<GeneratedCode[]>([]);
  const [notes, setNotes] = useState("");
  const [assignedCompany, setAssignedCompany] = useState("");

  function handleGenerate() {
    const { prefix, hash, fullCode } = generateBetaCode();
    setCodes((prev) => [{ fullCode, prefix, created: new Date() }, ...prev]);
    setNotes("");
    setAssignedCompany("");
    toast.success("Beta code generated!");
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
        <p className="text-muted-foreground">
          Manage beta invite codes and platform settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Beta Code Generator
          </CardTitle>
          <CardDescription>
            Generate single-use or multi-use beta invite codes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="company">Assigned Company (optional)</Label>
              <Input
                id="company"
                value={assignedCompany}
                onChange={(e) => setAssignedCompany(e.target.value)}
                placeholder="Acme Corp"
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="VIP invite for..."
              />
            </div>
          </div>
          <Button onClick={handleGenerate}>Generate Beta Code</Button>
        </CardContent>
      </Card>

      {codes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Codes</CardTitle>
            <CardDescription>
              Share these codes with beta testers. Codes are hashed in the database.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {codes.map((code, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <div>
                    <code className="text-sm font-mono">{code.fullCode}</code>
                    <div className="mt-1 flex gap-2">
                      <Badge variant="secondary">{code.prefix}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {code.created.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyCode(code.fullCode)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
