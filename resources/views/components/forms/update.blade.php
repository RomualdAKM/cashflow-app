<!-- Happiness is not something readymade. It comes from your own actions. - Dalai Lama -->
<form method="POST" action="{{ route($type . '.update', [$type => $item]) }}" enctype="multipart/form-data">
    @method('PUT')
    @csrf
    <!-- inputs -->
    <div @class(['form-group md:grid grid-cols-2 gap-2 mt-4'])>
        @foreach ($fields as $attr => $value)
            <div @class(['m-2', 'col-span-2' => isset($value['colspan'])])>
                @php
                    $component = 'inputs.' . $value['field'];
                    $fill = $item->{$attr};
                @endphp

                @if ($value['field'] === 'model')
                    <x-input-label for="{{ $attr }}" value="{!! $value['title'] !!}"></x-input-label>

                    <x-dynamic-component :component="$component" id="{{ $attr }}" name="{{ $attr }}"
                        class="block mt-2 w-full border-2 p-2 rounded outline-0">
                        <option value="">Cliquer pour sélectionner</option>
                        @foreach ($value['options'] as $data)
                            <option value="{{ $data->id }}" @selected(old($attr) ?? $fill === $data->name)>
                                {{ $data->name ?? $data->task }} {{ $data->firstname ?? '' }}
                            </option>
                        @endforeach
                    </x-dynamic-component>
                    @error($attr)
                        <x-input-error messages="{{ $message }}" class="mt-2" />
                    @enderror
                @elseif ($value['field'] === 'select')
                    <x-input-label for="{{ $attr }}" value="{!! $value['title'] !!}"></x-input-label>

                    <x-dynamic-component :component="$component" id="{{ $attr }}" name="{{ $attr }}"
                        class="block mt-1 w-full border-2 p-2 rounded outline-0">
                        <option value="">Sélectionner</option>
                        @foreach ($value['options'] as $key => $value)
                            <option value="{{ $key }}" @selected(old($attr) ? old($attr) === $key : $fill == $key)> {{ $value }}
                            </option>
                        @endforeach
                    </x-dynamic-component>
                    @error($attr)
                        <p class="text-red-500 text-sm pl-2 pt-2">
                            {{ $message }}
                        </p>
                    @enderror
                @elseif ($value['field'] === 'multiple-select')
                    <x-input-label for="{{ $attr }}" value="{!! $value['title'] !!}"></x-input-label>

                    <x-dynamic-component :component="$component" id="{{ $attr }}" name="{{ $attr }}[]"
                        class="block mt-1 w-full border-2 p-2 rounded outline-0">
                        @foreach ($value['options'] as $item)
                            <option value="{{ $item->id }}" @selected(old($attr))>
                                {{ $item->name ?? $item->task }} {{ $item->firstname ?? '' }}
                            </option>
                        @endforeach
                    </x-dynamic-component>
                    @error($attr)
                        <p class="text-red-500 text-sm pl-2 pt-2">
                            {{ $message }}
                        </p>
                    @enderror
                @elseif ($value['field'] === 'textarea')
                    <x-input-label for="{{ $attr }}" value="{!! $value['title'] !!}"></x-input-label>

                    <x-dynamic-component :component="$component" id="{{ $attr }}" name="{{ $attr }}"
                        type="{{ $value['field'] }}" class="block mt-1 w-full border-2 p-2 rounded outline-0">
                        {{ old($attr) ?? $fill }}</x-dynamic-component>
                    @error($attr)
                        <p class="text-red-500 text-sm pl-2 pt-2">
                            {{ $message }}
                        </p>
                    @enderror
                @elseif ($value['field'] === 'richtext')
                    <x-input-label for="{{ $attr }}" value="{!! $value['title'] !!}"></x-input-label>

                    <x-dynamic-component :component="$component" id="editor" name="{{ $attr }}"
                        type="{{ $value['field'] }}" class="block mt-1 w-full border-2 p-2 rounded outline-0">
                        {!! old($attr) ?? $fill !!}</x-dynamic-component>
                    @error($attr)
                        <p class="text-red-500 text-sm pl-2 pt-2">
                            {{ $message }}
                        </p>
                    @enderror
                @elseif ($value['field'] === 'checkbox')
                    <div class="flex items-center">
                        <x-dynamic-component :component="$component" id="{{ $attr }}" name="{{ $attr }}"
                            type="{{ $value['field'] }}" class="mt-1 border-2 p-2 rounded outline-0" />

                        <x-input-label for="{{ $attr }}" value="{!! $value['title'] !!}" class="ml-3">
                        </x-input-label>
                    </div>
                @else
                    <x-input-label for="{{ $attr }}" value="{!! $value['title'] !!}"></x-input-label>

                    <x-dynamic-component :component="$component" id="{{ $attr }}"
                        class="block mt-1 w-full border-2 p-2 rounded outline-0" type="{{ $value['field'] }}"
                        name="{{ $attr }}" value="{{ old($attr) ?? $fill }}"
                        autocomplete="{{ $attr }}" />

                    @error($attr)
                        <x-input-error messages="{{ $message }}" class="mt-2" />
                    @enderror
                @endif
            </div>
        @endforeach
    </div>

    <div class="flex items-center justify-start mt-4">
        <x-primary-button class="ml-4">
            {{ __('Modifier') }}
        </x-primary-button>

        <a href="{{ url()->previous() }}">
            <x-danger-button type="button" class="ml-4">
                {{ __('Annuler') }}
            </x-danger-button>
        </a>
    </div>
</form>
