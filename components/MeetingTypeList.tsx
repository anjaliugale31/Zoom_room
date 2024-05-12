"use client"
import React, { useState } from 'react'
import { useToast } from "@/components/ui/use-toast"

import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModal from './MeetingModal'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { Textarea } from './ui/textarea'
import ReactDatePicker from 'react-datepicker';
import { Input } from "@/components/ui/input"


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

    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`
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
                    setMeeting('isJoiningMeeting')
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
                title="Coming soon"
                description="Meeting recordings"
                handleClick={() => {
                    router.push('/recordings')
                }}
                className='bg-yellow-1'
            />
            {!callDetails ?
                <MeetingModal
                    isOpen={meeting === 'isScheduleMeeting'}
                    onClose={() => { setMeeting(undefined) }}
                    title="Create Meeting"
                    handleClick={createMeeting}>
                    <div className='flex flex-col gap-2.5'>
                        <label className=' text-base text-normal leading-[22px] text-sky-2'>
                            Add a description
                        </label>
                        <Textarea
                            className=' border-none bg-dark-3 focus-visible:ring-0 
                        focus-visible-ring-offset-0'
                            onChange={(e) => {
                                setValue({ ...value, description: e.target.value })
                            }}
                        />
                    </div>
                    <div className='flex w-full flex-col gap-2.5'>
                        <label className=' text-base text-normal leading-[22px] text-sky-2'>
                            Select Date And Time
                        </label>
                        <ReactDatePicker
                            selected={value.dateTime}
                            onChange={(date) => {
                                // ! have to give deu to typescript "date!"
                                setValue({ ...value, dateTime: date! })
                            }}
                            showTimeSelect
                            timeFormat='HH:mm'
                            timeIntervals={15}
                            timeCaption='time'
                            dateFormat="MMMM d, yyyy h:mm aa"
                            className=' w-full rounded bg-dark-3 p-2 focus:outline-none'
                        />
                    </div>
                </MeetingModal > : <MeetingModal
                    isOpen={meeting === 'isScheduleMeeting'}
                    onClose={() => { setMeeting(undefined) }}
                    title="Meeting created"
                    className="text-center"
                    handleClick={() => {
                        //copying the generated meeting link
                        navigator.clipboard.writeText(meetingLink)
                        toast({ title: 'Link Copied ' })
                    }}
                    image="/icons/checked.svg"
                    buttonIcon="/icons/copy.svg"
                    buttonText="copy meeting link"
                />
            }
            <MeetingModal
                isOpen={meeting === 'isInstantMeeting'}
                onClose={() => { setMeeting(undefined) }}
                title="Start an instant meeting"
                className="text-center"
                buttonText="Start Meeting"
                handleClick={createMeeting}
            />
            <MeetingModal
                isOpen={meeting === 'isJoiningMeeting'}
                onClose={() => { setMeeting(undefined) }}
                title="Type the Link here."
                className="text-center"
                buttonText="Join Meeting"
                handleClick={() => {
                    router.push(value.link)
                }}
            />
            <Input placeholder='Meeting Link'
                className=' border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'
                onChange={(e) => setValue({ ...value, link: e.target.value })}
            />
        </section >
    )
}

export default MeetingTypeList