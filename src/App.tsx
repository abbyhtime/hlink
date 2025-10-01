import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import LiveSession from "./pages/LiveSession";
import JoinSession from "./pages/JoinSession";
import Assistant from "./pages/Assistant";
import ContactPrivacy from "./pages/ContactPrivacy";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import ClaimAssistant from "./pages/ClaimAssistant";
import MyAssistant from "./pages/MyAssistant";
import ConfigureHIP from "./pages/ConfigureHIP";
import PublicProfile from "./pages/PublicProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/live-session" element={<LiveSession />} />
              <Route path="/join/:sessionCode" element={<JoinSession />} />
              <Route path="/join" element={<JoinSession />} />
              <Route path="/assistant" element={<Assistant />} />
              <Route path="/contacts" element={<ContactPrivacy />} />
              <Route path="/hip/:username" element={<PublicProfile />} />
              <Route
                path="/claim-assistant"
                element={
                  <ProtectedRoute>
                    <ClaimAssistant />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-assistant"
                element={
                  <ProtectedRoute>
                    <MyAssistant />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/configure-hip"
                element={
                  <ProtectedRoute>
                    <ConfigureHIP />
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
