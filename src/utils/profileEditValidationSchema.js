import { z } from 'zod';

export const profileFormSchema = z.object({
  profilePhoto: z.instanceof(File).nullable().refine(
    (file) => file !== null,
    { message: 'Profile photo is required' }
  ),
  age: z.string().optional().refine(
    (val) => !val || (parseInt(val) >= 18 && parseInt(val) <= 100),
    { message: 'Age must be between 18 and 100' }
  ),
  gender: z.enum(['male', 'female', 'others'], {
    required_error: 'Gender selection is required'
  }),
  experienceLevel: z.enum(['student', 'entry', 'junior', 'intermediate', 'senior', 'lead'], {
    required_error: 'Experience level is required'
  }),
  githubUsername: z.string().optional(),
  linkedinProfile: z.string().optional().refine(
    (val) => !val || val.includes('linkedin.com'),
    { message: 'Please enter a valid LinkedIn URL' }
  ),
  about: z.string()
    .min(1, 'About section is required')
    .refine(
      (val) => val.trim().split(/\s+/).filter(word => word.length > 0).length >= 30,
      { message: 'About section must be at least 30 words' }
    ),
  skills: z.array(z.string())
    .min(5, 'At least 5 skills are required')
    .max(10, 'Maximum 10 skills allowed')
});