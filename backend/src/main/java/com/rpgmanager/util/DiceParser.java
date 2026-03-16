package com.rpgmanager.util;

import com.rpgmanager.dto.DiceRollResponse;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class DiceParser {

    private static final Pattern DICE_PATTERN = Pattern.compile("^(\\d*)d(\\d+)([+-]\\d+)?$");

    public static DiceRollResponse parse(String expression) {
        String trimmed = expression.trim().toLowerCase();
        Matcher matcher = DICE_PATTERN.matcher(trimmed);

        if (!matcher.matches()) {
            throw new IllegalArgumentException("Invalid dice expression: " + expression);
        }

        int count = matcher.group(1).isEmpty() ? 1 : Integer.parseInt(matcher.group(1));
        int sides = Integer.parseInt(matcher.group(2));
        int modifier = matcher.group(3) != null ? Integer.parseInt(matcher.group(3)) : 0;

        List<Integer> rolls = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            rolls.add(ThreadLocalRandom.current().nextInt(1, sides + 1));
        }

        int sum = rolls.stream().mapToInt(Integer::intValue).sum();
        int result = sum + modifier;

        return DiceRollResponse.builder()
                .expression(trimmed)
                .result(result)
                .rolls(rolls)
                .modifier(modifier)
                .build();
    }
}
