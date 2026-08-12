export default function Reveal({ children, className = '', as: Tag = 'div', ...rest }) {
  const classes = ['reveal', className].filter(Boolean).join(' ');
  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}
