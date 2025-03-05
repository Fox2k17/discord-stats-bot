const { sendSingle } = require("./mysql");

const updateOnChange = async (userID, channelID, time) => {
  const { status } = await sendSingle(
    `UPDATE stats SET spend_time = spend_time + ?, today_time = today_time + ?, is_on_channel = 1, last_channel = ? WHERE user_id = ?;`,
    [time, time, channelID, userID]
  );
  if (!status) console.log("Nie udało się wykonwać [updateOnChange]");
};
const updateOnJoin = async (userID, channelID) => {
  const { status } = await sendSingle(
    `UPDATE stats SET is_on_channel = 1, last_channel = ? WHERE user_id = ?;`,
    [channelID, userID]
  );
  if (!status) console.log("Nie udało się wykonwać [updateOnJoin]");
};
const updateOnLeave = async (userID, time1, time2) => {
  const timestamp = new Date(new Date() - new Date().getTimezoneOffset() * 60000).toISOString().replace(/T/, ' ').replace(/\..+/, '');
  const { status } = await sendSingle(
    `UPDATE stats SET spend_time = spend_time + ?, today_time = today_time + ?, is_on_channel = 0, last_active = ? WHERE user_id = ?;`,
    [time1, time2, timestamp, userID]
  );
  if (!status) console.log("Nie udało się wykonwać [updateOnLeave]");
};
const updateStream = async (userID, time) => {
  const { status } = await sendSingle(
    `UPDATE stats SET stream_time = stream_time + ? WHERE user_id = ?;`,
    [time, userID]
  );
  if (!status) console.log("Nie udało się wykonwać [updateStream]");
};

module.exports = {
  updateOnChange,
  updateOnJoin,
  updateOnLeave,
  updateStream,
};
