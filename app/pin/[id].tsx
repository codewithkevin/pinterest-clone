import { useLocalSearchParams } from 'expo-router';
import { PinDetailScreen } from '@/screens/pin-detail/ui/PinDetailScreen';

export default function PinDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <PinDetailScreen pinId={id} />;
}
