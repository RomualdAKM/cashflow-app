<x-app-layout>
    <div class="content">
        <div class="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-lg sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <h1>{{ __('Voir les détails') }}</h1>
                    <x-forms.show :item="$article" :fields="$my_fields" type="article" />
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
