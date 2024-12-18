// see SignupForm.js for comments
import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { Book } from '../models/Book';
import { useMutation } from '@apollo/client';
import { Form, Button, Alert } from 'react-bootstrap';
import { LOGIN_USER } from '../utils/mutations';
// import { loginUser } from '../utils/API';
import Auth from '../utils/auth';

// biome-ignore lint/correctness/noEmptyPattern: <explanation>
const LoginForm = ({ handleModalClose }: { handleModalClose: () => void }) => {
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const [loginUser, { error }] = useMutation(LOGIN_USER);
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const { data } = await loginUser({
        variables: { ...userFormData },
      });

      Auth.login(data.loginUser.token);
      handleModalClose();

      // Store user's savedBooks in local storage
      const bookIds = data.loginUser.user.savedBooks.map((book: Book) => book.bookId);
      if(data.loginUser.user.savedBooks) {
        localStorage.setItem('saved_books', JSON.stringify(bookIds));
      }
      //   const response = await loginUser(userFormData);

      //   if (!response.ok) {
      //     throw new Error('something went wrong!');
      //   }

      //   const { token } = await response.json();
      //   Auth.login(token);
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    // clear form values
    setUserFormData({
      email: '',
      password: '',
    });
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        {error && (<Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your login credentials!
        </Alert>)}
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your email'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email || ''}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password || ''}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userFormData.email && userFormData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;
