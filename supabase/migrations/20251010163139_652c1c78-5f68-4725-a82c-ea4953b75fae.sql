-- Fix role for user dalitech@gmail.com who should be a pro
UPDATE user_roles 
SET role = 'pro'::app_role 
WHERE user_id = '5536c642-ac04-423c-8fda-9e87c0ec9b71';

-- Update profile to add company name
UPDATE profiles 
SET company_name = 'Nexo Pro'
WHERE id = '5536c642-ac04-423c-8fda-9e87c0ec9b71';