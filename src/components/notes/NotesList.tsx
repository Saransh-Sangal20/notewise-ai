import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, FileText, Clock, Type, Tag } from "lucide-react";
import { Note } from "@/pages/Notes";
import { formatDistanceToNow } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface NotesListProps {
  notes: Note[];
  selectedNote: Note | null;
  onSelectNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
}

const NotesList = ({ notes, selectedNote, onSelectNote, onDeleteNote }: NotesListProps) => {
  return (
    <div className="w-80 border-r border-border bg-card overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-foreground mb-4">Your Notes</h2>
        
        {notes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No notes yet</p>
            <p className="text-sm text-muted-foreground mt-1">Create your first note to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => {
              const wordCount = note.content ? note.content.split(/\s+/).filter(Boolean).length : 0;
              const charCount = note.content?.length || 0;
              
              return (
                <Card
                  key={note.id}
                  className={`group relative overflow-hidden cursor-pointer transition-all duration-300 border-l-4 ${
                    selectedNote?.id === note.id
                      ? "bg-gradient-subtle border-l-primary border-primary/50 shadow-elegant"
                      : "bg-card backdrop-blur-sm border-l-border hover:border-l-primary/60 hover:bg-gradient-subtle hover:shadow-soft"
                  }`}
                  onClick={() => onSelectNote(note)}
                >
                  <div className="p-5 space-y-3">
                    {/* Header with title and delete button */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <div className={`p-2 rounded-lg transition-colors ${
                          selectedNote?.id === note.id 
                            ? "bg-primary/15" 
                            : "bg-muted/60 group-hover:bg-primary/15"
                        }`}>
                          <FileText className={`w-4 h-4 ${
                            selectedNote?.id === note.id ? "text-primary" : "text-muted-foreground"
                          }`} />
                        </div>
                        <h3 className="font-bold text-lg text-foreground truncate">
                          {note.title || "Untitled Note"}
                        </h3>
                      </div>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Note</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this note? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDeleteNote(note.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                    
                    {/* Tags section */}
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                        {note.tags.map((tag, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary"
                            className="text-xs px-2 py-0.5 bg-primary/10 text-primary hover:bg-primary/20 border-0"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {/* Content preview - More visible */}
                    <div className="bg-muted/30 rounded-lg p-3 min-h-[60px]">
                      <p className="text-sm text-foreground/80 line-clamp-2 leading-relaxed font-medium">
                        {note.content || "No content yet. Start writing..."}
                      </p>
                    </div>
                    
                    {/* Footer with metadata */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Type className="w-3.5 h-3.5" />
                          <span>{wordCount} words</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                        <div className="flex items-center gap-1.5 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}</span>
                        </div>
                      </div>
                      
                      {charCount > 500 && (
                        <div className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                          Long
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesList;