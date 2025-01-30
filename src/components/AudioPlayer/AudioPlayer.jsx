import React from 'react';
import { useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { fetchCustomTracks } from '~/apis/songs';
import { useStore } from '~/hooks';
import { useSelector } from '~/hooks/useSelector';
import { forceUpdateCustomTracks, nextTrack, SessionSelect } from '~/store/session';

function AudioPlayer() {
    const { session } = useStore();
    const [, sessionDispatch] = session;
    const playerRef = useRef();
    const currentTrack = useSelector(SessionSelect.getCurrentTrack);
    const playing = useSelector(SessionSelect.getPlayingStatus);
    const level = useSelector(SessionSelect.getAudioLevel);
    // useEffect(() => {
    //     // 1. using async/await
    //     const updateCustomTracks = async () => {
    //         const customTracks = await fetchCustomTracks();
    //         sessionDispatch(forceUpdateCustomTracks({ customTracks }));
    //     };
    //     updateCustomTracks();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    const handleNextTrack = () => sessionDispatch(nextTrack());
    return (
        <div style={{ display: 'none' }} id="audio track">
            <ReactPlayer
                config={{
                    file: { forceAudio: true },
                }}
                playing={playing}
                ref={playerRef}
                url={currentTrack.url}
                volume={level}
                onEnded={handleNextTrack}
            />
        </div>
    );
}

export default AudioPlayer;
