'use server';

import * as z from 'zod';

// This is now defined in the page.tsx component
const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  message: z.string().min(10, {
    message: 'Message must be at least 10 characters.',
  }),
});

export async function submitContactForm(data: z.infer<typeof formSchema>) {
    console.log('Form submitted:', data);
    // Here you would typically send an email or save to a database.
    return { success: true, message: 'Your message has been sent successfully!' };
}
