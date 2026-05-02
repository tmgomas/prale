<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Division extends Model
{
    protected $fillable = [
        'district_id',
        'name_si',
        'name_ta',
        'name_en',
        'sort_order',
    ];

    /**
     * Get the district that owns this division
     */
    public function district(): BelongsTo
    {
        return $this->belongsTo(District::class);
    }
}
