'use client';

import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { Resolver, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { editItem } from '@/lib/dbActions';
import { EditItemSchema } from '@/lib/validationSchemas';
import { Save, ArrowLeft } from 'react-bootstrap-icons';
import Link from 'next/link';
import { Item } from '@prisma/client';

interface EditItemData {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  location: string;
  date: string;
  image: string;
  imageFile?: FileList;
  status: string;
}

interface EditItemFormProps {
  item: Item;
}

const EditItemForm: React.FC<EditItemFormProps> = ({ item }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditItemData>({
    resolver: yupResolver(EditItemSchema) as unknown as Resolver<EditItemData>,
    defaultValues: {
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      type: item.type,
      location: item.location,
      date: new Date(item.date).toISOString().split('T')[0],
      image: item.image || '',
      status: item.status,
    },
  });

  const onSubmit = async (data: EditItemData) => {
    try {
      await editItem({
        ...data,
        date: new Date(data.date),
        imageFile: data.imageFile ? data.imageFile[0] : undefined,
      });
      swal('Success', 'Item updated successfully!', 'success', {
        timer: 2000,
      });
    } catch (error) {
      swal('Error', (error as Error).message || 'Failed to update item', 'error');
    }
  };

  return (
    <main className="main-bg section-padding">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Link href="/my-stuff" className="link-green d-inline-flex align-items-center gap-2 mb-4">
              <ArrowLeft /> Back to My Reports
            </Link>

            <div className="text-center mb-4">
              <h2 className="section-title" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                Edit Report
              </h2>
              <p className="text-muted">
                Update the information for your listed item.
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
                          <option value="lost">Lost</option>
                          <option value="found">Found</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.type?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                          {...register('status')}
                          isInvalid={!!errors.status}
                        >
                          <option value="open">Open</option>
                          <option value="pending">Pending</option>
                          <option value="resolved">Resolved</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.status?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
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

                    <Col md={12} className="mb-3">
                      <Form.Group>
                        <Form.Label>Location</Form.Label>
                        <Form.Control
                          type="text"
                          {...register('location')}
                          isInvalid={!!errors.location}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.location?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={12} className="mb-4">
                      <Form.Group>
                        <Form.Label>Update Image (Optional)</Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          {...register('imageFile')}
                          isInvalid={!!errors.imageFile}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.imageFile?.message}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                          Leave blank to keep current image. Max size: 5MB.
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>

                  <input type="hidden" {...register('id')} />

                  <Button 
                    type="submit" 
                    className="btn-gold w-100 d-flex align-items-center justify-content-center gap-2"
                    style={{ height: '3rem' }}
                  >
                    <Save size={20} /> Save Changes
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default EditItemForm;
