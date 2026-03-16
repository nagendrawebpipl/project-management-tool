-- Create storage bucket for task attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('task-attachments', 'task-attachments', false);

-- Storage Policies
CREATE POLICY "Authenticated users can upload task attachments" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (
        bucket_id = 'task-attachments'
    );

CREATE POLICY "Users can view task attachments in their bucket" ON storage.objects
    FOR SELECT TO authenticated USING (
        bucket_id = 'task-attachments'
    );

CREATE POLICY "Users can delete their own attachments" ON storage.objects
    FOR DELETE TO authenticated USING (
        bucket_id = 'task-attachments' AND (storage.foldername(name))[1] IN (
            SELECT organization_id::text FROM organization_members WHERE user_id = auth.uid()
        )
    );
