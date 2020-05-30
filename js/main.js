$(function () {

  const $breakIncr = $('#break-increment');
  const $breakDecr = $('#break-decrement');
  const $breakLenght = $('#break-length');
  const $sessionIncr = $('#session-increment');
  const $sessionDecr = $('#session-decrement');
  const $sessionLenght = $('#session-length');
  const $adjustmentButtons = $('.adjustments button');
  const $mainTimer = $('#time-left');
  const $startButton = $('#start_stop');
  const $resetButton = $('#reset');
  const $label = $('#timer-label');
  const $pauseSign = $('.pause-sign');
  const sound = $('#beep').get(0);
  let countDown;
  let isSessionTime = true;
  let isBreakTime = false;
  let isRunning = false;

  function addBreakTime() {
    const duration = parseInt($breakLenght.text());
    // Maximum of 60 minutes
    if (duration >= 60) return;
    $breakLenght.text(duration + 1);
  }

  function deductBreakTime() {
    const duration = parseInt($breakLenght.text());
    // Minimum of 1 minute
    if (duration <= 1) return;
    $breakLenght.text(duration - 1);
  }

  function addSessionTime() {
    const duration = parseInt($sessionLenght.text());
    if (duration >= 60) return;
    $sessionLenght.text(duration + 1);
    adjustMainTimer($sessionLenght.text());
  }

  function deductSessionTime() {
    const duration = parseInt($sessionLenght.text());
    if (duration <= 1) return;
    $sessionLenght.text(duration - 1);
    adjustMainTimer($sessionLenght.text());
  }

  // Automatically adjusts the main timer while adjusting the session length 
  function adjustMainTimer(time) {
    $mainTimer.text(formatTime(time));
  }

  // Display time in [minutes:seconds] format
  function formatTime(value) {
    return value > 9 ? value + ':00' : '0' + value + ':00';
  }

  // We need to do some checking before running the clock
  function initClock() {
    const timerValue = $mainTimer.text();
    // Disabling four buttons for timers adjustment
    $adjustmentButtons.attr('disabled', true);
    // If clock is running the start button works as pause button
    if (isRunning) {
      clearInterval(countDown);
      $mainTimer.text(timerValue);
      isRunning = false;
      handleLabels();
    } else {
      runClock(timerValue);
      isRunning = true;
      handleLabels();
    }
  }

  function runClock(displayTime) {
    // Before we run the clock we need to convert the display time to seconds
    document.title = displayTime;
    let timeInSeconds = machineTime(displayTime);
    // Setting interval to simulate a real clock    
    countDown = setInterval(() => {
      timeInSeconds--;
      let normalTime = humanTime(timeInSeconds);
      // To display time we need to convert it from seconds back to normal
      $mainTimer.text(normalTime);
      document.title = normalTime;
      if (timeInSeconds < 0) {
        clearInterval(countDown);
        if (isSessionTime) {
          const breakTime = $breakLenght.text();
          $mainTimer.text(formatTime(breakTime));
          runClock($mainTimer.text());
          isSessionTime = false;
          isBreakTime = true;
          sound.play();
          handleLabels();
        } else {
          const sessionTime = $sessionLenght.text();
          $mainTimer.text(formatTime(sessionTime));
          runClock($mainTimer.text());
          isSessionTime = true;
          isBreakTime = false;
          sound.play();
          handleLabels();
        }
      }
    }, 1000);
  }

  // Converts time to seconds
  function machineTime(time) {
    return parseInt(time.slice(0, 2)) * 60 + parseInt(time.slice(3));
  }

  // Converts time from seconds back to normal 
  function humanTime(time) {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    minutes = minutes > 9 ? minutes : '0' + minutes;
    seconds = seconds > 9 ? seconds : '0' + seconds;
    return `${minutes}:${seconds}`;
  }

  // Displays relevant labels above the main timer
  function handleLabels() {
    if (isRunning && isSessionTime) {
      $pauseSign.css('opacity', 0);
      $label
        .removeClass('paused')
        .addClass('active')
        .text('Session time!');
    } else if (isRunning && isBreakTime) {
      $pauseSign.css('opacity', 0);
      $label
        .removeClass('paused')
        .addClass('active')
        .text('Break time!');
    } else {
      $pauseSign.css('opacity', 1);
      $label
        .removeClass('active')
        .addClass('paused')
        .text('Paused');
    }
  }

  // Back to default settings
  function resetClock() {
    clearInterval(countDown);
    sound.pause();
    sound.currentTime = 0;
    isRunning = false;
    isSessionTime = true;
    isBreakTime = false;
    $breakLenght.text('5');
    $sessionLenght.text('25');
    $mainTimer.text('25:00');
    // Enabling four buttons for timers adjustment
    $adjustmentButtons.removeAttr('disabled');
    $pauseSign.css('opacity', 0);
    $label
      .removeClass('paused active')
      .text('Hit start when you ready to work.');
    document.title = 'Pomodoro Clock';
  }

  $breakIncr.on('click', addBreakTime);
  $breakDecr.on('click', deductBreakTime);
  $sessionIncr.on('click', addSessionTime);
  $sessionDecr.on('click', deductSessionTime);
  $startButton.on('click', initClock);
  $resetButton.on('click', resetClock)

});