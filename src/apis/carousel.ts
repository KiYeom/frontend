import { TCarousel } from './carousel.types';
import { instance } from './interceptor';

export const getCarousel = async (
  type: 'cookie_profile' | 'home',
): Promise<TCarousel[] | undefined> => {
  try {
    const res = await instance.get('/v1/users/banners', { params: { type } });
    return res.data;
  } catch (error) {
    console.log('[ERROR] daily analyze', error);
    return;
  }
};
