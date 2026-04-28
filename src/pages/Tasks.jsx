import React, { useEffect, useState } from "react";
import {
  Plus,
  Check,
  Trash2,
  Home,
  Briefcase,
  GraduationCap,
  User,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import AddTaskDialog from "@/components/tasks/AddTaskDialog";

const categoryConfig = {
  house: {
    icon: Home,
    label: "House",
    bg: "bg-amber-400",
    card: "bg-amber-50 border-amber-200",
    text: "text-amber-800",
  },
  work: {
    icon: Briefcase,
    label: "Work",
    bg: "bg-blue-500",
    card: "bg-blue-50 border-blue-200",
    text: "text-blue-800",
  },
  school: {
    icon: GraduationCap,
    label: "School",
    bg: "bg-emerald-500",
    card: "bg-emerald-50 border-emerald-200",
    text: "text-emerald-800",
  },
  personal: {
    icon: User,
    label: "Personal",
    bg: "bg-violet-500",
    card: "bg-violet-50 border-violet-200",
    text: "text-violet-800",
  },
  other: {
    icon: MoreHorizontal,
    label: "Other",
    bg: "bg-slate-400",
    card: "bg-slate-50 border-slate-200",
    text: "text-slate-800",
  },
};

const priorityDot = {
  high: "bg-red-500",
  medium: "bg-amber-400",
  low: "bg-green-500",
};

export default function Tasks() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("tasks") || "[]");
    setTasks(data);
  }, []);

  const saveTasks = (updatedTasks) => {
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const toggleTask = (task) => {
    const updated = tasks.map((t) =>
      t.id === task.id
        ? { ...t, status: t.status === "pending" ? "done" : "pending" }
        : t
    );

    saveTasks(updated);
  };

  const deleteTask = (id) => {
    const updated = tasks.filter((t) => t.id !== id);
    saveTasks(updated);
  };

  const categories = Object.keys(categoryConfig);

  const filtered =
    activeCategory === "all"
      ? tasks
      : tasks.filter((t) => t.category === activeCategory);

  const pending = filtered.filter((t) => t.status === "pending");
  const done = filtered.filter((t) => t.status === "done");

  const columns =
    activeCategory === "all"
      ? categories.map((cat) => ({
          key: cat,
          config: categoryConfig[cat],
          tasks: tasks.filter(
            (t) => t.category === cat && t.status === "pending"
          ),
        }))
      : [
          {
            key: activeCategory,
            config: categoryConfig[activeCategory] || categoryConfig.other,
            tasks: pending,
          },
        ];

  return (
    <div className="p-4 md:p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold font-heading">Task Board</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {tasks.filter((t) => t.status === "pending").length} pending ·{" "}
            {tasks.filter((t) => t.status === "done").length} done
          </p>
        </div>

        <Button onClick={() => setShowAdd(true)} className="gap-1.5 shadow-md">
          <Plus className="w-4 h-4" /> Add Task
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
        <button
          onClick={() => setActiveCategory("all")}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all border",
            activeCategory === "all"
              ? "bg-foreground text-background border-foreground"
              : "bg-card border-border text-muted-foreground hover:border-foreground/30"
          )}
        >
          All
        </button>

        {categories.map((cat) => {
          const cfg = categoryConfig[cat];
          const Icon = cfg.icon;

          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all border flex items-center gap-1.5",
                activeCategory === cat
                  ? `${cfg.bg} text-white border-transparent`
                  : "bg-card border-border text-muted-foreground hover:border-foreground/30"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {cfg.label}
            </button>
          );
        })}
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => {
          const ColIcon = col.config.icon;

          return (
            <div key={col.key} className="flex-shrink-0 w-64 flex flex-col">
              <div
                className={cn(
                  "rounded-xl px-3 py-2 mb-3 flex items-center gap-2 border",
                  col.config.card
                )}
              >
                <div
                  className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center text-white",
                    col.config.bg
                  )}
                >
                  <ColIcon className="w-4 h-4" />
                </div>

                <span
                  className={cn(
                    "font-bold font-heading text-sm flex-1",
                    col.config.text
                  )}
                >
                  {col.config.label}
                </span>

                <span
                  className={cn(
                    "text-xs font-bold px-2 py-0.5 rounded-full",
                    col.config.card,
                    col.config.text
                  )}
                >
                  {col.tasks.length}
                </span>
              </div>

              <div className="space-y-2 flex-1">
                {col.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "rounded-xl border p-3 shadow-sm hover:shadow-md transition-all group",
                      col.config.card
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <button
                        onClick={() => toggleTask(task)}
                        className={cn(
                          "mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                          col.config.text.replace("text-", "border-"),
                          "hover:opacity-70"
                        )}
                      />

                      <p
                        className={cn(
                          "flex-1 font-semibold text-sm leading-snug",
                          col.config.text
                        )}
                      >
                        {task.title}
                      </p>

                      <button
                        onClick={() => deleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {(task.priority || task.due_date) && (
                      <div className="flex items-center gap-2 mt-2 pl-7">
                        {task.priority && (
                          <div className="flex items-center gap-1">
                            <div
                              className={cn(
                                "w-2 h-2 rounded-full",
                                priorityDot[task.priority]
                              )}
                            />
                            <span className="text-xs text-muted-foreground capitalize">
                              {task.priority}
                            </span>
                          </div>
                        )}

                        {task.due_date && (
                          <span className="text-xs text-muted-foreground">
                            📅 {task.due_date}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {col.tasks.length === 0 && (
                  <div
                    className={cn(
                      "rounded-xl border-2 border-dashed p-4 text-center",
                      col.config.card
                    )}
                  >
                    <p className={cn("text-xs opacity-50", col.config.text)}>
                      No tasks
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {activeCategory === "all" && done.length > 0 && (
          <div className="flex-shrink-0 w-64 flex flex-col">
            <div className="rounded-xl px-3 py-2 mb-3 flex items-center gap-2 border bg-slate-100 border-slate-200">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white bg-slate-400">
                <Check className="w-4 h-4" />
              </div>

              <span className="font-bold font-heading text-sm flex-1 text-slate-600">
                Done
              </span>

              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {done.length}
              </span>
            </div>

            <div className="space-y-2">
              {done.map((task) => (
                <div
                  key={task.id}
                  className="rounded-xl border p-3 bg-slate-100 border-slate-200 opacity-60 group"
                >
                  <div className="flex items-start gap-2">
                    <button
                      onClick={() => toggleTask(task)}
                      className="mt-0.5 w-5 h-5 rounded-full border-2 border-slate-400 bg-slate-300 flex items-center justify-center shrink-0"
                    >
                      <Check className="w-3 h-3 text-slate-600" />
                    </button>

                    <p className="flex-1 text-sm text-slate-500 line-through">
                      {task.title}
                    </p>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showAdd && (
        <AddTaskDialog
          onClose={() => setShowAdd(false)}
          onSuccess={() => {
            const data = JSON.parse(localStorage.getItem("tasks") || "[]");
            setTasks(data);
            setShowAdd(false);
          }}
        />
      )}
    </div>
  );
}
