import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version' };
const respond = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
  if (req.method !== 'POST') return respond({ error: 'Method not allowed' }, 405);
  try {
    const url = Deno.env.get('SUPABASE_URL');
    const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !key) return respond({ error: 'Publishing service unavailable' }, 503);
    const client = createClient(url, key);
    const token = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
    if (!token) return respond({ error: 'Sign in required' }, 401);
    const { data: { user }, error: authError } = await client.auth.getUser(token);
    if (authError || !user) return respond({ error: 'Sign in required' }, 401);
    const { data: role, error: roleError } = await client.from('user_roles').select('id').eq('user_id', user.id).eq('role', 'admin').maybeSingle();
    if (roleError || !role) return respond({ error: 'Admin access required' }, 403);
    const body = await req.json();
    if (!['list', 'save', 'delete', 'publish'].includes(body.action)) return respond({ error: 'Invalid request' }, 400);
    const result = body.action === 'publish'
      ? await client.rpc('publish_product_draft', { _draft_id: body.id })
      : await client.rpc('admin_product_drafts', { _action: body.action, _id: body.id ?? null, _product_id: body.productId ?? null, _title: body.title ?? '', _payload: body.payload ?? {} });
    if (result.error) {
      console.error('Product draft operation failed', result.error.code);
      return respond({ error: 'Could not complete this product operation. Check the product fields and try again.' }, 400);
    }
    return respond({ data: result.data });
  } catch {
    return respond({ error: 'Could not complete this product operation' }, 500);
  }
});