
export interface HeroImage {
  id: string;
  title: string;
  description: string;
  image_url: string;
  cta_text?: string;
  cta_link?: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HeroImageForm {
  title: string;
  description: string;
  image_url: string;
  cta_text: string;
  cta_link: string;
  order_index: number;
  is_active: boolean;
}

export const initialFormData: HeroImageForm = {
  title: '',
  description: '',
  image_url: '',
  cta_text: 'Learn More',
  cta_link: '#',
  order_index: 0,
  is_active: true
};
