export const formatVolume = (vol: number): string => {
  if (vol >= 1e9) return (vol / 1e9).toFixed(2) + "B";
  if (vol >= 1e6) return (vol / 1e6).toFixed(2) + "M";
  if (vol >= 1e3) return (vol / 1e3).toFixed(2) + "K";
  return vol.toFixed(0);
};

export const formatDuration = (ms: number): string => {
  if (ms >= 86400000) return (ms / 86400000).toFixed(1) + "d";
  if (ms >= 3600000) return (ms / 3600000).toFixed(1) + "h";
  return (ms / 60000).toFixed(0) + "m";
};

export const formatPrice = (price: number): string => {
  return "$" + new Intl.NumberFormat("en-US").format(price);
};

export const formatDate = (date: number): string => {
  return new Date(date * 1000).toLocaleDateString("id-ID");
};