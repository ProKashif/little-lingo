import { router } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, type ListRenderItem, StyleSheet } from 'react-native';
import { CategoryRow, Screen, ScreenHeader } from '@/components';
import { useLanguage } from '@/context';
import { CATEGORIES } from '@/data/categories';
import { useCategoryProgress } from '@/hooks/useCategoryProgress';
import { spacing } from '@/theme';
import type { Category } from '@/types';

export default function LearnScreen() {
  const { language, strings: t } = useLanguage();
  const categoryProgress = useCategoryProgress();

  const openCategory = useCallback((category: Category) => {
    router.push({ pathname: '/category/[id]', params: { id: category.id } });
  }, []);

  const renderItem = useCallback<ListRenderItem<Category>>(
    ({ item, index }) => {
      const { learned, total } = categoryProgress[item.id];
      return (
        <CategoryRow
          category={item}
          name={item.name[language]}
          caption={t.learn.words(learned, total)}
          learned={learned}
          total={total}
          index={index}
          onPress={openCategory}
        />
      );
    },
    [language, categoryProgress, openCategory, t],
  );

  return (
    <Screen>
      <ScreenHeader title={`📚 ${t.learn.title}`} subtitle={t.learn.subtitle} />
      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.lg, paddingTop: spacing.sm },
});
