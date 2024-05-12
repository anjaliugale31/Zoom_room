import { useUser } from "@clerk/nextjs"
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { use, useEffect, useState } from "react"
import { start } from "repl";


export const useGetCalls = () => {
    const [calls, setCalls] = useState<Call[]>([]);
    const [isLoading, setIsLoading] = useState(false)
    const client = useStreamVideoClient();
    const { user } = useUser()
    useEffect(() => {
        const loadCalls = async () => {
            if (!user || !client) return;
            setIsLoading(true);

            try {
                // fetching all the call
                const { calls } = await client.queryCalls({
                    sort: [{ field: 'starts_at', direction: -1 }],
                    filter_conditions: {
                        starts_at: { $exists: true },
                        $or: [
                            { created_by_user_id: user.id, },
                            { members: { $in: [user.id] } }
                        ]
                    }
                });
                setCalls(calls)

            } catch (err) {
                console.log(err);

            } finally {
                setIsLoading(false)
            }
        }
        loadCalls()
    }, [client, user])
    const now = new Date();

    //end call for showing page
    const endedCall = calls.filter(({ state: { startsAt, endedAt } }: Call) => {
        return (startsAt && new Date(startsAt) < now || !!endedAt)
    })
    //upcoming call for showing page
    const upcomingCalls = calls.filter(({ state: { startsAt } }: Call) => {
        return (startsAt && new Date(startsAt) > now)
    })
    return {
        endedCall,
        upcomingCalls,
        callRecordings: Call,
        isLoading
    }

}