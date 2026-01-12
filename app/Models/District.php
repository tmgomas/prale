<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class District extends Model
{
    protected $fillable = [
        'name_si',
        'name_en',
    ];

    /**
     * Get all submissions for this district
     */
    public function submissions(): HasMany
    {
        return $this->hasMany(Submission::class);
    }
}
