'use client';

import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react'; // v5 compatible
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import swal from 'sweetalert';
import { Card, Col, Container, Button, Form, Row } from 'react-bootstrap';
import Link from 'next/link';
import { changePassword } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';

type ChangePasswordForm = {
  oldpassword: string;
  password: string;
  confirmPassword: string;
  // acceptTerms: boolean;
};

/** The change password page. */
const ChangePassword = () => {
  const { data: session, status } = useSession();
  const email = session?.user?.email || '';
  const validationSchema = Yup.object().shape({
    oldpassword: Yup.string().required('Password is required'),
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
  } = useForm<ChangePasswordForm>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: ChangePasswordForm) => {
    // console.log(JSON.stringify(data, null, 2));
    await changePassword({ email, ...data });
    await swal('Password Changed', 'Your password has been changed', 'success', { timer: 2000 });
    reset();
  };

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  return (
    <main className="main-bg auth-page">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} lg={10}>
            <div className="auth-shell auth-shell--signin">
              <div className="auth-panel auth-panel--brand auth-panel--signin-brand">
                <p className="auth-eyebrow">Security Center</p>
                <h1 className="auth-title">Update your credentials.</h1>
                <p className="auth-copy">
                  Ensure your account remains secure by regularly updating your password.
                  A strong password helps protect your reports and claims.
                </p>
                <div className="auth-status-stack">
                  <div className="auth-status-card">
                    <strong>Secure encryption</strong>
                    <span>Your new password is hashed and stored securely in the PacificBytes database.</span>
                  </div>
                  <div className="auth-status-card">
                    <strong>Immediate update</strong>
                    <span>Changes take effect instantly across all your devices and active sessions.</span>
                  </div>
                </div>
                <div className="auth-feature-list">
                  <span>Credential protection</span>
                  <span>UH Manoa community</span>
                  <span>Safe session management</span>
                </div>
              </div>

              <Card className="form-card auth-panel auth-panel--form auth-panel--signin-form">
                <Card.Body>
                  <div className="auth-form-header">
                    <p className="section-kicker">Security</p>
                    <h2 className="section-title auth-form-title">Change Password</h2>
                    <p className="auth-form-copy">Update your account credentials to keep your recovery data safe.</p>
                  </div>
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="form-group mb-3">
                      <Form.Label>Old Password</Form.Label>
                      <input
                        type="password"
                        {...register('oldpassword')}
                        placeholder="Enter your current password"
                        className={`form-control ${errors.oldpassword ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.oldpassword?.message}</div>
                    </Form.Group>

                    <Form.Group className="form-group mb-3">
                      <Form.Label>New Password</Form.Label>
                      <input
                        type="password"
                        {...register('password')}
                        placeholder="At least 6 characters"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.password?.message}</div>
                    </Form.Group>
                    <Form.Group className="form-group mb-4">
                      <Form.Label>Confirm New Password</Form.Label>
                      <input
                        type="password"
                        {...register('confirmPassword')}
                        placeholder="Re-enter your new password"
                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
                    </Form.Group>
                    <Form.Group className="form-group pt-2">
                      <Row>
                        <Col>
                          <Button type="submit" className="btn-gold auth-submit-btn">
                            Update Password
                          </Button>
                        </Col>
                        <Col xs="auto">
                          <Button type="button" onClick={() => reset()} variant="outline-warning" className="auth-reset-btn" style={{ padding: '0.8rem 1.4rem' }}>
                            Reset
                          </Button>
                        </Col>
                      </Row>
                    </Form.Group>
                  </Form>
                  <div className="auth-form-meta mt-4">
                    <span>Secure credential update</span>
                    <span>PacificBytes Security</span>
                  </div>
                </Card.Body>
                <Card.Footer className="auth-footer">
                  Changed your mind?{' '}
                  <Link href="/" className="link-green">Back to home</Link>
                </Card.Footer>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default ChangePassword;
