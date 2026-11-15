// Player de vídeo em modal: iframe do YouTube (youtube-nocookie) criado só quando o modal abre, ou seja, depois do e-mail.
import { useId } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useDialog } from '../hooks/useDialog';

export default function VideoModal({ youtubeId, title, closeLabel, onClose }: { youtubeId: string; title: string; closeLabel: string; onClose: () => void }) {
  const dialogRef = useDialog(onClose);
  const titleId = useId();
  return createPortal(
    <div className="fixed inset-0 bg-black/75 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} className="w-full max-w-[960px] max-h-[96dvh]">
        <div className="flex items-center justify-between gap-4 mb-3 text-white">
          <h3 id={titleId} className="font-serif text-lg md:text-xl leading-snug">{title}</h3>
          <button type="button" onClick={onClose} aria-label={closeLabel} className="shrink-0 min-h-11 min-w-11 inline-flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeId)}?autoplay=1&rel=0`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
