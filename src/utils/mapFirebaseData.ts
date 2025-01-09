import { DbTypeWithKey } from '@/types';

const requestMapFirebaseData = <T>(
  data: Record<string, T>
): DbTypeWithKey<T>[] => {
  const firebaseField: DbTypeWithKey<T>[] = [];

  Object.entries(data).forEach(([key, field]) => {
    firebaseField.push({
      ...field,
      key,
    });
  });

  return firebaseField;
};

export default requestMapFirebaseData;
