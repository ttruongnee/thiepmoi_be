import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // GET: Lấy tất cả lời chúc
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('loichuc')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json({ success: true, data });
    }

    // DELETE: Xoá lời chúc
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

    // PUT: Sửa lời chúc
    if (req.method === 'PUT') {
      const { idloichuc, tennguoichuc, loichuc } = req.body;
      if (!idloichuc) {
        return res.status(400).json({ success: false, error: 'Thiếu id lời chúc' });
      }
      const updates = {};
      if (tennguoichuc !== undefined) updates.tennguoichuc = tennguoichuc;
      if (loichuc !== undefined) updates.loichuc = loichuc;

      const { data, error } = await supabase
        .from('loichuc')
        .update(updates)
        .eq('idloichuc', idloichuc)
        .select()
        .single();

      if (error) return res.status(500).json({ success: false, error: error.message });
      return res.status(200).json({ success: true, data });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
}