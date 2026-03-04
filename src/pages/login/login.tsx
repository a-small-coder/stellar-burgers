import { FC, SyntheticEvent, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { clearError, loginUser } from '../../services/slices/user';
import {
  selectUserError,
  selectUserLoading,
  selectIsAuthenticated
} from '../../services/slices/user';
import { useForm } from '../../hooks/useForm';

export const Login: FC = () => {
  const { values, handleChange, setValues } = useForm({
    email: '',
    password: ''
  });
  const { email, password } = values;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const error = useSelector(selectUserError);
  const loading = useSelector(selectUserLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  // сброс страой ошибки
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && !loading && !error) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, loading, error, navigate, from]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      password={password}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      loading={loading}
    />
  );
};
