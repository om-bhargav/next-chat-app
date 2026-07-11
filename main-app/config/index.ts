import { UserCircle2, Ban, UserPlus, MessagesSquare } from "lucide-react";
export const SITE_NAME = "FluxChat";

export const mainLinks = [
  { href: "/panel", label: "Chats", icon: MessagesSquare },
  { href: "/panel/requests", label: "Requests", icon: UserPlus },
  { href: "/panel/blocked", label: "Blocked", icon: Ban },
  { href: "/panel/profile", label: "Profile", icon: UserCircle2 },
];
