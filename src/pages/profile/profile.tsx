import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectUser,
  selectUpdateError,
  updateUser
} from '../../services/slices/user';
import { useForm } from '../../hooks/useForm';
import { TProfileForm } from '../../components/ui/pages/profile/type';

export const Profile: FC = () => {
  const user = useSelector(selectUser);
  const updateError = useSelector(selectUpdateError);
  const dispatch = useDispatch();

  const { values, handleChange, setValues } = useForm<TProfileForm>({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  const { name, email, password } = values;

  useEffect(() => {
    if (user) {
      setValues((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user, setValues]);

  const isFormChanged =
    name !== user?.name || email !== user?.email || !!password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const updateData: { name?: string; email?: string; password?: string } = {};
    if (name !== user?.name) updateData.name = name;
    if (email !== user?.email) updateData.email = email;
    if (password) updateData.password = password;
    dispatch(updateUser(updateData)).then(() => {
      setValues((prev) => ({ ...prev, password: '' }));
    });
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setValues({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  return (
    <ProfileUI
      formValue={values}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      updateUserError={updateError || ''}
    />
  );
};
