"use client";
import Loader from '@/components/Loader';
import MeetingRoom from '@/components/MeetingRoom';
import MeetingSetup from '@/components/MeetingSetup';
import { useGetCallById } from '@/hooks/useGetCallById';
import { useUser } from '@clerk/nextjs'
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import { useState } from 'react';

const Meeting = ({ params: { id } }: { params: { id: string } }) => {
    const { user, isLoaded } = useUser();
    const [isSetUpCompleted, setIsSetUpCompleted] = useState(false)

    const { call, isCallLoading } = useGetCallById(id);
    if (!isLoaded || isCallLoading) return <Loader />;
    return (
        //creating the meeting page 
        <main className='h-screen w-full'>
            <StreamCall call={call}>
                <StreamTheme>
                    {!isSetUpCompleted ? <MeetingSetup setIsSetUpCompleted={setIsSetUpCompleted} /> : <MeetingRoom />}
                </StreamTheme>
            </StreamCall>
        </main>
    )
}

export default Meeting