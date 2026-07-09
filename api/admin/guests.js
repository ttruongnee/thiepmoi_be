import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // Lấy danh sách tất cả khách mời
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('khachmoi')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json({ success: true, data });
    }

    // Thêm khách mời mới
    if (req.method === 'POST') {
      const { idkhachmoi, tenkhachmoi } = req.body;
      if (!idkhachmoi || !tenkhachmoi) {
        return res.status(400).json({ success: false, error: 'Thiếu id hoặc tên' });
      }
      const { data, error } = await supabase
        .from('khachmoi')
        .insert({ idkhachmoi, tenkhachmoi })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json({ success: true, data });
    }

    // Xoá khách mời (nhận id qua query hoặc body)
    if (req.method === 'DELETE') {
      const idkhachmoi = req.query.idkhachmoi || req.body.idkhachmoi;
      if (!idkhachmoi) {
        return res.status(400).json({ success: false, error: 'Thiếu id khách mời' });
      }
      const { error } = await supabase
        .from('khachmoi')
        .delete()
        .eq('idkhachmoi', idkhachmoi);
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
}