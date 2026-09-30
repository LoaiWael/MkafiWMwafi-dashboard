import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { profileInitials } from "@/features/profile/components/profile-banner";
import type { DirectoryPerson } from "@/features/profile/types";

interface ProfileDirectoryProps {
  people: readonly DirectoryPerson[];
  basePath: string;
}

export default function ProfileDirectory({
  people,
  basePath,
}: ProfileDirectoryProps) {
  return (
    <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {people.map((person) => (
        <li key={person.id}>
          <Link
            to={`${basePath}/${person.id}`}
            viewTransition
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-xs transition-colors hover:bg-muted/40"
          >
            <Avatar className="size-12">
              {person.avatarUrl ? (
                <AvatarImage src={person.avatarUrl} alt="" />
              ) : null}
              <AvatarFallback className="bg-primary/10 font-bold text-primary">
                {profileInitials(person.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 text-start">
              <p className="truncate text-sm font-bold text-foreground">
                {person.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {person.role}
              </p>
            </div>
            <Badge
              variant="outline"
              className={
                person.active
                  ? "border-primary/20 bg-primary/10 text-primary"
                  : "text-muted-foreground"
              }
            >
              {person.active ? "نشط" : "موقوف"}
            </Badge>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground rtl:rotate-180" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
