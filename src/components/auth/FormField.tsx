type FormFieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
};

export default function FormField({
  label,
  htmlFor,
  error,
  children,
}: FormFieldProps) {
  return (
    <div className='flex flex-col gap-1.5'>
      <label htmlFor={htmlFor} className='text-sm font-semibold'>
        {label}
      </label>
      {children}
      {error && (
        <p className='text-sm text-error' role='alert'>
          {error}
        </p>
      )}
    </div>
  );
}
