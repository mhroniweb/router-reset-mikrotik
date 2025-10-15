"use client";

import { useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { Button, Input, Label, PasswordInput } from "@/components/ui";

interface RouterFormData {
  name: string;
  ipAddress: string;
  username: string;
  password: string;
  port: number;
}

interface RouterFormProps {
  onSuccess?: () => void;
}

export default function RouterForm({ onSuccess }: RouterFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<RouterFormData>({
    name: "",
    ipAddress: "",
    username: "",
    password: "",
    port: 8728,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/routers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add router");
      }

      toast.success("Router added successfully!");
      setFormData({
        name: "",
        ipAddress: "",
        username: "",
        password: "",
        port: 8728,
      });

      if (onSuccess) onSuccess();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add router";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name" required>
          Router Name
        </Label>
        <Input
          id="name"
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Main Router"
        />
      </div>

      <div>
        <Label htmlFor="ipAddress" required>
          IP Address
        </Label>
        <Input
          id="ipAddress"
          type="text"
          required
          value={formData.ipAddress}
          onChange={(e) =>
            setFormData({ ...formData, ipAddress: e.target.value })
          }
          placeholder="192.168.88.1"
        />
      </div>

      <div>
        <Label htmlFor="username" required>
          Username
        </Label>
        <Input
          id="username"
          type="text"
          required
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          placeholder="admin"
        />
      </div>

      <PasswordInput
        id="password"
        name="password"
        label="Password"
        required
        value={formData.password}
        onChange={(e) =>
          setFormData({ ...formData, password: e.target.value })
        }
        placeholder="••••••••"
        disabled={loading}
        leftIcon={
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        }
      />

      <div>
        <Label htmlFor="port" required>
          API Port
        </Label>
        <Input
          id="port"
          type="number"
          required
          value={formData.port}
          onChange={(e) =>
            setFormData({ ...formData, port: parseInt(e.target.value) })
          }
          placeholder="8728"
        />
      </div>

      <Button type="submit" isLoading={loading} className="w-full">
        {loading ? "Adding..." : "Add Router"}
      </Button>
    </form>
  );
}
