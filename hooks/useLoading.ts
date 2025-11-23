import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

// useLoading ini untuk control loading di setiap reducer, untuk sync setiap loading di reducer yang dipanggil. 
// contoh kaya manggil dua api di dua slices berbeda jadi ter loading simultaniously 
// example: useLoading('users', 'posts', ...). param ambil dari nama setiap slices
export const useLoading = (...slices: (keyof RootState)[]) => {
  return useSelector((state: RootState) =>
    slices.some(slice => state[slice]?.loading || false)
  );
};