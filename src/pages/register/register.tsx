import { FC, SyntheticEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  registerUser,
  selectUserError,
  selectUserLoading,
  selectIsAuthenticated
} from '../../services/slices/user';
import { useForm } from '../../hooks/useForm';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector(selectUserError);
  const loading = useSelector(selectUserLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const { values, handleChange } = useForm({
    email: '',
    password: '',
    userName: ''
  });
  const { email, password, userName } = values;

  useEffect(() => {
    if (isAuthenticated && !loading && !error) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, loading, error, navigate]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(registerUser({ name: userName, email, password }));
  };

  return (
    <RegisterUI
      errorText={error || ''}
      email={email}
      userName={userName}
      password={password}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
