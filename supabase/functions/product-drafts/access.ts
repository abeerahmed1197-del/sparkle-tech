export function allowsDraftAccess(user: { id: string } | null, roles: { user_id: string; role: string }[]) {
  return !!user && roles.some(role => role.user_id === user.id && role.role === 'admin');
}