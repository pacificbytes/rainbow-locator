'use client';

import { useSession } from 'next-auth/react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { Resolver, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { redirect } from 'next/navigation';
import { addItem } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ReportItemSchema } from '@/lib/validationSchemas';
import { PlusCircle, Eraser } from 'react-bootstrap-icons';

interface ReportItemData {
  title: string;
  description: string;
  category: string;
  type: string;
  location: string;
  date: string;
  image: FileList;
  ownerId: string;
}

const ReportItemForm: React.FC = () => {
  const { data: session, status } = useSession();
  const userId = session?.user?.id || '';
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ReportItemData>({
    resolver: yupResolver(ReportItemSchema) as unknown as Resolver<ReportItemData>,
    defaultValues: {
      ownerId: userId,
    },
  });

  // Update ownerId when session is loaded
  if (userId) {
    setValue('ownerId', userId);
  }

  const onSubmit = async (data: ReportItemData) => {
    try {
      await addItem({
        ...data,
        date: new Date(data.date),
        image: data.image[0], // Pass the first file from FileList
      });
      swal('Success', 'Your item has been reported successfully!', 'success', {
        timer: 2000,
      });
    } catch (error) {
      swal('Error', (error as Error).message || 'Failed to report item', 'error');
    }
  };

  if (status === 'loading') {
    return <LoadingSpinner />;
  }
  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  return (
    <main className="main-bg section-padding">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <div className="text-center mb-4">
              <h2 className="section-title" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                Report an Item
              </h2>
              <p className="text-muted">
                Help the UH Mānoa community by listing a lost or found object.
              </p>
            </div>

            <Card className="form-card">
              <Card.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Row>
                    <Col md={12} className="mb-3">
                      <Form.Group>
                        <Form.Label>Item Title</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="e.g., Hydro Flask, Blue Backpack"
                          {...register('title')}
                          isInvalid={!!errors.title}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.title?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={12} className="mb-3">
                      <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Provide details like color, brand, or unique marks..."
                          {...register('description')}
                          isInvalid={!!errors.description}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.description?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Electronics, Books, etc."
                          {...register('category')}
                          isInvalid={!!errors.category}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.category?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Report Type</Form.Label>
                        <Form.Select
                          {...register('type')}
                          isInvalid={!!errors.type}
                        >
                          <option value="">Select Type</option>
                          <option value="lost">Lost</option>
                          <option value="found">Found</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.type?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={12} className="mb-3">
                      <Form.Group>
                        <Form.Label>Location</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Where was it lost or found? (e.g., Hamilton Library)"
                          {...register('location')}
                          isInvalid={!!errors.location}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.location?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={12} className="mb-3">
                      <Form.Group>
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                          type="date"
                          {...register('date')}
                          isInvalid={!!errors.date}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.date?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={12} className="mb-4">
                      <Form.Group>
                        <Form.Label>Upload Image</Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          {...register('image')}
                          isInvalid={!!errors.image}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.image?.message}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                          Max size: 5MB. Formats: JPG, PNG, WEBP.
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>

                  <input type="hidden" {...register('ownerId')} />

                  <Row>
                    <Col>
                      <Button 
                        type="submit" 
                        className="btn-gold w-100 d-flex align-items-center justify-content-center gap-2"
                        style={{ height: '3rem' }}
                      >
                        <PlusCircle size={20} /> Submit Report
                      </Button>
                    </Col>
                    <Col xs="auto">
                      <Button 
                        type="button" 
                        variant="outline-warning" 
                        onClick={() => reset()}
                        className="d-flex align-items-center justify-content-center gap-2"
                        style={{ height: '3rem', padding: '0 1.5rem', borderRadius: '0.6rem' }}
                      >
                        <Eraser size={20} />
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default ReportItemForm;
