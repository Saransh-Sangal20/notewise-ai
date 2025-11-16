import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Session, User } from "@supabase/supabase-js";
import NotesList from "@/components/notes/NotesList";
import NoteEditor from "@/components/notes/NoteEditor";
import AIPanel from "@/components/notes/AIPanel";
import Navbar from "@/components/notes/Navbar";

export interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

const Notes = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session) {
          navigate("/auth");
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/auth");
      } else {
        fetchNotes();
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      toast({
        title: "Error fetching notes",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setNotes(data || []);
    }
  };

  const handleCreateNote = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("notes")
      .insert([
        {
          title: "Untitled Note",
          content: "",
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      toast({
        title: "Error creating note",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setNotes([data, ...notes]);
      setSelectedNote(data);
      toast({
        title: "Note created",
        description: "Your new note has been created.",
      });
    }
  };

  const handleUpdateNote = async (id: string, updates: Partial<Note>) => {
    const { error } = await supabase
      .from("notes")
      .update(updates)
      .eq("id", id);

    if (error) {
      toast({
        title: "Error updating note",
        description: error.message,
        variant: "destructive",
      });
    } else {
      // Update local state
      setNotes(notes.map((note) => (note.id === id ? { ...note, ...updates } : note)));
      if (selectedNote?.id === id) {
        setSelectedNote({ ...selectedNote, ...updates });
      }
    }
  };

  const handleDeleteNote = async (id: string) => {
    const { error } = await supabase.from("notes").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error deleting note",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setNotes(notes.filter((note) => note.id !== id));
      if (selectedNote?.id === id) {
        setSelectedNote(null);
      }
      toast({
        title: "Note deleted",
        description: "Your note has been deleted.",
      });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar onSignOut={handleSignOut} onCreateNote={handleCreateNote} />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <NotesList
          notes={notes}
          selectedNote={selectedNote}
          onSelectNote={setSelectedNote}
          onDeleteNote={handleDeleteNote}
        />
        
        <div className="flex-1 flex">
          <NoteEditor
            note={selectedNote}
            onUpdateNote={handleUpdateNote}
          />
          
          {selectedNote && (
            <AIPanel note={selectedNote} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;