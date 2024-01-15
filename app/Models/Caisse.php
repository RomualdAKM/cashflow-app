<?php

namespace App\Models;

use App\Models\PaymentMode;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Caisse extends Model
{
    use HasFactory;

    protected $append = [
        'payment_mode',
    ];

    public function payment_mode(): BelongsTo{
        return $this->belongsTo(PaymentMode::class);
    }

    public function getPaymentModeNameAttribute(){
        return $this->payment_mode->name;
    }
}
