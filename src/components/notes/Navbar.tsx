import { Button } from "@/components/ui/button";
import { StickyNote, Plus, LogOut } from "lucide-react";

interface NavbarProps {
  onSignOut: () => void;
  onCreateNote: () => void;
}

const Navbar = ({ onSignOut, onCreateNote }: NavbarProps) => {
  return (
    <nav className="h-16 border-b border-border bg-card shadow-soft">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-gradient-primary p-2 rounded-xl shadow-soft">
            <StickyNote className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="ml-3 text-xl font-bold text-foreground">NotesAI</h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={onCreateNote}
            className="bg-gradient-primary hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Note
          </Button>
          
          <Button
            onClick={onSignOut}
            variant="outline"
            className="border-border hover:bg-secondary"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;