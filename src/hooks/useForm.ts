import { useState, ChangeEvent } from 'react';

type TFormValues = {
  [key: string]: string;
};

export function useForm<T extends TFormValues>(inputValues: T) {
  const [values, setValues] = useState<T>(inputValues);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  return { values, handleChange, setValues };
}
