import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StickyNote, Sparkles, Lock, Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-primary p-4 rounded-2xl shadow-large">
              <StickyNote className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4">
            NotesAI
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your intelligent note-taking companion. Write, organize, and understand your notes with the power of AI.
          </p>
          <Button
            onClick={() => navigate("/auth")}
            size="lg"
            className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-6 shadow-medium"
          >
            Get Started
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-card p-6 rounded-xl shadow-soft border border-border">
            <div className="bg-gradient-primary p-3 rounded-lg w-fit mb-4">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">AI-Powered Summaries</h3>
            <p className="text-muted-foreground">
              Generate instant summaries of your notes and get quick insights with advanced AI.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-soft border border-border">
            <div className="bg-gradient-accent p-3 rounded-lg w-fit mb-4">
              <Lock className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Secure & Private</h3>
            <p className="text-muted-foreground">
              Your notes are encrypted and only accessible to you. We take your privacy seriously.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-soft border border-border">
            <div className="bg-gradient-primary p-3 rounded-lg w-fit mb-4">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Fast & Responsive</h3>
            <p className="text-muted-foreground">
              Lightning-fast interface that works seamlessly across all your devices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
