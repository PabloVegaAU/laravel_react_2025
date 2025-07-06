<?php

namespace Database\Factories;

use App\Models\Profile;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProfileFactory extends Factory
{
    protected $model = Profile::class;

    public function definition()
    {
        return [
            'first_name' => fake()->firstName,
            'last_name' => fake()->lastName,
            'second_last_name' => fake()->lastName,
            'birth_date' => fake()->date,
            'phone' => fake()->phoneNumber,
        ];
    }
}
