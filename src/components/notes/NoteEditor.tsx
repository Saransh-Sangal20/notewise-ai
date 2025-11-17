import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Note } from "@/pages/Notes";
import { FileText, X, Plus } from "lucide-react";

interface NoteEditorProps {
  note: Note | null;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
}

const NoteEditor = ({ note, onUpdateNote }: NoteEditorProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const titleDebounceRef = useRef<NodeJS.Timeout>();
  const contentDebounceRef = useRef<NodeJS.Timeout>();
  const tagsDebounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags || []);
    }
  }, [note?.id]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    
    if (titleDebounceRef.current) {
      clearTimeout(titleDebounceRef.current);
    }
    
    titleDebounceRef.current = setTimeout(() => {
      if (note) {
        onUpdateNote(note.id, { title: value });
      }
    }, 500);
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    
    if (contentDebounceRef.current) {
      clearTimeout(contentDebounceRef.current);
    }
    
    contentDebounceRef.current = setTimeout(() => {
      if (note) {
        onUpdateNote(note.id, { content: value });
      }
    }, 500);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      setNewTag("");
      
      if (tagsDebounceRef.current) {
        clearTimeout(tagsDebounceRef.current);
      }
      
      tagsDebounceRef.current = setTimeout(() => {
        if (note) {
          onUpdateNote(note.id, { tags: updatedTags });
        }
      }, 500);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    
    if (tagsDebounceRef.current) {
      clearTimeout(tagsDebounceRef.current);
    }
    
    tagsDebounceRef.current = setTimeout(() => {
      if (note) {
        onUpdateNote(note.id, { tags: updatedTags });
      }
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
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
    <div className="flex-1 flex flex-col bg-background">
      <div className="border-b border-border p-6 bg-card space-y-4">
        <Input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Note title..."
          className="text-3xl font-bold border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-auto"
        />
        
        {/* Tags Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a tag..."
              className="flex-1 h-9 text-sm"
            />
            <Button 
              onClick={handleAddTag}
              size="sm"
              variant="secondary"
              className="shrink-0"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
          
          {tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="text-sm px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 border-0 gap-1.5"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-destructive transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1 p-8 overflow-y-auto">
        <Textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Start writing your note..."
          className="min-h-full border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 resize-none text-lg leading-relaxed font-medium text-foreground"
        />
      </div>
    </div>
  );
};

export default NoteEditor;