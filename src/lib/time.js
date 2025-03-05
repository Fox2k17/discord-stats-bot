const secondsTo_DGMS = (sekundy) => {
  const minuta = 60;
  const godzina = minuta * 60;
  const dzien = godzina * 24;

  const dni = Math.floor(sekundy / dzien);
  sekundy %= dzien;

  const godziny = Math.floor(sekundy / godzina);
  sekundy %= godzina;

  const minuty = Math.floor(sekundy / minuta);
  sekundy %= minuta;

  return { dni, godziny, minuty, sekundy };
}
const secondsTo_GMS = (sekundy) => {
  const minuta = 60;
  const godzina = minuta * 60;

  const godziny = Math.floor(sekundy / godzina);
  sekundy %= godzina;

  const minuty = Math.floor(sekundy / minuta);
  sekundy %= minuta;

  return { godziny, minuty, sekundy };
}

module.exports = {
    secondsTo_DGMS,
    secondsTo_GMS,
};
