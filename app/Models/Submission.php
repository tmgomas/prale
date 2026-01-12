<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Submission extends Model
{
    protected $fillable = [
        'district_id',
        'division',
        'officer_name',
        'designation',
        'epf_number',
        'status',
        'user_id',
        'submitted_at',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
    ];

    /**
     * Get the district for this submission
     */
    public function district(): BelongsTo
    {
        return $this->belongsTo(District::class);
    }

    /**
     * Get the user who created this submission
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all team sports data for this submission
     */
    public function teamSportsData(): HasMany
    {
        return $this->hasMany(TeamSportData::class);
    }

    /**
     * Get all swimming data for this submission
     */
    public function swimmingData(): HasMany
    {
        return $this->hasMany(SwimmingData::class);
    }

    /**
     * Get all track field data for this submission
     */
    public function trackFieldData(): HasMany
    {
        return $this->hasMany(TrackFieldData::class);
    }

    /**
     * Get the financial data for this submission
     */
    public function financialData(): HasOne
    {
        return $this->hasOne(FinancialData::class);
    }

    /**
     * Mark submission as submitted
     */
    public function markAsSubmitted(): void
    {
        $this->update([
            'status' => 'submitted',
            'submitted_at' => now(),
        ]);
    }

    /**
     * Check if submission is draft
     */
    public function isDraft(): bool
    {
        return $this->status === 'draft';
    }

    /**
     * Check if submission is submitted
     */
    public function isSubmitted(): bool
    {
        return $this->status === 'submitted';
    }
}
