import React, { useEffect, useRef } from 'react';

interface HeroVideoProps {
  src: string;
  label: string;
  className?: string;
}

// Video de fondo en loop. Además del atributo `loop`, lo reinicia a mano al terminar y
// lo vuelve a reproducir si el navegador lo pausa (al cambiar el tamaño de la ventana,
// emular otro dispositivo, o volver a la pestaña), que es cuando se quedaba congelado.
export const HeroVideo: React.FC<HeroVideoProps> = ({ src, label, className }) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const play = () => {
      if (document.hidden) return;
      const p = video.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    };
    const restart = () => {
      video.currentTime = 0;
      play();
    };
    const onVisibility = () => {
      if (!document.hidden && video.paused) play();
    };

    video.muted = true;
    video.addEventListener('ended', restart);
    video.addEventListener('pause', play);
    video.addEventListener('stalled', play);
    video.addEventListener('suspend', play);
    video.addEventListener('canplay', play);
    window.addEventListener('resize', play);
    document.addEventListener('visibilitychange', onVisibility);

    // Red de seguridad: si por lo que sea sigue pausado o parado en el final, lo arranca.
    const watchdog = window.setInterval(() => {
      if (document.hidden) return;
      if (video.ended || (video.duration && video.currentTime >= video.duration - 0.05)) restart();
      else if (video.paused) play();
    }, 1000);

    play();

    return () => {
      video.removeEventListener('ended', restart);
      video.removeEventListener('pause', play);
      video.removeEventListener('stalled', play);
      video.removeEventListener('suspend', play);
      video.removeEventListener('canplay', play);
      window.removeEventListener('resize', play);
      document.removeEventListener('visibilitychange', onVisibility);
      window.clearInterval(watchdog);
    };
  }, [src]);

  return (
    <video
      ref={ref}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-label={label}
      className={className}
    />
  );
};
