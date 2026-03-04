import { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate
} from 'react-router-dom';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, Modal, IngredientDetails, OrderInfo } from '@components';
import { ProtectedRoute } from '../protected-route';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { useDispatch, useSelector } from '../../services/store';
import { checkUserAuth } from '../../services/slices/user';
import {
  fetchIngredients,
  selectIngredients
} from '../../services/slices/ingredients';

const ModalSwitch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;

  const handleCloseModal = () => {
    navigate(-1);
  };

  return (
    <>
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleCloseModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title='' onClose={handleCloseModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title='' onClose={handleCloseModal}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </>
  );
};

const App = () => {
  const dispatch = useDispatch();

  const ingredients = useSelector(selectIngredients);
  useEffect(() => {
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  useEffect(() => {
    dispatch(checkUserAuth());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <BrowserRouter>
        <AppHeader />
        <ModalSwitch />
      </BrowserRouter>
    </div>
  );
};

export default App;
