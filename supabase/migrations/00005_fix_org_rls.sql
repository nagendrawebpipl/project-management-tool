-- Modify the SELECT policy for the organizations table to allow the owner to see the organization even if they aren't a member yet.
DROP POLICY IF EXISTS "Organizations are viewable by members" ON organizations;

CREATE POLICY "Organizations are viewable by members or owners" ON organizations
    FOR SELECT TO authenticated 
    USING (is_org_member(id) OR auth.uid() = owner_id);
