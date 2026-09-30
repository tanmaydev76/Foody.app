export function isRestaurantOpen(openHours?: { open: string; close: string }): boolean {
  const open  = openHours?.open  ?? '10:00';
  const close = openHours?.close ?? '23:00';

  const now = new Date();
  const [oh, om] = open.split(':').map(Number);
  const [ch, cm] = close.split(':').map(Number);

  const currentMins = now.getHours() * 60 + now.getMinutes();
  const openMins    = oh * 60 + om;
  let   closeMins   = ch * 60 + cm;

  if (closeMins <= openMins) closeMins += 24 * 60; // overnight close (e.g. 01:00 next day)

  if (closeMins > 24 * 60) {
    return currentMins >= openMins || currentMins < (closeMins - 24 * 60);
  }

  return currentMins >= openMins && currentMins < closeMins;
}
