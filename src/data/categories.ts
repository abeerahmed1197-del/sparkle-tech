import { Category, Brand } from '@/types';

export const categories: Category[] = [
  { id: '1', name: 'Mobiles', slug: 'mobiles', icon: 'Smartphone', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop', productCount: 48 },
  { id: '2', name: 'Watches', slug: 'watches', icon: 'Watch', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', productCount: 32 },
  { id: '3', name: 'Earbuds', slug: 'earbuds', icon: 'Headphones', image: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop', productCount: 56 },
  { id: '4', name: 'Headphones', slug: 'headphones', icon: 'Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', productCount: 28 },
  { id: '5', name: 'Neckbands', slug: 'neckbands', icon: 'Music', image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop', productCount: 18 },
  { id: '6', name: 'Mobile Accessories', slug: 'mobile-accessories', icon: 'Cable', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop', productCount: 94 },
  { id: '7', name: 'Tablets', slug: 'tablets', icon: 'Tablet', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop', productCount: 16 },
  { id: '8', name: 'Laptop', slug: 'laptop', icon: 'Laptop', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop', productCount: 22 },
  { id: '9', name: 'Computer & Laptop Accessories', slug: 'computer-laptop-accessories', icon: 'Mouse', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop', productCount: 67 },
  { id: '10', name: 'Bluetooth Speakers', slug: 'bluetooth-speakers', icon: 'Speaker', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop', productCount: 35 },
  { id: '11', name: 'Power Banks', slug: 'power-banks', icon: 'Battery', image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop', productCount: 24 },
  { id: '12', name: 'Action Camera', slug: 'action-camera', icon: 'Camera', image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop', productCount: 12 },
  { id: '13', name: 'Car Accessories', slug: 'car-accessories', icon: 'Car', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=400&h=400&fit=crop', productCount: 29 },
  { id: '14', name: 'Power Extensions', slug: 'power-extensions', icon: 'Plug', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop', productCount: 15 },
  { id: '15', name: 'Projectors', slug: 'projectors', icon: 'Projector', image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=400&fit=crop', productCount: 8 },
  { id: '16', name: 'Wifi Routers', slug: 'wifi-routers', icon: 'Wifi', image: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=400&h=400&fit=crop', productCount: 11 },
];

export const brands: Brand[] = [
  '1Hora','A4Tech','Amaze','Amazfit','Amazon','Anker','Apple','AuraFit','Baseus','Beats',
  'Belkin','Black Shark','Boya','Choetech','Dji','Dyson','Earfun','Edifier','GoPro','Haylou',
  'Hifuture','Hoco','Hyperx','Infinix','Insta360','JBL','Kospet','Marshall','Mcdodo','Mibro',
  'Nothing','Oppo','Oraimo','Pitaka','Realme','Samsung','Sony','Soundpeats','Tecno','Torras',
  'UGreen','Vivo','Whoop','Wiwu','Xiaomi'
].map((name, i) => ({ id: String(i + 1), name, slug: name.toLowerCase().replace(/\s+/g, '-') }));
