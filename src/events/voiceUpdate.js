const { updateOnChange, updateOnJoin, updateOnLeave, updateStream, } = require('../lib/update');
const config = require('../config.json');
const client = require('..');

client.on('voiceStateUpdate', (oldState, newState) => {
    try {
        function doTodayUpdate(joinTimestamp, nowTimestamp) {
          const joinDate = new Date(joinTimestamp);
          const nowDate = new Date(nowTimestamp);
    
          joinDate.setHours(0, 0, 0, 0);
          nowDate.setHours(0, 0, 0, 0);
    
          nowDate.setDate(nowDate.getDate() - 1);
    
          return joinDate.getTime() === nowDate.getTime();
        }
        const afkChannel = config.afkChannel;

        const joinTimestamps = client.joinTimestamps;
        const streamTimestamps = client.streamTimestamps;

        const member = newState.member;
        const channel = newState.channel;
        const Old_isStreaming = oldState.streaming;
        const New_isStreaming = newState.streaming;

        const leaveTimestamp = new Date().getTime();

        // brak zmiany kanału
        if (oldState.channelId === newState.channelId) {
            if(!Old_isStreaming && New_isStreaming) { // start stream!
              const joinTimestamp = new Date().getTime();
              streamTimestamps.set(member.id, joinTimestamp);
            }
            if(!New_isStreaming && Old_isStreaming) { // stop stream!
              const joinTimestamp = streamTimestamps.get(member.id);
              if (joinTimestamp) {
                const timeDifference = leaveTimestamp - joinTimestamp;
                const seconds = Math.floor(timeDifference / 1000);
                updateStream(member.id, seconds);
                streamTimestamps.delete(member.id);
              }
            }
        }
        // zmiana kanału lub wyjście
        if (oldState.channelId !== newState.channelId) {
            if (channel && channel != afkChannel) {
              if (joinTimestamps.get(member.id)) {
                const joinTimestamp = joinTimestamps.get(member.id);
                const timeDifference = leaveTimestamp - joinTimestamp;
                const seconds = Math.floor(timeDifference / 1000);
                updateOnChange(member.id, channel.id, seconds);
              }
              if (streamTimestamps.get(member.id)) {
                const joinTimestamp = streamTimestamps.get(member.id);
                const timeDifference = leaveTimestamp - joinTimestamp;
                const seconds = Math.floor(timeDifference / 1000);
                updateStream(member.id, seconds);
                streamTimestamps.delete(member.id);
              }
              const joinTimestamp = new Date().getTime();
              updateOnJoin(member.id, channel.id)
              joinTimestamps.set(member.id, joinTimestamp);
            }

            if (!channel || channel == afkChannel) {
              const joinTimestamp = joinTimestamps.get(member.id);
              if (joinTimestamp) {
                const timeDifference = leaveTimestamp - joinTimestamp;
                const seconds = Math.floor(timeDifference / 1000);
                const todayTime = doTodayUpdate(joinTimestamp, leaveTimestamp) ? 0 : seconds;
                updateOnLeave(member.id, seconds, todayTime);
              }
        
              const streamTimestamp = streamTimestamps.get(member.id);
              if (streamTimestamp) {
                const timeDifference = leaveTimestamp - streamTimestamp;
                const seconds = Math.floor(timeDifference / 1000);
                updateStream(member.id, seconds);
                streamTimestamps.delete(member.id);
              }
              joinTimestamps.delete(member.id);
            }
        }
    } catch (error) {
        console.log('Wystąpił błąd w [voiceUpdate.js], ' + error);
    }
});
