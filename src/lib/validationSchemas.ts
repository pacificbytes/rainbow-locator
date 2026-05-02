import * as Yup from 'yup';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];

export const ReportItemSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  category: Yup.string().required('Category is required'),
  type: Yup.string().oneOf(['lost', 'found'], 'Type must be "lost" or "found"').required('Type is required'),
  location: Yup.string().required('Location is required'),
  date: Yup.date().required('Date is required'),
  image: Yup.mixed()
    .test('fileSize', 'File Size is too large (max 5MB)', (value) => {
      if (!value || !(value instanceof FileList) || value.length === 0) return true;
      return value[0].size <= MAX_FILE_SIZE;
    })
    .test('fileType', 'Unsupported File Format (JPG, PNG, WEBP only)', (value) => {
      if (!value || !(value instanceof FileList) || value.length === 0) return true;
      return SUPPORTED_FORMATS.includes(value[0].type);
    })
    .required('An image file is required'),
  ownerId: Yup.string().required(),
});

export const EditItemSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  category: Yup.string().required('Category is required'),
  type: Yup.string().oneOf(['lost', 'found'], 'Type must be "lost" or "found"').required('Type is required'),
  location: Yup.string().required('Location is required'),
  date: Yup.date().required('Date is required'),
  image: Yup.mixed()
    .test('fileSize', 'File Size is too large (max 5MB)', (value) => {
      if (!value || !(value instanceof FileList) || value.length === 0) return true;
      return value[0].size <= MAX_FILE_SIZE;
    })
    .test('fileType', 'Unsupported File Format (JPG, PNG, WEBP only)', (value) => {
      if (!value || !(value instanceof FileList) || value.length === 0) return true;
      return SUPPORTED_FORMATS.includes(value[0].type);
    })
    .optional()
    .nullable(),
  status: Yup.string().oneOf(['open', 'pending', 'resolved'], 'Invalid status').required('Status is required'),
});

export const ClaimSchema = Yup.object({
  message: Yup.string().required('A message is required for the claim'),
});
