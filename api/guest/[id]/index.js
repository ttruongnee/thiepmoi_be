import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const { id } = req.query;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { data, error } = await supabase
      .from('khachmoi')
      .select('tenkhachmoi')
      .eq('idkhachmoi', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy khách mời' });
    }

    return res.status(200).json({ success: true, tenkhachmoi: data.tenkhachmoi });
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
}