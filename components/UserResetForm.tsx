"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Button,
  Input,
  Label,
  Select,
  Checkbox,
  Card,
  CardContent,
  Alert,
  Spinner,
} from "@/components/ui";

interface Router {
  _id: string;
  name: string;
  ipAddress: string;
}

interface UserResetFormProps {
  routers: Router[];
}

export default function UserResetForm({ routers }: UserResetFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    routerId: "",
    username: "",
    removeActive: true,
    removeCookies: true,
    removeMacBindings: true,
  });

  const [result, setResult] = useState<{
    success: boolean;
    operations?: {
      activeRemoved: boolean;
      cookiesRemoved: boolean;
      macBindingsRemoved: boolean;
    };
    details?: string[];
    error?: string;
  } | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const debouncedUsername = useDebounce(formData.username, 300);

  // Fetch user suggestions from router
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!formData.routerId) {
        setSuggestions([]);
        return;
      }

      setLoadingSuggestions(true);
      try {
        const response = await fetch(
          `/api/routers/${formData.routerId}/users?search=${encodeURIComponent(
            debouncedUsername
          )}`
        );

        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.users || []);
        }
      } catch (error: unknown) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [debouncedUsername, formData.routerId]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionClick = (username: string) => {
    setFormData({ ...formData, username });
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.routerId || !formData.username) {
      toast.error("Please select a router and enter a username");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/reset-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset user");
      }

      setResult(data.result);
      toast.success("User reset operation completed!");

      // Reset form
      setFormData({
        ...formData,
        username: "",
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to reset user";
      toast.error(errorMessage);
      setResult({
        success: false,
        error: errorMessage,
        details: [errorMessage],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="router" required>
                Select Router
              </Label>
              <Select
                id="router"
                required
                value={formData.routerId}
                onChange={(e) =>
                  setFormData({ ...formData, routerId: e.target.value })
                }
              >
                <option value="">-- Select a router --</option>
                {routers.map((router) => (
                  <option key={router._id} value={router._id}>
                    {router.name} ({router.ipAddress})
                  </option>
                ))}
              </Select>
            </div>

            <div className="relative" ref={suggestionsRef}>
              <Label htmlFor="username" required>
                Username
              </Label>
              <Input
                id="username"
                type="text"
                required
                value={formData.username}
                onChange={(e) => {
                  setFormData({ ...formData, username: e.target.value });
                  setShowSuggestions(true);
                }}
                onFocus={() => {
                  setShowSuggestions(true);
                  // Fetch all users if not already loaded
                  if (suggestions.length === 0 && formData.routerId) {
                    setLoadingSuggestions(true);
                  }
                }}
                placeholder="Enter hotspot username"
                autoComplete="off"
                rightIcon={loadingSuggestions && <Spinner size="sm" />}
              />

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {suggestions.map((username, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(username)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-indigo-50 hover:text-indigo-700 focus:bg-indigo-50 focus:text-indigo-700 focus:outline-none transition-colors border-b border-gray-100 last:border-b-0 cursor-pointer"
                    >
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-2 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        {username}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* No results message */}
              {showSuggestions &&
                !loadingSuggestions &&
                suggestions.length === 0 &&
                formData.routerId && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3">
                    <p className="text-sm text-gray-500 text-center">
                      {formData.username.length > 0 ? (
                        <>
                          No users found matching &quot;{formData.username}
                          &quot;
                        </>
                      ) : (
                        "No active users found on this router"
                      )}
                    </p>
                  </div>
                )}
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Reset Options
              </p>
              <div className="space-y-2">
                <Checkbox
                  label="Remove from Active Connections"
                  checked={formData.removeActive}
                  onChange={(e) =>
                    setFormData({ ...formData, removeActive: e.target.checked })
                  }
                />

                <Checkbox
                  label="Remove Hotspot Cookies"
                  checked={formData.removeCookies}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      removeCookies: e.target.checked,
                    })
                  }
                />

                <Checkbox
                  label="Remove MAC Address Bindings"
                  checked={formData.removeMacBindings}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      removeMacBindings: e.target.checked,
                    })
                  }
                />
              </div>
            </div>

            <Button
              type="submit"
              isLoading={loading}
              disabled={loading || routers.length === 0}
              className="w-full"
            >
              {loading ? "Resetting User..." : "Reset User"}
            </Button>

            {routers.length === 0 && (
              <Alert variant="warning" className="mt-4">
                <p className="text-sm">
                  Please add a router first before resetting users
                </p>
              </Alert>
            )}
          </form>
        </CardContent>
      </Card>

      {result && (
        <Alert
          variant={result.success ? "success" : "error"}
          title={
            result.success
              ? "✓ Reset Operation Completed"
              : "✗ Reset Operation Failed"
          }
        >
          <div className="space-y-2">
            {result.details &&
              result.details.map((detail: string, index: number) => (
                <p
                  key={index}
                  className={`text-sm ${
                    detail.startsWith("✓")
                      ? "text-green-700"
                      : detail.startsWith("✗")
                      ? "text-red-700"
                      : "text-gray-700"
                  }`}
                >
                  {detail}
                </p>
              ))}
          </div>

          {result.operations && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Operations Summary:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  Active Connections:{" "}
                  {result.operations.activeRemoved ? (
                    <span className="text-green-600 font-medium">
                      ✓ Processed
                    </span>
                  ) : (
                    <span className="text-gray-400">○ Skipped</span>
                  )}
                </li>
                <li>
                  Cookies:{" "}
                  {result.operations.cookiesRemoved ? (
                    <span className="text-green-600 font-medium">
                      ✓ Processed
                    </span>
                  ) : (
                    <span className="text-gray-400">○ Skipped</span>
                  )}
                </li>
                <li>
                  MAC Bindings:{" "}
                  {result.operations.macBindingsRemoved ? (
                    <span className="text-green-600 font-medium">
                      ✓ Processed
                    </span>
                  ) : (
                    <span className="text-gray-400">○ Skipped</span>
                  )}
                </li>
              </ul>
            </div>
          )}
        </Alert>
      )}
    </div>
  );
}
