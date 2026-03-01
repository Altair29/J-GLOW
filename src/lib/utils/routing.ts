import type { Role } from '@/types/database';

export function getHomePath(role: Role | string): string {
  switch (role) {
    case 'admin':    return '/admin';
    case 'editor':   return '/admin';
    case 'business': return '/business/home';
    case 'worker':   return '/worker/home';
    default:         return '/';
  }
}
