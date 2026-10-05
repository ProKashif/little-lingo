import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '@/theme';
import type { Illustration as IllustrationData } from '@/types';

interface Props {
  illustration: IllustrationData;
  size: number;
}

/** Draws a vocabulary picture. Decorative — the word next to it carries the meaning. */
function IllustrationBase({ illustration, size }: Props) {
  switch (illustration.kind) {
    case 'emoji':
      return (
        <Text
          style={{ fontSize: size, lineHeight: size * 1.2 }}
          accessible={false}
          importantForAccessibility="no"
        >
          {illustration.value}
        </Text>
      );

    case 'color':
      return (
        <View
          accessible={false}
          style={[
            styles.colorBlob,
            {
              width: size * 1.1,
              height: size * 1.1,
              borderRadius: size * 0.55,
              backgroundColor: illustration.hex,
              borderWidth: illustration.border ? 4 : 0,
            },
          ]}
        />
      );

    case 'number': {
      const perRow = illustration.value > 5 ? 5 : illustration.value;
      const dotSize = size * 0.2;
      return (
        <View style={styles.center} accessible={false}>
          <Text style={[styles.numeral, { fontSize: size * 0.85, lineHeight: size }]}>
            {illustration.value}
          </Text>
          <View style={[styles.dots, { width: perRow * dotSize * 1.3 }]}>
            {Array.from({ length: illustration.value }, (_, index) => (
              <Text key={index} style={{ fontSize: dotSize, lineHeight: dotSize * 1.25 }}>
                {illustration.emoji}
              </Text>
            ))}
          </View>
        </View>
      );
    }

    case 'letter':
      return (
        <Text
          accessible={false}
          style={[styles.letter, { fontSize: size, lineHeight: size * 1.15 }]}
        >
          {illustration.value}
          <Text style={[styles.letterLower, { fontSize: size * 0.7 }]}>
            {illustration.value.toLowerCase()}
          </Text>
        </Text>
      );
  }
}

export const Illustration = memo(IllustrationBase);

const styles = StyleSheet.create({
  center: { alignItems: 'center' },
  colorBlob: { borderColor: colors.border },
  numeral: { ...typography.hero, color: colors.text },
  dots: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  letter: { ...typography.hero, color: colors.text },
  letterLower: { color: colors.textMuted, fontWeight: '800' },
});
