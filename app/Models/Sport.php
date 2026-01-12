<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sport extends Model
{
    protected $fillable = [
        'code',
        'name_si',
        'name_en',
    ];

    /**
     * Get all team sports data for this sport
     */
    public function teamSportsData(): HasMany
    {
        return $this->hasMany(TeamSportData::class);
    }
}
