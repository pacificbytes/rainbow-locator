'use client';

import { useSession } from 'next-auth/react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { redirect } from 'next/navigation';
import { addItem } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ReportItemSchema } from '@/lib/validationSchemas';

const ReportItemForm: React.FC = () => {
  const { data: session, status } = useSession();
  const userId = session?.user?.id || '';
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ReportItemSchema),
    defaultValues: {
      ownerId: userId,
    },
  });

  // Update ownerId when session is loaded
  if (userId) {
    setValue('ownerId', userId);
  }

  const onSubmit = async (data: any) => {
    await addItem(data);
    swal('Success', 'Your item has been reported', 'success', {
      timer: 2000,
    });
  };

  if (status === 'loading') {
    return <LoadingSpinner />;
  }
  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={10} md={7} lg={6}>
          <Col className="text-center">
            <h2>Report Lost or Found Item</h2>
          </Col>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group>
                  <Form.Label>Title</Form.Label>
                  <input
                    type="text"
                    {...register('title')}
                    className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.title?.message}</div>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <textarea
                    {...register('description')}
                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.description?.message}</div>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <input
                    type="text"
                    {...register('category')}
                    className={`form-control ${errors.category ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.category?.message}</div>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Type</Form.Label>
                  <select {...register('type')} className={`form-control ${errors.type ? 'is-invalid' : ''}`}>
                    <option value="">Select Type</option>
                    <option value="lost">Lost</option>
                    <option value="found">Found</option>
                  </select>
                  <div className="invalid-feedback">{errors.type?.message}</div>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Location</Form.Label>
                  <input
                    type="text"
                    {...register('location')}
                    className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.location?.message}</div>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Date</Form.Label>
                  <input
                    type="date"
                    {...register('date')}
                    className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.date?.message}</div>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Image URL (Optional)</Form.Label>
                  <input
                    type="text"
                    {...register('image')}
                    className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.image?.message}</div>
                </Form.Group>
                <input type="hidden" {...register('ownerId')} />
                <Form.Group className="form-group">
                  <Row className="pt-3">
                    <Col>
                      <Button type="submit" variant="primary">
                        Submit
                      </Button>
                    </Col>
                    <Col>
                      <Button type="button" onClick={() => reset()} variant="warning" className="float-right">
                        Reset
                      </Button>
                    </Col>
                  </Row>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ReportItemForm;
