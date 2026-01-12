<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SwimmingData extends Model
{
    protected $fillable = [
        'submission_id',
        'event_date',
        'venue',
        'event_name',
        'teams_male',
        'teams_female',
        'players_male',
        'players_female',
    ];

    protected $casts = [
        'event_date' => 'date',
        'teams_male' => 'integer',
        'teams_female' => 'integer',
        'players_male' => 'integer',
        'players_female' => 'integer',
    ];

    /**
     * Get the submission for this swimming data
     */
    public function submission(): BelongsTo
    {
        return $this->belongsTo(Submission::class);
    }

    /**
     * Get total teams count
     */
    public function getTotalTeamsAttribute(): int
    {
        return ($this->teams_male ?? 0) + ($this->teams_female ?? 0);
    }

    /**
     * Get total players count
     */
    public function getTotalPlayersAttribute(): int
    {
        return ($this->players_male ?? 0) + ($this->players_female ?? 0);
    }
}
