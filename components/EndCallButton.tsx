import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk'
import React from 'react'
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';


const EndCallButton = () => {
    const call = useCall();
    const router = useRouter()
    const { useLocalParticipant } = useCallStateHooks();
    const localParicipants = useLocalParticipant();

    //check is owner 
    const isMeetingOwner = localParicipants && call?.state?.createdBy && localParicipants?.userId === call?.state?.createdBy.id
    if (!isMeetingOwner) return null;
    return (
        // ending the call for everyone
        <Button onClick={async () => {
            await call.endCall();
            router.push('/')
        }} className='bg-red-500'>
            End Call for everyone
        </Button>
    )
}

export default EndCallButton