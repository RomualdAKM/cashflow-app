<input {!! $attributes->merge([
    'class' => implode(' ', [
        $errors->has($name) ? 'form-input is-invalid block w-full uppercase placeholder:text-sm' : 'form-input block w-full uppercase placeholder:text-sm'
    ]), 
]) !!}>
