import {User} from '@/lib/models/User';
import {Match} from '@/lib/models/Match';

interface MatchScore {
    userId: string
    score: number
    reasons: string[]
}

export async function calculateMatchScore(userId: string, otherUserId: string): Promise<number> {

    if(userId === otherUserId) return 0; // No self-matching

    const user = await User.findById(userId);
    const otherUser = await User.findById(otherUserId);
    
    if(!user || !otherUser) return 0;

    let score = 0;
    const maxScore = 100;

    // Destination match (30 points)
    const commonDestinations = user.destinations?.filter((d:string)=> otherUser.destinations?.some((od:string)=>od.toLowerCase() === d.toLowerCase())) || [];
    if(commonDestinations.length > 0){
        score += Math.min(30, commonDestinations.length * 10)
    }

    // Travel style match (25 points)
    const commonStyles = user.travelStyle?.filter((s:string)=> otherUser.travelStyle?.includes(s)) || [];
    if (commonStyles.length > 0) {
        score += Math.min(25, commonStyles.length * 8)
    }

    // Budget match (20 points)
    if (user.budget === otherUser.budget) {
        score += 20
    }

    // Language match (15 points)
    const commonLanguages = user.languages?.filter((l: string) => otherUser.languages?.includes(l)) || [];
    if (commonLanguages.length > 0) {
        score += Math.min(15, commonLanguages.length * 5)
    }

    // Age compatibility (10 points) - within 10 years
    if (user.age && otherUser.age && Math.abs(user.age - otherUser.age) <= 10) {
        score += 10
    }

    return Math.min(score, maxScore)
}

export async function findMatches(userId:string, limit=10): Promise<MatchScore[]>{
    const user = await User.findById(userId);

    if(!user || user.destinations?.length === 0){
        return []
    }

    // Find all other users
    const allUsers = await User.find({ _id: { $ne: userId } })

    const matchPromises = allUsers.map(async (otherUser) => {
        const score = await calculateMatchScore(userId, otherUser._id.toString())
        
        if(score > 0){
            return {
                userId: otherUser._id.toString(),
                score,
                reasons: getMatchReasons(user, otherUser),
            }
        }
        return null
    })

    const matchResults = await Promise.all(matchPromises)
    const matches = matchResults.filter((m): m is MatchScore => m !== null)

    // Sort by score descending and return top matches
    return matches.sort((a, b) => b.score - a.score).slice(0, limit)
}

function getMatchReasons(user: any, otherUser: any): string[] {
    const reasons: string[] = []

    // Check destination match
    const commonDestinations = user.destinations?.filter((d: string) =>
        otherUser.destinations?.some((od: string) => od.toLowerCase() === d.toLowerCase()),
    ) || []
    if (commonDestinations.length > 0) {
        reasons.push(`Both interested in ${commonDestinations.join(", ")}`)
    }

    // Check travel style match
    const commonStyles = user.travelStyle?.filter((s: string) => 
        otherUser.travelStyle?.includes(s)
    ) || []
    if (commonStyles.length > 0) {
        reasons.push(`Share ${commonStyles.join(", ")} travel style`)
    }

    // Check budget match
    if (user.budget && otherUser.budget && user.budget === otherUser.budget) {
        reasons.push(`Same budget preference`)
    }

    // Check language match
    const commonLanguages = user.languages?.filter((l: string) => 
        otherUser.languages?.includes(l)
    ) || []
    if (commonLanguages.length > 0) {
        reasons.push(`Both speak ${commonLanguages.join(", ")}`)
    }

    return reasons
}

export async function createMatch(userId1: string, userId2: string, tripId?: string): Promise<any>{
    const existingMatch = await Match.findOne({
        $or:[
            {userId1, userId2},
            {userId1: userId2, userId2: userId1}
        ]
    })

    if (existingMatch) {
        return existingMatch
    }

    const matchScore = await calculateMatchScore(userId1, userId2)

    const match = await Match.create({
        userId1,
        userId2,
        tripId,
        matchScore,
        status: "pending",
    })

    return match
}