import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { allowsDraftAccess } from './access.ts';

Deno.test('Product drafts require a signed-in admin', () => {
  assertEquals(allowsDraftAccess(null, []), false);
  assertEquals(allowsDraftAccess({ id: 'customer' }, [{ user_id: 'customer', role: 'user' }]), false);
  assertEquals(allowsDraftAccess({ id: 'admin' }, [{ user_id: 'admin', role: 'admin' }]), true);
});
Deno.test('Another account admin role cannot grant draft access', () => {
  assertEquals(allowsDraftAccess({ id: 'customer' }, [{ user_id: 'other', role: 'admin' }]), false);
});