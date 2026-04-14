'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Form } from 'react-bootstrap';
import swal from 'sweetalert';
import { addClaim } from '@/lib/dbActions';
import { ClaimSchema } from '@/lib/validationSchemas';

interface ClaimFormProps {
  itemId: string;
  userId: string;
}

const ClaimForm = ({ itemId, userId }: ClaimFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ClaimSchema),
  });

  const onSubmit = async (data: any) => {
    await addClaim({
      itemId,
      userId,
      message: data.message,
    });
    swal('Success', 'Your claim has been submitted', 'success');
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-3">
        <Form.Label>Message to Admin / Owner</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          {...register('message')}
          className={errors.message ? 'is-invalid' : ''}
          placeholder="Provide more details to prove this item is yours..."
        />
        <Form.Control.Feedback type="invalid">
          {errors.message?.message}
        </Form.Control.Feedback>
      </Form.Group>
      <Button type="submit" variant="success">
        Submit Claim
      </Button>
      <Button type="button" variant="link" onClick={() => reset()} className="ms-2">
        Reset
      </Button>
    </Form>
  );
};

export default ClaimForm;
