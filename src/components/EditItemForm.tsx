'use client';

import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { Resolver, useForm } from 'react-hook-form';
import swal from 'sweetalert';
import { yupResolver } from '@hookform/resolvers/yup';
import { Item } from '@prisma/client';
import { ReportItemSchema } from '@/lib/validationSchemas';
import { editItem } from '@/lib/dbActions';

interface EditItemFormData {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  location: string;
  date: string;
  image?: string | null;
  status: string;
  ownerId: string;
}

const onSubmit = async (data: EditItemFormData) => {
  await editItem({
    ...data,
    date: new Date(data.date),
  });
  swal('Success', 'Your item has been updated', 'success', {
    timer: 2000,
  });
};

const EditItemForm = ({ item }: { item: Item }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditItemFormData>({
    resolver: yupResolver(ReportItemSchema) as Resolver<EditItemFormData>,
    defaultValues: {
      ...item,
      date: item.date ? new Date(item.date).toISOString().split('T')[0] : '',
    },
  });

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={10} md={7} lg={6}>
          <Col className="text-center">
            <h2>Edit Item</h2>
          </Col>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <input type="hidden" {...register('id')} value={item.id} />
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
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <select {...register('status')} className={`form-control ${errors.status ? 'is-invalid' : ''}`}>
                    <option value="open">Open</option>
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <div className="invalid-feedback">{errors.status?.message}</div>
                </Form.Group>
                <input type="hidden" {...register('ownerId')} value={item.ownerId} />
                <Form.Group className="form-group">
                  <Row className="pt-3">
                    <Col>
                      <Button type="submit" variant="primary">
                        Update
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

export default EditItemForm;
