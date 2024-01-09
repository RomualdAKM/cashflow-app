<?php

namespace App\Http\Controllers;

use App\Models\Article;
use RealRashid\SweetAlert\Facades\Alert;
use App\Http\Requests\StoreArticleRequest;
use App\Http\Requests\UpdateArticleRequest;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view('app.article.index', [
            'articles' => Article::all(),
            'my_actions' => $this->article_actions(),
            'my_attributes' => $this->article_columns(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('app.article.create', [
            'my_fields' => $this->article_fields()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreArticleRequest $request)
    {
        
        $article = new Article();

        $article->name = $request->name;

        if ($article->save()) {
            Alert::toast('Enregistrement effectue', 'success');
            return redirect('article');
        } else {
            Alert::toast('Une erreur est survenue', 'error');
            return redirect()->back()->withInput($request->input());
        }
    
    }

    /**
     * Display the specified resource.
     */
    public function show(Article $article)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Article $article)
    {
        return view('app.article.edit', [
            'article' => $article,
            'my_fields' => $this->article_fields(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateArticleRequest $request, Article $article)
    {
       
        $article->name = $request->name;
      
        
        if ($article->save()) {
            Alert::toast('Modification éffectée', 'success');
            return redirect('article');
        };
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Article $article)
    {
        try {
            $article = $article->delete();
            Alert::success('Opération éffectué', 'Les données ont été supprimés avec succès');
            return redirect('article');
        } catch (\Exception $e) {
            Alert::error('Oops', 'Une erreur est survenue');
            return redirect()->back();
        }
    }
    private function article_columns()
    {
        $columns = (object) [
           
            'name' => 'Nom',
           
        ];
        return $columns;
    }
    private function article_actions()
    {
        $actions = (object) array(
            'edit' => 'Modifier',
            'delete' => "Supprimer",
        );
        return $actions;
    }

    private function article_fields()
    {
        $fields = [
            'name' => [
                'title' => 'Nom',
                'field' => 'text'
            ],

        ];
        return $fields;
    }
}
