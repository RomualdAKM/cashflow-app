<input {!! $attributes->merge([
    'class' => implode(' ', [
        $errors->has($name) ? 'form-input is-invalid block w-full placeholder:text-sm' : 'form-input block w-full placeholder:text-sm'
    ]), 'type' => 'number'
]) !!}>
