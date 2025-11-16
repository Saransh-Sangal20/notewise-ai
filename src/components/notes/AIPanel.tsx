import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { Note } from "@/pages/Notes";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIPanelProps {
  note: Note;
}

const AIPanel = ({ note }: AIPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    if (!note.content.trim()) {
      toast({
        title: "No Content",
        description: "Add some content to your note first.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setMessages([]);

    try {
      const { data, error } = await supabase.functions.invoke("ai-summarize", {
        body: { noteContent: note.content },
      });

      if (error) throw error;

      if (data.error) {
        if (data.error.includes("Rate limits")) {
          toast({
            title: "Rate Limit Exceeded",
            description: "Please try again in a moment.",
            variant: "destructive",
          });
        } else if (data.error.includes("Payment required")) {
          toast({
            title: "Credits Required",
            description: "Please add credits to your workspace to continue.",
            variant: "destructive",
          });
        } else {
          throw new Error(data.error);
        }
        return;
      }

      setMessages([
        {
          role: "assistant",
          content: data.summary,
        },
      ]);
    } catch (error: any) {
      toast({
        title: "AI Error",
        description: error.message || "Failed to generate summary",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages([...messages, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-summarize", {
        body: {
          noteContent: note.content,
          userMessage,
          conversationHistory: messages,
        },
      });

      if (error) throw error;

      if (data.error) {
        if (data.error.includes("Rate limits")) {
          toast({
            title: "Rate Limit Exceeded",
            description: "Please try again in a moment.",
            variant: "destructive",
          });
        } else if (data.error.includes("Payment required")) {
          toast({
            title: "Credits Required",
            description: "Please add credits to your workspace to continue.",
            variant: "destructive",
          });
        } else {
          throw new Error(data.error);
        }
        setMessages(messages.slice(0, -1));
        return;
      }

      setMessages([
        ...messages,
        { role: "user", content: userMessage },
        { role: "assistant", content: data.summary },
      ]);
    } catch (error: any) {
      toast({
        title: "AI Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
      setMessages(messages.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-96 border-l border-border bg-card flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-gradient-accent p-2 rounded-lg">
            <Sparkles className="w-4 h-4 text-accent-foreground" />
          </div>
          <h2 className="font-semibold text-foreground">Nova AI</h2>
        </div>
        
        <Button
          onClick={handleSummarize}
          disabled={loading || !note.content.trim()}
          className="w-full bg-gradient-accent hover:opacity-90 transition-opacity"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Summary
            </>
          )}
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              Generate a summary or ask questions about your note
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <Card
                key={index}
                className={`p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground ml-4"
                    : "bg-secondary mr-4"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
            placeholder="Ask about this note..."
            disabled={loading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
            size="icon"
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIPanel;