export function fullNameController(
  firstName: string | null | undefined,
  lastName: string | null | undefined
) {
  return `${firstName || 'N/A '} ${lastName || ''}`;
}
