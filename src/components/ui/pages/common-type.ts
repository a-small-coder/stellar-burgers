import { ChangeEvent, SyntheticEvent } from 'react';

export type PageUIProps = {
  errorText: string | undefined;
  email: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: SyntheticEvent) => void;
};
