// Test file for profile page functionality
import { profileSchema } from '@/lib/validators/user';

describe('Profile Page Implementation', () => {
  test('Profile schema validation works correctly', () => {
    const validData = {
      name: 'John Doe',
      bio: 'Software developer with 5 years of experience',
      location: 'New York, NY',
      occupation: 'Developer',
      tradingExperience: 'Intermediate',
      avatar: 'https://example.com/avatar.jpg',
    };

    const result = profileSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  test('Profile schema rejects invalid data', () => {
    const invalidData = {
      name: 'J', // Too short
      avatar: 'not-a-url', // Invalid URL
    };

    const result = profileSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});