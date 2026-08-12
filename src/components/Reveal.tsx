import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';

type RevealProps<T extends ElementType = 'div'> = {
  as?: T;
  children?: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

export default function Reveal<T extends ElementType = 'div'>({
  children,
  className = '',
  as,
  ...rest
}: RevealProps<T>) {
  const Tag = (as || 'div') as ElementType;
  const classes = ['reveal', className].filter(Boolean).join(' ');
  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}
