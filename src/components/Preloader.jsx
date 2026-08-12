import { useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';

const Preloader = forwardRef(function Preloader({ onDismiss }, ref) {
  const dismissed = useRef(false);
  const elRef = useRef(null);

  const dismiss = useCallback(() => {
    if (dismissed.current) return;
    dismissed.current = true;
    const p = elRef.current;
    if (p) p.classList.add('hidden');
    document.body.classList.remove('loading');
    onDismiss?.();
  }, [onDismiss]);

  useImperativeHandle(ref, () => ({ dismiss }), [dismiss]);

  useEffect(() => {
    document.body.classList.add('loading');

    const t1 = setTimeout(dismiss, 1400);
    const t2 = setTimeout(dismiss, 4000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.body.classList.remove('loading');
    };
  }, [dismiss]);

  return (
    <div id="preloader" ref={elRef}>
      <div className="preloader-inner">
        <div className="preloader-logo-img">
          <img src="/assets/logo.png" alt="mubi" />
        </div>
        <div className="preloader-title">MUBI</div>
        <div className="preloader-sub">DEV · DESIGN · FUTURE MD</div>
        <div className="preloader-bar">
          <div className="preloader-fill" />
        </div>
        <div className="preloader-mono">BOOTING STACK…</div>
      </div>
    </div>
  );
});

export default Preloader;
