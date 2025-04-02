export function stringFullNameAvatar(name: string | null) {
  let initials = 'N/A'; 
  if (name) {
    const nameSplit = name.split(' ').filter(i => i.length > 0);
    if (nameSplit.length > 1) {
      initials = `${nameSplit[0]?.charAt(0).toUpperCase()}${nameSplit[1]?.charAt(0).toUpperCase()}`;
    } else if (nameSplit.length > 0) {
      initials = `${nameSplit[0]?.charAt(0).toUpperCase()}`;
    }
  }

  return {
    children: initials,
  };
}