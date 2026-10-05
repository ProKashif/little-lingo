import { Redirect } from 'expo-router';
import { useLanguage } from '@/context';

/** First-launch routing: no saved language → picker, otherwise straight to Home. */
export default function Index() {
  const { selectedLanguage } = useLanguage();
  return <Redirect href={selectedLanguage ? '/home' : '/language'} />;
}
