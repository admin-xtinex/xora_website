import type { AnchorHTMLAttributes, MouseEvent } from 'react';
import { navigate } from './router';

type FeLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string };

/** A real `<a href>` (works without JS, middle-click, copy link) that uses the History-API router on a plain click. */
export function FeLink({ to, onClick, target, ...rest }: FeLinkProps) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (target && target !== '_self') return;
    e.preventDefault();
    navigate(to);
  };
  return <a href={to} target={target} onClick={handle} {...rest} />;
}
