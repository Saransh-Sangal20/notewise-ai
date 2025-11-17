import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, FileText, Clock, Type } from "lucide-react";
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
                      : "bg-card/50 backdrop-blur-sm border-l-border hover:border-l-primary/60 hover:bg-gradient-subtle hover:shadow-soft"
                  }`}
                  onClick={() => onSelectNote(note)}
                >
                  <div className="p-4 space-y-3">
                    {/* Header with title and delete button */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className={`p-1.5 rounded-md transition-colors ${
                          selectedNote?.id === note.id 
                            ? "bg-primary/10" 
                            : "bg-muted/50 group-hover:bg-primary/10"
                        }`}>
                          <FileText className={`w-3.5 h-3.5 ${
                            selectedNote?.id === note.id ? "text-primary" : "text-muted-foreground"
                          }`} />
                        </div>
                        <h3 className="font-semibold text-base text-foreground truncate">
                          {note.title || "Untitled Note"}
                        </h3>
                      </div>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-all text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
                    
                    {/* Content preview with fade effect */}
                    <div className="relative">
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {note.content || "No content yet. Start writing..."}
                      </p>
                      <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-card to-transparent pointer-events-none" />
                    </div>
                    
                    {/* Footer with metadata */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground/70">
                        <div className="flex items-center gap-1">
                          <Type className="w-3 h-3" />
                          <span>{wordCount} words</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}</span>
                        </div>
                      </div>
                      
                      {charCount > 500 && (
                        <div className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
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