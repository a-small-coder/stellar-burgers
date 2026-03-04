import { ChangeEvent, SyntheticEvent } from 'react';

export type TProfileForm = {
  name: string;
  email: string;
  password: string;
};

export type ProfileUIProps = {
  formValue: TProfileForm;
  isFormChanged: boolean;
  handleSubmit: (e: SyntheticEvent) => void;
  handleCancel: (e: SyntheticEvent) => void;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  updateUserError?: string;
};
