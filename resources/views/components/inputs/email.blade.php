<input {!! $attributes->merge([
    'class' => implode(' ', [
        $errors->has($name) ? 'form-input is-invalid block w-full text-sm' : 'form-input block w-full text-sm'
    ]), 
]) !!}>
