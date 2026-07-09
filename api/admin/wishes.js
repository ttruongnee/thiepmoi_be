import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // Lấy tất cả lời chúc
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('loichuc')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json({ success: true, data });
    }

    // Xoá lời chúc theo idloichuc
    if (req.method === 'DELETE') {
      const idloichuc = req.query.idloichuc || req.body.idloichuc;
      if (!idloichuc) {
        return res.status(400).json({ success: false, error: 'Thiếu id lời chúc' });
      }
      const { error } = await supabase
        .from('loichuc')
        .delete()
        .eq('idloichuc', idloichuc);
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
}