import { FC, useState } from 'react';
import {
  Input,
  Button,
  PasswordInput
} from '@zlden/react-developer-burger-ui-components';
import styles from '../common.module.css';
import { Link } from 'react-router-dom';
import { RegisterUIProps } from './type';
import { ErrorMessage } from '../../error-message';

export const RegisterUI: FC<RegisterUIProps> = ({
  errorText,
  email,
  password,
  userName,
  handleSubmit,
  handleChange
}) => (
  <main className={styles.container}>
    <div className={`pt-6 ${styles.wrapCenter}`}>
      <h3 className='pb-6 text text_type_main-medium'>Регистрация</h3>
      <form
        className={`pb-15 ${styles.form}`}
        name='register'
        onSubmit={handleSubmit}
      >
        <>
          <div className='pb-6'>
            <Input
              type='text'
              placeholder='Имя'
              onChange={handleChange}
              value={userName}
              name='name'
              error={false}
              errorText=''
              size='default'
            />
          </div>
          <div className='pb-6'>
            <Input
              type='email'
              placeholder='E-mail'
              onChange={handleChange}
              value={email}
              name={'email'}
              error={false}
              errorText=''
              size={'default'}
            />
          </div>
          <div className='pb-6'>
            <PasswordInput
              onChange={handleChange}
              value={password}
              name='password'
            />
          </div>
          <div className={`pb-6 ${styles.button}`}>
            <Button type='primary' size='medium' htmlType='submit'>
              Зарегистрироваться
            </Button>
          </div>
          {errorText && (
            <ErrorMessage className={styles.error + ' pb-6'}>
              {errorText}
            </ErrorMessage>
          )}
        </>
      </form>
      <div className={`${styles.question} text text_type_main-default pb-6`}>
        Уже зарегистрированы?
        <Link to='/login' className={`pl-2 ${styles.link}`}>
          Войти
        </Link>
      </div>
    </div>
  </main>
);
