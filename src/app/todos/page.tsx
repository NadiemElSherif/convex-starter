"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { NavHeader } from "@/components/nav-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

type StatusFilter = "all" | "pending" | "in_progress" | "done";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  done: "bg-green-100 text-green-800",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  done: "Done",
};

export default function TodosPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const todos = useQuery(
    api.todos.list,
    statusFilter === "all" ? {} : { status: statusFilter }
  );
  const users = useQuery(api.users.getAllUsers);
  const createTodo = useMutation(api.todos.create);
  const updateStatus = useMutation(api.todos.updateStatus);
  const removeTodo = useMutation(api.todos.remove);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await createTodo({
      title: title.trim(),
      description: description.trim() || undefined,
      assignedTo: assignedTo
        ? (assignedTo as Id<"users">)
        : undefined,
    });

    setTitle("");
    setDescription("");
    setAssignedTo("");
  };

  const cycleStatus = (
    id: Id<"todos">,
    current: string
  ) => {
    const next =
      current === "pending"
        ? "in_progress"
        : current === "in_progress"
          ? "done"
          : "pending";
    updateStatus({
      id,
      status: next as "pending" | "in_progress" | "done",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavHeader />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Todo List</h1>

        {/* Create form */}
        <form onSubmit={handleCreate} className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex gap-2 mb-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1"
            />
            <Button type="submit" disabled={!title.trim()}>
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
          <div className="flex gap-2">
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="flex-1"
            />
            <Select value={assignedTo} onValueChange={setAssignedTo}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Assign to..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Unassigned</SelectItem>
                {users?.map((u) => (
                  <SelectItem key={u._id} value={u._id}>
                    {u.name || u.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </form>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-4">
          {(["all", "pending", "in_progress", "done"] as const).map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(s)}
            >
              {s === "all" ? "All" : statusLabels[s]}
            </Button>
          ))}
        </div>

        {/* Todo list */}
        <div className="space-y-2">
          {todos === undefined ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : todos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No todos yet. Create one above.
            </div>
          ) : (
            todos.map((todo: { _id: Id<"todos">; title: string; description?: string; status: string; creatorName: string; assigneeName?: string }) => (
              <div
                key={todo._id}
                className="bg-white rounded-lg border p-4 flex items-center gap-3"
              >
                <button
                  onClick={() => cycleStatus(todo._id, todo.status)}
                  className="shrink-0"
                  title="Click to change status"
                >
                  <Badge className={statusColors[todo.status]}>
                    {statusLabels[todo.status]}
                  </Badge>
                </button>

                <div className="flex-1 min-w-0">
                  <p
                    className={`font-medium ${todo.status === "done" ? "line-through text-gray-400" : "text-gray-900"}`}
                  >
                    {todo.title}
                  </p>
                  {todo.description && (
                    <p className="text-sm text-gray-500 truncate">
                      {todo.description}
                    </p>
                  )}
                  <div className="flex gap-2 mt-1 text-xs text-gray-400">
                    <span>by {todo.creatorName}</span>
                    {todo.assigneeName && (
                      <span>- assigned to {todo.assigneeName}</span>
                    )}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTodo({ id: todo._id })}
                  className="shrink-0 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
