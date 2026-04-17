'use client';

import Link from 'next/link';
import { signIn } from 'next-auth/react'; // v5 compatible
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Card, Col, Container, Button, Form, Row } from 'react-bootstrap';
import { createUser } from '@/lib/dbActions';

type SignUpForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

/** The sign up page. */
const SignUp = () => {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email is invalid'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(40, 'Password must not exceed 40 characters'),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password'), ''], 'Confirm Password does not match'),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: SignUpForm) => {
    // console.log(JSON.stringify(data, null, 2));
    await createUser({
      name: data.name,
      email: data.email,
      password: data.password,
    });
    // After creating, signIn with redirect to the home page
    await signIn('credentials', { callbackUrl: '/', ...data });
  };
  return (
    <main className="main-bg auth-page">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} lg={10}>
            <div className="auth-shell auth-shell--signup">
              <div className="auth-panel auth-panel--brand auth-panel--signup-brand">
                <p className="auth-eyebrow">Create Account</p>
                <h1 className="auth-title">Join the Rainbow Locator network.</h1>
                <p className="auth-copy">
                  Create your account to report items, submit claims, and keep
                  everything organized in one place.
                </p>
                <div className="auth-steps">
                  <div className="auth-step">
                    <strong>1</strong>
                    <div>
                      <h3>Set up your profile</h3>
                      <p>Create a simple account for campus recovery tools.</p>
                    </div>
                  </div>
                  <div className="auth-step">
                    <strong>2</strong>
                    <div>
                      <h3>Report or claim</h3>
                      <p>Post missing items or respond to found listings quickly.</p>
                    </div>
                  </div>
                </div>
                <div className="auth-feature-list">
                  <span>Fast reporting flow</span>
                  <span>Verified claim process</span>
                  <span>Designed by PacificBytes</span>
                </div>
              </div>

              <Card className="form-card auth-panel auth-panel--form auth-panel--signup-form">
                <Card.Body>
                  <div className="auth-form-header">
                    <p className="section-kicker">Sign Up</p>
                    <h2 className="section-title auth-form-title">Create your account</h2>
                    <p className="auth-form-copy">Set up your profile to start using the platform and begin posting or tracking reports.</p>
                    <div className="auth-note-row auth-note-row--signup">
                      <span>No approval required</span>
                      <span>Start reporting right away</span>
                    </div>
                  </div>
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="form-group mb-3">
                      <Form.Label>Name</Form.Label>
                      <input
                        type="text"
                        {...register('name')}
                        placeholder="Your full name"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.name?.message}</div>
                    </Form.Group>

                    <Form.Group className="form-group mb-3">
                      <Form.Label>Email</Form.Label>
                      <input
                        type="email"
                        {...register('email')}
                        placeholder="you@hawaii.edu"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.email?.message}</div>
                    </Form.Group>

                    <Form.Group className="form-group mb-3">
                      <Form.Label>Password</Form.Label>
                      <input
                        type="password"
                        {...register('password')}
                        placeholder="At least 6 characters"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.password?.message}</div>
                    </Form.Group>
                    <Form.Group className="form-group mb-3">
                      <Form.Label>Confirm Password</Form.Label>
                      <input
                        type="password"
                        {...register('confirmPassword')}
                        placeholder="Re-enter your password"
                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
                    </Form.Group>
                    <Form.Group className="form-group pt-3">
                      <Row>
                        <Col>
                          <Button type="submit" className="btn-gold auth-submit-btn">
                            Create Account
                          </Button>
                        </Col>
                        <Col>
                          <Button type="button" onClick={() => reset()} variant="outline-warning" className="auth-reset-btn">
                            Reset
                          </Button>
                        </Col>
                      </Row>
                    </Form.Group>
                  </Form>
                </Card.Body>
                <Card.Footer className="auth-footer">
                  Already have an account?{' '}
                  <Link href="/auth/signin" className="link-green">Log in</Link>
                </Card.Footer>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default SignUp;
