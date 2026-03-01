import {
  Building2, Users, ArrowRight, ArrowRightLeft, Home, Heart,
  Shield, FileText, BookOpen, Wallet, Coffee, AlertTriangle,
  TrendingUp, ClipboardCheck, Newspaper, GitBranch, Calculator,
  Settings, Globe, Menu, X, LayoutDashboard, Banknote, SquarePen,
  Gamepad2, MessageSquare, Bell,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Building2,
  Users,
  ArrowRight,
  ArrowRightLeft,
  Home,
  Heart,
  Shield,
  FileText,
  BookOpen,
  Wallet,
  Coffee,
  AlertTriangle,
  TrendingUp,
  ClipboardCheck,
  Newspaper,
  GitBranch,
  Calculator,
  Settings,
  Globe,
  Menu,
  X,
  LayoutDashboard,
  Banknote,
  PenSquare: SquarePen,
  Gamepad2,
  MessageSquare,
  Bell,
};

export function getIcon(name: string | null | undefined): LucideIcon | null {
  if (!name) return null;
  return iconMap[name] ?? null;
}
