"use client"
import React, { useState } from 'react'
import { useToast } from "@/components/ui/use-toast"

import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModal from './MeetingModal'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'

const MeetingTypeList = () => {
    const router = useRouter()
    const { toast } = useToast()

    const [meeting, setMeeting] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>()
    const [value, setValue] = useState({
        dateTime: new Date(),
        description: '',
        link: ''
    })
    const [callDetails, setCallDetails] = useState<Call>()
    const user = useUser()
    const client = useStreamVideoClient()
    const createMeeting = async () => {
        if (!user || !client) return;
        try {
            //generating random id for call
            if (!value.dateTime) {
                toast({
                    title: "Please Select date and time ",
                })
                return;
            }
            const id = crypto.randomUUID();
            const call = client.call('default', id)
            if (!call) throw new Error("Failed to create call")
            const startAt = value.dateTime.toISOString() ||
                new Date(Date.now()).toISOString();
            const description = value.description || 'Instant Meeting'
            await call.getOrCreate({
                data: {
                    starts_at: startAt,
                    custom: { description }
                }
            })
            setCallDetails(call);
            if (!value.description) {
                router.push(`/meeting/${call.id}`)
            }
            toast({
                title: "Meeting created succesfully!",
            })
        } catch (error) {
            toast({
                title: "Unable to schedule meeting",
            })
        }
    }
    return (
        <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
            <HomeCard
                img="/icons/add-meeting.svg"
                title="New meeting"
                description="Start an instant meeting"
                handleClick={() => {
                    setMeeting('isInstantMeeting')
                }}
                className='bg-orange-1'
            />
            <HomeCard
                img="/icons/join-meeting.svg"
                title="Join Meeting"
                description="via invitation link"
                handleClick={() => {
                    setMeeting('isInstantMeeting')
                }}
                className='bg-blue-1'

            />
            <HomeCard
                img="/icons/schedule.svg"
                title="Schedule Meeting"
                description="Plan your meeting"
                handleClick={() => {
                    setMeeting('isScheduleMeeting')
                }}
                className='bg-purpul-1'
            />
            <HomeCard
                img="/icons/recordings.svg"
                title="View Recordings"
                description="Meeting recordings"
                handleClick={() => {
                    router.push('/recordings')
                }}
                className='bg-yellow-1'

            />
            <MeetingModal
                isOpen={meeting === 'isInstantMeeting'}
                onClose={() => { setMeeting(undefined) }}
                title="Start an instant meeting"
                className="text-center"
                buttonText="Start Meeting"
                handleClick={createMeeting}
            />
        </section>
    )
}

export default MeetingTypeList