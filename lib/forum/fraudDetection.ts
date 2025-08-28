// Fraud detection utilities for forum engagement

// Calculate a fraud score for a user based on their engagement patterns
export function calculateFraudScore(
  likes: number,
  comments: number,
  shares: number,
  timePeriodHours: number = 24
) {
  let fraudScore = 0;
  
  // High volume indicators
  if (likes > 1000) fraudScore += 15; // Excessive likes
  if (comments > 100) fraudScore += 10; // Excessive comments
  if (shares > 100) fraudScore += 5; // Excessive shares
  
  // Velocity checks (per hour)
  const likesPerHour = likes / timePeriodHours;
  const commentsPerHour = comments / timePeriodHours;
  const sharesPerHour = shares / timePeriodHours;
  
  if (likesPerHour > 50) fraudScore += 20; // Very high like rate
  else if (likesPerHour > 20) fraudScore += 10; // High like rate
  
  if (commentsPerHour > 10) fraudScore += 15; // Very high comment rate
  else if (commentsPerHour > 5) fraudScore += 5; // High comment rate
  
  if (sharesPerHour > 5) fraudScore += 10; // High share rate
  
  // Pattern analysis
  // If likes and comments are extremely disproportionate
  if (likes > 0 && comments > 0) {
    const ratio = likes / comments;
    if (ratio > 100) fraudScore += 15; // Too many likes, too few comments
    else if (ratio < 0.1) fraudScore += 10; // Too many comments, too few likes
  }
  
  // Cap the fraud score at 100
  return Math.min(fraudScore, 100);
}

// Determine if content should be auto-flagged based on fraud score
export function shouldAutoFlag(fraudScore: number): boolean {
  return fraudScore > 50;
}

// Determine if content should be auto-hidden based on fraud score
export function shouldAutoHide(fraudScore: number): boolean {
  return fraudScore > 75;
}

// Get fraud risk level
export function getFraudRiskLevel(fraudScore: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  if (fraudScore >= 75) return 'CRITICAL';
  if (fraudScore >= 50) return 'HIGH';
  if (fraudScore >= 25) return 'MEDIUM';
  return 'LOW';
}