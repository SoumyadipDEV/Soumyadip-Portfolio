-- Personal Portfolio Website - Supabase schema
--
-- Storage bucket setup:
-- 1. Create a public "resumes" bucket:
--    Supabase Dashboard -> Storage -> New bucket -> Name: resumes -> Public bucket: enabled.
--    Store uploaded resume files here. The latest public file URL is saved in personal_info.resume_url.
--
-- 2. Create a public "profile-images" bucket:
--    Supabase Dashboard -> Storage -> New bucket -> Name: profile-images -> Public bucket: enabled.
--    Store profile images here. Public image URLs are saved in personal_info.profile_image_url.
--
-- 3. Create a public "thumbnails" bucket:
--    Supabase Dashboard -> Storage -> New bucket -> Name: thumbnails -> Public bucket: enabled.
--    Store project and certificate thumbnails here. Public image URLs are saved in thumbnail_url fields.
--
-- SQL alternative for bucket creation, if you prefer the SQL Editor:
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES
--   ('resumes', 'resumes', true),
--   ('profile-images', 'profile-images', true),
--   ('thumbnails', 'thumbnails', true)
-- ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;
--
-- Admin note:
-- These RLS policies treat Supabase's "authenticated" role as the admin role.
-- If public signup is enabled, add an admin claim/profile check before production use.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.personal_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  tagline text,
  bio text,
  profile_image_url text,
  email text,
  phone text,
  location text,
  github_url text,
  linkedin_url text,
  twitter_url text,
  website_url text,
  resume_url text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution text NOT NULL,
  degree text NOT NULL,
  field_of_study text,
  start_year integer,
  end_year integer,
  grade text,
  description text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT education_year_range_chk CHECK (
    start_year IS NULL
    OR end_year IS NULL
    OR end_year >= start_year
  )
);

CREATE TABLE IF NOT EXISTS public.experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  job_title text NOT NULL,
  employment_type text,
  location text,
  start_date date,
  end_date date,
  is_current boolean NOT NULL DEFAULT false,
  description text,
  tech_stack text[],
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT experience_employment_type_chk CHECK (
    employment_type IS NULL
    OR employment_type IN ('Full-time', 'Part-time', 'Contract', 'Freelance')
  ),
  CONSTRAINT experience_date_range_chk CHECK (
    start_date IS NULL
    OR end_date IS NULL
    OR end_date >= start_date
  ),
  CONSTRAINT experience_current_has_no_end_date_chk CHECK (
    is_current = false
    OR end_date IS NULL
  )
);

CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  tech_stack text[],
  live_url text,
  github_url text,
  thumbnail_url text,
  is_featured boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  issuing_organization text,
  issue_date date,
  expiry_date date,
  credential_id text,
  credential_url text,
  thumbnail_url text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT certificates_date_range_chk CHECK (
    issue_date IS NULL
    OR expiry_date IS NULL
    OR expiry_date >= issue_date
  )
);

CREATE TABLE IF NOT EXISTS public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text,
  proficiency integer,
  icon_url text,
  display_order integer NOT NULL DEFAULT 0,
  CONSTRAINT skills_proficiency_range_chk CHECK (
    proficiency IS NULL
    OR proficiency BETWEEN 0 AND 100
  )
);

CREATE TABLE IF NOT EXISTS public.hobbies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text,
  display_order integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_name text NOT NULL,
  sender_email text NOT NULL,
  subject text,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  received_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS personal_info_set_updated_at ON public.personal_info;
CREATE TRIGGER personal_info_set_updated_at
BEFORE UPDATE ON public.personal_info
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS education_display_order_idx
ON public.education (display_order, created_at DESC);

CREATE INDEX IF NOT EXISTS experience_display_order_idx
ON public.experience (display_order, created_at DESC);

CREATE INDEX IF NOT EXISTS projects_display_order_idx
ON public.projects (display_order, created_at DESC);

CREATE INDEX IF NOT EXISTS certificates_display_order_idx
ON public.certificates (display_order, created_at DESC);

CREATE INDEX IF NOT EXISTS skills_display_order_idx
ON public.skills (display_order, name);

CREATE INDEX IF NOT EXISTS hobbies_display_order_idx
ON public.hobbies (display_order, name);

CREATE INDEX IF NOT EXISTS contact_messages_received_at_idx
ON public.contact_messages (received_at DESC);

CREATE INDEX IF NOT EXISTS contact_messages_is_read_idx
ON public.contact_messages (is_read);

ALTER TABLE public.personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hobbies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read personal_info" ON public.personal_info;
CREATE POLICY "Public can read personal_info"
ON public.personal_info
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert personal_info" ON public.personal_info;
CREATE POLICY "Authenticated users can insert personal_info"
ON public.personal_info
FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update personal_info" ON public.personal_info;
CREATE POLICY "Authenticated users can update personal_info"
ON public.personal_info
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete personal_info" ON public.personal_info;
CREATE POLICY "Authenticated users can delete personal_info"
ON public.personal_info
FOR DELETE
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Public can read education" ON public.education;
CREATE POLICY "Public can read education"
ON public.education
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert education" ON public.education;
CREATE POLICY "Authenticated users can insert education"
ON public.education
FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update education" ON public.education;
CREATE POLICY "Authenticated users can update education"
ON public.education
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete education" ON public.education;
CREATE POLICY "Authenticated users can delete education"
ON public.education
FOR DELETE
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Public can read experience" ON public.experience;
CREATE POLICY "Public can read experience"
ON public.experience
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert experience" ON public.experience;
CREATE POLICY "Authenticated users can insert experience"
ON public.experience
FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update experience" ON public.experience;
CREATE POLICY "Authenticated users can update experience"
ON public.experience
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete experience" ON public.experience;
CREATE POLICY "Authenticated users can delete experience"
ON public.experience
FOR DELETE
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Public can read projects" ON public.projects;
CREATE POLICY "Public can read projects"
ON public.projects
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert projects" ON public.projects;
CREATE POLICY "Authenticated users can insert projects"
ON public.projects
FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update projects" ON public.projects;
CREATE POLICY "Authenticated users can update projects"
ON public.projects
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete projects" ON public.projects;
CREATE POLICY "Authenticated users can delete projects"
ON public.projects
FOR DELETE
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Public can read certificates" ON public.certificates;
CREATE POLICY "Public can read certificates"
ON public.certificates
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert certificates" ON public.certificates;
CREATE POLICY "Authenticated users can insert certificates"
ON public.certificates
FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update certificates" ON public.certificates;
CREATE POLICY "Authenticated users can update certificates"
ON public.certificates
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete certificates" ON public.certificates;
CREATE POLICY "Authenticated users can delete certificates"
ON public.certificates
FOR DELETE
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Public can read skills" ON public.skills;
CREATE POLICY "Public can read skills"
ON public.skills
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert skills" ON public.skills;
CREATE POLICY "Authenticated users can insert skills"
ON public.skills
FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update skills" ON public.skills;
CREATE POLICY "Authenticated users can update skills"
ON public.skills
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete skills" ON public.skills;
CREATE POLICY "Authenticated users can delete skills"
ON public.skills
FOR DELETE
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Public can read hobbies" ON public.hobbies;
CREATE POLICY "Public can read hobbies"
ON public.hobbies
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert hobbies" ON public.hobbies;
CREATE POLICY "Authenticated users can insert hobbies"
ON public.hobbies
FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update hobbies" ON public.hobbies;
CREATE POLICY "Authenticated users can update hobbies"
ON public.hobbies
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete hobbies" ON public.hobbies;
CREATE POLICY "Authenticated users can delete hobbies"
ON public.hobbies
FOR DELETE
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Authenticated users can read contact_messages" ON public.contact_messages;
CREATE POLICY "Authenticated users can read contact_messages"
ON public.contact_messages
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Public can insert contact_messages" ON public.contact_messages;
CREATE POLICY "Public can insert contact_messages"
ON public.contact_messages
FOR INSERT
TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update contact_messages" ON public.contact_messages;
CREATE POLICY "Authenticated users can update contact_messages"
ON public.contact_messages
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete contact_messages" ON public.contact_messages;
CREATE POLICY "Authenticated users can delete contact_messages"
ON public.contact_messages
FOR DELETE
TO authenticated
USING (true);

GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT ON
  public.personal_info,
  public.education,
  public.experience,
  public.projects,
  public.certificates,
  public.skills,
  public.hobbies
TO anon, authenticated;

GRANT SELECT ON public.contact_messages TO authenticated;

GRANT INSERT, UPDATE, DELETE ON
  public.personal_info,
  public.education,
  public.experience,
  public.projects,
  public.certificates,
  public.skills,
  public.hobbies,
  public.contact_messages
TO authenticated;

GRANT INSERT ON public.contact_messages TO anon;
