"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  Button,
  IconButton,
  Input,
  Label,
  PasswordInput,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  EmptyState,
  ConfirmDialog,
} from "@/components/ui";

interface Router {
  _id: string;
  name: string;
  ipAddress: string;
  username: string;
  port: number;
  createdAt: string;
}

interface RouterListProps {
  routers: Router[];
  onRouterDeleted?: () => void;
  onRouterUpdated?: () => void;
}

export default function RouterList({
  routers,
  onRouterDeleted,
  onRouterUpdated,
}: RouterListProps) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    routerId: string;
    routerName: string;
  }>({
    isOpen: false,
    routerId: "",
    routerName: "",
  });
  const [editForm, setEditForm] = useState({
    name: "",
    ipAddress: "",
    username: "",
    password: "",
    port: 8728,
  });

  const handleEdit = (router: Router) => {
    setEditing(router._id);
    setEditForm({
      name: router.name,
      ipAddress: router.ipAddress,
      username: router.username,
      password: "",
      port: router.port,
    });
  };

  const handleCancelEdit = () => {
    setEditing(null);
    setEditForm({
      name: "",
      ipAddress: "",
      username: "",
      password: "",
      port: 8728,
    });
  };

  const handleUpdate = async (id: string) => {
    try {
      const response = await fetch(`/api/routers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update router");
      }

      toast.success("Router updated successfully!");
      setEditing(null);
      if (onRouterUpdated) onRouterUpdated();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update router";
      toast.error(errorMessage);
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteConfirm({
      isOpen: true,
      routerId: id,
      routerName: name,
    });
  };

  const handleDeleteConfirm = async () => {
    const { routerId } = deleteConfirm;
    setDeleting(routerId);

    try {
      const response = await fetch(`/api/routers?id=${routerId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete router");
      }

      toast.success("Router deleted successfully!");
      if (onRouterDeleted) onRouterDeleted();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete router";
      toast.error(errorMessage);
    } finally {
      setDeleting(null);
      setDeleteConfirm({ isOpen: false, routerId: "", routerName: "" });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, routerId: "", routerName: "" });
  };

  if (routers.length === 0) {
    return (
      <EmptyState
        title="No routers added yet"
        description="Add your first router to get started"
        icon={
          <svg
            className="h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        }
      />
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Port</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {routers.map((router) => (
            <>
              <TableRow key={router._id}>
                <TableCell className="font-medium text-gray-900">
                  {router.name}
                </TableCell>
                <TableCell>{router.ipAddress}</TableCell>
                <TableCell>{router.username}</TableCell>
                <TableCell>{router.port}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <IconButton
                      variant="primary"
                      size="sm"
                      onClick={() => handleEdit(router)}
                      icon={
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      }
                      aria-label="Edit router"
                    >
                      Edit
                    </IconButton>
                    <IconButton
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteClick(router._id, router.name)}
                      isLoading={deleting === router._id}
                      disabled={deleting === router._id}
                      icon={
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      }
                      aria-label="Delete router"
                    >
                      Delete
                    </IconButton>
                  </div>
                </TableCell>
              </TableRow>

              {/* Edit Form Row */}
              {editing === router._id && (
                <TableRow className="bg-indigo-50">
                  <TableCell colSpan={5}>
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-gray-800 mb-3">
                        Edit Router
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs">Router Name</Label>
                          <Input
                            type="text"
                            value={editForm.name}
                            onChange={(e) =>
                              setEditForm({ ...editForm, name: e.target.value })
                            }
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">IP Address</Label>
                          <Input
                            type="text"
                            value={editForm.ipAddress}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                ipAddress: e.target.value,
                              })
                            }
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Username</Label>
                          <Input
                            type="text"
                            value={editForm.username}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                username: e.target.value,
                              })
                            }
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <PasswordInput
                            id="edit-password"
                            name="password"
                            label="Password (leave empty to keep current)"
                            value={editForm.password}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                password: e.target.value,
                              })
                            }
                            className="text-sm"
                            placeholder="Enter new password"
                            leftIcon={
                              <svg
                                className="w-4 h-4"
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
                        </div>
                        <div>
                          <Label className="text-xs">API Port</Label>
                          <Input
                            type="number"
                            value={editForm.port}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                port: parseInt(e.target.value),
                              })
                            }
                            className="text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-3 mt-4">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleUpdate(router._id)}
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Router"
        description={`Are you sure you want to delete "${deleteConfirm.routerName}"? This action cannot be undone and will remove all router configuration data.`}
        confirmText="Delete Router"
        cancelText="Cancel"
        variant="error"
        isLoading={deleting === deleteConfirm.routerId}
        icon={
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        }
      />
    </>
  );
}
