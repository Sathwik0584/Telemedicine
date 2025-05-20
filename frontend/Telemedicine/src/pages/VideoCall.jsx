import React, { useRef, useState, useEffect } from 'react';

const VideoCall = ({ appointmentId, username }) => {
  const jitsiContainerRef = useRef(null);
  const [callStarted, setCallStarted] = useState(false);
  const [jitsiApi, setJitsiApi] = useState(null);

  // Initialize Jitsi after call starts
  useEffect(() => {
    if (callStarted && jitsiContainerRef.current) {
      const domain = 'meet.jit.si';
      const options = {
        roomName: `Telemed-${appointmentId}`,
        width: '100%',
        height: 600,
        parentNode: jitsiContainerRef.current,
        userInfo: {
          displayName: username || 'Guest',
        },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
        },
      };

      const api = new window.JitsiMeetExternalAPI(domain, options);
      setJitsiApi(api);

      return () => {
        api.dispose();
      };
    }
  }, [callStarted, appointmentId, username]);

  const startCall = () => {
    setCallStarted(true);
  };

  const endCall = () => {
    if (jitsiApi) {
      jitsiApi.dispose();
    }
    setJitsiApi(null);
    setCallStarted(false);
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 p-6 bg-white shadow-2xl rounded-2xl">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Live Video Consultation</h2>

      {!callStarted ? (
        <div className="flex justify-center">
          <button
            onClick={startCall}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:from-blue-600 hover:to-indigo-700 transition duration-300"
          >
            📞 Start Call
          </button>
        </div>
      ) : (
        <>
          <div
            ref={jitsiContainerRef}
            className="rounded-xl overflow-hidden border border-gray-300 shadow-lg"
            style={{ height: '600px' }}
          />
          <div className="flex justify-center mt-6">
            <button
              onClick={endCall}
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-full shadow-lg hover:bg-red-700 transition duration-300"
            >
              ❌ End Call
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoCall;
