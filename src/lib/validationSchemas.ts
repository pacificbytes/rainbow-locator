import * as Yup from 'yup';

export const ReportItemSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  category: Yup.string().required('Category is required'),
  type: Yup.string().oneOf(['lost', 'found'], 'Type must be "lost" or "found"').required('Type is required'),
  location: Yup.string().required('Location is required'),
  date: Yup.date().required('Date is required'),
  image: Yup.string().optional().nullable(),
  ownerId: Yup.string().required(),
});

export const ClaimSchema = Yup.object({
  message: Yup.string().required('A message is required for the claim'),
});
