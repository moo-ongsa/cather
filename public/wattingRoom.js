const meetings = document.getElementById("meetings");
const FIVE_MINUTES = 5 * 60 * 1000;

showTime();

ROOM_LIST.slice(0, 9).map((room) => {
  const meetingDiv = document.createElement("div");

  meetingDiv.classList.add("meeting");

  if (new Date() - new Date(room.timeStamp) > FIVE_MINUTES) {
    meetingDiv.classList.add("passed");
  } else {
    meetingDiv.onclick = function () {
      window.location.href = `/${room.roomId}`;
    };
  }

  const meetingTime = document.createElement("h3");
  meetingTime.textContent = room.timeStamp.toLocaleString();

  const meetingId = document.createElement("h2");
  meetingId.textContent = room.roomId;

  const meetingJoin = document.createElement("h3");
  meetingJoin.textContent = "JOIN US";

  meetingDiv.appendChild(meetingTime);
  meetingDiv.appendChild(meetingId);
  meetingDiv.appendChild(meetingJoin);

  meetings.appendChild(meetingDiv);
});

function showTime() {
  const date = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  let h = date.getHours(); // 0 - 23
  let m = date.getMinutes(); // 0 - 59
  let s = date.getSeconds(); // 0 - 59
  let session = "AM";

  if (h == 0) {
    h = 12;
  }

  if (h > 12) {
    h = h - 12;
    session = "PM";
  }

  h = h < 10 ? "0" + h : h;
  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;

  let time = h + ":" + m + ":" + s + " " + session;

  document.getElementById("date").textContent = date.toLocaleDateString(
    "en-US",
    options
  );
  document.getElementById("time").textContent = time;

  setTimeout(showTime, 1000);
}

function redirectToNewRoom() {
  window.location.href = `/newRoom`;
}
