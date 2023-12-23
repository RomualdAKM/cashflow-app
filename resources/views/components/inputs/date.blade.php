{{-- <input datepicker datepicker-autohide datepicker-buttons datepicker-format="dd/mm/yyyy" datepicker-title="Choisir une date" type="text" {!! $attributes->merge([
    'class' => implode(' ', [
        $errors->has($name) ? 'form-input is-invalid block w-full placeholder:italic' : 'form-input block w-full placeholder:italic'
    ]), 
]) !!}> --}}

<input type="date" {!! $attributes->merge([
    'class' => implode(' ', [
        $errors->has($name) ? 'form-input is-invalid block w-full placeholder:italic' : 'form-input block w-full placeholder:italic'
    ]), 
]) !!}>