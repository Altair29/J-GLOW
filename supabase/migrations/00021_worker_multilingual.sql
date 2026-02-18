-- ========================================
-- Worker多言語化: 11カ国語対応
-- ========================================

-- 1. worker_topics に title_en カラム追加
ALTER TABLE public.worker_topics ADD COLUMN IF NOT EXISTS title_en TEXT;

UPDATE public.worker_topics SET title_en = CASE slug
  WHEN 'transfer'     THEN 'Job Transfer & Career Change'
  WHEN 'housing'      THEN 'Housing & Rental'
  WHEN 'medical'      THEN 'Medical & Health'
  WHEN 'labor_rights' THEN 'Labor Rights & Protection'
  WHEN 'visa'         THEN 'Visa & Residency Status'
  WHEN 'japanese'     THEN 'Japanese Language Learning'
  WHEN 'banking'      THEN 'Banking & Finance'
  WHEN 'daily_life'   THEN 'Daily Life & Living'
  WHEN 'emergency'    THEN 'Emergency Response'
  WHEN 'career'       THEN 'Career Development'
END;

-- 2. content_blocks: worker_home の既存データ更新 (ja)
UPDATE public.content_blocks
  SET content = '日本での生活をサポートします'
  WHERE page = 'worker_home' AND block_key = 'hero_title' AND lang = 'ja';

UPDATE public.content_blocks
  SET content = '外国人労働者のための総合生活支援プラットフォーム'
  WHERE page = 'worker_home' AND block_key = 'hero_subtitle_en' AND lang = 'ja';

-- hero_subtitle_en → hero_subtitle にリネーム
UPDATE public.content_blocks
  SET block_key = 'hero_subtitle'
  WHERE page = 'worker_home' AND block_key = 'hero_subtitle_en' AND lang = 'ja';

UPDATE public.content_blocks
  SET content = '11カ国語対応'
  WHERE page = 'worker_home' AND block_key = 'hero_note' AND lang = 'ja';

UPDATE public.content_blocks
  SET content = '生活課題サポート'
  WHERE page = 'worker_home' AND block_key = 'section_heading' AND lang = 'ja';

UPDATE public.content_blocks
  SET content = 'あなたの困りごとを選んでください'
  WHERE page = 'worker_home' AND block_key = 'section_desc' AND lang = 'ja';

-- 3. content_blocks: 11言語の翻訳データ挿入
-- English (en)
INSERT INTO public.content_blocks (page, block_key, content, lang, sort_order) VALUES
  ('worker_home', 'hero_title',      'We Support Your Life in Japan',                                         'en', 1),
  ('worker_home', 'hero_subtitle',   'Comprehensive Life Support Platform for Foreign Workers',               'en', 2),
  ('worker_home', 'hero_note',       'Available in 11 languages',                                             'en', 3),
  ('worker_home', 'section_heading', 'Life Support Topics',                                                   'en', 4),
  ('worker_home', 'section_desc',    'Choose your topic',                                                     'en', 5)
ON CONFLICT (page, block_key, lang) DO UPDATE SET content = EXCLUDED.content;

-- Chinese (zh)
INSERT INTO public.content_blocks (page, block_key, content, lang, sort_order) VALUES
  ('worker_home', 'hero_title',      '支持您在日本的生活',                          'zh', 1),
  ('worker_home', 'hero_subtitle',   '面向外国劳动者的综合生活支持平台',            'zh', 2),
  ('worker_home', 'hero_note',       '支持11种语言',                                'zh', 3),
  ('worker_home', 'section_heading', '生活问题支持',                                'zh', 4),
  ('worker_home', 'section_desc',    '请选择您的问题',                              'zh', 5)
ON CONFLICT (page, block_key, lang) DO UPDATE SET content = EXCLUDED.content;

-- Vietnamese (vi)
INSERT INTO public.content_blocks (page, block_key, content, lang, sort_order) VALUES
  ('worker_home', 'hero_title',      'Hỗ trợ cuộc sống của bạn tại Nhật Bản',                                      'vi', 1),
  ('worker_home', 'hero_subtitle',   'Nền tảng hỗ trợ sinh hoạt toàn diện cho người lao động nước ngoài',           'vi', 2),
  ('worker_home', 'hero_note',       'Hỗ trợ 11 ngôn ngữ',                                                         'vi', 3),
  ('worker_home', 'section_heading', 'Hỗ trợ vấn đề cuộc sống',                                                    'vi', 4),
  ('worker_home', 'section_desc',    'Hãy chọn vấn đề của bạn',                                                    'vi', 5)
ON CONFLICT (page, block_key, lang) DO UPDATE SET content = EXCLUDED.content;

-- Tagalog (tl)
INSERT INTO public.content_blocks (page, block_key, content, lang, sort_order) VALUES
  ('worker_home', 'hero_title',      'Suporta para sa Iyong Buhay sa Japan',                                           'tl', 1),
  ('worker_home', 'hero_subtitle',   'Komprehensibong Platform ng Suporta sa Buhay para sa Dayuhang Manggagawa',       'tl', 2),
  ('worker_home', 'hero_note',       'Available sa 11 wika',                                                           'tl', 3),
  ('worker_home', 'section_heading', 'Mga Paksa ng Suporta sa Buhay',                                                 'tl', 4),
  ('worker_home', 'section_desc',    'Piliin ang iyong paksa',                                                         'tl', 5)
ON CONFLICT (page, block_key, lang) DO UPDATE SET content = EXCLUDED.content;

-- Indonesian (id)
INSERT INTO public.content_blocks (page, block_key, content, lang, sort_order) VALUES
  ('worker_home', 'hero_title',      'Mendukung Kehidupan Anda di Jepang',                        'id', 1),
  ('worker_home', 'hero_subtitle',   'Platform Dukungan Hidup Komprehensif untuk Pekerja Asing',   'id', 2),
  ('worker_home', 'hero_note',       'Tersedia dalam 11 bahasa',                                   'id', 3),
  ('worker_home', 'section_heading', 'Topik Dukungan Kehidupan',                                   'id', 4),
  ('worker_home', 'section_desc',    'Pilih topik Anda',                                           'id', 5)
ON CONFLICT (page, block_key, lang) DO UPDATE SET content = EXCLUDED.content;

-- Thai (th)
INSERT INTO public.content_blocks (page, block_key, content, lang, sort_order) VALUES
  ('worker_home', 'hero_title',      'สนับสนุนชีวิตของคุณในประเทศญี่ปุ่น',                                              'th', 1),
  ('worker_home', 'hero_subtitle',   'แพลตฟอร์มสนับสนุนชีวิตครบวงจรสำหรับแรงงานต่างชาติ',                              'th', 2),
  ('worker_home', 'hero_note',       'รองรับ 11 ภาษา',                                                                  'th', 3),
  ('worker_home', 'section_heading', 'หัวข้อสนับสนุนชีวิต',                                                             'th', 4),
  ('worker_home', 'section_desc',    'เลือกหัวข้อของคุณ',                                                               'th', 5)
ON CONFLICT (page, block_key, lang) DO UPDATE SET content = EXCLUDED.content;

-- Burmese (my)
INSERT INTO public.content_blocks (page, block_key, content, lang, sort_order) VALUES
  ('worker_home', 'hero_title',      'ဂျပန်တွင် သင့်ဘဝကို ပံ့ပိုးပေးပါသည်',                                                    'my', 1),
  ('worker_home', 'hero_subtitle',   'နိုင်ငံခြားအလုပ်သမားများအတွက် ဘက်စုံဘဝပံ့ပိုးမှုစနစ်',                                    'my', 2),
  ('worker_home', 'hero_note',       'ဘာသာစကား ၁၁ မျိုး ရရှိနိုင်သည်',                                                          'my', 3),
  ('worker_home', 'section_heading', 'ဘဝပြဿနာများ ပံ့ပိုးကူညီမှု',                                                               'my', 4),
  ('worker_home', 'section_desc',    'သင့်ခေါင်းစဉ်ကို ရွေးချယ်ပါ',                                                              'my', 5)
ON CONFLICT (page, block_key, lang) DO UPDATE SET content = EXCLUDED.content;

-- Khmer (km)
INSERT INTO public.content_blocks (page, block_key, content, lang, sort_order) VALUES
  ('worker_home', 'hero_title',      'គាំទ្រជីវិតរបស់អ្នកនៅប្រទេសជប៉ុន',                                              'km', 1),
  ('worker_home', 'hero_subtitle',   'វេទិកាគាំទ្រជីវភាពទូលំទូលាយសម្រាប់កម្មករបរទេស',                                'km', 2),
  ('worker_home', 'hero_note',       'មាន ១១ ភាសា',                                                                    'km', 3),
  ('worker_home', 'section_heading', 'ប្រធានបទគាំទ្រជីវភាព',                                                           'km', 4),
  ('worker_home', 'section_desc',    'ជ្រើសរើសប្រធានបទរបស់អ្នក',                                                       'km', 5)
ON CONFLICT (page, block_key, lang) DO UPDATE SET content = EXCLUDED.content;

-- Mongolian (mn)
INSERT INTO public.content_blocks (page, block_key, content, lang, sort_order) VALUES
  ('worker_home', 'hero_title',      'Японд таны амьдралыг дэмжинэ',                                                       'mn', 1),
  ('worker_home', 'hero_subtitle',   'Гадаадын ажилчдад зориулсан иж бүрэн амьдралын дэмжлэгийн платформ',                  'mn', 2),
  ('worker_home', 'hero_note',       '11 хэлээр үйлчилнэ',                                                                 'mn', 3),
  ('worker_home', 'section_heading', 'Амьдралын дэмжлэгийн сэдвүүд',                                                       'mn', 4),
  ('worker_home', 'section_desc',    'Сэдвээ сонгоно уу',                                                                   'mn', 5)
ON CONFLICT (page, block_key, lang) DO UPDATE SET content = EXCLUDED.content;

-- Nepali (ne)
INSERT INTO public.content_blocks (page, block_key, content, lang, sort_order) VALUES
  ('worker_home', 'hero_title',      'जापानमा तपाईंको जीवनलाई सहयोग गर्छौं',                                              'ne', 1),
  ('worker_home', 'hero_subtitle',   'विदेशी कामदारहरूको लागि व्यापक जीवन सहायता प्लेटफर्म',                               'ne', 2),
  ('worker_home', 'hero_note',       '११ भाषामा उपलब्ध',                                                                   'ne', 3),
  ('worker_home', 'section_heading', 'जीवन सहायता विषयहरू',                                                                'ne', 4),
  ('worker_home', 'section_desc',    'आफ्नो विषय छान्नुहोस्',                                                              'ne', 5)
ON CONFLICT (page, block_key, lang) DO UPDATE SET content = EXCLUDED.content;
