{{-- <select {{$attributes->merge(['class'=>"simple-select form-input"])}} style="width:100%;">
  {{$slot}}
</select> --}}

<select {{$attributes->merge(['class'=>"simple-select form-input"])}}>
    {{$slot}}
</select>