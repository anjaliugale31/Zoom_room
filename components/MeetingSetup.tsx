"use client"

import { DeviceSettings, VideoPreview, useCall } from '@stream-io/video-react-sdk'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'

const MeetingSetup = ({ setIsSetUpCompleted }: { setIsSetUpCompleted: (value: boolean) => void }) => {
    //allowing localhost to access camera and microphone
    const [isMicCamToggleOn, setisMicCamToggleOn] = useState(false)

    const call = useCall();
    if (!call) {
        throw new Error("useCall must be used within streamcall component")
    }

    useEffect(() => {
        if (isMicCamToggleOn) {
            call?.camera?.disable();
            call?.microphone?.disable();
        }
        else {
            call?.camera?.enable();
            call?.microphone?.enable();
        }

    }, [isMicCamToggleOn, call?.camera, call?.microphone])
    return (
        //preparing camera and microphone for meeting
        <div className='flex h-screen w-full flex-col items-center justify-center gap-3 text-white'>
            <h1 className='text-2xl font-bold'>
                SetUp
            </h1>
            {/* camera screen of meeting  */}
            <VideoPreview className='flex h-[400px]' />
            <div className='flex h-16 items-center justify-center gap-3'>
                <label className='flex items-center justify-center gap-2 font-medium '>

                    <input
                        type='checkbox'
                        checked={isMicCamToggleOn}
                        onChange={(e) => {
                            setisMicCamToggleOn(e.target.checked)
                        }}
                    />
                    Join with Mic and Camera Off
                </label>
                {/* audio setting menu  */}
                <DeviceSettings />
            </div>
            <Button className='rounded bg-green-500 px-20 py-2.5' onClick={() => {
                call.join();
                setIsSetUpCompleted(true)
            }}>
                Join Meeting
            </Button>
        </div>
    )
}

export default MeetingSetup