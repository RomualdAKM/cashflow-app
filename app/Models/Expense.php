<?php

namespace App\Models;

use App\Models\Article;
use App\Models\Project;
use App\Models\Supplier;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Expense extends Model
{
    use HasFactory;

    protected $append = [
        'project',
        'supplier',
        'user',
        'article',
    ];

    public function getProjectNameAttribute(){
        return $this->project->name;
    }

    public function getSupplierNameAttribute(){
        return $this->supplier->name;
    }
    public function getUserNameAttribute()
    {
        return $this->user->name;
    }
    // public function getUserAttribute(){
    //     return $this->user->name;
    // }
    public function getArticleNameAttribute(){
        return $this->article->name;
    }

    public function project(): BelongsTo{
        return $this->belongsTo(Project::class);
    }
    public function user(): BelongsTo{
        return $this->belongsTo(user::class);
    }
    public function supplier(): BelongsTo{
        return $this->belongsTo(Supplier::class);
    }
    public function article(): BelongsTo{
        return $this->belongsTo(Article::class);
    }
}
