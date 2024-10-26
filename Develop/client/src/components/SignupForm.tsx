import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { ADD_USER } from '../utils/mutations';
import { useMutation } from '@apollo/client';
// import { createUser } from '../utils/API';
import Auth from '../utils/auth';
import type { User } from '../models/User';

// biome-ignore lint/correctness/noEmptyPattern: <explanation>
const SignupForm = ({ handleModalClose }: { handleModalClose: () => void }) => {
  // set initial form state
  const [userFormData, setUserFormData] = useState<User>({ username: '', email: '', password: '', savedBooks: [] });
  // set state for form validation
  const [validated] = useState(false);
  // set state for alert
  const [showAlert, setShowAlert] = useState(false);
  const [signup, { error }] = useMutation(ADD_USER, {
    onError: (error) => {
      console.error('Mutation error: ', error);
      setShowAlert(true);
    },
  });

  //update state based on form input changes
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserFormData({
      ...userFormData,
      [name]: value,
    });
  };

  // const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = event.target;
  //   setUserFormData({ ...userFormData, [name]: value });
  // };

  // submit form
  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const { data } = await signup({
        variables: { input: { ...userFormData } },
      });

      const token = data?.signup?.token;
      if (token) {
        Auth.login(token);
        handleModalClose();
      }

      //   const response = await createUser(userFormData);

      //   if (!response.ok) {
      //     throw new Error('something went wrong!');
      //   }

      //   const { token } = await response.json();
      //   Auth.login(token);
      // } catch (err) {
      //   console.error(err);
      //   setShowAlert(true);
      // }

      // setUserFormData({
      //   username: '',
      //   email: '',
      //   password: '',
      //   savedBooks: [],
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    };

    setUserFormData({ username: '', email: '', password: '', savedBooks: [] });
  };

  return (
    <>
      {/* This is needed for the validation functionality above */}
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        {/* show alert if server response is bad */}
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          {error ? error.message : 'Something went wrong with your signup!'}
        </Alert>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='username'>Username</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your username'
            name='username'
            onChange={handleInputChange}
            value={userFormData.username || ''}
            required
          />
          <Form.Control.Feedback type='invalid'>Username is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='Your email address'
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
          disabled={!(userFormData.username && userFormData.email && userFormData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default SignupForm;
