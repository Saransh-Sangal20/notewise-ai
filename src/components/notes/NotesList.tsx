import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, FileText } from "lucide-react";
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
            {notes.map((note) => (
              <Card
                key={note.id}
                className={`group relative overflow-hidden cursor-pointer transition-all duration-300 ${
                  selectedNote?.id === note.id
                    ? "bg-gradient-subtle border-primary/50 shadow-elegant ring-1 ring-primary/20"
                    : "bg-card/50 backdrop-blur-sm hover:bg-gradient-subtle hover:shadow-soft hover:border-primary/30"
                }`}
                onClick={() => onSelectNote(note)}
              >
                {selectedNote?.id === note.id && (
                  <div className="absolute inset-0 bg-gradient-primary opacity-5" />
                )}
                
                <div className="relative p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full transition-colors ${
                          selectedNote?.id === note.id ? "bg-primary" : "bg-muted-foreground/40"
                        }`} />
                        <h3 className="font-semibold text-foreground truncate">
                          {note.title || "Untitled Note"}
                        </h3>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed pl-3.5">
                        {note.content || "No content"}
                      </p>
                      
                      <div className="flex items-center gap-2 pl-3.5">
                        <div className="h-px flex-1 bg-border/50" />
                        <p className="text-xs text-muted-foreground/80 font-medium">
                          {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
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
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesList;