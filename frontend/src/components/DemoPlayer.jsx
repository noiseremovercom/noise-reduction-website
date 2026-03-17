// src/components/DemoPlayer.jsx
import React, { useState, useRef } from 'react';

const DemoPlayer = ({ demos }) => {
    const [playingStates, setPlayingStates] = useState({});
    const audioRefs = useRef({});

    const handlePlay = (demoId, type) => {
        const audioId = `${demoId}-${type}`;
        
        // Pause all other audio
        Object.keys(audioRefs.current).forEach(key => {
            if (key !== audioId && audioRefs.current[key]) {
                audioRefs.current[key].pause();
                audioRefs.current[key].currentTime = 0;
            }
        });

        // Update playing states
        const newPlayingStates = {};
        Object.keys(playingStates).forEach(key => {
            newPlayingStates[key] = false;
        });
        newPlayingStates[audioId] = true;
        setPlayingStates(newPlayingStates);
    };

    const handlePause = (demoId, type) => {
        const audioId = `${demoId}-${type}`;
        setPlayingStates(prev => ({ ...prev, [audioId]: false }));
    };

    const handleEnded = (demoId, type) => {
        const audioId = `${demoId}-${type}`;
        setPlayingStates(prev => ({ ...prev, [audioId]: false }));
    };

    return (
        <div className="demo-players">
            <h3>
                <i className="fas fa-headphones"></i> Hear the difference:
            </h3>
            <div className="demo-grid">
                {demos.map((demo) => (
                    <div key={demo.id} className="demo-item">
                        <p>{demo.title}</p>
                        
                        {/* Before Player */}
                        <div className="player-wrapper">
                            <audio
                                ref={el => audioRefs.current[`${demo.id}-before`] = el}
                                onPlay={() => handlePlay(demo.id, 'before')}
                                onPause={() => handlePause(demo.id, 'before')}
                                onEnded={() => handleEnded(demo.id, 'before')}
                            >
                                <source src={demo.before} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                            <span className="demo-label before">Before</span>
                        </div>

                        {/* After Player */}
                        <div className="player-wrapper">
                            <audio
                                ref={el => audioRefs.current[`${demo.id}-after`] = el}
                                onPlay={() => handlePlay(demo.id, 'after')}
                                onPause={() => handlePause(demo.id, 'after')}
                                onEnded={() => handleEnded(demo.id, 'after')}
                            >
                                <source src={demo.after} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                            <span className="demo-label after">After</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DemoPlayer;