export function matchRoles(givenRole: string, requiredRoles: string[]) {
  return requiredRoles.includes(givenRole);
}
