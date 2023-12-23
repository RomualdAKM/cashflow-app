<form method="POST" action="{{ $action }}">
    @csrf
    <div class="md:flex text-sm mx-2">
        <div class="p-2 grid grid-cols-2 gap-2 md:block">
            <span>{{ __('message.from') }}</span>
            <input
                class="sm:p-1 p-2 sm:h-4 md:h-10 border-gray-300 border-2 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-lg"
                type="date" name="start" value="{{ request()->start }}">
            <span>
                {{ __('message.to') }}
            </span>
            <input
                class="sm:p-1 p-2 sm:h-4 md:h-10 border-gray-300 border-2 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-lg"
                type="date" name="end" value="{{ request()->end }}">
            <x-secondary-button class="py-3 border-gray-300 border-2 shadow-lg col-start-2" type="submit">
                {{ __('message.apply') }}
            </x-secondary-button>
        </div>
    </div>
</form>
