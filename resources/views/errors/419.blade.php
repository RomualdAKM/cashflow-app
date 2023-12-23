<x-guest-layout>
    <img class="w-48 block mx-auto" src="{{ asset('assets/img/419.svg') }}" alt="Not found">
    <h1>Une erreur est survenue lors du traitement de votre requête. Raffraîchissez votre session et réessayer.</h1>
        <x-nav-link href="{{ url()->previous() }}">Retour</x-nav-link>
</x-guest-layout>
