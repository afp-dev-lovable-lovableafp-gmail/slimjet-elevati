
-- Create a new storage bucket for team member photos
INSERT INTO storage.buckets (id, name)
VALUES ('team-photos', 'team-photos')
ON CONFLICT (id) DO NOTHING;

-- Set up public access policy for the team-photos bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'team-photos');
