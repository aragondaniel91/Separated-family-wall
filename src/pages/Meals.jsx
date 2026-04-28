import React, { useEffect, useState } from "react";
import {
  format,
  addDays,
  startOfWeek,
  isToday as dateFnsIsToday,
} from "date-fns";
import {
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import AddMealDialog from "@/components/meals/AddMealDialog";

const mealTypeConfig = {
  breakfast: { label: "Breakfast", emoji: "☕", color: "from-amber-400 to-orange-300" },
  lunch: { label: "Lunch", emoji: "🌞", color: "from-orange-400 to-yellow-300" },
  dinner: { label: "Dinner", emoji: "🌙", color: "from-indigo-500 to-purple-400" },
  snack: { label: "Snack", emoji: "🍎", color: "from-green-400 to-emerald-300" },
};

const FOOD_IMAGES = {
  default: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
  breakfast: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&q=80",
  lunch: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
  dinner: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80",
  snack: "https://images.unsplash.com/photo-1481671703460-040cb8a2d909?w=400&q=80",
};

export default function Meals() {
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date()));
  const [addMealDate, setAddMealDate] = useState(null);
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("meals") || "[]");
    setMeals(data);
  }, []);

  const saveMeals = (updated) => {
    setMeals(updated);
    localStorage.setItem("meals", JSON.stringify(updated));
  };

  const deleteMeal = (id) => {
    const updated = meals.filter((m) => m.id !== id);
    saveMeals(updated);
  };

  const weekEnd = addDays(weekStart, 6);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getMealsForDate = (date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return meals.filter((m) => m.date === dateStr);
  };

  return (
    <div className="p-4 md:p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold font-heading">Meal Planner</h1>
          <p className="text-sm text-muted-foreground">
            {meals.length} meals total
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setWeekStart(addDays(weekStart, -7))}>
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <span className="text-sm font-semibold font-heading min-w-[140px] text-center">
            {format(weekStart, "MMM d")} – {format(weekEnd, "MMM d")}
          </span>

          <Button variant="outline" size="icon" onClick={() => setWeekStart(addDays(weekStart, 7))}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Board */}
      <div className="flex gap-3 overflow-x-auto pb-4 flex-1">
        {weekDays.map((day) => {
          const dayMeals = getMealsForDate(day);
          const isToday = dateFnsIsToday(day);

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "flex-shrink-0 w-52 flex flex-col rounded-2xl p-3 border",
                isToday ? "bg-primary/5 border-primary/40" : "bg-muted/30 border-border"
              )}
            >
              <div className="mb-3">
                <p className="font-bold text-sm">{format(day, "EEE")}</p>
                <p className="text-xs text-muted-foreground">{format(day, "MMM d")}</p>
              </div>

              <div className="flex-1 space-y-2">
                {dayMeals.map((meal) => {
                  const config = mealTypeConfig[meal.meal_type] || mealTypeConfig.snack;
                  const img = meal.image_url || FOOD_IMAGES[meal.meal_type] || FOOD_IMAGES.default;

                  return (
                    <div key={meal.id} className="rounded-xl overflow-hidden border shadow-sm group">
                      <div className="h-24 relative">
                        <img src={img} className="w-full h-full object-cover" />
                        <button
                          onClick={() => deleteMeal(meal.id)}
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-black/50 text-white rounded-full p-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="p-2 text-sm">
                        <p className="font-bold">{meal.name}</p>
                        <p className="text-xs text-muted-foreground">{config.emoji} {config.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setAddMealDate(day)}
                className="mt-3 border-2 border-dashed rounded-xl p-2 text-sm flex items-center justify-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add meal
              </button>
            </div>
          );
        })}
      </div>

      {addMealDate && (
        <AddMealDialog
          date={addMealDate}
          onClose={() => setAddMealDate(null)}
          onSuccess={() => {
            const data = JSON.parse(localStorage.getItem("meals") || "[]");
            setMeals(data);
            setAddMealDate(null);
          }}
        />
      )}
    </div>
  );
}