import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Tasks from "@/pages/Tasks";
import Schedule from "@/pages/Schedule";
import Assignments from "@/pages/Assignments";
import TimerPage from "@/pages/TimerPage";
import Reader from "@/pages/Reader";
import Motivation from "@/pages/Motivation";
import FocusPage from "@/pages/FocusPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function ThemeInit() {
  const { darkMode } = useStore();
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);
  return null;
}

const App = () => {
  const { focusMode } = useStore();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeInit />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {focusMode ? (
              <Route path="*" element={<FocusPage />} />
            ) : (
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/assignments" element={<Assignments />} />
                <Route path="/timer" element={<TimerPage />} />
                <Route path="/reader" element={<Reader />} />
                <Route path="/motivation" element={<Motivation />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            )}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
