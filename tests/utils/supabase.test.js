import { supabase } from '@/utils/supabase';

test('supabase client is configured', () => {
  expect(supabase).toBeDefined();
});