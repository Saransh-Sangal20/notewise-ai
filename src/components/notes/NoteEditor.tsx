import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Note } from "@/pages/Notes";
import { FileText } from "lucide-react";

interface NoteEditorProps {
  note: Note | null;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
}

const NoteEditor = ({ note, onUpdateNote }: NoteEditorProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (note) {
      onUpdateNote(note.id, { title: value });
    }
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    if (note) {
      onUpdateNote(note.id, { content: value });
    }
  };

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No Note Selected</h3>
          <p className="text-muted-foreground">Select a note or create a new one to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background p-8 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <Input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Note title"
          className="text-3xl font-bold border-0 px-0 mb-6 focus-visible:ring-0 placeholder:text-muted-foreground"
        />
        
        <Textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Start typing your note..."
          className="min-h-[calc(100vh-16rem)] border-0 px-0 resize-none focus-visible:ring-0 text-base leading-relaxed placeholder:text-muted-foreground"
        />
      </div>
    </div>
  );
};

export default NoteEditor;