import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const { id } = req.query;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // GET: Lấy danh sách lời chúc (mới nhất trước)
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('loichuc')
        .select('*')
        .eq('idkhachmoi', id)
        .order('created_at', { ascending: false });

      if (error) return res.status(500).json({ success: false, error: error.message });
      return res.status(200).json({ success: true, data });
    }

    // POST: Gửi lời chúc mới
    if (req.method === 'POST') {
      const { tennguoichuc, loichuc } = req.body;
      if (!tennguoichuc || !loichuc) {
        return res.status(400).json({ success: false, error: 'Thiếu tên hoặc lời chúc' });
      }

      // Kiểm tra khách mời tồn tại
      const { data: guest } = await supabase
        .from('khachmoi')
        .select('idkhachmoi')
        .eq('idkhachmoi', id)
        .single();
      if (!guest) {
        return res.status(404).json({ success: false, error: 'Khách mời không tồn tại' });
      }

      const { data, error } = await supabase
        .from('loichuc')
        .insert({ idkhachmoi: id, tennguoichuc, loichuc })
        .select()
        .single();

      if (error) return res.status(500).json({ success: false, error: error.message });
      return res.status(201).json({ success: true, data });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
}