import clsx from 'clsx';
import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from 'react-hook-form';

interface InputProps<T extends FieldValues> {
  label: string;
  id: Path<T>;
  type?: string;
  required?: boolean;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  disabled?: boolean;
}

const Input = <T extends FieldValues>({
  label,
  id,
  register,
  required = true,
  errors,
  type = 'text',
  disabled,
}: InputProps<T>) => {
  return (
    <div>
      <label
        htmlFor={id}
        className='block text-sm font-medium leading-6 text-gray-900'
      >
        {label}
        {required && <span className='text-rose-500 ml-1'>*</span>}
      </label>
      <div className='mt-2'>
        <input
          id={id}
          type={type}
          autoComplete={id}
          disabled={disabled}
          {...register(id)}
          className={clsx(
            `
              form-input
              block 
              w-full
              rounded-md
              border-0
              py-1.5
              px-2
              text-gray-900
              shadow-sm
              ring-1
              ring-inset
              ring-gray-300
              placeholder:text-gray-400
              focus:ring-2
              focus:ring-inset
              focus:ring-sky-600
              sm:text-sm
              sm:leading-6
            `,
            errors[id] && 'focus:ring-rose-500 ring-rose-500',
            disabled && 'opacity-50 cursor-default'
          )}
        />
        {required && errors[id] && (
          <span className='text-sm text-rose-500 mt-1 block'>
            {errors[id]?.message as string}
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;