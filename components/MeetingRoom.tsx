import { cn } from '@/lib/utils'
import { CallControls, CallParticipantsList, CallStatsButton, CallingState, PaginatedGridLayout, SpeakerLayout, useCallStateHooks, useParticipantViewContext } from '@stream-io/video-react-sdk'
import React, { useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutList, Users } from 'lucide-react'
import { User } from '@clerk/nextjs/server'
import { useRouter, useSearchParams } from 'next/navigation'
import EndCallButton from './EndCallButton'
import Loader from './Loader'

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right'
const MeetingRoom = () => {
    const [layout, setLayout] = useState<CallLayoutType>('speaker-left')
    const [showPaticipant, setShowPaticipant] = useState(false)

    const searchParams = useSearchParams()
    const router = useRouter()

    //function exposes all state hooks 
    const { useCallCallingState } = useCallStateHooks();
    const callingState = useCallCallingState();

    if (callingState !== CallingState.JOINED) return <Loader />

    const isPersonalRoom = !!searchParams.get('personal')

    const CallLayout = () => {
        switch (layout) {
            case 'grid':
                return <PaginatedGridLayout />
            case 'speaker-right':
                return <SpeakerLayout participantsBarPosition='left' />
            default:
                return <SpeakerLayout participantsBarPosition='right' />
        }
    }

    return (
        <section className='relative h-screen w-full overflow-hidden pt-4 text-white '>
            <div className='relative flex size-full item-center justify-center'>
                <div className='flex size-full max-w-[1000px] items-center'>
                    <CallLayout />
                </div>
                <div className={cn('h-[calc(100vh-86px)] hidden ml-2', { 'show-block': showPaticipant })}>
                    <CallParticipantsList onClose={() => { setShowPaticipant(false) }} />
                </div>
            </div>
            <div className='fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap'>
                <CallControls onLeave={() => { router.push("/") }} />
                <DropdownMenu>
                    <div className='flex items-center'>
                        <DropdownMenuTrigger className=' cursor-pointer rounded-2xl bg-[#192232d] 
                        px-4 py-2 hover:bg-[#4c535b]'>

                            <LayoutList size={20} className='text-white' />
                        </DropdownMenuTrigger>

                    </div>
                    <DropdownMenuContent className=' border-dark-1 bg-dark-1 text-white'>
                        {['Grid', 'Speaker-Right', 'Speaker-Left'].map((items, index) => (
                            <div key={index}>
                                <DropdownMenuItem className=' cursor-pointer' onClick={() => {
                                    setLayout(items.toLocaleLowerCase() as CallLayoutType)
                                }}>
                                    {items}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className=' border-dark-1' />
                            </div>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                <CallStatsButton />
                <button onClick={() =>
                    setShowPaticipant((prev) => !prev)}>
                    <div className=' cursor-pointer rounded-2xl bg-[#192232d] 
                        px-4 py-2 hover:bg-[#4c535b]'>
                        <Users size={20} className=' text-white' />
                    </div>
                </button>
                {!isPersonalRoom && <EndCallButton />}
            </div>
        </section>
    )
}

export default MeetingRoom