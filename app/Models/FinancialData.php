<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FinancialData extends Model
{
    protected $fillable = [
        'submission_id',
        'income_head_office',
        'income_external_sources',
        'total_income',
        'expense_team_sports',
        'expense_track_field',
        'total_expense',
    ];

    protected $casts = [
        'income_head_office' => 'decimal:2',
        'income_external_sources' => 'decimal:2',
        'total_income' => 'decimal:2',
        'expense_team_sports' => 'decimal:2',
        'expense_track_field' => 'decimal:2',
        'total_expense' => 'decimal:2',
    ];

    /**
     * Get the submission for this financial data
     */
    public function submission(): BelongsTo
    {
        return $this->belongsTo(Submission::class);
    }

    /**
     * Calculate and update the totals
     */
    public function calculateTotals(): void
    {
        $this->total_income = (float) (($this->income_head_office ?? 0) + ($this->income_external_sources ?? 0));
        $this->total_expense = (float) (($this->expense_team_sports ?? 0) + ($this->expense_track_field ?? 0));
        $this->save();
    }

    /**
     * Boot method to auto-calculate totals before saving
     */
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($financialData) {
            $financialData->total_income = (float) (($financialData->income_head_office ?? 0) + ($financialData->income_external_sources ?? 0));
            $financialData->total_expense = (float) (($financialData->expense_team_sports ?? 0) + ($financialData->expense_track_field ?? 0));
        });
    }
}
