import { FC, ReactNode } from 'react';

type ErrorMessageProps = {
  children: ReactNode;
  className?: string;
};

export const ErrorMessage: FC<ErrorMessageProps> = ({
  children,
  className
}) => (
  <p className={`text text_type_main-default ${className ?? ''}`}>{children}</p>
);
