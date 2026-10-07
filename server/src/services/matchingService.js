/**
 * Blood Compatibility Matrix
 * Key: Recipient Blood Group
 * Value: Array of Compatible Donor Blood Groups
 */
export const BLOOD_COMPATIBILITY = {
    'A+': ['A+', 'A-', 'O+', 'O-'],
    'A-': ['A-', 'O-'],
    'B+': ['B+', 'B-', 'O+', 'O-'],
    'B-': ['B-', 'O-'],
    'AB+': ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-'], // Universal Recipient
    'AB-': ['AB-', 'A-', 'B-', 'O-'],
    'O+': ['O+', 'O-'],
    'O-': ['O-'] // Can only receive from O- (Universal Donor to all)
};
/**
 * Calculate distance between two coordinates in kilometers using Haversine formula
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) {
        return 5.0; // Default distance if coordinates are missing
    }
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return Math.round(d * 10) / 10; // Round to 1 decimal place
}
/**
 * Check if last donation was more than 90 days ago (standard safe interval)
 */
export function isEligibleByDate(lastDonationDate) {
    if (!lastDonationDate) {
        return { eligible: true, daysAgo: null };
    }
    const lastDate = new Date(lastDonationDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return {
        eligible: diffDays >= 90,
        daysAgo: diffDays
    };
}
/**
 * Smart matching algorithm
 */
export function computeSmartDonorMatches(request, donors) {
    const recipientGroup = request.blood_group;
    const compatibleGroups = BLOOD_COMPATIBILITY[recipientGroup] || [recipientGroup];
    const matchedDonors = [];
    for (const donor of donors) {
        // Only consider donors with compatible blood group
        if (!compatibleGroups.includes(donor.blood_group)) {
            continue;
        }
        let score = 0;
        const matchReasons = [];
        // 1. Blood Compatibility (up to 40 pts)
        if (donor.blood_group === recipientGroup) {
            score += 40;
            matchReasons.push('Exact blood group match (40 pts)');
        }
        else {
            score += 30;
            matchReasons.push(`Compatible blood group ${donor.blood_group} (30 pts)`);
        }
        // 2. Availability (25 pts)
        const isAvailable = Boolean(donor.available);
        if (isAvailable) {
            score += 25;
            matchReasons.push('Donor is actively available (25 pts)');
        }
        else {
            matchReasons.push('Donor is marked unavailable (0 pts)');
        }
        // 3. Distance calculation (up to 20 pts)
        const reqLat = request.latitude ?? 16.5062;
        const reqLon = request.longitude ?? 80.6480;
        const donorLat = donor.latitude ?? 16.5100;
        const donorLon = donor.longitude ?? 80.6500;
        const distance = calculateHaversineDistance(reqLat, reqLon, donorLat, donorLon);
        // Closer donors get higher points: max 20 points for <= 2km, decays up to 40km
        let distanceScore = Math.max(0, Math.round(20 - distance * 0.4));
        if (donor.city && request.city && donor.city.toLowerCase() === request.city.toLowerCase()) {
            distanceScore = Math.max(distanceScore, 10);
        }
        score += distanceScore;
        matchReasons.push(`Proximity: ${distance} km away (+${distanceScore} pts)`);
        // 4. Last donation date eligibility (15 pts)
        const { eligible, daysAgo } = isEligibleByDate(donor.last_donation_date);
        if (eligible) {
            score += 15;
            matchReasons.push(daysAgo ? `Eligible (last donated ${daysAgo} days ago) (+15 pts)` : 'Eligible (first time donor) (+15 pts)');
        }
        else {
            matchReasons.push(`Recently donated (${daysAgo} days ago) (0 pts)`);
        }
        // Verification bonus
        if (donor.verified) {
            score += 5;
            matchReasons.push('Verified donor status (+5 pts)');
        }
        matchedDonors.push({
            donor_id: donor.id,
            user_id: donor.user_id,
            name: donor.name,
            phone: donor.phone,
            email: donor.email,
            blood_group: donor.blood_group,
            city: donor.city,
            state: donor.state,
            address: donor.address,
            distance,
            available: isAvailable,
            verified: Boolean(donor.verified),
            last_donation_date: donor.last_donation_date,
            donation_count: donor.donation_count || 0,
            compatibility_score: Math.min(100, score),
            match_reasons: matchReasons,
            eligibility_status: eligible ? 'Eligible' : 'Cooling Period'
        });
    }
    // Sort by highest score first, then lowest distance
    return matchedDonors.sort((a, b) => {
        if (b.compatibility_score !== a.compatibility_score) {
            return b.compatibility_score - a.compatibility_score;
        }
        return a.distance - b.distance;
    });
}
